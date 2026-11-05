type Argument = string | number | readonly string[]

const unanswered = { group: { id: 0, title: '' }, chain: [] }

export let answer: unknown = unanswered

export const asked: string[] = []

export const headersSent: Record<string, string>[] = []

export const sent: { url: string, body: unknown }[] = []

let refuse = false
let nextHold: Promise<void> | null = null
const holds = new Set<() => void>()

// Only the next write is held, so two writes can be answered in either order
export function holdNextWrite(): () => void {
  let letGo = (): void => undefined
  nextHold = new Promise<void>(resolve => { letGo = resolve })
  holds.add(letGo)

  return () => {
    letGo()
    holds.delete(letGo)
  }
}

// Reads can be held back out of order; only the next read is held
let heldRead: Promise<void> | null = null
let releaseRead: (() => void) | null = null

export function holdNextRead(): () => void {
  heldRead = new Promise<void>(resolve => { releaseRead = resolve })
  const release = releaseRead

  return () => { release?.() }
}

export function reply(payload: unknown): void {
  answer = payload
}

const answers = new Map<string, unknown>()

export function replyTo(route: string, payload: unknown): void {
  answers.set(route, payload)
}

function answerFor(url: string): unknown {
  for (const [route, payload] of answers) {
    if (url.includes(route)) {
      return payload
    }
  }

  return answer
}

export function refuseNextWrite(): void {
  refuse = true
}

let refuseRead = false

export function refuseNextRead(): void {
  refuseRead = true
}

// Return 422 on cancelled; treat it as no error, not a failure
let cancelled = false

export function cancelNextPassword(): void {
  cancelled = true
}

// As core does: an answer whose raw() reads a response that is not there
let unreadable = false

export function breakNextWriteAnswer(): void {
  unreadable = true
}

// Core follows the redirect a dead login answers with, and hands back the login page
let redirected = false

export function sendNextWriteToLogin(): void {
  redirected = true
}

let answered: number | null = null

let tagged: string | null = null
let readStatus = 200

export function tagNextAnswer(tag: string): void {
  tagged = tag
}

export function answerNextReadWith(status: number): void {
  readStatus = status
}

export function answerNextWriteWith(status: number): void {
  answered = status
}

export function forget(): void {
  asked.length = 0
  headersSent.length = 0
  sent.length = 0
  refuse = false
  refuseRead = false
  cancelled = false
  unreadable = false
  redirected = false
  answered = null
  tagged = null
  readStatus = 200
  answer = unanswered
  answers.clear()
  // Must release read lock before next test starts; shared resource hazard
  releaseRead?.()
  heldRead = null
  releaseRead = null
  holds.forEach(letGo => { letGo() })
  holds.clear()
  nextHold = null
}

export default class AjaxRequest {
  private query: Record<string, Argument> = {}

  constructor(private readonly url: string) {
  }

  public withQueryArguments(queryArguments: Record<string, Argument>): this {
    this.query = queryArguments

    return this
  }

  public addMiddleware(): this {
    return this
  }

  public get(init: RequestInit = {}): Promise<{
    resolve: <T>() => Promise<T>
    raw: () => { status: number, headers: { get: (name: string) => string | null } }
  }> {
    headersSent.push((init.headers ?? {}) as Record<string, string>)
    const params = new URLSearchParams()

    for (const [name, value] of Object.entries(this.query)) {
      if (Array.isArray(value)) {
        value.forEach((entry, index) => { params.append(`${name}[${String(index)}]`, String(entry)) })
      } else {
        params.append(name, String(value))
      }
    }

    const query = params.toString()
    asked.push(query === '' ? this.url : `${this.url}?${query}`)

    if (refuseRead) {
      refuseRead = false

      return Promise.reject(new Error('the backend refused'))
    }

    // Held answer is not overwritten by later tests; query and all, so one route can answer two asks differently.
    const payload = answerFor(asked[asked.length - 1] ?? this.url)
    const waiting = heldRead
    heldRead = null

    const tag = tagged
    const status = readStatus
    tagged = null
    readStatus = 200

    const answer = {
      resolve: <T>(): Promise<T> => Promise.resolve(payload as T),
      raw: () => ({
        status,
        headers: { get: (name: string): string | null => (name === 'ETag' ? tag : null) },
      }),
    }

    // Core throws for non-2xx responses
    return (waiting ?? Promise.resolve())
      .then(() => {
        if (status < 200 || status > 299) {
          // eslint-disable-next-line @typescript-eslint/only-throw-error -- as core does
          throw answer
        }

        return answer
      })
  }

  public async post(body: unknown): Promise<{
    resolve: <T>() => Promise<T>
    raw: () => { status: number, ok: boolean }
  }> {
    sent.push({ url: this.url, body })

    if (refuse) {
      refuse = false

      throw new Error('the backend refused')
    }

    const hold = nextHold
    nextHold = null
    const status = answered ?? (cancelled ? 422 : 200)
    const broken = unreadable
    const sentElsewhere = redirected
    cancelled = false
    answered = null
    unreadable = false
    redirected = false

    await (hold ?? Promise.resolve())

    const given = {
      resolve: <T>(): Promise<T> => Promise.resolve(answer as T),
      raw: (): { status: number, ok: boolean, redirected: boolean } => {
        if (broken) {
          throw new TypeError("Cannot read properties of undefined (reading 'response')")
        }

        return { status, ok: status < 300, redirected: sentElsewhere }
      },
    }

    // Core throws the answer itself for every status outside 2xx; treat refusals and cancellations as faults.
    if (status >= 300) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- as core does
      throw given
    }

    return given
  }
}
