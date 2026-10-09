import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { slideAway, slideIn } from '#src/view-as-user/slide.js'

describe('sliding from one backend to the other', () => {
  beforeEach(() => {
    sessionStorage.clear()
    document.body.removeAttribute(attributes.leaving)
    document.body.removeAttribute(attributes.settling)
    document.body.removeAttribute(attributes.arriving)
    document.body.removeAttribute(attributes.unwrapping)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    delete TYPO3.settings.visualPermissions
  })

  // The page that slid away is gone, so the one that arrives is told which way it came.
  // A note in the tab, since every setting written while the session is somebody else's
  // is written as them.
  // One goes down and the next follows from the top; coming back, one goes up and the
  // next follows from the bottom. The page that arrives was not there when the one before
  // it left, so the way they were both travelling is left behind in the tab.
  it('slides the next backend in the way the last one went', () => {
    vi.useFakeTimers()
    slideAway(document, 'up', () => undefined)
    document.body.removeAttribute(attributes.leaving)

    slideIn(document)

    expect(document.body.getAttribute(attributes.arriving)).toBe('up')

    document.body.dispatchEvent(new Event('animationend'))
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    vi.advanceTimersByTime(300)

    expect(document.body.hasAttribute(attributes.arriving)).toBe(false)
  })

  it('holds the page under wraps until the backend stops loading', () => {
    vi.useFakeTimers()
    sessionStorage.setItem('vperm.arriving', 'down')

    slideIn(document)

    expect(document.body.hasAttribute(attributes.settling)).toBe(true)
    expect(document.body.getAttribute(attributes.arriving)).toBe('down')

    document.body.dispatchEvent(new Event('animationend'))
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    vi.advanceTimersByTime(100)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    vi.advanceTimersByTime(100)

    expect(document.body.hasAttribute(attributes.settling)).toBe(true)

    vi.advanceTimersByTime(200)

    expect(document.body.hasAttribute(attributes.settling)).toBe(false)
    expect(document.body.hasAttribute(attributes.unwrapping)).toBe(true)
  })

  it('lifts the wraps only once the page has come to rest', () => {
    vi.useFakeTimers()
    sessionStorage.setItem('vperm.arriving', 'down')

    slideIn(document)
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    vi.advanceTimersByTime(300)

    expect(document.body.getAttribute(attributes.arriving)).toBe('down')
    expect(document.body.hasAttribute(attributes.unwrapping)).toBe(false)

    document.body.dispatchEvent(new Event('animationend'))

    expect(document.body.hasAttribute(attributes.arriving)).toBe(false)
    expect(document.body.hasAttribute(attributes.unwrapping)).toBe(true)

    vi.advanceTimersByTime(400)

    expect(document.body.hasAttribute(attributes.unwrapping)).toBe(false)
  })

  it('stops listening for modules once the page is unwrapped', () => {
    vi.useFakeTimers()
    sessionStorage.setItem('vperm.arriving', 'down')

    slideIn(document)
    document.body.dispatchEvent(new Event('animationend'))
    vi.runAllTimers()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(vi.getTimerCount()).toBe(0)
  })

  it('lifts the wraps once when the wait for the slide runs out later', () => {
    vi.useFakeTimers()
    sessionStorage.setItem('vperm.arriving', 'down')

    slideIn(document)
    document.body.dispatchEvent(new Event('animationend'))
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    vi.advanceTimersByTime(650)

    expect(document.body.hasAttribute(attributes.unwrapping)).toBe(false)
  })

  it('goes anyway when the tab refuses to hold a note', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })
    const went: string[] = []

    slideAway(document, 'down', () => { went.push('gone') })
    document.body.dispatchEvent(new Event('animationend'))

    expect(went).toStrictEqual(['gone'])
  })

  // Reading the note happens on every page of the backend, so a browser that refuses to
  // be asked would take the whole script down.
  it('slides in nothing when the tab refuses to be asked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })

    slideIn(document)

    expect(document.body.hasAttribute(attributes.arriving)).toBe(false)
  })

  it('slides in all the same when the tab refuses to forget the way', () => {
    sessionStorage.setItem('vperm.arriving', 'down')
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })

    slideIn(document)

    expect(document.body.getAttribute(attributes.arriving)).toBe('down')
  })

  it('goes at once where the installation wants no animation', () => {
    TYPO3.settings.visualPermissions = { animation: false }
    const went: string[] = []

    slideAway(document, 'down', () => { went.push('gone') })

    expect(went).toStrictEqual(['gone'])
    expect(document.body.hasAttribute(attributes.leaving)).toBe(false)
  })

  // Looks like a bug but is required: prevent double switch when both triggers fire
  it('goes once when the animation ends and the wait is up too', () => {
    vi.useFakeTimers()
    const went: string[] = []

    slideAway(document, 'down', () => { went.push('gone') })
    document.body.dispatchEvent(new Event('animationend'))
    vi.advanceTimersByTime(1000)

    expect(went).toStrictEqual(['gone'])
  })

  it('goes anyway when no animation runs', () => {
    vi.useFakeTimers()
    const went: string[] = []

    slideAway(document, 'down', () => { went.push('gone') })
    vi.advanceTimersByTime(1000)

    expect(went).toStrictEqual(['gone'])
  })

  it('slides the backend away before it goes', () => {
    const went: string[] = []

    slideAway(document, 'down', () => { went.push('gone') })

    expect(document.body.getAttribute(attributes.leaving)).toBe('down')
    expect(went).toStrictEqual([])

    document.body.dispatchEvent(new Event('animationend'))

    expect(went).toStrictEqual(['gone'])
  })
})
