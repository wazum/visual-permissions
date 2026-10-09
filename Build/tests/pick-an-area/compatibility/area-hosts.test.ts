import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/frame.js'

// 13.4 keeps both trees in one column; column shows the module's tree
const bothTrees = (): { column: HTMLElement, page: HTMLElement, folders: HTMLElement } => {
  const column = document.createElement('div')
  column.className = 't3js-scaffold-content-navigation'
  const page = document.createElement('typo3-backend-navigation-component-pagetree')
  const folders = document.createElement('typo3-backend-navigation-component-filestoragetree')
  column.append(page, folders)
  document.body.append(column)

  return { column, page, folders }
}

const showing = (tree: HTMLElement, shown: boolean): void => {
  tree.style.display = shown ? 'flex' : 'none'
}

const toolbarItem = (): void => {
  const carrier = document.createElement('span')
  carrier.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Content Reviewers', inherits: [] } }))
  document.body.append(carrier)
}

const watched = async (): Promise<void> => {
  await new Promise(resolve => { setTimeout(resolve, 0) })
  await new Promise(resolve => { requestAnimationFrame(() => { resolve(null) }) })
}

describe('the column 13.4 keeps both trees in', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('is named after the tree that is showing', () => {
    const { column, page, folders } = bothTrees()
    showing(page, true)
    showing(folders, false)
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(column.getAttribute(attributes.area)).toBe('pageMounts')
  })

  it('is handed over when the module shows the other tree', async () => {
    const { column, page, folders } = bothTrees()
    showing(page, false)
    showing(folders, true)
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    showing(folders, false)
    showing(page, true)
    column.append(document.createElement('div'))
    await watched()

    expect(column.getAttribute(attributes.area)).toBe('pageMounts')
  })
})
