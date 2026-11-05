import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { lineUpWithPanel } from '#src/platform/panel-line.js'

const placeAt = (element: Element, left: number, right: number): void => {
  element.getBoundingClientRect = () => ({ left, right, top: 0, bottom: 0, width: right - left, height: 0, x: left, y: 0, toJSON: () => ({}) })
}

const found = (selector: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(selector)
  if (element === null) {
    throw new Error(`no ${selector} in the document`)
  }

  return element
}

const site = (): HTMLElement => found('.topbar-site')
const follower = (): HTMLElement => found('.follower')

describe('the site in the header, as wide as the module panel below it', () => {
  let listening: AbortController
  let changed = (): void => undefined

  beforeEach(() => {
    globalThis.ResizeObserver = class {
      constructor(callback: () => void) { changed = callback }
      observe(): void { /* The test says when the panel changed */ }
      unobserve(): void { /* Nothing to let go of */ }
      disconnect(): void { changed = () => undefined }
    } as unknown as typeof ResizeObserver
    listening = new AbortController()
    document.body.removeAttribute('style')
    document.body.innerHTML = '<div class="scaffold-sidebar"></div>'
      + '<div class="topbar-site-container"><div class="topbar-site"></div><div class="follower" style="margin-inline-start: 24px"></div></div>'
    placeAt(site(), 56, 164)
  })

  afterEach(() => {
    listening.abort()
  })

  // What follows the site starts where the areas below start, however long its name
  it('reaches from where it starts to the end of the module panel', () => {
    placeAt(found('.scaffold-sidebar'), 0, 240)

    lineUpWithPanel(document, follower(), listening.signal)

    expect(site().style.flexBasis).toBe('160px')
  })

  // A folded panel ends inside the logo; there is no line to meet, and the site keeps its width
  it('keeps its own width beside a folded module panel', () => {
    placeAt(found('.scaffold-sidebar'), 0, 56)

    lineUpWithPanel(document, follower(), listening.signal)

    expect(site().style.flexBasis).toBe('')
  })

  it('keeps its own width where the panel ends just before what follows', () => {
    placeAt(found('.scaffold-sidebar'), 0, 80)

    lineUpWithPanel(document, follower(), listening.signal)

    expect(site().style.flexBasis).toBe('')
  })

  it('lets go of its width once the module panel is folded', () => {
    const panel = found('.scaffold-sidebar')
    placeAt(panel, 0, 240)
    lineUpWithPanel(document, follower(), listening.signal)

    placeAt(panel, 0, 56)
    changed()

    expect(site().style.flexBasis).toBe('')
  })

  it('follows the module panel no longer once it is put away', () => {
    const panel = found('.scaffold-sidebar')
    placeAt(panel, 0, 240)
    lineUpWithPanel(document, follower(), listening.signal)
    listening.abort()

    placeAt(panel, 0, 56)
    changed()

    expect(site().style.flexBasis).toBe('160px')
  })
})
