import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import {
  activate, deactivate, getState, hideControls, selectGroup, showControls,
} from '#src/platform/session.js'
import { initialise } from '#src/surfaces/toolbar/controls.js'

const controls = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>(`[${attributes.controls}]`)
  if (element === null) {
    throw new Error('no controls in the document')
  }

  return element
}

const toolbar = (): HTMLElement => {
  const button = document.querySelector<HTMLElement>(`[${attributes.toolbar}]`)
  if (button === null) {
    throw new Error('no toolbar button in the document')
  }

  return button
}

describe('the controls in the header', () => {
  let listening: AbortController

  beforeEach(() => {
    hideControls()
    deactivate()
    selectGroup(null)
    listening = new AbortController()
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div>'
      + `<li class="${classes.toolbarItem}"><button ${attributes.toolbar} aria-pressed="false">`
      + `</button><div ${attributes.controls} hidden>`
      + `<select ${attributes.group}></select></div></li>`
  })

  afterEach(() => {
    listening.abort()
  })

  it('stands them in the empty middle of the header bar', () => {
    initialise(document, listening.signal)

    const stood = document.querySelector(`.topbar-site-container [${attributes.controls}]`)

    expect(stood).not.toBeNull()
    expect(stood?.hasAttribute('hidden')).toBe(false)
    expect(stood?.classList.contains(classes.viewAsControls)).toBe(true)
  })

  // The controls start on the line where the areas below them start
  it('lets the site reach to the end of the module panel', () => {
    globalThis.ResizeObserver = class {
      observe(): void { /* The panel is not changed here */ }
      disconnect(): void { /* Nothing to let go of */ }
    } as unknown as typeof ResizeObserver
    document.body.insertAdjacentHTML('afterbegin', `<style>.${classes.viewAsControls} { margin-inline-start: 24px }</style><div class="scaffold-sidebar"></div>`)
    document.querySelector('.topbar-site-container')?.insertAdjacentHTML('afterbegin', '<div class="topbar-site"></div>')
    const at = (left: number, right: number) => () => ({ left, right, top: 0, bottom: 0, width: right - left, height: 0, x: left, y: 0, toJSON: () => ({}) })
    const [panel, site] = [...document.querySelectorAll<HTMLElement>('.scaffold-sidebar, .topbar-site')]
    if (panel === undefined || site === undefined) {
      throw new Error('no module panel and site in the document')
    }

    panel.getBoundingClientRect = at(0, 240)
    site.getBoundingClientRect = at(56, 164)

    initialise(document, listening.signal)

    expect(site.style.flexBasis).toBe('160px')
  })

  it('leaves the controls where they were when the header keeps no room', () => {
    document.querySelector('.topbar-site-container')?.remove()

    initialise(document, listening.signal)

    expect(controls().closest(`.${classes.toolbarItem}`)).not.toBeNull()
    expect(controls().hasAttribute('hidden')).toBe(true)
  })

  it('leaves the header alone when there are no controls to stand up', () => {
    controls().remove()

    initialise(document, listening.signal)

    expect(document.querySelector('.topbar-site-container')?.children).toHaveLength(0)
  })

  it('keeps the bar folded away until the toolbar button asks for it', () => {
    initialise(document, listening.signal)

    expect(controls().classList.contains(classes.controlsOpen)).toBe(false)

    toolbar().click()

    expect(controls().classList.contains(classes.controlsOpen)).toBe(true)
  })

  it('folds the bar away again when the toolbar button is pressed a second time', () => {
    initialise(document, listening.signal)
    toolbar().click()

    toolbar().click()

    expect(controls().classList.contains(classes.controlsOpen)).toBe(false)
  })

  it('stands the bar up at once on a page that was left with it open', () => {
    showControls()

    initialise(document, listening.signal)

    expect(controls().classList.contains(classes.controlsOpen)).toBe(true)
  })

  it('writes the bar down, so the next page stands it up again', () => {
    initialise(document, listening.signal)

    toolbar().click()

    expect(getState().open).toBe(true)
  })

  it('says on the toolbar button whether the bar is up', () => {
    initialise(document, listening.signal)

    expect(toolbar().getAttribute('aria-pressed')).toBe('false')

    toolbar().click()

    expect(toolbar().getAttribute('aria-pressed')).toBe('true')
  })

  it('stands the bar up when the mode is switched on from the keyboard', () => {
    selectGroup(13)
    initialise(document, listening.signal)

    activate()

    expect(controls().classList.contains(classes.controlsOpen)).toBe(true)
    expect(toolbar().getAttribute('aria-pressed')).toBe('true')
  })


  it('takes the bar out of the header once the signal is aborted', () => {
    initialise(document, listening.signal)

    listening.abort()

    expect(document.querySelector(`[${attributes.controls}]`)).toBeNull()
  })

  // The bar is gone; a press would switch a mode nothing can switch back
  it('leaves the toolbar button dead once the signal is aborted', () => {
    initialise(document, listening.signal)
    showControls()
    const button = toolbar()

    listening.abort()
    button.click()

    expect(getState().open).toBe(true)
  })

  it('stands the controls up on a page that has no toolbar button', () => {
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div>'
      + `<div ${attributes.controls} hidden><select ${attributes.group}></select></div>`

    initialise(document, listening.signal)

    expect(controls().parentElement?.className).toBe('topbar-site-container')
    expect(controls().hidden).toBe(false)
  })
})
