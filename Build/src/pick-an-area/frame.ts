import { attributes, classes } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import { getState, subscribe, type SessionState } from '../platform/session.js'
import { withOlderHost } from './compatibility/area-hosts.js'

interface Area {
  readonly key: string
  readonly host: string
  readonly ground: string
  // Column belongs to whichever tree the module is showing
  readonly showing?: string
}

const areas: readonly Area[] = [
  { key: 'modules', host: withOlderHost('.scaffold-sidebar'), ground: 'panel' },
  {
    key: 'pageMounts',
    host: withOlderHost('typo3-backend-navigation-component-pagetree'),
    showing: 'typo3-backend-navigation-component-pagetree',
    ground: 'tree',
  },
  {
    key: 'fileMounts',
    host: withOlderHost('typo3-backend-navigation-component-filestoragetree'),
    showing: 'typo3-backend-navigation-component-filestoragetree',
    ground: 'tree',
  },
  { key: 'fields', host: withOlderHost('[slot="content"]'), ground: 'module' },
]

function unframe(doc: Document): void {
  doc.querySelectorAll(`.${classes.frame}`).forEach(host => {
    host.classList.remove(classes.frame)
    host.removeAttribute(attributes.area)
    host.removeAttribute(attributes.ground)
  })
}

function hostOf(doc: Document, area: Area): HTMLElement | null {
  if (area.showing !== undefined) {
    const tree = doc.querySelector(area.showing)
    if (tree === null || getComputedStyle(tree).display === 'none') {
      return null
    }
  }

  return doc.querySelector<HTMLElement>(area.host)
}

export function initialise(doc: Document, signal: AbortSignal): void {
  const show = (state: SessionState): void => {
    const title = state.active ? titleOf(doc, state.groupId) : null
    if (title === null) {
      unframe(doc)

      return
    }

    const framed = areas.flatMap(area => {
      const host = hostOf(doc, area)

      return host === null ? [] : [{ ...area, element: host }]
    })

    unframe(doc)

    framed.forEach(({ element, key, ground }) => {
      element.classList.add(classes.frame)
      element.setAttribute(attributes.area, key)
      element.setAttribute(attributes.ground, ground)
      pinSurface(element)
    })
  }

  let looking = 0
  const watch = new MutationObserver(() => {
    window.cancelAnimationFrame(looking)
    looking = window.requestAnimationFrame(() => {
      if (unframed(doc)) {
        show(getState())
      }
    })
  })

  watch.observe(doc.body, { childList: true, subtree: true })
  signal.addEventListener('abort', () => { watch.disconnect() })

  show(getState())
  subscribe(show, signal)
}

function unframed(doc: Document): boolean {
  return areas.some(area => {
    const host = hostOf(doc, area)

    return host !== null
      && (!host.classList.contains(classes.frame)
        || host.getAttribute(attributes.area) !== area.key)
  })
}

// A plate must be opaque to hide a hatch; only the backend knows the area colour
function pinSurface(element: HTMLElement): void {
  for (let node: HTMLElement | null = element; node !== null; node = node.parentElement) {
    const colour = getComputedStyle(node).backgroundColor
    if (colour !== 'rgba(0, 0, 0, 0)') {
      element.style.setProperty('--vperm-surface', colour)

      return
    }
  }
}
