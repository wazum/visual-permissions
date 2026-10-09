import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { activate, deactivate, getState, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/switch-the-mode/toggle.js'

const toggleMarkup = `<button type="button" ${attributes.toggle} aria-pressed="false"></button>`

const toggle = (): HTMLButtonElement => {
  const element = document.querySelector<HTMLButtonElement>(`[${attributes.toggle}]`)
  if (element === null) {
    throw new Error('no toggle in the document')
  }

  return element
}

const isOn = (): boolean => toggle().getAttribute('aria-pressed') === 'true'

describe('the visual mode toggle', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(13)
    listening = new AbortController()
    document.body.innerHTML = toggleMarkup
  })

  afterEach(() => {
    listening.abort()
  })

  it('cannot be switched while no group is selected', () => {
    selectGroup(null)

    initialise(document, listening.signal)

    expect(toggle().disabled).toBe(true)
  })

  it('cannot be switched any more once the group is dropped', () => {
    initialise(document, listening.signal)

    selectGroup(null)

    expect(toggle().disabled).toBe(true)
  })

  it('shows the mode as off while it is off', () => {
    initialise(document, listening.signal)

    expect(isOn()).toBe(false)
  })

  it('shows the mode as on while it is on', () => {
    activate()

    initialise(document, listening.signal)

    expect(isOn()).toBe(true)
  })

  it('turns the mode on when switched on', () => {
    initialise(document, listening.signal)

    toggle().click()

    expect(getState().active).toBe(true)
  })

  it('turns the mode off when switched off again', () => {
    activate()
    initialise(document, listening.signal)

    toggle().click()

    expect(getState().active).toBe(false)
  })

  it('stops switching the mode once the backend page is gone', () => {
    initialise(document, listening.signal)
    listening.abort()

    toggle().click()

    expect(getState().active).toBe(false)
  })

  it('follows the mode when something else changes it', () => {
    initialise(document, listening.signal)

    activate()

    expect(isOn()).toBe(true)
  })

  it('does nothing when the document has no toggle', () => {
    document.body.innerHTML = ''

    expect(() => {
      initialise(document, listening.signal)
    }).not.toThrow()
  })
})
