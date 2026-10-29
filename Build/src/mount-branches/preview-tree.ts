import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import Notification from '@typo3/backend/notification.js'
import type { PageTree, PreparedNode } from '@typo3/backend/tree/page-tree.js'
import type { Tree, TreeNode } from '@typo3/backend/tree/tree.js'
import { classes, elements } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import {
  actionRow,
  flash,
  hasMountAbove,
  hasMountBelow,
  inheritedIds,
  markedIds,
  mountedIds,
  pickedIn,
  unseenIds,
} from './marks.js'
import type { Kind, TreeConfiguration } from './panel.js'

// Stryker disable next-line StringLiteral: rooted always names a group and its pages, so no seed matches it
let builtFor = ''

// What it counts is the current panel count, not the one it was built with
let countMarks = (): void => undefined

// The roots are the group's whole world; nothing it cannot reach is shown
export async function showBranches(
  doc: Document,
  into: HTMLElement,
  pages: readonly string[],
  { groupId, kind, showCount }: { readonly groupId: number, readonly kind: Kind, readonly showCount: () => void },
): Promise<void> {
  countMarks = showCount
  const rooted = `${String(groupId)}:${pages.join(',')}`

  // A group with no pages is the whole tree; it has nothing to show beyond itself.
  if (pages.length === 0) {
    into.replaceChildren()
    builtFor = rooted

    return
  }

  const ours = kind.tree

  register(ours, kind.base)

  const existing = into.querySelector(ours)

  // The tree is built once and kept; only new mounts make a new one
  if (existing !== null && builtFor === rooted) {
    return
  }

  let configuration: TreeConfiguration
  try {
    configuration = await kind.rootedAt(groupId)
  } catch {
    Notification.error(labelOf('platform.notRead'))

    return
  }

  const tree = doc.createElement(ours)

  tree.addEventListener('mousedown', event => {
    const row = event.target instanceof Element ? event.target.closest('.node') : null
    if (row === null) {
      return
    }

    // Stryker disable next-line StringLiteral: the backend names every node with its page
    if (!actionRow(row.getAttribute('data-id') ?? '')) {
      event.preventDefault()
    }
  })

  // Only a branch root is a mount of the group's, so only that one can be removed.
  tree.addEventListener('typo3:tree:node-selected', event => {
    // This tree is the panel's own; a row click never opens a page elsewhere
    event.stopPropagation()

    const { node, propagate } = pickedIn(event)
    if (propagate === false) {
      return
    }

    if (markedIds.has(node.identifier)) {
      markedIds.delete(node.identifier)
    } else {
      markedIds.add(node.identifier)
    }

    repaintBranches(doc)
    countMarks()
  })
  // Domain rule: mounting is not editing; no renaming, no dragging pages about
  Object.assign(tree, { allowNodeEdit: false, allowNodeDrag: false, allowNodeSorting: false })

  const holder = doc.createElement('div')
  holder.className = classes.mountTree
  holder.append(tree)

  into.replaceChildren(holder)
  builtFor = rooted
  Object.assign(tree, { setup: configuration })
}

export function repaintBranches(doc: Document): void {
  doc.querySelector<PageTree>(
    `.${classes.facePreview} :is(${elements.pageTree}, ${elements.folderTree})`,
  )?.requestUpdate()
}

function register(named: string, base: typeof Tree): void {
  if (window.customElements.get(named) !== undefined) {
    return
  }

  window.customElements.define(named, class extends base {

    // A node never selected is never filled in and never spoken of
    public override isNodeSelectable(node: { identifier: string, depth: number }): boolean {
      return actionRow(node.identifier)
    }

    // Core loads the first levels only, so a deeper mount needs the way down to it loaded
    public override async loadData(): Promise<void> {
      await super.loadData()

      const missing = [...mountedIds].filter(mount => !this.nodes.some(node => node.identifier === mount))

      for (const mount of missing) {
        // A mount can name a page deleted since, and that has no way down to load
        // Stryker disable next-line StringLiteral: both kinds hand the tree a rootline route
        const response = await new AjaxRequest(this.settings.rootlineUrl ?? '')
          .withQueryArguments({ identifier: mount })
          .get()
          .catch(() => null)
        if (response === null) {
          continue
        }
        const { rootline } = await response.resolve<{ rootline: string[] }>()

        for (const over of rootline.slice(0, -1)) {
          const node = this.nodes.find(each => each.identifier === over)

          if (node !== undefined && node.loaded !== true) {
            await this.loadChildren(node)
          }
        }
      }

      openWayDown(this.nodes)
    }

    public override prepareNodes(nodes: PreparedNode[]): PreparedNode[] {
      return openWayDown(super.prepareNodes(nodes))
    }

    public override hideChildren(node: PreparedNode): void {
      if (!hasMountAbove(node) && !mountedIds.has(node.identifier)) {
        return
      }

      super.hideChildren(node)
    }

    public override getNodeClasses(node: TreeNode): string[] {
      const painted = super.getNodeClasses(node).filter(name => name !== 'node-selected')

      if (hasMountAbove(node)) {
        painted.push(classes.mountInside)
      }

      if (!hasMountAbove(node) && !mountedIds.has(node.identifier)) {
        painted.push(classes.mountContext)
      }

      // This group cannot remove the branch; it is inherited from a subgroup
      if (inheritedIds.has(node.identifier)) {
        painted.push(classes.mountInherited)
      }

      if (markedIds.has(node.identifier)) {
        painted.push(classes.faceMarked)
      }

      if (unseenIds.has(node.identifier)) {
        painted.push(classes.mountUnseen)
      }

      if (flash.isLit(node.identifier)) {
        painted.push(classes.justAdded)
      }

      return painted
    }
  })
}

// A closed row hides the mount under it, and this side is the way down to the mounts and
// what they carry, and no more
function openWayDown(nodes: PreparedNode[]): PreparedNode[] {
  nodes.forEach(node => {
    if (hasMountAbove(node) || mountedIds.has(node.identifier)) {
      return
    }

    node.__expanded = true
    node.__hidden = !hasMountBelow(node, nodes)
  })

  return nodes
}
