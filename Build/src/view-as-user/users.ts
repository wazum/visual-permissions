import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { routes } from '../platform/routes.js'

export interface ViewableUser {
  readonly id: number
  readonly username: string
  readonly realName: string
  readonly groups: readonly number[]
}

export interface ViewableUsers {
  // Users switched to most recently, newest first
  readonly recent: readonly number[]
  readonly users: readonly ViewableUser[]
}

// Backend sends no-store; the last answer is kept with its tag here
let held: { tag: string, users: ViewableUsers } | null = null

type Answer = Awaited<ReturnType<AjaxRequest['get']>>

// A 304 is the answer for a successful conditional request, not a refusal
function unchanged(refused: unknown): Answer {
  // Core hands back an answer or a fault, never nothing.
  if ((refused as { raw?: () => { status: number } }).raw?.().status !== 304) {
    throw refused
  }

  return refused as Answer
}

export async function viewableUsers(): Promise<ViewableUsers> {
  const response = await new AjaxRequest(ajaxUrl(routes.viewable_users))
    .get(held === null ? {} : { headers: { 'If-None-Match': held.tag } })
    .catch(unchanged)

  const raw = response.raw()
  if (raw.status === 304) {
    // The tag that asked for this answer came from the note itself, so the note is here.
    return (held as { tag: string, users: ViewableUsers }).users
  }

  const users = await response.resolve<ViewableUsers>()
  const tag = raw.headers.get('ETag')

  held = tag === null ? null : { tag, users }

  return users
}
