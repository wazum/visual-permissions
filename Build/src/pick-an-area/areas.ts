import { getState, subscribe } from '../platform/session.js'

const menu = '#modulemenu'
const shut = `${menu} .modulemenu-group-container.collapse:not(.show)`
const controls = `${menu} [aria-controls]`
const folded = 'typo3-backend-content-navigation[navigation-collapsed]'
const collapsed = 'navigation-collapsed'

export function initialise(doc: Document, signal: AbortSignal): void {
  let undo: (() => void)[] = []

  const apply = (): void => {
    undo.forEach(step => { step() })
    undo = []

    const { active, area } = getState()

    // Folded areas lose their badge; keep it on screen always
    if (active) {
      keepTreeOpen(doc, undo)
    }

    // Area outlives mode going off; both must be true for this to pass.
    if (active && area === 'modules') {
      keepPanelOpen(doc, undo)
    }
  }

  // A drop moves or copies a record, and records are not saved while the mode is on. Caught
  // before the tree hears of it, or the tree offers its drop zones for a drag that never started.
  doc.addEventListener('dragstart', event => {
    if (getState().active) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, { capture: true, signal })

  apply()
  subscribe(apply, signal)
}

function keepPanelOpen(doc: Document, undo: (() => void)[]): void {
  doc.querySelectorAll(shut).forEach(group => {
    group.classList.add('show')
    control(doc, group)?.setAttribute('aria-expanded', 'true')
    undo.push(() => {
      group.classList.remove('show')
      control(doc, group)?.setAttribute('aria-expanded', 'false')
    })
  })

  // Shutting a group hides what is being granted; a disabled button cannot take focus
  doc.querySelectorAll(controls).forEach(row => {
    row.setAttribute('aria-disabled', 'true')
    undo.push(() => { row.removeAttribute('aria-disabled') })
  })
}

function keepTreeOpen(doc: Document, undo: (() => void)[]): void {
  doc.querySelectorAll(folded).forEach(navigation => {
    navigation.toggleAttribute(collapsed, false)
    undo.push(() => { navigation.toggleAttribute(collapsed, true) })
  })
}

function control(doc: Document, group: Element): Element | null {
  return doc.querySelector(`[aria-controls="${group.id}"]`)
}
