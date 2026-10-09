import { on } from '../../platform/bus.js'
import { attributes, classes } from '../../platform/contract.js'
import { withOlderLanguageMenu } from './compatibility/language-menu.js'
import { onFormReady } from './form.js'
import { titleOf } from '../../platform/group-catalogue.js'
import { labelOf } from '../../platform/labels.js'
import { button, escapeLeavesPicking, said, say } from '../../platform/panel-card.js'
import { getState, subscribe, turnTo } from '../../platform/session.js'
import { flipForm } from './turn.js'

const column = '.module-docheader-navigation > .module-docheader-column-breadcrumb'
const buttons = '.module-docheader-buttons .btn-toolbar > *'

const closeButton = '.t3js-editform-close'

// Core's own controls come off the row while the form is ours; the ones we put there stay
const ourOwn = withOlderLanguageMenu(`.${classes.headButton}, .${classes.showMenu}`)

const heading = 'form[name="editform"] h1'

export function initialise(outer: Document, signal: AbortSignal): void {
  let doc: Document | null = null

  // The page layout stands in this area too, and it has no field to say anything about
  const ours = (inner: Document): boolean => {
    const { active, area } = getState()

    return active && area === 'fields' && inner.querySelector(`[${attributes.token}]`) !== null
  }

  const apply = (): void => {
    if (doc === null) {
      return
    }

    const inner = doc
    const taken = ours(inner)

    inner.querySelectorAll(`.${classes.headBar}, .${classes.headButton}`)
      .forEach(gone => { gone.remove() })

    const out = inner.querySelector(closeButton)
    // The record is closed from the side that shows it; the other side is left through its foot
    const kept = getState().face === 'preview' ? out : null

    inner.querySelectorAll(buttons).forEach(control => {
      control.toggleAttribute('hidden', taken && !control.matches(ourOwn) && !control.contains(kept))
    })

    // The form's own heading says the record twice over, once the header is ours
    inner.querySelectorAll(heading).forEach(said => { said.toggleAttribute('hidden', taken) })

    if (!taken) {
      return
    }

    const reachable = inner.querySelector(`[${attributes.token}][${attributes.inside}='']:not([${attributes.outOfReach}])`) !== null

    // A record without a field to give has no other side
    if (!reachable && getState().face === 'pick') {
      flipForm(inner, () => { turnTo('preview') })

      return
    }

    const showing = getState().face === 'preview'
    const bar = inner.createElement('div')
    bar.className = classes.headBar
    bar.append(
      say(inner, classes.faceEyebrow, labelOf(showing ? 'platform.preview' : 'platform.pick')),
      say(inner, classes.faceSentence, said(
        labelOf(showing ? 'recordForm.previewFor' : 'recordForm.pickFor'),
        titleOf(outer, getState().groupId) ?? '',
      )),
    )

    inner.querySelector(column)?.append(bar)

    // The picking decides in its foot
    if (!showing || !reachable) {
      return
    }

    const way = button(
      inner,
      labelOf('recordForm.add'),
      `btn btn-default btn-sm ${classes.headButton}`,
      () => { flipForm(inner, () => { turnTo('pick') }) },
      'actions-check-square',
    )

    const beside = [...inner.querySelectorAll(buttons)].find(control => control.contains(out))
    beside?.after(way)
  }

  onFormReady(form => {
    const seen = form.doc === doc
    doc = form.doc
    apply()

    if (seen) {
      return
    }

    escapeLeavesPicking(
      form.doc,
      signal,
      () => getState().face === 'pick',
      () => { flipForm(form.doc, () => { turnTo('preview') }) },
    )
  }, signal)

  // The backend judges the fields after the form is drawn, and the way in depends on that
  on('fields-judged', apply, signal)
  subscribe(apply, signal)
}
