import { attributes } from '../platform/contract.js'
import { activate, deactivate, getState, subscribe, type SessionState } from '../platform/session.js'

export function initialise(doc: Document, signal: AbortSignal): void {
  const toggle = doc.querySelector<HTMLButtonElement>(`[${attributes.toggle}]`)
  if (toggle === null) {
    return
  }

  const show = (state: SessionState): void => {
    toggle.setAttribute('aria-pressed', String(state.active))
    toggle.disabled = state.groupId === null
  }

  show(getState())

  toggle.addEventListener('click', () => {
    if (getState().active) {
      deactivate()

      return
    }

    activate()
  }, { signal })

  subscribe(show, signal)
}
