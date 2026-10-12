import { attributes } from './contract.js'
import { routes } from './routes.js'
import { remembered, type ChainStep } from './transport.js'

export interface GroupEntry {
  readonly title: string
  readonly disabled: boolean
  readonly inherits: readonly ChainStep[]
}

export function groupsOn(doc: Document): Record<string, GroupEntry> {
  return JSON.parse(doc.querySelector(`[${attributes.groups}]`)?.getAttribute(attributes.groups) ?? '{}') as Record<string, GroupEntry>
}

const allGroups = remembered<Record<string, GroupEntry>>(routes.groups)

export async function refreshGroups(doc: Document): Promise<void> {
  const groups = await allGroups().catch(() => null)
  if (groups === null) {
    return
  }

  // Stryker disable next-line OptionalChaining: the toolbar item that draws the pickers carries the groups
  doc.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, JSON.stringify(groups))
}

export function titleOf(doc: Document, groupId: number | null): string | null {
  return groupsOn(doc)[String(groupId)]?.title ?? null
}
