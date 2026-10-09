import { afterEach, describe, expect, it } from 'vitest'
import Hotkeys, { ModifierKeys } from '@typo3/backend/hotkeys.js'
import { bindShortcut, spelled } from '#src/platform/shortcuts.js'

const onKeyboardWithout = (modifier: string): void => {
  Object.assign(Hotkeys, { normalizedCtrlModifierKey: modifier })
}

describe('spelling out a shortcut', () => {
  afterEach(() => { onKeyboardWithout(ModifierKeys.META) })

  it('carries the symbols a mac keyboard has on its keys', () => {
    expect(spelled('v')).toBe('⌘⇧V')
  })

  it('names the keys in words where there are no symbols', () => {
    onKeyboardWithout(ModifierKeys.CTRL)
    TYPO3.settings.visualPermissions = { modifiers: 'Strg+Umschalt' }

    expect(spelled('v')).toBe('Strg+Umschalt+V')
  })

  it('names the key alone where the backend published no words for the others', () => {
    onKeyboardWithout(ModifierKeys.CTRL)
    delete TYPO3.settings.visualPermissions

    expect(spelled('v')).toBe('+V')
  })
})

describe('binding a shortcut to a button', () => {
  it('shows the keys on the button and answers them', () => {
    delete TYPO3.settings.visualPermissions
    const button = document.createElement('button')
    let pressed = 0

    bindShortcut('u', button, () => { pressed += 1 })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', metaKey: true, shiftKey: true }))

    expect([button.querySelector('kbd')?.textContent, pressed]).toStrictEqual(['⌘⇧U', 1])
  })

  it('binds nothing where the installation gave no key', () => {
    const button = document.createElement('button')

    bindShortcut('', button, () => undefined)

    expect([button.querySelector('kbd'), button.hasAttribute('aria-keyshortcuts')]).toStrictEqual([null, false])
  })

  it('leaves a key typed into a field alone', () => {
    const field = document.createElement('input')
    document.body.append(field)
    let pressed = 0

    bindShortcut('y', document.createElement('button'), () => { pressed += 1 })
    field.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', metaKey: true, shiftKey: true, bubbles: true }))

    expect(pressed).toBe(0)
  })

  it('keeps the keys off the button where the installation wants none shown', () => {
    TYPO3.settings.visualPermissions = { keysOnButtons: false }
    const button = document.createElement('button')

    bindShortcut('u', button, () => undefined)

    expect([button.querySelector('kbd'), button.hasAttribute('aria-keyshortcuts')]).toStrictEqual([null, true])
  })
})
