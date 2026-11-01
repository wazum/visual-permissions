import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { activate, deactivate, getState, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/switch-the-mode/toggle.js'
import { forget, registered } from '../__mocks__/typo3-hotkeys.js'

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

describe('the visual mode shortcut', () => {
  let listening: AbortController

  const press = (key: string): void => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: true, shiftKey: true }))
  }

  beforeEach(() => {
    localStorage.clear()
    forget()
    TYPO3.settings.visualPermissions = { toggleKey: 'u' }
    deactivate()
    selectGroup(13)
    listening = new AbortController()
    document.body.innerHTML = toggleMarkup
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('switches the mode on', () => {
    initialise(document, listening.signal)

    press('U')

    expect(isOn()).toBe(true)
  })

  it('switches the mode off again on a second press', () => {
    initialise(document, listening.signal)

    press('U')
    press('U')

    expect(isOn()).toBe(false)
  })

  it('works while the group select has focus', () => {
    document.body.insertAdjacentHTML('beforeend', `<select ${attributes.group}></select>`)
    initialise(document, listening.signal)

    document.querySelector('select')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'U', metaKey: true, shiftKey: true, bubbles: true }),
    )

    expect(isOn()).toBe(true)
  })

  it('shows on the button which keys switch it', () => {
    initialise(document, listening.signal)

    expect(toggle().querySelector('kbd')?.textContent).toBe('⌘⇧U')
  })

  it('tells a screen reader which keys switch the toggle', () => {
    initialise(document, listening.signal)

    expect(toggle().getAttribute('aria-keyshortcuts')).toContain('u')
  })

  it('answers the key the installation picked', () => {
    TYPO3.settings.visualPermissions = { toggleKey: 'k' }
    initialise(document, listening.signal)

    press('K')

    expect(isOn()).toBe(true)
  })

  it('leaves the keys off the button where an installation says so', () => {
    TYPO3.settings.visualPermissions = { toggleKey: 'u', keysOnButtons: false }

    initialise(document, listening.signal)

    expect(toggle().querySelector('kbd')).toBeNull()
    expect(registered()).toHaveLength(1)
  })

  it('registers nothing when no key is named', () => {
    TYPO3.settings.visualPermissions = { toggleKey: '' }

    initialise(document, listening.signal)

    expect(registered()).toStrictEqual([])
  })

  it('registers nothing on a page that carries no settings of ours', () => {
    delete TYPO3.settings.visualPermissions

    initialise(document, listening.signal)

    expect(registered()).toStrictEqual([])
  })

  it('leaves another key alone', () => {
    initialise(document, listening.signal)

    press('K')

    expect(isOn()).toBe(false)
  })

  it('switches nothing while no group is selected', () => {
    selectGroup(null)
    initialise(document, listening.signal)

    press('U')

    expect(isOn()).toBe(false)
  })
})
