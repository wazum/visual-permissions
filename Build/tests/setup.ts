import { afterEach, beforeEach, vi } from 'vitest'
import { routes } from '#src/platform/routes.js'

beforeEach(() => {
  TYPO3.lang = {}
})

afterEach(() => {
  vi.useRealTimers()
})

class Boxes {
  static readonly watching: Boxes[] = []

  private readonly watched = new Set<Element>()

  constructor(private readonly report: () => void) {
    Boxes.watching.push(this)
  }

  static tell(): void {
    Boxes.watching.filter(boxes => boxes.watched.size > 0).forEach(boxes => { boxes.report() })
  }

  observe(element: Element): void {
    this.watched.add(element)
  }

  disconnect(): void {
    this.watched.clear()
    Boxes.watching.splice(Boxes.watching.indexOf(this), 1)
  }
}

Object.assign(globalThis, { ResizeObserver: Boxes, boxesChanged: () => { Boxes.tell() } })

declare global {
  function boxesChanged(): void
}

const published = [
  ...Object.values(routes),
  'page_tree_browser_configuration',
  'filestorage_tree_rootline',
  'filestorage_tree_filter',
  'switch_user',
  'switch_user_exit',
]

Object.assign(globalThis, {
  TYPO3: {
    lang: {},
    settings: {
      ajaxUrls: Object.fromEntries(published.map(id => [id, `/typo3/ajax/${id}`])),
      visualPermissions: {
        animation: true, toggleKey: 'u', switchUserKey: 'v', leave: 'Leave user view',
      },
    },
  },
})

Object.assign(HTMLElement.prototype, {
  showPopover(this: HTMLElement) {
    if (!this.hasAttribute('popover')) {
      throw new DOMException('Not a popover', 'InvalidStateError')
    }

    if (this.hasAttribute('data-open')) {
      return
    }

    this.dispatchEvent(Object.assign(new Event('beforetoggle'), { newState: 'open' }))
    this.toggleAttribute('data-open', true)
    this.dispatchEvent(new Event('toggle'))
  },
  hidePopover(this: HTMLElement) {
    if (!this.hasAttribute('data-open')) {
      return
    }

    this.dispatchEvent(Object.assign(new Event('beforetoggle'), { newState: 'closed' }))
    this.removeAttribute('data-open')
    this.dispatchEvent(new Event('toggle'))
  },
  scrollIntoView: (): undefined => undefined,
})
