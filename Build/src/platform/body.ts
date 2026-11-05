import { attributes } from './contract.js'
import { getState, subscribe } from './session.js'

export function initialise(signal: AbortSignal): void {
  const paint = (): void => {
    mark(document.body)
    // Stryker disable next-line OptionalChaining: the backend frame is same-origin, so it always has a document
    const inner = document.querySelector<HTMLIFrameElement>('#typo3-contentIframe')?.contentDocument?.body ?? null
    if (inner !== null) {
      mark(inner)
    }
  }

  // The module may have landed before this ran; its event is then already past
  paint()
  subscribe(paint, signal)
}

function mark(body: HTMLElement): void {
  const state = getState()

  body.toggleAttribute(attributes.still, TYPO3.settings.visualPermissions?.animation === false)
  body.toggleAttribute(attributes.active, state.active)

  if (!state.active) {
    body.removeAttribute(attributes.picked)
    body.removeAttribute(attributes.face)

    return
  }

  body.setAttribute(attributes.picked, state.area)
  body.setAttribute(attributes.face, state.face)
}
