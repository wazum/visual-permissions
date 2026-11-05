import { on } from '../platform/bus.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import { attributes, classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { getState, subscribe } from '../platform/session.js'
import { dropped, givable, isReachable, picked, reachable } from '../platform/vocabulary.js'
import type { Draft } from './draft.js'

const anyOf = (verdicts: readonly string[]): string => verdicts
  .map(verdict => `[${attributes.verdict}='${verdict}']:not([${attributes.outOfReach}])`)
  .join(',')

// One side is about the fields the group could be given, the other about the ones they hold
const shownOn = (face: string): string => anyOf(face === 'pick' ? givable : reachable)

// And on each, only what that side decides answers to a press
const decides = (face: string): string => anyOf([face === 'pick' ? dropped : picked])

const judged = `.${classes.anchor}[${attributes.verdict}]`

interface FieldState {
  readonly marked: boolean
  readonly offered: boolean
  readonly on: boolean
  readonly operable: boolean
  readonly waiting: string
}

const stateOf = (field: Element, marked: boolean, face: string): FieldState => {
  // Stryker disable next-line StringLiteral: the field was found by that very attribute
  const has = isReachable(field.getAttribute(attributes.verdict) ?? '')

  return {
    marked,
    offered: field.matches(shownOn(face)),
    // The group has it after the change unless this side is about to take it away
    on: has !== marked,
    operable: field.matches(decides(face)),
    waiting: marked ? labelOf(face === 'pick' ? 'platform.toAdd' : 'grantFields.toTakeAway') : '',
  }
}

// A strike over the whole heading crosses the word beside the name as well, so the name gets
// a box of its own and the strike goes there
const wrapName = (heading: Element): void => {
  if (heading.querySelector(`.${classes.fieldName}`) !== null) {
    return
  }

  const mark = heading.querySelector(`:scope > .${classes.mark}`)
  const name = heading.ownerDocument.createElement('span')
  name.className = classes.fieldName
  name.append(...heading.childNodes)
  heading.append(name, ...mark === null ? [] : [mark])
}

// Every field is told where it stands, and nothing is taken off a field that still stands
// there: a switch that stops being one drops the keyboard that was holding it
function say(field: Element, state: FieldState): void {
  const heading = field.querySelector(':scope > .form-label, :scope > fieldset > legend')
  field.classList.toggle(classes.faceMarked, state.marked)

  if (!state.offered) {
    field.removeAttribute('role')
    field.removeAttribute('aria-checked')
    field.removeAttribute('aria-disabled')
    field.removeAttribute('tabindex')
    heading?.removeAttribute(attributes.waiting)

    return
  }

  field.setAttribute('tabindex', '0')
  field.setAttribute('role', 'switch')
  field.setAttribute('aria-checked', String(state.on))
  // What this side cannot change is still shown, and says as much
  field.setAttribute('aria-disabled', String(!state.operable))

  if (heading === null) {
    return
  }

  wrapName(heading)

  if (state.waiting === '') {
    heading.removeAttribute(attributes.waiting)

    return
  }

  // The word stands in the heading, beside the name and the mark
  heading.setAttribute(attributes.waiting, state.waiting)
}

export function initialise(draft: Draft, signal: AbortSignal): void {
  let doc: Document | null = null

  const markFields = (): void => {
    if (doc === null) {
      return
    }

    const { face } = getState()

    doc.querySelectorAll(judged).forEach(field => {
      say(field, stateOf(field, draft.has(field), face))
    })

    offerTabs(doc, face)
  }

  // A tab's fields of its own are marked at once; what records of other tables hold is theirs
  const offerTabs = (form: Document, face: string): void => {
    form.querySelectorAll('.tab-pane').forEach(pane => {
      const offered = pane.querySelector<HTMLButtonElement>(`.${classes.tabGive}`)
      if (face !== 'pick') {
        offered?.remove()

        return
      }

      const unmarked = (): Element[] => [...pane.querySelectorAll(`[${attributes.inside}='']`)]
        .filter(field => field.matches(decides(face)) && !draft.has(field))
      const button = offered ?? offerTab(form, pane, unmarked)
      button.disabled = unmarked().length === 0
    })
  }

  const offerTab = (form: Document, pane: Element, unmarked: () => Element[]): HTMLButtonElement => {
    const button = form.createElement('button')
    // Stryker disable next-line StringLiteral: a form button submits by default and would take the backend along; jsdom submits nothing, only a browser can tell
    button.type = 'button'
    button.className = `btn btn-default btn-sm ${classes.tabGive}`
    button.textContent = labelOf('grantFields.grantTab')
    button.addEventListener('click', () => {
      unmarked().forEach(field => { draft.toggle(field) })
      markFields()
    })
    // Stryker disable next-line OptionalChaining: FormEngine draws every tab as sections, so the tab has a first one
    pane.querySelector(':scope > .form-section')?.prepend(button)

    return button
  }

  onFormReady(form => {
    const seen = form.doc === doc
    doc = form.doc
    markFields()

    if (seen) {
      return
    }

    // The server draws one anchor per field, nested as the fields nest, so the innermost one
    // around the press is the field the press was meant for
    const turn = (event: Event): boolean => {
      const pressed = event.target as Element
      const field = pressed.closest(`.${classes.mark}`) === null ? pressed.closest(decides(getState().face)) : null
      if (field === null) {
        return false
      }

      draft.toggle(field)
      markFields()

      return true
    }

    form.doc.addEventListener('click', event => { turn(event) }, { signal })
    form.doc.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return
      }

      // The page must not scroll under the space that pressed a field, and a key that presses
      // anything else on the form is that control's own
      if (turn(event)) {
        event.preventDefault()
      }
    }, { signal })
  }, signal)

  on('fields-judged', markFields, signal)
  subscribe(markFields, signal)
}
