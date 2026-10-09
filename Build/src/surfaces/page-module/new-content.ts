import { labelOf } from '../../platform/labels.js'
import { getState, subscribe } from '../../platform/session.js'

// The wizard only opens the form of a new record, and that form saves nothing while the mode is on
export function initialise(doc: Document, signal: AbortSignal): void {
  let undo: (() => void)[] = []

  const apply = (): void => {
    undo.forEach(step => { step() })
    undo = []

    if (!getState().active) {
      return
    }

    const module = doc.querySelector<HTMLIFrameElement>('#typo3-contentIframe')?.contentDocument

    // Core draws the icon, then the words, in both cores
    module?.querySelectorAll('typo3-backend-new-content-element-wizard-button').forEach(button => {
      const words = button.lastChild as Text
      const said = words.textContent
      words.textContent = labelOf('readOnly.previewNewContent')
      undo.push(() => { words.textContent = said })
    })
  }

  apply()
  subscribe(apply, signal)
}
