import ModuleMenu from '@typo3/backend/module-menu.js'
import Viewport from '@typo3/backend/viewport.js'
import { withOlderNames } from '../../platform/compatibility/module-names.js'
import { settled } from '../../platform/persistence.js'
import { getState, subscribe } from '../../platform/session.js'

const lists = withOlderNames(['records'])

// The server leaves out what changes a record while the mode is on, and it decides that when
// it draws the list, from the setting it holds
export function initialise(doc: Document, signal: AbortSignal): void {
  let shown = getState().active

  // Asked once the setting has arrived: a record opened meanwhile is not thrown out again
  const listShown = (): boolean => {
    // Stryker disable next-line OptionalChaining: the backend frame is same-origin, so it always has a document
    const formShown = doc.querySelector<HTMLIFrameElement>('#typo3-contentIframe')?.contentDocument
      ?.querySelector('form[name="editform"]') != null

    // Stryker disable next-line StringLiteral: no spelling of the stand-in is one of ours
    return !formShown && lists.includes(ModuleMenu.App.getCurrentModule() ?? '')
  }

  subscribe(({ active }) => {
    if (active !== shown) {
      void settled().then(() => {
        if (listShown()) {
          Viewport.ContentContainer.refresh()
        }
      })
    }

    shown = active
  }, signal)
}
