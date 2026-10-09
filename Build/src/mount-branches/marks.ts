import type { PreparedNode } from '@typo3/backend/tree/page-tree.js'
import { createFlash } from '../platform/panel-card.js'

export const flash = createFlash(520)

export const markedIds = new Set<string>()

export const pickedIds = new Set<string>()

export const mountedIds = new Set<string>()

export const inheritedIds = new Set<string>()

export const unseenIds = new Set<string>()

// A mount on a whole storage leaves the reader with no access to it at all; a folder name
// cannot hold a colon, so only a storage's own identifier ends in ":/"
export const isStorageRoot = (identifier: string): boolean =>
  decodeURIComponent(identifier).endsWith(':/') || Number(identifier) < 1

// Only a branch root can be taken away; everything below one is carried by it
export const actionRow = (page: string): boolean =>
  mountedIds.has(page) && !inheritedIds.has(page)

// Stryker disable next-line ArrayDeclaration: a node with no parents stands under none, and no made-up name is mounted
const above = (node: { __parents?: string[] }): readonly string[] => node.__parents ?? []

// A mount carries everything under it, and the tree names every row a row stands under.
export const hasMountAbove = (node: { __parents?: string[] }): boolean =>
  above(node).some(over => mountedIds.has(over))

export const hasMountBelow = (node: { identifier: string }, rows: readonly PreparedNode[]): boolean =>
  rows.some(under => mountedIds.has(under.identifier) && above(under).includes(node.identifier))

interface Picked {
  readonly node: { readonly identifier: string, readonly depth: number, readonly __parents?: string[] }
  readonly propagate?: boolean
}

export const pickedIn = (event: Event): Picked => (event as CustomEvent<Picked>).detail
