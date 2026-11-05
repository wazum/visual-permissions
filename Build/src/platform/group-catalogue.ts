import { attributes } from './contract.js'
import type { ChainStep } from './transport.js'

export interface GroupEntry {
  readonly title: string
  readonly disabled: boolean
  readonly inherits: readonly ChainStep[]
}

export function groupsOn(doc: Document): Record<string, GroupEntry> {
  return JSON.parse(doc.querySelector(`[${attributes.groups}]`)?.getAttribute(attributes.groups) ?? '{}') as Record<string, GroupEntry>
}

export function titleOf(doc: Document, groupId: number | null): string | null {
  return groupsOn(doc)[String(groupId)]?.title ?? null
}
