import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import LoginRefresh from '@typo3/backend/login-refresh.js'
import Notification from '@typo3/backend/notification.js'
import { sudoModeInterceptor } from '@typo3/backend/security/sudo-mode-interceptor.js'
import { ajaxUrl } from './ajax-url.js'
import { labelOf } from './labels.js'
import { routes } from './routes.js'

export interface ChainStep {
  readonly groupId: number
  readonly title: string
  readonly depth: number
}

export interface Targets {
  readonly targets: Readonly<Record<string, string>>
}

export interface UnseenPage {
  readonly page: number
  readonly title: string
  readonly link: string
}

export interface Permissions {
  readonly group: { readonly id: number, readonly title: string }
  readonly chain: readonly ChainStep[]
  readonly scopes: {
    // A field a subgroup gives names that subgroup; one the group gives itself is not listed
    readonly fields: Targets & { readonly givenBy: Readonly<Record<string, readonly number[]>> }
    readonly fieldValues: Targets
    readonly modules: Targets
    readonly pageMounts: Targets & { readonly order: readonly number[], readonly unseen: readonly UnseenPage[] }
    // Folder must be named before it can be mounted; named folders are in fileMounts
    readonly fileMounts: Targets & { readonly named: Readonly<Record<string, string>> }
    readonly fileOperations: Targets
    readonly pageTypes: Targets
    // A record on a form says which table it is, and the screen has to say it in the user's words
    readonly tablesModify: Targets & { readonly named: Readonly<Record<string, string>> }
    // Whatever the group may write, core lets it read as well
    readonly tablesSelect: Targets
  }
}

// A taken change may clear the face; the other outcomes leave it standing
export type WriteOutcome = 'taken' | 'cancelled' | 'refused' | 'failed' | 'loggedOut'

let writing = 0

export async function write(route: string, body: unknown): Promise<WriteOutcome> {
  writing += 1

  return new AjaxRequest(ajaxUrl(route))
    .addMiddleware(sudoModeInterceptor)
    .post(body)
    .then(outcomeOf, outcomeOf)
    .finally(() => { writing -= 1 })
}

export function isWriting(): boolean {
  return writing > 0
}

// A non-2xx status means refusal or cancellation; no status means no answer ever arrived
export function outcomeOf(answer: unknown): WriteOutcome {
  try {
    const came = (answer as { raw: () => { status: number, redirected?: boolean } }).raw()

    // A login that ran out sends the write to the login page, and that answer reads like ours
    if (came.redirected === true) {
      void LoginRefresh.checkActiveSession()

      return 'loggedOut'
    }

    return outcomeOfStatus(came.status)
  } catch {
    // A fault carries no status, and neither does an answer core cannot read itself
    return 'failed'
  }
}

function outcomeOfStatus(status: number): WriteOutcome {
  if (status < 300) {
    return 'taken'
  }

  // A password prompt left without a password answers 422
  if (status === 422) {
    return 'cancelled'
  }

  if (status === 409) {
    return 'refused'
  }

  return 'failed'
}

export async function inspect(groupId: number, tables: readonly string[] = []): Promise<Permissions | null> {
  return read<Permissions>(new AjaxRequest(ajaxUrl(routes.inspect))
    .withQueryArguments({ group: groupId, tables: [...tables] })
    .get())
}

export function createLatestInspect(): {
  inspect: (groupId: number, tables?: readonly string[]) => Promise<Permissions | null>
  drop: () => void
} {
  let newest = 0

  return {
    inspect: async (groupId, tables) => {
      // Stryker disable next-line UpdateOperator: counting down works as well, since only "is this still the newest" is asked
      const mine = ++newest
      const permissions = await inspect(groupId, tables)

      return mine === newest ? permissions : null
    },
    // Stryker disable next-line AssignmentOperator: counting down works as well, since only "is this still the newest" is asked
    drop: () => { newest += 1 },
  }
}

// A document's URL holds a session token that dies with that session; ask again for a fresh one
export async function documentUrl(record: string, returnUrl: string): Promise<string> {
  const between = record.indexOf(':')
  const table = record.slice(0, between)
  const uids = record.slice(between + 1)

  const response = await new AjaxRequest(ajaxUrl(routes.open_document))
    .withQueryArguments({ table, uids, returnUrl })
    .get()
  const answered = await response.resolve<{ url?: string }>()

  return answered.url ?? ''
}

export async function read<T>(request: ReturnType<AjaxRequest['get']>): Promise<T | null> {
  try {
    return await (await request).resolve<T>()
  } catch {
    Notification.error(labelOf('platform.notRead'))

    return null
  }
}
