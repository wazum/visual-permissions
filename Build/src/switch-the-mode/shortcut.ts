import { attributes } from '../platform/contract.js'
import { bindShortcut } from '../platform/shortcuts.js'
import { activate, deactivate, getState } from '../platform/session.js'

export function initialise(doc: Document): void {
  bindShortcut(TYPO3.settings.visualPermissions?.toggleKey ?? '', doc.querySelector(`[${attributes.toggle}]`), () => {
    if (getState().active) {
      deactivate()

      return
    }

    activate()
  }, true)
}
