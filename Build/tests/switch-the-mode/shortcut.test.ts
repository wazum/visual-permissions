import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { deactivate, getState, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/switch-the-mode/shortcut.js'
import { forget, registered } from '../__mocks__/typo3-hotkeys.js'

const press = (key: string): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: true, shiftKey: true }))
}

const showsPermissions = (): boolean => getState().active

describe('the visual mode shortcut', () => {
  beforeEach(() => {
    localStorage.clear()
    forget()
    TYPO3.settings.visualPermissions = { toggleKey: 'u' }
    deactivate()
    selectGroup(13)
    document.body.innerHTML = `<input type="checkbox" ${attributes.toggle}>`
  })

  afterEach(() => {
    deactivate()
  })

  it('shows the permissions of the selected group', () => {
    initialise(document)

    press('U')

    expect(showsPermissions()).toBe(true)
  })

  it('works while the group select has focus', () => {
    document.body.innerHTML = `<input type="checkbox" ${attributes.toggle}>`
      + `<select ${attributes.group}></select>`
    initialise(document)

    document.querySelector('select')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'U', metaKey: true, shiftKey: true, bubbles: true }),
    )

    expect(showsPermissions()).toBe(true)
  })

  it('hides them again on a second press', () => {
    initialise(document)

    press('U')
    press('U')

    expect(showsPermissions()).toBe(false)
  })

  it('shows on the button which keys switch it', () => {
    initialise(document)

    expect(document.querySelector(`[${attributes.toggle}] kbd`)?.textContent).toBe('⌘⇧U')
  })

  it('tells a screen reader which keys switch the toggle', () => {
    initialise(document)

    expect(document.querySelector(`[${attributes.toggle}]`)?.getAttribute('aria-keyshortcuts'))
      .toContain('u')
  })

  it('answers the key the installation picked', () => {
    TYPO3.settings.visualPermissions = { toggleKey: 'k' }
    initialise(document)

    press('K')

    expect(showsPermissions()).toBe(true)
  })

  it('leaves the keys off the button where an installation says so', () => {
    TYPO3.settings.visualPermissions = { toggleKey: 'u', keysOnButtons: false }

    initialise(document)

    expect(document.querySelector(`[${attributes.toggle}] kbd`)).toBeNull()
    expect(registered()).toHaveLength(1)
  })

  // An installation with clashing keys empties the setting; register nothing
  it('registers nothing when no key is named', () => {
    TYPO3.settings.visualPermissions = { toggleKey: '' }

    initialise(document)

    expect(registered()).toStrictEqual([])
  })

  it('registers nothing on a page that carries no settings of ours', () => {
    delete TYPO3.settings.visualPermissions

    initialise(document)

    expect(registered()).toStrictEqual([])
  })

  it('leaves another key alone', () => {
    initialise(document)

    press('K')

    expect(showsPermissions()).toBe(false)
  })

  it('shows nothing while no group is selected', () => {
    selectGroup(null)
    initialise(document)

    press('U')

    expect(showsPermissions()).toBe(false)
  })
})
