export interface TreeNode {
  readonly identifier: string
  readonly depth: number
  readonly checked?: boolean
  readonly __parents?: string[]
}

export interface PreparedNode {
  readonly identifier: string
  readonly depth: number
  readonly __parents?: string[]
  __hidden?: boolean
  __expanded?: boolean
}

export class Tree extends HTMLElement {
  public setup: unknown = null

  public nodes: PreparedNode[] = []

  public allowNodeEdit = true

  public allowNodeDrag = true

  public allowNodeSorting = true

  public getNodeClasses(node: TreeNode): string[] {
    return node.checked === true ? ['node', 'node-selected'] : ['node']
  }

  // Unselected node is never filled in, focused or spoken of; select first
  public isNodeSelectable(node: TreeNode): boolean {
    return node.identifier !== ''
  }

  public selectNode(node: TreeNode, propagate = true): void {
    if (!this.isNodeSelectable(node)) {
      return
    }

    this.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
      bubbles: true,
      detail: { node, propagate },
    }))
  }

  public prepareNodes(nodes: PreparedNode[]): PreparedNode[] {
    return nodes
  }

  public hideChildren(node: PreparedNode): void {
    node.__expanded = false
  }

  public requestUpdate(): void {
    this.setAttribute('data-repainted', String(this.repainted() + 1))
  }

  public repainted(): number {
    return Number(this.getAttribute('data-repainted') ?? '0')
  }
}

export const coreTree = (tag: string, nodes: PreparedNode[]): Tree => {
  if (customElements.get(tag) === undefined) {
    customElements.define(tag, class extends Tree {})
  }

  const tree = document.createElement(tag) as Tree
  tree.nodes = nodes

  return tree
}
