import { attributes, classes } from '../platform/contract.js'
import { openedByUs, openModule } from './modules.js'
import { labelOf } from '../platform/labels.js'
import { say } from '../platform/panel-card.js'
import { dividerIn } from '../platform/panel-line.js'
import { getState, pickArea, standIn, subscribe, type SessionState } from '../platform/session.js'

const otherPermissions = 'other'

const everyArea: readonly string[] = ['modules', 'pageMounts', 'fileMounts', 'fields', otherPermissions]

// Air between tabs is 10; this is a domain rule for layout
const air = 10

const drawnIn: Readonly<Record<string, string>> = {
  pageMounts: 'tree',
  fileMounts: 'tree',
  // Stryker disable next-line StringLiteral: the name only pairs the two tabs, and the other tab follows the fields tab anyway
  fields: 'module',
  // Stryker disable next-line StringLiteral: see above
  [otherPermissions]: 'module',
}

const drawnBy: Readonly<Record<string, string>> = {
  pageMounts: 'web_layout',
  fileMounts: 'media_management',
}

export function initialise(doc: Document, signal: AbortSignal): void {
  const bar = doc.createElement('nav')
  bar.className = classes.tabBar
  bar.setAttribute('role', 'tablist')
  bar.setAttribute('aria-label', labelOf('pickAnArea.bar'))

  const stamped = new Set<HTMLElement>()

  const restoreAreas = (): void => {
    stamped.forEach(host => {
      host.removeAttribute('inert')
      host.removeAttribute(attributes.armed)
    })
    stamped.clear()
  }

  // Stryker disable next-line StringLiteral: any seed differs from the first list of columns, and an empty list is turned away below
  let judged = ''

  // Fixed set of tabs; the tabs are always the same ones
  let built = ''

  const show = (state: SessionState): void => {
    const hosts = framedAreas(doc)

    hosts.forEach(host => { measuring.observe(host) })

    if (!state.active) {
      bar.remove()
      restoreAreas()

      return
    }

    const named = hosts.map(host => nameOf(host))
    const offered = [...everyArea, ...named.filter(area => !everyArea.includes(area))]
    // Stryker disable next-line ArrayDeclaration: an area nobody built a tab for is turned away below
    const sharing = named.includes('fields') ? [otherPermissions] : []

    // An empty column for a picked area stands, even if off screen
    const columns = hosts.filter(host => host.getBoundingClientRect().width !== 0).map(nameOf)
    const shownAreas = columns.includes('fields') ? [...columns, otherPermissions] : columns
    const [first] = shownAreas.includes('fields') ? ['fields'] : shownAreas
    // What the admin picked comes first, wherever they are; the pick is theirs again as soon as a module has a column for it.
    const instead = shownAreas.find(area => drawnIn[area] !== undefined && drawnIn[area] === drawnIn[state.picked])
    const nextArea = shownAreas.includes(state.picked) ? state.picked : instead ?? first

    if (shownAreas.join() !== judged) {
      judged = shownAreas.join()

      // Stryker disable next-line ConditionalExpression: standing in the area already stood in says the same as leaving it
      if (nextArea !== undefined && nextArea !== state.area) {
        standIn(nextArea)

        return
      }
    }

    if (named.join() !== built) {
      built = named.join()
      bar.replaceChildren(
        ...named.flatMap(area => [sheetFor(doc, area), seamFor(doc, area)]),
        ...offered.map(area => tabFor(doc, area, labelOf(`pickAnArea.${area}`))),
      )
    }

    if (bar.parentElement === null) {
      homeIn(doc).append(bar)
    }

    // The tab that owns none of its own follows the column it shares
    const armed = state.area === otherPermissions ? 'fields' : state.area

    fitBar(bar, doc)
    // Area is armed before it has arrived; nothing to outline until then.
    outlineCard(bar, doc, hosts.find(host => nameOf(host) === armed) ?? null)

    const sideArea = state.area !== 'fields'

    hosts.forEach(host => {
      const area = nameOf(host)
      const own = area === armed
      const inactive = sideArea && !own && area !== 'modules'

      const tab = tabIn(bar, area)

      // Stryker disable next-line OptionalChaining: a tab is built for every offered area, and this one is on screen
      tab?.setAttribute('aria-selected', String(area === state.area))
      pin(tab, host)
      // Armed area's top edge is drawn by the card; do not toggle it here.
      host.toggleAttribute(attributes.armed, own)
      host.toggleAttribute('inert', inactive)
      stamped.add(host)
      lay(sheetIn(bar, area), host, inactive)
      drawSeam(seamIn(bar, area), host, own, hosts)
    })

    // Tabs in this column start where the column does, not from the left edge
    let cursor = 0
    let behind: HTMLElement | null = null

    offered.forEach(area => {
      const tab = tabIn(bar, area)
      if (tab === null) {
        return
      }

      const wide = tab.hidden ? 0 : tab.getBoundingClientRect().width
      const host = hosts.find(one => nameOf(one) === area)
      const column = host ?? columnOf(area, hosts)
      const room = Math.max(cursor, column?.getBoundingClientRect().left ?? cursor)

      tab.style.setProperty('--vperm-host-x', `${String(room)}px`)

      // Tab does not cover the rule if it is owned elsewhere; host must be defined for it to do so.
      tab.toggleAttribute(attributes.elsewhere, host === undefined)

      // Stryker disable next-line ConditionalExpression: a tab with a column of its own was already dressed from it above
      if (host === undefined) {
        tab.setAttribute('aria-selected', String(area === state.area))
        matchBackground(tab, column ?? behind ?? tab)
      }

      cursor = tab.hidden ? cursor : room + wide + air
      behind = tab
    })

    const ahead = tabIn(bar, 'fields')

    sharing.forEach(area => {
      const tab = tabIn(bar, area)

      // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: both areas are in everyArea, so both were built above
      if (tab === null || ahead === null) {
        return
      }

      tab.setAttribute('aria-selected', String(area === state.area))
      tab.hidden = ahead.hidden
    })
  }

  let looking = 0
  const recheck = (): void => {
    window.cancelAnimationFrame(looking)
    looking = window.requestAnimationFrame(() => { show(getState()) })
  }

  const watch = new MutationObserver(reports => {
    if (reports.some(report => !bar.contains(report.target))) {
      recheck()
    }
  })

  // The backend's first module is the one the page was opened on, so a reload moves nowhere
  let landed = false
  const moved = (event: Event): void => {
    // Stryker disable next-line StringLiteral: the name is only asked whether we opened it
    const module = (event as CustomEvent<{ module?: string }>).detail.module ?? ''
    const ours = openedByUs(module)
    if (!landed) {
      landed = true

      return
    }

    if (!ours && drawnIn[getState().picked] === 'tree') {
      pickArea('fields')
    }
  }

  doc.addEventListener('typo3-module-loaded', moved, { signal })
  watch.observe(doc.body, { childList: true, subtree: true })
  const measuring = new ResizeObserver(recheck)
  doc.body.addEventListener('load', recheck, { capture: true, signal })
  window.addEventListener('resize', recheck, { signal })
  doc.body.addEventListener('transitionend', recheck, { signal })
  signal.addEventListener('abort', () => {
    watch.disconnect()
    measuring.disconnect()
    window.cancelAnimationFrame(looking)
  })

  subscribe(show, signal)
  show(getState())
}

const homeIn = (doc: Document): HTMLElement =>
  doc.querySelector<HTMLElement>('.scaffold') ?? doc.body

function tabFor(doc: Document, area: string, label: string): HTMLElement {
  const tab = doc.createElement('button')
  tab.type = 'button'
  tab.className = classes.tab
  tab.setAttribute('role', 'tab')
  tab.setAttribute(attributes.area, area)
  tab.setAttribute(attributes.label, label)
  tab.append(say(doc, classes.tabLabel, label))
  tab.addEventListener('click', () => {
    pickArea(area)

    const module = drawnBy[area]
    if (module !== undefined && framedAreas(doc).every(host => nameOf(host) !== area)) {
      openModule(module)
    }
  })

  return tab
}

function pin(tab: HTMLElement | null, host: HTMLElement): void {
  const box = host.getBoundingClientRect()

  // Stryker disable next-line ConditionalExpression,BlockStatement: a tab is built for every offered area, and this one is on screen
  if (tab === null) {
    return
  }

  tab.hidden = box.width === 0
  matchBackground(tab, host)
}

const matchBackground = (element: HTMLElement, host: HTMLElement): void => {
  element.setAttribute(attributes.ground, host.getAttribute(attributes.ground) ?? '')
}

const bandOf = (host: HTMLElement): number =>
  Number.parseFloat(getComputedStyle(host).paddingBlockStart) || 0

// Bar must stay below the header to be fully visible; tabs lose their line if covered
function fitBar(bar: HTMLElement, doc: Document): void {
  const header = doc.querySelector('.scaffold-header')?.getBoundingClientRect()
  if (header !== undefined) {
    doc.body.style.setProperty('--vperm-tab-top', `${String(header.bottom)}px`)
  }

  const tall = Math.ceil(bar.querySelector(`.${classes.tab}`)?.getBoundingClientRect().height ?? 0)
  if (tall === 0) {
    return
  }

  doc.body.style.setProperty('--vperm-tab-tall', `${String(tall)}px`)
}

function outlineCard(bar: HTMLElement, doc: Document, host: HTMLElement | null): void {
  const card = ensureChild(bar, classes.tabCard, doc)

  // Host must not be null; an area is armed before it has arrived
  if (host === null) {
    card.hidden = true

    return
  }

  card.hidden = host.getBoundingClientRect().width === 0
  matchBackground(card, host)
  placeOver(card, host)
}

// Top edge is where the tab's foot rests; a pixel higher and it stands off the tab
function placeOver(element: HTMLElement, host: HTMLElement): void {
  const box = host.getBoundingClientRect()
  const band = bandOf(host)

  element.style.setProperty('--vperm-host-x', `${String(box.left)}px`)
  element.style.setProperty('--vperm-host-y', `${String(box.top + band)}px`)
  element.style.setProperty('--vperm-host-width', `${String(box.width)}px`)
  element.style.setProperty('--vperm-host-height', `${String(box.height - band)}px`)
}

// Armed area's card draws the seam line; two lines on one pixel is a bug
function drawSeam(seam: HTMLElement | null, host: HTMLElement, armed: boolean, hosts: HTMLElement[]): void {
  // Stryker disable next-line ConditionalExpression,BlockStatement: a seam is built for every area on screen, and this one is
  if (seam === null) {
    return
  }

  const box = host.getBoundingClientRect()

  matchBackground(seam, host)
  seam.hidden = box.width === 0 || box.left === 0 || armed
    || dividerIn(host.ownerDocument) === 0
    || drawnByNeighbour(box, hosts)

  placeOver(seam, host)
}

function ensureChild(bar: HTMLElement, named: string, doc: Document): HTMLElement {
  const existing = bar.querySelector<HTMLElement>(`.${named}`)
  if (existing !== null) {
    return existing
  }

  const made = doc.createElement('div')
  made.className = named
  bar.append(made)

  return made
}

// Column boundaries are drawn by whichever neighbour ends where this one starts
function drawnByNeighbour(box: DOMRect, hosts: HTMLElement[]): boolean {
  const neighbour = hosts.find(host => {
    const its = host.getBoundingClientRect()

    return its.width > 0 && Math.round(its.right) === Math.round(box.left)
  })

  if (neighbour === undefined) {
    return false
  }

  return (Number.parseFloat(getComputedStyle(neighbour).borderRightWidth) || 0) > 0
}

function seamFor(doc: Document, area: string): HTMLElement {
  const seam = doc.createElement('div')
  seam.className = classes.tabSeam
  seam.setAttribute(attributes.area, area)

  return seam
}

// Area out of play has no pointer; cannot carry a cursor inside it
function sheetFor(doc: Document, area: string): HTMLElement {
  const sheet = doc.createElement('div')
  sheet.className = classes.areaCover
  sheet.setAttribute(attributes.area, area)

  return sheet
}

function lay(sheet: HTMLElement | null, host: HTMLElement, inactive: boolean): void {
  // Stryker disable next-line ConditionalExpression,BlockStatement: a sheet is built for every area on screen, and this one is
  if (sheet === null) {
    return
  }

  sheet.hidden = !inactive

  if (!inactive) {
    return
  }

  matchBackground(sheet, host)
  placeOver(sheet, host)
}

const columnOf = (area: string, hosts: HTMLElement[]): HTMLElement | undefined =>
  // Scope drawn in none finds no column to share; area must be defined elsewhere
  drawnIn[area] === undefined
    ? undefined
    : hosts.find(host => drawnIn[nameOf(host)] === drawnIn[area])

const tabIn = (bar: HTMLElement, area: string): HTMLElement | null =>
  bar.querySelector<HTMLElement>(`.${classes.tab}[${attributes.area}="${area}"]`)

const sheetIn = (bar: HTMLElement, area: string): HTMLElement | null =>
  bar.querySelector<HTMLElement>(`.${classes.areaCover}[${attributes.area}="${area}"]`)

const seamIn = (bar: HTMLElement, area: string): HTMLElement | null =>
  bar.querySelector<HTMLElement>(`.${classes.tabSeam}[${attributes.area}="${area}"]`)

function framedAreas(doc: Document): HTMLElement[] {
  return [...doc.querySelectorAll<HTMLElement>(`.${classes.frame}[${attributes.area}]`)]
}

// Stryker disable next-line StringLiteral: every element here was found by that very attribute
const nameOf = (element: HTMLElement): string => element.getAttribute(attributes.area) ?? ''
