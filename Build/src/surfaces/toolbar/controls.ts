import { attributes, classes } from '../../platform/contract.js'
import { lineUpWithPanel } from '../../platform/panel-line.js'
import { getState, hideControls, showControls, subscribe } from '../../platform/session.js'

export function initialise(doc: Document, signal: AbortSignal): void {
  const host = doc.querySelector('.topbar-site-container')
  const controls = doc.querySelector<HTMLElement>(`[${attributes.controls}]`)
  if (host === null || controls === null) {
    return
  }

  controls.classList.add(classes.viewAsControls)
  controls.hidden = false
  host.append(controls)

  lineUpWithPanel(doc, controls, signal)

  const button = doc.querySelector(`[${attributes.toolbar}]`)

  const stand = (): void => {
    controls.classList.toggle(classes.controlsOpen, getState().open)
    button?.setAttribute('aria-pressed', String(getState().open))
  }

  stand()
  subscribe(stand, signal)

  button?.addEventListener('click', () => {
    if (getState().open) {
      hideControls()
    } else {
      showControls()
    }

    stand()
  }, { signal })

  signal.addEventListener('abort', () => { controls.remove() })
}
