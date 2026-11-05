import Hotkeys, { ModifierKeys } from '@typo3/backend/hotkeys.js'

export function spelled(key: string): string {
  if (Hotkeys.normalizedCtrlModifierKey === ModifierKeys.META) {
    return `⌘⇧${key.toUpperCase()}`
  }

  return `${TYPO3.settings.visualPermissions?.modifiers ?? ''}+${key.toUpperCase()}`
}

export function bindShortcut(
  key: string,
  button: Element | null,
  act: () => void,
  allowOnEditables = false,
): void {
  // Installation with clashing keys leaves the setting empty
  if (key === '') {
    return
  }

  if (button !== null && TYPO3.settings.visualPermissions?.keysOnButtons !== false) {
    const keys = button.ownerDocument.createElement('kbd')
    keys.textContent = spelled(key)
    button.append(keys)
  }

  Hotkeys.register(
    [Hotkeys.normalizedCtrlModifierKey, ModifierKeys.SHIFT, key],
    act,
    { allowOnEditables, bindElement: button ?? undefined },
  )
}
