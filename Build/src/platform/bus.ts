import type { eventNames } from './contract.js'

export interface Events {
  // The record form is drawn before the backend answers, so the rest of the page waits for this
  'fields-judged': Record<string, never>
  // The backend took a change, so what every scope holds about the group is old.
  'permissions-written': Record<string, never>
}

// The contract owns the names: a bus event the contract does not list, or a name it lists
// that nothing declares here, fails the typecheck
type Unnamed = Exclude<keyof Events, (typeof eventNames)[number]>
type Undeclared = Exclude<(typeof eventNames)[number], keyof Events>
// Stryker disable next-line BooleanLiteral: nothing reads it; its type is the assertion, and false fails it
export const contractHolds: [Unnamed, Undeclared] extends [never, never] ? true : never = true

const dispatched = (event: keyof Events): string => `vperm:${event}`

export function emit<Name extends keyof Events>(event: Name, detail: Events[Name]): void {
  document.dispatchEvent(new CustomEvent(dispatched(event), { detail }))
}

export function on<Name extends keyof Events>(
  event: Name,
  listener: (detail: Events[Name]) => void,
  signal: AbortSignal,
): void {
  document.addEventListener(
    dispatched(event),
    heard => { listener((heard as CustomEvent<Events[Name]>).detail); },
    { signal },
  )
}
