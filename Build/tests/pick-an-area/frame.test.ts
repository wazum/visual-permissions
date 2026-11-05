import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/frame.js'

const area = (): HTMLElement => {
  const host = document.createElement('div')
  host.setAttribute('slot', 'content')
  document.body.append(host)

  return host
}

const panel = (): HTMLElement => {
  const host = document.createElement('div')
  host.className = 'scaffold-sidebar'
  document.body.append(host)

  return host
}

const tree = (): HTMLElement => {
  const host = document.createElement('typo3-backend-navigation-component-pagetree')
  document.body.append(host)

  return host
}

const folderTree = (): HTMLElement => {
  const host = document.createElement('typo3-backend-navigation-component-filestoragetree')
  document.body.append(host)

  return host
}

// Backend hangs the tree inside the scaffold, not next to it; adjust the selector
const treeInside = (around: Element): HTMLElement => {
  const host = document.createElement('typo3-backend-navigation-component-pagetree')
  around.append(host)

  return host
}

const showing = (tree: HTMLElement, shown: boolean): void => {
  tree.style.display = shown ? 'flex' : 'none'
}

const eitherTree = (): { page: HTMLElement, folders: HTMLElement } => {
  const page = document.createElement('typo3-backend-navigation-component-pagetree')
  const folders = document.createElement('typo3-backend-navigation-component-filestoragetree')
  document.body.append(page, folders)

  return { page, folders }
}

const scaffold = (): HTMLElement => {
  const around = document.createElement('div')
  document.body.append(around)

  return around
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

const framedAreas = (): number => document.querySelectorAll(`.${classes.frame}`).length

describe('the frame around the area', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
    document.body.style.removeProperty('--vperm-frame-radius')
    document.documentElement.style.setProperty('--typo3-component-border-radius', '12px')
  })

  afterEach(() => {
    listening.abort()
    deactivate()
    vi.restoreAllMocks()
  })

  it('marks the area while permissions are shown', () => {
    const host = area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(host.classList.contains(classes.frame)).toBe(true)
  })

  it('frames the module panel, the page tree and the module area alike', () => {
    const left = panel()
    const middle = tree()
    const right = area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(left.classList.contains(classes.frame)).toBe(true)
    expect(middle.classList.contains(classes.frame)).toBe(true)
    expect(right.classList.contains(classes.frame)).toBe(true)
  })

  it('says which area each frame is', () => {
    const left = panel()
    const middle = tree()
    const right = area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(left.getAttribute(attributes.area)).toBe('modules')
    expect(middle.getAttribute(attributes.area)).toBe('pageMounts')
    expect(right.getAttribute(attributes.area)).toBe('fields')
  })

  it('says the folder tree is the file mounts area', () => {
    const middle = folderTree()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(middle.getAttribute(attributes.area)).toBe('fileMounts')
    // Both trees stand on the same ground; ground is shared, not per tree
    expect(middle.getAttribute(attributes.ground)).toBe('tree')
  })

  it('takes the frame off a tree the module has put away', async () => {
    const { page, folders } = eitherTree()
    showing(page, false)
    showing(folders, true)
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    showing(folders, false)
    showing(page, true)
    document.body.append(document.createElement('div'))
    await watched()

    expect(folders.classList.contains(classes.frame)).toBe(false)
  })

  it('says which ground each area stands on', () => {
    const left = panel()
    const middle = tree()
    const right = area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(left.getAttribute(attributes.ground)).toBe('panel')
    expect(middle.getAttribute(attributes.ground)).toBe('tree')
    expect(right.getAttribute(attributes.ground)).toBe('module')
  })

  it('hands each area the colour it stands on', () => {
    const left = panel()
    left.style.backgroundColor = 'rgb(4, 5, 6)'
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(left.style.getPropertyValue('--vperm-surface')).toBe('rgb(4, 5, 6)')
  })

  it('takes the colour from above when an area has none of its own', () => {
    const around = scaffold()
    around.style.backgroundColor = 'rgb(1, 2, 3)'
    const host = treeInside(around)
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(host.style.getPropertyValue('--vperm-surface')).toBe('rgb(1, 2, 3)')
  })

  it('stops framing once the backend goes away', () => {
    area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    listening.abort()
    const late = tree()
    document.dispatchEvent(new Event('typo3-module-loaded'))

    expect(late.classList.contains(classes.frame)).toBe(false)
  })

  it('frames an area that arrives with a module', () => {
    area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    const late = tree()
    document.dispatchEvent(new Event('typo3-module-loaded'))

    expect(late.classList.contains(classes.frame)).toBe(true)
  })

  it('frames an area that turns up on its own, with no module to announce it', async () => {
    area()
    toolbarItem()
    const around = scaffold()
    initialise(document, listening.signal)

    activate()
    // Framing's changes are reported first; the tree is the only news left. D8
    await watched()
    const late = treeInside(around)
    await watched()

    expect(late.classList.contains(classes.frame)).toBe(true)
  })

  it('frames the first area to turn up on a page without one', async () => {
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    const late = tree()
    await watched()

    expect(late.classList.contains(classes.frame)).toBe(true)
  })

  it('leaves the areas alone while every one of them is framed', async () => {
    const left = panel()
    left.style.backgroundColor = 'rgb(1, 2, 3)'
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    await watched()

    left.style.backgroundColor = 'rgb(9, 9, 9)'
    document.body.append(document.createElement('span'))
    await watched()

    expect(left.style.getPropertyValue('--vperm-surface')).toBe('rgb(1, 2, 3)')
  })

  it('looks at the areas once a frame however often the page changes', async () => {
    tree()
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()
    const looks = vi.spyOn(window, 'getComputedStyle')

    document.body.append(document.createElement('span'))
    await Promise.resolve()
    document.body.append(document.createElement('span'))
    await Promise.resolve()
    document.body.append(document.createElement('span'))
    await watched()

    expect(looks).toHaveBeenCalledOnce()
  })

  it('stops looking out for areas once the backend goes away', async () => {
    area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    listening.abort()
    const late = tree()
    await watched()

    expect(late.classList.contains(classes.frame)).toBe(false)
  })

  it('marks what it finds and leaves the rest', () => {
    const left = panel()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(left.classList.contains(classes.frame)).toBe(true)
    expect(framedAreas()).toBe(1)
  })

  it('takes the marks away when permissions are hidden', () => {
    const host = area()
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(host.classList.contains(classes.frame)).toBe(false)
  })

  it('marks nothing on a page without a single area of ours', () => {
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(framedAreas()).toBe(0)
  })

  it('marks nothing without a group to work on', () => {
    area()
    initialise(document, listening.signal)

    activate()

    expect(framedAreas()).toBe(0)
  })
})
