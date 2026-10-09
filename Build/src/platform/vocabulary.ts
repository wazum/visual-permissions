import type { verdicts } from './contract.js'

export type Verdict = (typeof verdicts)[number]

export const reachable: readonly string[] = ['allowed', 'allowedAndInherited', 'inherited']

// An inherited grant is the subgroup's
const ownVerdicts: readonly string[] = ['allowed', 'denied']

export const picked = 'allowed'
export const dropped = 'denied'

export const inherited = 'inherited'

export const alsoInherited = 'allowedAndInherited'

export const adminsOnly = 'adminOnly'

// The backend names only the tables it was asked about, and says nothing about the rest
export function isReachable(verdict: string | undefined): boolean {
  return reachable.some(one => one === verdict)
}

// The rest are nobody's to give: everyone has them, or only an administrator, or no one at all
export const givable: readonly string[] = [...reachable, dropped]

export function isOwn(verdict: string): boolean {
  return ownVerdicts.includes(verdict)
}

export function tableOf(token: string): string {
  return token.substring(0, token.indexOf(':'))
}

export function fieldOf(token: string): string {
  return token.substring(token.indexOf(':') + 1)
}
