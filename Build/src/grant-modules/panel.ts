import { emit } from '../platform/bus.js'
import { attributes, classes } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import {
  button,
  counted,
  createFace,
  createFlash,
  crossing,
  disableOnGroupChange,
  escapeLeavesPicking,
  footIn,
  said,
  say,
  showOutcome,
  type Face,
} from '../platform/panel-card.js'
import { labelOf } from '../platform/labels.js'
import { writeModules } from './write.js'
import { getState } from '../platform/session.js'
import { isWriting } from '../platform/transport.js'
import type { Verdict } from '../platform/vocabulary.js'
import { dropped, isReachable, isOwn, picked } from '../platform/vocabulary.js'

const moduleIdentifier = 'data-modulemenu-identifier'
const rows = `[${moduleIdentifier}]:not([aria-controls])`
const groupContainer = '.modulemenu-group-container'

// Which face is up must not change during a repaint; it outlives the repaint.
let picking = false

const was = new WeakMap<Element, Verdict>()

// Repaint builds new faces; the keyboard follows the newest ones only.
let listening: AbortController | null = null

const flash = createFlash(560)

export function render(doc: Document, menu: Element): void {
  // Every pick on this panel is a change asked for on that group, not just what's shown
  const paintedFor = getState().groupId
  const group = titleOf(doc, paintedFor) ?? ''
  const known = [...menu.querySelectorAll(rows)]
  const reachable = known.filter(row => isReachable(verdictOf(row)))
  const grantedByGroup = known.filter(row => verdictOf(row) === picked)

  const preview = face(doc, classes.facePreview, labelOf('platform.preview'), said(labelOf('grantModules.previewFor'), group))
  const pick = face(doc, classes.facePick, labelOf('platform.pick'), said(labelOf('grantModules.pickFor'), group))

  const spinning = doc.querySelector(`.${classes.coin}`)
  const coin = spinning ?? doc.createElement('div')
  coin.className = classes.coin
  coin.replaceChildren(preview.sheet, pick.sheet)

  const taken = doc.querySelector(`.${classes.granted}`)
  const stage = taken ?? doc.createElement('div')
  stage.className = classes.granted

  if (coin.parentElement !== stage) {
    stage.replaceChildren(coin)
  }

  const card = cardAround(doc, menu)

  // Putting a side back where it is stops a turn halfway; check parent element
  if (stage.parentElement !== card) {
    card.append(stage)
  }

  menu.toggleAttribute('inert', true)

  window.requestAnimationFrame(() => { card.classList.add(classes.panelCardTurned) })

  const turnTo = (pickSide: boolean): void => {
    picking = pickSide
    coin.classList.toggle(classes.coinTurned, pickSide)
    // The side turned away is not there for the reader: no keyboard, no pointer, no card.
    preview.sheet.toggleAttribute('inert', pickSide)
    pick.sheet.toggleAttribute('inert', !pickSide)
  }

  // The module carries changes and no others
  const write = (operations: { module: string, grant: boolean }[]): void => {
    const asked = operations.filter(operation => operation.grant).map(operation => operation.module)

    // Stryker disable next-line ConditionalExpression,BlockStatement: the panel is painted only for a group, and writeModules needs the number
    if (paintedFor === null) {
      return
    }

    // Picks affect a group the reader is not looking at; ensure groupId matches paintedFor
    if (getState().groupId !== paintedFor) {
      return
    }

    if (isWriting()) {
      return
    }

    // What was asked for flashes whenever the panel is drawn again, and it is drawn again as
    // soon as the backend has taken it
    asked.forEach(module => { flash.add(module) })

    // The backend asks for the password in front of the face the change was asked for on
    void writeModules(paintedFor, operations)
      .then(outcome => {
        if (outcome !== 'taken') {
          asked.forEach(module => { flash.delete(module) })
          showOutcome(picking ? additions : removals, outcome)

          return
        }

        turnTo(false)
        emit('permissions-written', {})
      })
  }

  const removals = footIn(preview.foot, {
    label: labelOf('platform.doRemove'),
    cancel: () => {
      marked(preview.scroll).forEach(row => { row.classList.remove(classes.faceMarked) })
      showCount()
    },
    apply: () => {
      write(marked(preview.scroll).map(row => ({ module: nameOf(row), grant: false })))
    },
  })

  const leavePicking = (): void => {
    fillPick(pick.scroll, menu, showCount)
    showCount()
    turnTo(false)
  }

  const additions = footIn(pick.foot, {
    label: labelOf('platform.doAdd'),
    cancel: leavePicking,
    apply: () => {
      const changed = ownIn(pick.scroll).filter(row => verdictOf(row) !== was.get(row))

      // Only a module the group has not got can be picked here; every change is a grant
      write(changed.map(row => ({ module: nameOf(row), grant: true })))
    },
  })

  const showCount = (): void => {
    const own = ownIn(pick.scroll)
    const queued = own.filter(row => verdictOf(row) !== was.get(row))
    const granted = own.filter(row => isReachable(verdictOf(row)) && !queued.includes(row))
    const has = counted('grantModules.tally', own.length, granted.length, own.length)

    const toRemove = marked(preview.scroll)
    removals.state.textContent = toRemove.length === 0
      ? has
      : counted('grantModules.marked', grantedByGroup.length, toRemove.length, grantedByGroup.length)
    removals.ready(toRemove.length > 0, toRemove.length > 0)

    additions.state.textContent = has
    additions.waiting.textContent = queued.length === 0 ? '' : said(labelOf('platform.waiting'), queued.length)
    additions.ready(queued.length > 0, true)
  }

  preview.bar.append(
    button(doc, labelOf('grantModules.add'), 'btn btn-default', () => { turnTo(true) }),
    say(doc, classes.faceHint, labelOf('grantModules.hint')),
  )

  pick.scroll.style.setProperty('--vperm-queued-note', `"${labelOf('platform.toAdd')}"`)

  fillPreview(doc, preview.scroll, reachable, labelOf('platform.from'), showCount)
  fillPick(pick.scroll, menu, showCount)
  showCount()
  turnTo(picking)
  flash.start(() => {
    coin.querySelectorAll(`.${classes.facePreview} ${rows}`)
      .forEach(row => { row.classList.toggle(classes.justAdded, flash.isLit(nameOf(row))) })
  })

  listening?.abort()
  listening = new AbortController()
  // One of area or picking is always being worked in; the other stays
  escapeLeavesPicking(doc, listening.signal, () => picking, leavePicking)

  disableOnGroupChange(paintedFor, [removals, additions], listening.signal)
}

export function restoreMenu(doc: Document, menu: Element): void {
  listening?.abort()
  listening = null
  // Area must be unarmed to start picking; state transition rule
  picking = false
  flash.stop()

  const card = doc.querySelector(`.${classes.panelCard}`)
  menu.removeAttribute('inert')

  if (card === null) {
    return
  }

  const stage = card.querySelector(`.${classes.granted}`)
  if (stage === null) {
    return
  }

  // Stryker disable next-line OptionalChaining: the coin is built into the stage above
  stage.querySelector(`.${classes.coin}`)?.classList.remove(classes.coinTurned)

  // Wait a frame; the backend rewrites the menu on this state change
  window.requestAnimationFrame(() => {
    card.classList.remove(classes.panelCardTurned)
    window.setTimeout(() => {
      // Menu is inert if armed while waiting; leave it alone
      if (menu.hasAttribute('inert')) {
        return
      }

      stage.remove()
      card.replaceWith(menu)
    }, crossing)
  })
}

function cardAround(doc: Document, menu: Element): Element {
  const existing = menu.parentElement

  // Stryker disable next-line OptionalChaining: the menu is on the page when the panel is painted
  if (existing?.classList.contains(classes.panelCard) === true) {
    return existing
  }

  const card = doc.createElement('div')
  card.className = classes.panelCard
  menu.replaceWith(card)
  card.append(menu)

  return card
}

function face(doc: Document, kind: string, eyebrow: string, sentence: string): Face {
  const built = createFace(doc, kind)
  built.eyebrow.textContent = eyebrow
  built.sentence.textContent = sentence
  // Numbers hang off the backend's menu class; each version fills it in
  built.scroll.classList.add('modulemenu')

  return built
}

function fillPreview(
  doc: Document,
  into: HTMLElement,
  reachable: Element[],
  from: string,
  marked: () => void,
): void {
  let heading: string | null = null

  into.replaceChildren()

  reachable.forEach(row => {
    const parent = row.closest(groupContainer)?.previousElementSibling?.getAttribute('title') ?? ''
    if (parent !== heading && parent !== '') {
      heading = parent
      into.append(say(doc, classes.grantedGroup, parent))
    }

    const clone = plain(row)

    // Only this group's grants can be revoked here; the rest tracks origin
    if (clone.getAttribute(attributes.verdict) === picked) {
      answersTo(clone, () => {
        clone.classList.toggle(classes.faceMarked)
        marked()
      })
    } else {
      clone.append(say(doc, classes.grantedFrom, from))
    }

    into.append(clone)
  })
}

function fillPick(into: HTMLElement, menu: Element, marked: () => void): void {
  into.replaceChildren(...[...menu.children].map(child => child.cloneNode(true)))

  into.querySelectorAll(groupContainer).forEach(container => { container.classList.add('show') })

  into.querySelectorAll(rows).forEach(row => {
    strip(row)
    was.set(row, verdictOf(row))

    // This face cannot pick what the group already had taken away on the preview
    if (isReachable(verdictOf(row))) {
      row.setAttribute('aria-disabled', 'true')
    }

    // A row opens nothing here, and only what this group decides answers at all.
    answersTo(row, () => {
      ask(row)
      marked()
    })
  })

  into.querySelectorAll('[aria-controls]').forEach(control => {
    control.replaceWith(say(control.ownerDocument, classes.grantedGroup, control.getAttribute('title') ?? ''))
  })
}

function deedFor(row: Element): '' | 'grant' | 'unpick' {
  const now = verdictOf(row)

  if (row.getAttribute('aria-disabled') === 'true' || !isOwn(now)) {
    return ''
  }

  return isReachable(now) ? 'unpick' : 'grant'
}

function ask(row: Element): void {
  const deed = deedFor(row)
  if (deed !== '') {
    row.setAttribute(attributes.verdict, deed === 'grant' ? picked : dropped)
  }
}

function strip(row: Element): void {
  row.removeAttribute('href')
  row.removeAttribute('aria-current')
  row.classList.remove('modulemenu-action-active')
}

function plain(row: Element): Element {
  const clone = row.cloneNode(true) as Element
  strip(clone)

  return clone
}

function answersTo(row: Element, act: () => void): void {
  row.setAttribute('tabindex', '0')
  row.setAttribute('role', 'button')
  row.addEventListener('click', event => {
    event.preventDefault()
    act()
  })
  row.addEventListener('keydown', event => {
    if (!(event instanceof KeyboardEvent) || (event.key !== 'Enter' && event.key !== ' ')) {
      return
    }

    event.preventDefault()
    act()
  })
}

function marked(where: HTMLElement): Element[] {
  return [...where.querySelectorAll(`.${classes.faceMarked}`)]
}

// What this group decides itself can be picked or dropped here; inherited grants belong to the subgroup that gave them
function ownIn(where: HTMLElement): Element[] {
  return [...where.querySelectorAll(rows)].filter(row => isOwn(verdictOf(row)))
}

const verdictOf = (row: Element): Verdict => (row.getAttribute(attributes.verdict) ?? '') as Verdict

// Stryker disable next-line StringLiteral: the row was matched on that very attribute
const nameOf = (row: Element): string => row.getAttribute(moduleIdentifier) ?? ''
