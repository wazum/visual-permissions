import { classes } from '../../platform/contract.js'
import { onFormReady } from './form.js'
import { getState, subscribe } from '../../platform/session.js'
import { shellIn } from '../../platform/shell.js'

const editTrigger = 'typo3-backend-contextual-record-edit-trigger'

export function initialise(outer: Document, signal: AbortSignal): void {
  let doc: Document | null = null

  const blockSheet = (event: Event): void => {
    const asked = (event.target as Element).closest(editTrigger)
    if (!getState().active || asked === null) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    // Stryker disable next-line OptionalChaining,StringLiteral: the module document has no shell of its own, and the sheet is turned away there all the same
    shellIn(outer)?.setAttribute('endpoint', asked.getAttribute('edit-url') ?? '')
  }

  outer.addEventListener('click', blockSheet, { capture: true, signal })

  const picked = (): boolean => {
    const { active, area } = getState()

    return active && area === 'fields'
  }

  const refuse = (event: Event): void => {
    if (picked()) {
      event.preventDefault()
    }
  }

  // A press lands on a field or on the module around it, and the module is none of our
  // business: its records open, its menus work, whatever is picked here
  const blockPress = (event: Event): void => {
    if ((event.target as Element).closest(`.${classes.anchor}`) !== null) {
      refuse(event)
    }
  }

  // The controls, never the field around them: a field is pressed to pick it, and a field
  // that holds a record holds that record's fields too. Ours are not the form's to lock.
  const controls = `.${classes.anchor} :is(input,select,textarea,button,[contenteditable])`
    + `:not(.${classes.tableGate} *):not(.${classes.mark})`

  const apply = (): void => {
    const locked = picked()

    // Inert, not disabled: a disabled control is left out of the save
    doc?.querySelectorAll(controls).forEach(control => { control.toggleAttribute('inert', locked) })
  }

  onFormReady(form => {
    doc = form.doc
    doc.addEventListener('submit', refuse, { capture: true, signal })
    // A press changes a value by what the browser does with it, not by any code of ours: a
    // label hands it on to the control it names, a box ticks itself, a link opens. None of
    // that while the fields are picked; a press our own controls read is unharmed.
    doc.addEventListener('click', blockPress, { capture: true, signal })
    doc.addEventListener('click', blockSheet, { capture: true, signal })
    apply()
  }, signal)

  subscribe(apply, signal)
}
