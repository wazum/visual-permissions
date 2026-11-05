import { emit, on } from '../platform/bus.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import { attributes, classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { counted, footIn, showOutcome } from '../platform/panel-card.js'
import { writeFields } from './write.js'
import { getState, subscribe, turnTo } from '../platform/session.js'
import { isWriting } from '../platform/transport.js'
import { flipForm } from '../surfaces/record-form/turn.js'
import { adminsOnly, dropped } from '../platform/vocabulary.js'
import type { Draft } from './draft.js'

// A field no grant can reach is on neither side of the count, so the record is what a grant
// could reach and the tally what it does
const countable = `[${attributes.verdict}]:not([${attributes.outOfReach}])`

const kept = [dropped, adminsOnly]
  .map(verdict => `:not([${attributes.verdict}='${verdict}'])`)
  .join('')

interface FootState {
  readonly form: Element
  readonly face: string
  readonly groupId: number
  readonly showCount: () => void
}

export function initialise(draft: Draft, signal: AbortSignal): void {
  let doc: Document | null = null
  let state: FootState | null = null

  const apply = (): void => {
    if (doc === null) {
      return
    }

    const form = doc.querySelector('form[name="editform"]')
    if (form === null) {
      return
    }

    const { active, area, face, groupId } = getState()
    const armed = active && area === 'fields'

    // The foot is the reader's until its side or its group changes: what it said stays said
    if (armed && state?.form === form && state.face === face && state.groupId === groupId) {
      state.showCount()

      return
    }

    doc.querySelectorAll(`.${classes.faceFoot}`).forEach(gone => { gone.remove() })
    state = null

    if (!armed) {
      return
    }

    // A record the group cannot reach has nothing to count and nothing to decide
    if (form.querySelector(countable) === null) {
      return
    }

    // Stryker disable next-line ConditionalExpression,BlockStatement: an area is armed only for a group; this only narrows the type for writeFields
    if (groupId === null) {
      return
    }

    state = { form, face, groupId, showCount: mountFoot(form, face === 'pick', groupId) }
  }

  // One side hands fields over, the other takes them back; every pick under this form is a
  // change asked for on that group, not just what's shown
  const mountFoot = (form: Element, adding: boolean, paintedFor: number): () => void => {
    // How many marks stood when the backend last turned the change down
    let toldAbout: number | null = null

    const foot = form.ownerDocument.createElement('div')
    foot.className = classes.faceFoot

    const markedFields = (): Element[] => [...form.querySelectorAll(`[${attributes.token}]`)]
      .filter(field => draft.has(field))

    // The side that takes fields back is the one the form settles on, so from there it is
    // read again where it stands; only the side that hands them over has somewhere to turn
    const settle = (): void => {
      if (!adding) {
        turnTo('preview')

        return
      }

      flipForm(form.ownerDocument, () => { turnTo('preview') })
    }

    const card = footIn(foot, {
      label: labelOf(adding ? 'platform.doAdd' : 'platform.doRemove'),
      cancel: () => {
        draft.drop()
        settle()
      },
      apply: () => {
        // Stryker disable next-line StringLiteral: the field was matched on that very attribute
        const marked = markedFields().map(field => ({ field: field.getAttribute(attributes.token) ?? '', grant: adding }))

        if (isWriting()) {
          return
        }

        void writeFields(paintedFor, marked).then(outcome => {
          if (getState().groupId !== paintedFor) {
            if (outcome === 'taken') {
              emit('permissions-written', {})
            }

            return
          }

          if (outcome !== 'taken') {
            showOutcome(card, outcome)
            toldAbout = marked.length

            return
          }

          draft.drop()
          settle()
          emit('permissions-written', {})
        })
      },
    })

    const showCount = (): void => {
      // The backend answers after the form is drawn, so they are counted when the count is said
      const recordFields = [...form.querySelectorAll(countable)].filter(field => field.closest(`.${classes.otherKinds}`) === null)
      const theirs = recordFields.filter(field => field.matches(kept))

      const waiting = markedFields().length

      // What went wrong stands in the count's place until the marks it was about change, so
      // reading it, or reaching for the next field, does not wipe it
      if (toldAbout === waiting) {
        return
      }

      toldAbout = null

      card.state.textContent = counted('grantFields.tally', recordFields.length, theirs.length, recordFields.length)
      card.waiting.textContent = waiting === 0
        ? ''
        : counted(`grantFields.${adding ? 'waiting' : 'going'}`, waiting, waiting)
      // The side that hands fields over is left by cancelling it; the side the form settles
      // on has nowhere to go, so there is only a mark to take back
      card.ready(waiting > 0, adding || waiting > 0)
    }

    showCount()
    form.append(foot)

    return showCount
  }

  // One listener per window, however often the form is handed over: the browser keeps a
  // listener it already has
  const showCount = (): void => { state?.showCount() }

  onFormReady(form => {
    doc = form.doc
    apply()

    // The count listens on the window, where a press arrives after the row was marked
    // Stryker disable OptionalChaining: a document on screen always stands in a window
    doc.defaultView?.addEventListener('click', showCount, { signal })
    doc.defaultView?.addEventListener('keydown', showCount, { signal })
    // Stryker restore OptionalChaining
  }, signal)

  on('fields-judged', apply, signal)

  subscribe(apply, signal)
}
