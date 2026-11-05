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

describe('the site in the header, beside the module panel 13.4 draws', () => {
  let listening: AbortController

  beforeEach(() => {
    globalThis.ResizeObserver = class {
      observe(): void { /* The test says when the panel changed */ }
      disconnect(): void { /* Nothing to let go of */ }
    } as unknown as typeof ResizeObserver
    listening = new AbortController()
    document.body.removeAttribute('style')
    document.body.innerHTML = '<div class="scaffold-modulemenu"></div>'
      + '<div class="topbar-site-container"><div class="topbar-site"></div><div class="follower" style="margin-inline-start: 24px"></div></div>'
    placeAt(site(), 56, 164)
    placeAt(found('.scaffold-modulemenu'), 0, 240)
  })

  afterEach(() => {
    listening.abort()
  })

  it('reaches to the end of the module panel', () => {
    lineUpWithPanel(document, follower(), listening.signal)

    expect(site().style.flexBasis).toBe('160px')
  })

  // 13.4 divides its columns with a line and stands the tabs on it
  it('reaches to the line that divides the columns', () => {
    document.body.style.setProperty('--vperm-divider', '1px')

    lineUpWithPanel(document, follower(), listening.signal)

    expect(site().style.flexBasis).toBe('159px')
  })
})
