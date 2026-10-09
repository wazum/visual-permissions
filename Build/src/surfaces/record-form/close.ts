import { getState } from '../../platform/session.js'

interface FormEngine {
  preventExitIfNotSaved: (callback: (leave: boolean) => void) => void
}

interface ModuleWindow {
  readonly TYPO3: { readonly FormEngine?: FormEngine }
}

// Records are not saved while the mode is on, so there is nothing to lose by leaving
export function initialise(doc: Document, signal: AbortSignal): void {
  const hold = (): void => {
    // Stryker disable next-line OptionalChaining: a module only loads into the backend's own frame, so the frame is there
    const moduleWindow = doc.querySelector<HTMLIFrameElement>('#typo3-contentIframe')?.contentWindow as unknown as ModuleWindow
    const engine = moduleWindow.TYPO3.FormEngine
    if (engine === undefined) {
      return
    }

    const ask = engine.preventExitIfNotSaved.bind(engine)

    engine.preventExitIfNotSaved = callback => {
      if (getState().active) {
        callback(true)

        return
      }

      ask(callback)
    }
  }

  // Held while the event is still captured: the session hears of the module afterwards, and
  // what follows may lead away from the form before the form is reported anywhere
  doc.addEventListener('typo3-module-loaded', hold, { capture: true, signal })
}
