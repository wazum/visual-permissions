import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, getState, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/tab-bar.js'
import { quiet, stored } from '../__mocks__/typo3-persistent-storage.js'
import { forget, shown } from '../__mocks__/typo3-module-menu.js'

const framed = (area: string): HTMLElement => {
  const host = document.createElement('div')
  host.className = classes.frame
  host.setAttribute(attributes.area, area)
  document.body.append(host)

  return host
}

const header = (): HTMLElement => {
  const host = document.createElement('div')
  host.className = 'scaffold-header'
  host.getBoundingClientRect = (): DOMRect => new DOMRect(0, 0, 1800, 60)
  const topbar = document.createElement('div')
  topbar.className = 'scaffold-topbar'
  topbar.getBoundingClientRect = (): DOMRect => new DOMRect(8, 10, 1442, 40)
  host.append(topbar)
  document.body.append(host)

  return host
}

const toolbarItem = (): void => {
  TYPO3.lang = {
    'pickAnArea.bar': 'Areas to work in',
    'pickAnArea.modules': 'Modules',
    'pickAnArea.pageMounts': 'Page mounts',
    'pickAnArea.fileMounts': 'File mounts',
    'pickAnArea.fields': 'Records and fields',
    'pickAnArea.other': 'Other permissions',
  }
}

const boxed = (element: HTMLElement, box: DOMRect): HTMLElement => {
  element.getBoundingClientRect = (): DOMRect => box

  return element
}

const watched = async (): Promise<void> => {
  await new Promise(resolve => { setTimeout(resolve, 0) })
  await new Promise(resolve => { requestAnimationFrame(() => { resolve(null) }) })
}

const tabs = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.tabBar} .${classes.tab}`)].map(tab => tab.textContent)

const tabOf = (area: string): HTMLElement => {
  const found = document.querySelector<HTMLElement>(`.${classes.tab}[${attributes.area}="${area}"]`)
  if (found === null) {
    throw new Error(`no tab for ${area}`)
  }

  return found
}

const useDividerLine = (): void => {
  document.body.style.setProperty('--vperm-divider', '1px')
}

const seamOf = (area: string): HTMLElement => {
  const found = document.querySelector<HTMLElement>(`.${classes.tabSeam}[${attributes.area}="${area}"]`)
  if (found === null) {
    throw new Error(`no seam for ${area}`)
  }

  return found
}

const selected = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.tab}[aria-selected="true"]`)]
    .map(tab => tab.getAttribute(attributes.area))

describe('the bar of tabs over the areas', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forget()
    deactivate()
    pickArea('modules')
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
    document.body.style.removeProperty('background-color')
    document.body.style.removeProperty('--vperm-tab-top')
    document.body.style.removeProperty('--vperm-tab-tall')
    document.body.style.removeProperty('--vperm-divider')
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('stands in the main frame when the picked area is empty here', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    framed('pageMounts')
    boxed(framed('fields'), new DOMRect(240, 60, 1560, 900))
    toolbarItem()
    activate()
    pickArea('pageMounts')

    initialise(document, listening.signal)
    await watched()

    expect(selected()).toStrictEqual(['fields'])
    expect(getState().area).toBe('fields')
  })

  it('stands in the scope of the same column when the picked one is empty here', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('fileMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    activate()
    pickArea('pageMounts')

    initialise(document, listening.signal)
    await watched()

    expect(selected()).toStrictEqual(['fileMounts'])
  })

  it('keeps the picked tree when the backend loads its first module', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    activate()
    pickArea('pageMounts')
    initialise(document, listening.signal)
    await watched()

    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    await watched()

    expect(selected()).toStrictEqual(['pageMounts'])
  })

  it('arms the main frame when the admin opens a module of their own', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    activate()
    pickArea('pageMounts')
    await watched()

    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await watched()

    expect(selected()).toStrictEqual(['fields'])
  })

  it('arms the main frame when what arrived says nothing about itself', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    activate()
    pickArea('pageMounts')
    await watched()

    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { url: '/typo3/x' } }))
    await watched()

    expect(selected()).toStrictEqual(['fields'])
  })

  it('keeps the menu armed when another module arrives', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    activate()
    pickArea('modules')
    await watched()

    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await watched()

    expect(selected()).toStrictEqual(['modules'])
  })

  it('keeps the scope when a tab of its own opened the module', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    const tree = boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 900))
    toolbarItem()
    pickArea('pageMounts')
    initialise(document, listening.signal)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    activate()
    await watched()

    tabOf('fileMounts').click()
    tree.remove()
    boxed(framed('fileMounts'), new DOMRect(240, 60, 414, 900))
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'media_management' } }))
    await watched()

    expect(selected()).toStrictEqual(['fileMounts'])
  })

  // Standing in another area is what this module leaves room for; not a change of mind.
  it('stands in an area on screen when the column the other permissions share is not here', () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    toolbarItem()
    activate()
    pickArea('other')

    initialise(document, listening.signal)

    expect(getState().area).toBe('modules')
  })

  it('leaves the picked area alone when no column stands on screen', async () => {
    framed('modules')
    toolbarItem()
    activate()
    pickArea('pageMounts')

    initialise(document, listening.signal)
    await watched()

    expect(getState().area).toBe('pageMounts')
  })

  it('leaves the area it stands in alone when the last column goes off screen', async () => {
    const host = boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    toolbarItem()
    activate()
    pickArea('modules')

    initialise(document, listening.signal)
    await watched()

    boxed(host, new DOMRect(0, 60, 0, 900))
    window.dispatchEvent(new Event('resize'))
    await watched()

    expect(getState().area).toBe('modules')
  })

  it('stands in the first column rather than one no scope of ours is drawn in', async () => {
    boxed(framed('pageMounts'), new DOMRect(0, 60, 240, 900))
    boxed(framed('reports'), new DOMRect(240, 60, 1560, 900))
    toolbarItem()
    activate()
    pickArea('modules')

    initialise(document, listening.signal)
    await watched()

    expect(getState().area).toBe('pageMounts')
  })

  it('stands a scope with no column of ours at the left edge', () => {
    boxed(framed('reports'), new DOMRect(500, 101, 1300, 900))
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('0px')
  })

  it('leaves the picked area in the settings while standing in another one', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    framed('pageMounts')
    boxed(framed('fields'), new DOMRect(240, 60, 1560, 900))
    toolbarItem()
    activate()
    pickArea('pageMounts')

    initialise(document, listening.signal)
    await watched()
    await quiet()

    expect((stored()['vperm'] as { session: { area: string } }).session.area).toBe('pageMounts')
  })

  it('gives the picked area its own back as soon as a module has that column', async () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    const mounts = framed('pageMounts')
    boxed(framed('fields'), new DOMRect(240, 60, 1560, 900))
    toolbarItem()
    activate()
    pickArea('pageMounts')

    initialise(document, listening.signal)
    await watched()

    expect(selected()).toStrictEqual(['fields'])

    boxed(mounts, new DOMRect(240, 60, 300, 900))
    window.dispatchEvent(new Event('resize'))
    await watched()

    expect(selected()).toStrictEqual(['pageMounts'])
  })

  // A module showing no tree would hide the way to the mounts; always show a tab for every scope
  it('carries a tab for every scope, whatever this module shows', () => {
    framed('modules')
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabs()).toStrictEqual([
      'Modules', 'Page mounts', 'File mounts', 'Records and fields', 'Other permissions',
    ])
  })

  it('stands the bar where the header ends', () => {
    framed('modules')
    header()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.body.style.getPropertyValue('--vperm-tab-top')).toBe('60px')
  })

  it('marks the tab of the area being worked in', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    expect(selected()).toStrictEqual(['pageMounts'])
  })

  it('arms the area of the tab that was pressed', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('pageMounts').click()

    expect(getState().area).toBe('pageMounts')
    expect(selected()).toStrictEqual(['pageMounts'])
  })

  it('arms the other permissions when its tab is pressed', () => {
    framed('modules')
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('other').click()

    expect(getState().area).toBe('other')
    expect(selected()).toStrictEqual(['other'])
  })

  it('keeps the very tabs it has while only the state changes', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    const built = [...document.querySelectorAll(`.${classes.tab}`)]

    pickArea('modules')
    pickArea('pageMounts')

    const shownTabs = [...document.querySelectorAll(`.${classes.tab}`)]

    expect(shownTabs).toHaveLength(built.length)
    shownTabs.forEach((tab, place) => { expect(tab).toBe(built[place]) })
  })

  it('stands the other permissions where the tab it follows ends', () => {
    boxed(framed('fields'), new DOMRect(240, 101, 1560, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    boxed(tabOf('fields'), new DOMRect(240, 104, 165, 34))

    pickArea('fields')

    expect(tabOf('other').style.getPropertyValue('--vperm-host-x')).toBe('415px')
  })

  it('opens the module that draws a scope this one does not', () => {
    framed('modules')
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('fileMounts').click()

    expect(shown()).toStrictEqual(['media_management'])
  })

  it('opens the module that draws the page mounts when this one draws no tree', () => {
    framed('modules')
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('pageMounts').click()

    expect(shown()).toStrictEqual(['web_layout'])
  })

  it('opens no module for a scope this one draws itself', () => {
    framed('modules')
    boxed(framed('fileMounts'), new DOMRect(240, 60, 414, 900))
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('fileMounts').click()

    expect(shown()).toStrictEqual([])
  })

  it('opens no module for a scope no module of its own draws', () => {
    framed('modules')
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('other').click()

    expect(shown()).toStrictEqual([])
  })

  it('stands the scopes of one column from the edge of that column', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('fileMounts'), new DOMRect(240, 101, 414, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    boxed(tabOf('pageMounts'), new DOMRect(0, 104, 120, 34))
    boxed(tabOf('fileMounts'), new DOMRect(240, 104, 165, 34))

    pickArea('fileMounts')

    expect(tabOf('pageMounts').style.getPropertyValue('--vperm-host-x')).toBe('240px')
    expect(tabOf('fileMounts').style.getPropertyValue('--vperm-host-x')).toBe('370px')
  })

  it('stands a scope with no column here after the tab it follows', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 101, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    boxed(tabOf('pageMounts'), new DOMRect(240, 104, 165, 34))

    pickArea('pageMounts')

    expect(tabOf('fileMounts').style.getPropertyValue('--vperm-host-x')).toBe('415px')
  })

  // A column's top edge rule runs under a tab that does not own it
  it('marks a tab whose scope is drawn in another module', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('fileMounts').hasAttribute(attributes.elsewhere)).toBe(true)
    expect(tabOf('pageMounts').hasAttribute(attributes.elsewhere)).toBe(false)
  })

  it('stands every tab at the left edge of its own area', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    left.getBoundingClientRect = (): DOMRect => new DOMRect(0, 101, 240, 900)
    middle.getBoundingClientRect = (): DOMRect => new DOMRect(240, 101, 414, 900)
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('0px')
    expect(tabOf('pageMounts').style.getPropertyValue('--vperm-host-x')).toBe('240px')
  })

  it('stands on the same ground as its own area', () => {
    framed('modules').setAttribute(attributes.ground, 'panel')
    framed('fields').setAttribute(attributes.ground, 'module')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('modules').getAttribute(attributes.ground)).toBe('panel')
    expect(tabOf('fields').getAttribute(attributes.ground)).toBe('module')
  })

  it('keeps no tab standing under the one before it', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('fields'), new DOMRect(240, 101, 1560, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    boxed(tabOf('modules'), new DOMRect(0, 104, 90, 34))
    boxed(tabOf('pageMounts'), new DOMRect(0, 104, 128, 34))
    boxed(tabOf('fileMounts'), new DOMRect(0, 104, 115, 34))

    pickArea('fields')

    expect(tabOf('fields').style.getPropertyValue('--vperm-host-x')).toBe('363px')
  })

  it('stands scopes with no column here one after the other', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('fields'), new DOMRect(240, 101, 1560, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    boxed(tabOf('modules'), new DOMRect(0, 104, 100, 34))
    boxed(tabOf('pageMounts'), new DOMRect(0, 104, 120, 34))

    pickArea('fields')

    expect(tabOf('pageMounts').style.getPropertyValue('--vperm-host-x')).toBe('110px')
    expect(tabOf('fileMounts').style.getPropertyValue('--vperm-host-x')).toBe('240px')
  })

  it('says a scope with no column here is not the one being worked in', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('fileMounts').getAttribute('aria-selected')).toBe('false')
  })

  it('stands a scope with no column here on the ground of the column they share', () => {
    framed('modules').setAttribute(attributes.ground, 'panel')
    framed('pageMounts').setAttribute(attributes.ground, 'tree')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('fileMounts').getAttribute(attributes.ground)).toBe('tree')
  })

  it('stands a scope on the ground of its column, not of the tab before', () => {
    framed('modules').setAttribute(attributes.ground, 'panel')
    framed('fileMounts').setAttribute(attributes.ground, 'tree')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('pageMounts').getAttribute(attributes.ground)).toBe('tree')
  })

  it('says a scope with no column here is the one being worked in when that is so', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    pickArea('other')

    expect(tabOf('other').getAttribute('aria-selected')).toBe('true')
  })

  it('folds the other permissions away with the column they share', () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 900))
    boxed(framed('fields'), new DOMRect(240, 60, 0, 0))
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('fields').hidden).toBe(true)
    expect(tabOf('other').hidden).toBe(true)
  })

  it('stands in the main frame when the menu the admin picked is not here', async () => {
    toolbarItem()
    activate()
    pickArea('modules')

    boxed(framed('pageMounts'), new DOMRect(0, 60, 414, 900))
    boxed(framed('fields'), new DOMRect(414, 60, 1146, 900))
    initialise(document, listening.signal)
    await watched()

    expect(selected()).toStrictEqual(['fields'])
  })

  it('keeps the other permissions armed while the areas on screen change', async () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    boxed(framed('fields'), new DOMRect(240, 101, 1560, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('other').click()

    boxed(framed('pageMounts'), new DOMRect(240, 101, 300, 900))
    await watched()

    expect(getState().area).toBe('other')
  })

  it('takes the other permissions out of sight with the column it shares', () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    framed('fields')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('other').hidden).toBe(true)
  })

  it('stands the other permissions on the ground of the column it shares', () => {
    framed('modules').setAttribute(attributes.ground, 'panel')
    framed('fields').setAttribute(attributes.ground, 'module')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('other').getAttribute(attributes.ground)).toBe('module')
  })

  it('outlines the area that was armed and no other', () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983)).style.paddingBlockStart = '31px'
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('pageMounts').click()

    const card = document.querySelector<HTMLElement>(`.${classes.tabCard}`)

    expect(card?.style.getPropertyValue('--vperm-host-x')).toBe('240px')
    expect(card?.style.getPropertyValue('--vperm-host-width')).toBe('414px')
  })

  it('outlines the card the armed tab belongs to', () => {
    const left = boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    left.style.paddingBlockStart = '31px'
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('modules').click()

    const card = document.querySelector<HTMLElement>(`.${classes.tabCard}`)

    expect(card?.hidden).toBe(false)
    expect(card?.style.getPropertyValue('--vperm-host-x')).toBe('0px')
    expect(card?.style.getPropertyValue('--vperm-host-width')).toBe('240px')
    expect(card?.style.getPropertyValue('--vperm-host-y')).toBe('91px')
    expect(card?.style.getPropertyValue('--vperm-host-height')).toBe('952px')
  })

  // A tab and what it owns are one card, and what this one owns is the column it shares.
  it('outlines the column it shares while the other permissions are armed', () => {
    framed('modules')
    const right = boxed(framed('fields'), new DOMRect(654, 60, 1146, 983))
    right.style.paddingBlockStart = '31px'
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('other').click()

    const card = document.querySelector<HTMLElement>(`.${classes.tabCard}`)

    expect(card?.hidden).toBe(false)
    expect(card?.style.getPropertyValue('--vperm-host-x')).toBe('654px')
    expect(card?.style.getPropertyValue('--vperm-host-width')).toBe('1146px')
  })

  it('leaves the edge of the armed area to the card that draws it, and the rest as they are', () => {
    useDividerLine()
    framed('modules')
    const middle = boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    const right = boxed(framed('fields'), new DOMRect(654, 60, 1146, 983))
    middle.style.paddingBlockStart = '31px'
    right.style.paddingBlockStart = '31px'
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('pageMounts').click()

    expect(seamOf('pageMounts').hidden).toBe(true)
    expect(seamOf('fields').hidden).toBe(false)

    tabOf('fields').click()

    expect(seamOf('pageMounts').hidden).toBe(false)
    expect(seamOf('fields').hidden).toBe(true)
  })

  it('draws no edge down the left of the first column', () => {
    useDividerLine()
    boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 983))
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    // Armed is a reason to leave that edge alone; another area takes it.
    tabOf('fields').click()

    expect(seamOf('modules').hidden).toBe(true)
    expect(seamOf('pageMounts').hidden).toBe(false)
  })

  it('draws the edge where the column beside it is folded away', () => {
    useDividerLine()
    const left = boxed(framed('modules'), new DOMRect(240, 60, 0, 0))
    left.style.borderRightWidth = '1px'
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 983))
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('fields').click()

    expect(seamOf('pageMounts').hidden).toBe(false)
  })

  it('draws no edge where the columns are divided by their surfaces', () => {
    boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(seamOf('pageMounts').hidden).toBe(true)
  })

  it('leaves the edge to the column beside it that draws it', () => {
    useDividerLine()
    const left = boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    left.style.borderRightWidth = '1px'
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    boxed(framed('fields'), new DOMRect(654, 60, 1146, 983))
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    // Armed is a reason to leave that edge alone; another area takes it.
    tabOf('modules').click()

    expect(seamOf('pageMounts').hidden).toBe(true)
    expect(seamOf('fields').hidden).toBe(false)
  })

  it('draws no edge down a column with no room on screen', () => {
    useDividerLine()
    boxed(framed('modules'), new DOMRect(0, 60, 240, 983))
    boxed(framed('pageMounts'), new DOMRect(240, 60, 0, 0))
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(seamOf('pageMounts').hidden).toBe(true)
  })

  it('outlines nothing while no area is being worked in', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.querySelector<HTMLElement>(`.${classes.tabCard}`)?.hidden).toBe(true)
  })

  it('draws the edge down the left of a column, below the bar', () => {
    useDividerLine()
    boxed(framed('pageMounts'), new DOMRect(240, 60, 414, 983))
    const right = framed('fields')
    right.style.paddingBlockStart = '41px'
    right.getBoundingClientRect = (): DOMRect => new DOMRect(654, 60, 1146, 983)
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    // Armed area draws its own left edge; another is armed here
    pickArea('pageMounts')

    const seam = seamOf('fields')

    expect(seam.hidden).toBe(false)
    expect(seam.style.getPropertyValue('--vperm-host-x')).toBe('654px')
    expect(seam.style.getPropertyValue('--vperm-host-y')).toBe('101px')
    expect(seam.style.getPropertyValue('--vperm-host-height')).toBe('942px')
  })

  it('keeps the tab of a column that is folded away out of sight', () => {
    const left = framed('modules')
    left.getBoundingClientRect = (): DOMRect => new DOMRect(0, 101, 0, 0)
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('modules').hidden).toBe(true)
  })

  it('puts the areas beside the other permissions out of play, the menu apart', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    const right = framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('other').click()

    expect(left.hasAttribute('inert')).toBe(false)
    expect(middle.hasAttribute('inert')).toBe(true)
    expect(right.hasAttribute('inert')).toBe(false)
  })

  it('puts the areas that are not being worked in out of play', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    const right = framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('modules').click()

    expect(left.hasAttribute('inert')).toBe(false)
    expect(middle.hasAttribute('inert')).toBe(true)
    expect(right.hasAttribute('inert')).toBe(true)
  })

  it('lays a sheet over every area out of play', () => {
    boxed(framed('modules'), new DOMRect(0, 100, 240, 500))
    const middle = boxed(framed('pageMounts'), new DOMRect(0, 100, 300, 500))
    middle.style.paddingBlockStart = '31px'
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('modules').click()

    const sheet = document.querySelector<HTMLElement>(`.${classes.areaCover}[${attributes.area}="pageMounts"]`)

    expect(sheet?.hidden).toBe(false)
    expect(sheet?.style.getPropertyValue('--vperm-host-x')).toBe('0px')
    expect(sheet?.style.getPropertyValue('--vperm-host-y')).toBe('131px')
    expect(sheet?.style.getPropertyValue('--vperm-host-width')).toBe('300px')
    expect(sheet?.style.getPropertyValue('--vperm-host-height')).toBe('469px')

    const spare = document.querySelector<HTMLElement>(`.${classes.areaCover}[${attributes.area}="modules"]`)

    expect(spare?.hidden).toBe(true)
    expect(spare?.style.getPropertyValue('--vperm-host-height')).toBe('')
  })

  it('lets every area back into play when permissions are hidden', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').click()

    deactivate()

    expect(left.hasAttribute('inert')).toBe(false)
    expect(middle.hasAttribute('inert')).toBe(false)
  })

  it('takes the bar away when permissions are hidden', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(document.querySelector(`.${classes.tabBar}`)).toBeNull()
  })

  // Areas lose marks on the change that hides permissions; hand them all back anyway
  it('hands every area back when permissions are hidden after the marks are gone', () => {
    const left = framed('modules')
    const right = framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').click()

    expect(right.hasAttribute('inert'), 'nothing was put out of play to hand back').toBe(true)

    ;[left, right].forEach(host => {
      host.classList.remove(classes.frame)
      host.removeAttribute(attributes.area)
    })

    deactivate()

    expect(right.hasAttribute('inert'), 'an area was left answering no click').toBe(false)
    expect(left.hasAttribute(attributes.armed), 'an area was left armed').toBe(false)
  })

  it('leaves the areas in play while the module itself is armed', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    const right = framed('fields')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('fields').click()

    expect(right.hasAttribute('inert')).toBe(false)
    expect(left.hasAttribute('inert')).toBe(false)
    expect(middle.hasAttribute('inert')).toBe(false)
    expect(document.querySelector<HTMLElement>(`.${classes.areaCover}[${attributes.area}="pageMounts"]`)?.hidden)
      .toBe(true)
  })

  it('lets every area back into play once the main frame is picked', () => {
    const left = framed('modules')
    const middle = framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').click()

    pickArea('fields')

    expect(left.hasAttribute('inert')).toBe(false)
    expect(middle.hasAttribute('inert')).toBe(false)
  })

  it('stands the tabs again once the backend has built on inside an area', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    const middle = boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    const inside = middle.appendChild(document.createElement('div'))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(left, new DOMRect(0, 101, 300, 900))
    boxed(middle, new DOMRect(300, 101, 414, 900))
    inside.append(document.createElement('span'))
    await watched()

    expect(tabOf('pageMounts').style.getPropertyValue('--vperm-host-x')).toBe('300px')
    expect(tabOf('pageMounts').hidden).toBe(false)
  })

  it('keeps one sheet for each area as the areas change', async () => {
    boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    await watched()

    expect(document.querySelectorAll(`.${classes.areaCover}`)).toHaveLength(2)
  })

  it('stands the tabs again once a module has arrived in its own frame', async () => {
    const right = boxed(framed('fields'), new DOMRect(654, 101, 1146, 900))
    const frame = document.createElement('iframe')
    right.append(frame)
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(right, new DOMRect(500, 101, 1300, 900))
    frame.dispatchEvent(new Event('load'))
    await watched()

    expect(tabOf('fields').style.getPropertyValue('--vperm-host-x')).toBe('500px')
  })

  it('stands the tabs again once the window has been resized', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(left, new DOMRect(60, 101, 180, 900))
    window.dispatchEvent(new Event('resize'))
    await watched()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('60px')
  })

  it('stands the tabs again once an area has been dragged wider', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(left, new DOMRect(0, 101, 534, 900))
    boxesChanged()
    await watched()

    expect(document.querySelector<HTMLElement>(`.${classes.tabCard}`)
      ?.style.getPropertyValue('--vperm-host-width')).toBe('534px')
  })

  it('stands the tabs again once an area has finished fading', async () => {
    framed('modules')
    const middle = boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').click()
    await watched()

    boxed(middle, new DOMRect(240, 101, 500, 900))
    middle.dispatchEvent(new Event('transitionend', { bubbles: true }))
    await watched()

    expect(document.querySelector<HTMLElement>(`.${classes.areaCover}[${attributes.area}="pageMounts"]`)
      ?.style.getPropertyValue('--vperm-host-width')).toBe('500px')
  })

  it('leaves its own changes alone', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(left, new DOMRect(60, 101, 240, 900))
    document.querySelector(`.${classes.tabBar}`)?.append(document.createElement('span'))
    await watched()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('0px')
  })

  // Building a tab or moving its bar takes the keyboard off it
  it('keeps the keyboard on a tab while it looks again', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').focus()

    boxed(left, new DOMRect(0, 101, 300, 900))
    document.body.append(document.createElement('span'))
    await watched()

    expect(document.activeElement).toBe(tabOf('modules'))
  })

  it('says the bar is a bar of tabs', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.querySelector(`.${classes.tabBar}`)?.getAttribute('role')).toBe('tablist')
    expect(tabOf('modules').getAttribute('role')).toBe('tab')
    // Tab in a form of the backend's own must never send it; type must be 'button'
    expect(tabOf('modules').getAttribute('type')).toBe('button')
  })

  it('names the bar after what its tabs are', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.querySelector(`.${classes.tabBar}`)?.getAttribute('aria-label')).toBe('Areas to work in')
  })

  it('leaves the tab of an area the backend has no word for unnamed', () => {
    framed('modules')
    framed('languages')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('languages').textContent).toBe('')
    expect(tabOf('modules').textContent).toBe('Modules')
  })

  it('carries the tabs even where the backend gave no words at all', () => {
    framed('modules')
    initialise(document, listening.signal)

    activate()

    expect(tabs()).toStrictEqual(['', '', '', '', ''])
  })

  it('leaves the tab of an area that stands on no named ground bare', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabOf('modules').getAttribute(attributes.ground)).toBe('')
  })

  it('takes the sheets away with the bar when permissions are hidden', () => {
    framed('modules')
    framed('pageMounts')
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    tabOf('modules').click()

    deactivate()

    expect(document.querySelector(`.${classes.areaCover}`)).toBeNull()
  })

  it('leaves the bar as it stands where there is no header to stand it against', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.body.style.getPropertyValue('--vperm-tab-top')).toBe('')
  })

  it('says how tall the tabs turned out', async () => {
    framed('modules')
    header()
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    boxed(tabOf('modules'), new DOMRect(0, 60, 84, 37))
    window.dispatchEvent(new Event('resize'))
    await watched()

    expect(document.body.style.getPropertyValue('--vperm-tab-tall')).toBe('37px')
  })

  // Height must be in whole pixels to avoid seams along the bar
  it('says that height in whole pixels', async () => {
    framed('modules')
    header()
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    boxed(tabOf('modules'), new DOMRect(0, 60, 84, 32.86))
    window.dispatchEvent(new Event('resize'))
    await watched()

    expect(document.body.style.getPropertyValue('--vperm-tab-tall')).toBe('33px')
  })

  it('says nothing about the height while no tab has been laid out', () => {
    framed('modules')
    header()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.body.style.getPropertyValue('--vperm-tab-tall')).toBe('')
  })

  // A page with no area has no tab to measure and the bar carries none
  it('says nothing about the height on a page with no area at all', () => {
    header()
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(tabs()).toStrictEqual([])
    expect(document.body.style.getPropertyValue('--vperm-tab-tall')).toBe('')
  })

  it('looks again when a change of its own arrives among the backend\'s', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    boxed(left, new DOMRect(90, 101, 240, 900))
    document.querySelector(`.${classes.tabBar}`)?.append(document.createElement('span'))
    document.body.append(document.createElement('span'))
    await watched()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('90px')
  })

  it('stops looking once the backend is done with the page', async () => {
    const left = boxed(framed('modules'), new DOMRect(0, 101, 240, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()
    await watched()

    listening.abort()
    boxed(left, new DOMRect(120, 101, 240, 900))
    window.dispatchEvent(new Event('resize'))
    document.body.dispatchEvent(new Event('transitionend', { bubbles: true }))
    await watched()

    expect(tabOf('modules').style.getPropertyValue('--vperm-host-x')).toBe('0px')
  })

  it('keeps the one card it has, look after look, and one seam for each area', async () => {
    framed('modules')
    boxed(framed('fields'), new DOMRect(654, 101, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    document.body.append(document.createElement('span'))
    await watched()

    expect(document.querySelectorAll(`.${classes.tabCard}`)).toHaveLength(1)
    expect(document.querySelectorAll(`.${classes.tabSeam}`)).toHaveLength(2)
  })

  it('outlines nothing while the armed area has not arrived yet', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    pickArea('languages')

    expect(document.querySelector<HTMLElement>(`.${classes.tabCard}`)?.hidden).toBe(true)
  })

  it('outlines the armed area only while it has room on screen', () => {
    const left = framed('modules')
    left.getBoundingClientRect = (): DOMRect => new DOMRect(0, 101, 0, 0)
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('modules').click()

    expect(document.querySelector<HTMLElement>(`.${classes.tabCard}`)?.hidden).toBe(true)
  })

  it('draws no edge beside a module area that is not there', () => {
    framed('modules')
    toolbarItem()
    initialise(document, listening.signal)

    activate()

    expect(document.querySelector<HTMLElement>(`.${classes.tabSeam}`)?.hidden).toBe(true)
  })

  it('draws no edge beside a module area with no room on screen', () => {
    framed('modules')
    const right = framed('fields')
    right.getBoundingClientRect = (): DOMRect => new DOMRect(654, 101, 0, 0)
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('modules').click()

    expect(document.querySelector<HTMLElement>(`.${classes.tabSeam}`)?.hidden).toBe(true)
  })

  it('leaves the edge beside the module area to the card that owns it', () => {
    framed('modules')
    boxed(framed('pageMounts'), new DOMRect(240, 101, 414, 900))
    boxed(framed('fields'), new DOMRect(654, 101, 1146, 900))
    toolbarItem()
    initialise(document, listening.signal)
    activate()

    tabOf('fields').click()

    expect(document.querySelector<HTMLElement>(`.${classes.tabSeam}`)?.hidden).toBe(true)
  })
})
