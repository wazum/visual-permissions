import type { PreparedNode } from '@typo3/backend/tree/page-tree.js'
import type { Tree } from '@typo3/backend/tree/tree.js'
import { classes } from '../platform/contract.js'
import { hasMountAbove, isStorageRoot, mountedIds, pickedIds, pickedIn } from './marks.js'

export function takeOverPicking(
  sheet: HTMLElement,
  picked: () => void,
  signal: AbortSignal,
): void {
  sheet.addEventListener('typo3:tree:node-selected', event => {
    event.stopPropagation()

    const { node, propagate } = pickedIn(event)
    if (propagate === false
      || isStorageRoot(node.identifier)
      || mountedIds.has(node.identifier)
      || hasMountAbove(node)) {
      return
    }

    if (pickedIds.has(node.identifier)) {
      pickedIds.delete(node.identifier)
    } else {
      pickedIds.add(node.identifier)
    }

    picked()
    paintQueue(treeIn(sheet))
  }, { capture: true, signal })

  const arriving = new MutationObserver(() => {
    const late = treeIn(sheet)

    // Stryker disable next-line ConditionalExpression,BlockStatement: paintQueue turns a missing tree away itself
    if (late === null) {
      return
    }

    if (!painting.has(late) || sheet.querySelector(`.node[data-id='0']`) !== null) {
      paintQueue(late)
    }
  })

  arriving.observe(sheet, { childList: true, subtree: true })
  signal.addEventListener('abort', () => { arriving.disconnect() })

  paintQueue(treeIn(sheet))
}

// The tree is borrowed whole; its own painting goes back with it
export function restorePainting(holder: Element): void {
  const tree = treeIn(holder as HTMLElement)

  // Stryker disable next-line ConditionalExpression,BlockStatement: nothing was ever noted against a missing tree, so the check below turns it away too
  if (tree === null) {
    return
  }

  const original = painting.get(tree)
  if (original === undefined) {
    return
  }

  tree.getNodeClasses = original.classes
  tree.prepareNodes = original.rows
  tree.nodes.filter(node => Number(node.identifier) < 1)
    .forEach(node => { node.__hidden = false })
  painting.delete(tree)
  tree.requestUpdate()
}

function paintQueue(tree: Tree | null): void {
  if (tree === null) {
    return
  }

  hideRoot(tree.nodes)

  if (!painting.has(tree)) {
    const coreClasses = tree.getNodeClasses.bind(tree)
    const coreRows = tree.prepareNodes.bind(tree)
    painting.set(tree, { classes: coreClasses, rows: coreRows })

    tree.prepareNodes = (nodes): PreparedNode[] =>
      hideRoot(coreRows(nodes))

    tree.getNodeClasses = (node): string[] => {
      const painted = coreClasses(node).filter(name => name !== 'node-selected')

      if (mountedIds.has(node.identifier)) {
        painted.push(classes.mountAlready)
      }

      if (pickedIds.has(node.identifier)) {
        painted.push(classes.mountPicked)
      }

      if (isStorageRoot(node.identifier)) {
        painted.push(classes.mountWhole)
      }

      return painted
    }
  }

  tree.requestUpdate()
}

// The installation row is not a mount point; do not offer it to the user
function hideRoot(nodes: PreparedNode[]): PreparedNode[] {
  nodes.filter(node => Number(node.identifier) < 1)
    .forEach(node => { node.__hidden = true })

  return nodes
}

interface CorePainting {
  readonly classes: (node: { identifier: string, depth: number }) => string[]
  readonly rows: (nodes: PreparedNode[]) => PreparedNode[]
}

const painting = new WeakMap<Tree, CorePainting>()

const treeIn = (sheet: HTMLElement): Tree | null =>
  sheet.querySelector<Tree>(
    'typo3-backend-navigation-component-pagetree-tree,'
    + 'typo3-backend-navigation-component-filestorage-tree',
  )
