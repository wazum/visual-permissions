import { on } from '../platform/bus.js'
import { attributes, classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { said } from '../platform/panel-card.js'
import { getState, selectGroup } from '../platform/session.js'
import type { ChainStep } from '../platform/transport.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import type { Judgement } from './judgement.js'

const judged = `.${classes.anchor}[${attributes.verdict}]`

const openAfter = 350
const closeAfter = 250

// Stryker disable next-line StringLiteral: a mark is drawn only on a field found by its verdict
const verdictOf = (field: Element): string => field.getAttribute(attributes.verdict) ?? ''

// Stryker disable next-line StringLiteral: every field of ours carries its token
const tokenOf = (field: Element): string => field.getAttribute(attributes.token) ?? ''

const headingOf = (field: Element): Element | null => field.querySelector(':scope > .form-label, :scope > fieldset > legend')

const titleOf = (verdict: string): string => labelOf(`grantFields.mark.${verdict}.title`)

// Only a field that answers a press on this side says what the press does
const hintOf = (field: Element): string => {
  if (field.getAttribute('role') !== 'switch' || field.getAttribute('aria-disabled') === 'true') {
    return ''
  }

  const marked = field.classList.contains(classes.faceMarked)
  if (getState().face === 'pick') {
    return labelOf(marked ? 'grantFields.hint.leave' : 'grantFields.hint.give')
  }

  return labelOf(marked ? 'grantFields.hint.keep' : 'grantFields.hint.take')
}

function givers(card: HTMLElement, groups: readonly ChainStep[]): HTMLElement[] {
  if (groups.length === 0) {
    return []
  }

  const doc = card.ownerDocument
  const heading = doc.createElement('h3')
  heading.textContent = labelOf('grantFields.givenBy')
  const list = doc.createElement('ul')
  list.append(...groups.map(group => {
    const name = doc.createElement('span')
    name.textContent = group.title
    const show = doc.createElement('button')
    // Stryker disable next-line StringLiteral: the card stands outside any form, so there is nothing to submit
    show.type = 'button'
    // Stryker disable next-line StringLiteral: core's look, which only a browser draws
    show.className = 'btn btn-default btn-sm'
    show.textContent = labelOf('grantFields.showGroup')
    show.setAttribute('aria-label', said(labelOf('grantFields.showGroupNamed'), group.title))
    show.addEventListener('click', () => {
      card.hidePopover()
      selectGroup(group.groupId)
    })
    const line = doc.createElement('li')
    line.append(name, show)

    return line
  }))
  const section = doc.createElement('section')
  section.append(heading, list)

  return [section]
}

function fill(card: HTMLElement, field: Element, groups: readonly ChainStep[]): void {
  const doc = card.ownerDocument
  const verdict = verdictOf(field)
  // The card shows the field's square again; CSS draws it, which only a browser does
  const square = getComputedStyle(field)
  // Stryker disable next-line StringLiteral: see above
  card.style.setProperty('--vperm-glyph', square.getPropertyValue('--vperm-glyph'))
  // Stryker disable next-line StringLiteral: see above
  card.style.setProperty('--vperm-square-edge', square.getPropertyValue('--vperm-square-edge'))

  const title = doc.createElement('h2')
  title.id = `${classes.markCard}-title`
  title.textContent = titleOf(verdict)
  const meaning = doc.createElement('p')
  meaning.textContent = labelOf(`grantFields.mark.${verdict}.meaning`)
  const words = doc.createElement('div')
  words.append(title, meaning)
  const header = doc.createElement('header')
  header.append(words)
  card.replaceChildren(header, ...givers(card, groups))

  const hint = hintOf(field)
  if (hint !== '') {
    const press = doc.createElement('footer')
    press.textContent = hint
    card.append(press)
  }
}

export function initialise(judgement: Judgement, signal: AbortSignal): void {
  let form: Document = document
  let timer = 0
  let opened = false
  let shownFor: HTMLElement | null = null
  const cards = new WeakMap<Document, HTMLElement>()

  const letGo = (card: HTMLElement): void => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => { card.hidePopover() }, closeAfter)
  }

  const cardIn = (doc: Document): HTMLElement => {
    const drawn = cards.get(doc)
    if (drawn !== undefined) {
      return drawn
    }

    const card = doc.createElement('div')
    card.className = classes.markCard
    card.id = classes.markCard
    card.toggleAttribute('popover', true)
    card.setAttribute('role', 'dialog')
    card.setAttribute('aria-labelledby', `${classes.markCard}-title`)
    card.addEventListener('mouseenter', () => { window.clearTimeout(timer) })
    card.addEventListener('mouseleave', () => { letGo(card) })
    // Told before the change, so a mark entered right after an open already finds it open
    card.addEventListener('beforetoggle', event => {
      opened = event.newState === 'open'
      if (opened) {
        return
      }

      // Stryker disable next-line OptionalChaining: a card closes only after a mark opened it
      shownFor?.setAttribute('aria-expanded', 'false')
      if (card.contains(doc.activeElement)) {
        // Stryker disable next-line OptionalChaining: a card closes only after a mark opened it
        shownFor?.focus()
      }
    })
    doc.body.append(card)
    cards.set(doc, card)

    return card
  }

  const open = (mark: HTMLElement, field: Element): void => {
    window.clearTimeout(timer)
    const card = cardIn(mark.ownerDocument)
    // Stryker disable next-line StringLiteral: anchor positioning is the browser's to do
    shownFor?.style.removeProperty('anchor-name')
    shownFor?.setAttribute('aria-expanded', 'false')
    shownFor = mark
    // Stryker disable next-line StringLiteral: anchor positioning is the browser's to do
    mark.style.setProperty('anchor-name', '--vperm-mark')
    mark.setAttribute('aria-expanded', 'true')
    fill(card, field, judgement.givenBy(tokenOf(field)))
    card.showPopover()
  }

  const drawMarks = (): void => {
    form.querySelectorAll(judged).forEach(field => {
      const heading = headingOf(field)
      if (heading === null) {
        return
      }

      const drawn = heading.querySelector(`.${classes.mark}`)
      if (drawn !== null) {
        drawn.setAttribute('aria-label', titleOf(verdictOf(field)))

        return
      }

      const mark = heading.ownerDocument.createElement('button')
      mark.type = 'button'
      mark.className = classes.mark
      mark.setAttribute('aria-label', titleOf(verdictOf(field)))
      mark.setAttribute('aria-haspopup', 'dialog')
      mark.setAttribute('aria-controls', classes.markCard)
      mark.setAttribute('aria-expanded', 'false')
      mark.addEventListener('click', event => {
        open(mark, field)
        // A key opens the card to be read and used; a pointer only to be read
        if (event.detail === 0) {
          cardIn(mark.ownerDocument).querySelector('button')?.focus()
        }
      })
      mark.addEventListener('mouseenter', () => {
        window.clearTimeout(timer)
        if (opened) {
          open(mark, field)

          return
        }

        timer = window.setTimeout(() => { open(mark, field) }, openAfter)
      })
      mark.addEventListener('mouseleave', () => { letGo(cardIn(mark.ownerDocument)) })
      heading.append(mark)
    })
  }

  onFormReady(ready => { form = ready.doc }, signal)
  on('fields-judged', drawMarks, signal)
}
