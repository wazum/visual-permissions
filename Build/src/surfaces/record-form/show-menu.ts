import Client from '@typo3/backend/storage/client.js'
import { backToOlderLanguageMenu, besideOlderLanguageMenu } from './compatibility/language-menu.js'
import { on } from '../../platform/bus.js'
import { onFormReady } from './form.js'
import { attributes, classes } from '../../platform/contract.js'
import { labelOf } from '../../platform/labels.js'
import { getState, subscribe } from '../../platform/session.js'

const toolbar = '.module-docheader-buttons .btn-toolbar'

// What a reader last asked for, kept as core keeps what a backend user reads
// Stryker disable StringLiteral: only this file writes and reads these keys, so any two names work the same
const note = 'vperm.show'
const identifyNote = 'vperm.identify'
// Stryker restore StringLiteral

const remember = (key: string, word: string, holds: boolean): void => {
  if (holds) {
    Client.set(key, word)

    return
  }

  Client.unset(key)
}

// Core reads this status to draw the tick, and readers read the tick
const mark = (item: Element, doing: boolean): void => {
  item.setAttribute('aria-selected', String(doing))

  if (!doing) {
    item.removeAttribute('data-dropdowntoggle-status')

    return
  }

  item.setAttribute('data-dropdowntoggle-status', 'active')
}

export function initialise(signal: AbortSignal): void {
  let doc: Document | null = null

  const ours = (inner: Document): boolean => {
    const { active, area } = getState()

    // A record the group cannot reach reads the same either way
    return active && area === 'fields' && inner.querySelector(`[${attributes.token}]:not([${attributes.outOfReach}])`) !== null
  }

  const apply = (): void => {
    if (doc === null) {
      return
    }

    const inner = doc

    inner.querySelectorAll(`.${classes.showMenu}`).forEach(gone => { gone.remove() })

    if (!ours(inner)) {
      inner.body.removeAttribute(attributes.show)
      backToOlderLanguageMenu(inner)

      return
    }

    readAs(inner, Client.get(note) === 'list')
    nameFields(inner, Client.get(identifyNote) === 'said')

    const menu = inner.createElement('div')
    menu.className = `btn-group ${classes.showMenu}`

    const named = inner.createElement('button')
    // Stryker disable next-line StringLiteral: a button submits by default; jsdom submits nothing, so only a browser can tell
    named.type = 'button'
    named.className = 'btn btn-sm btn-default dropdown-toggle'
    named.setAttribute('data-bs-toggle', 'dropdown')
    named.setAttribute('aria-expanded', 'false')
    named.append(iconIn(inner, 'actions-filter'), ` ${labelOf('recordForm.show')}`)

    const list = inner.createElement('ul')
    list.className = 'dropdown-menu'

    list.append(
      // The names and the marks are what a permission is read from; the controls say nothing
      itemIn(inner, labelOf('recordForm.show.listOnly'), 'actions-list', () => inner.body.hasAttribute(attributes.show), on => {
        remember(note, 'list', on)
        readAs(inner, on)
      }),
      // A permission is written for tt_content:header, and the form says only "Header"
      itemIn(inner, labelOf('recordForm.show.identifiers'), 'actions-tag', () => inner.body.hasAttribute(attributes.identify), on => {
        remember(identifyNote, 'said', on)
        nameFields(inner, on)
      }),
    )

    menu.append(named, list)

    inner.querySelector(toolbar)?.append(menu)
    besideOlderLanguageMenu(inner, menu)
  }

  onFormReady(form => {
    doc = form.doc
    apply()
  }, signal)

  // The backend judges the fields after the form is drawn, and what there is to show with it
  on('fields-judged', apply, signal)
  subscribe(apply, signal)
}

function nameFields(inner: Document, said: boolean): void {
  inner.querySelectorAll(`.${classes.fieldToken}`).forEach(gone => { gone.remove() })
  inner.body.toggleAttribute(attributes.identify, said)

  if (!said) {
    return
  }

  inner.querySelectorAll(`.${classes.anchor}[${attributes.token}]`).forEach(field => {
    const heading = field.querySelector(':scope > .form-label, :scope > fieldset > legend')
    if (heading === null) {
      return
    }

    const token = inner.createElement('small')
    token.className = classes.fieldToken
    token.textContent = field.getAttribute(attributes.token)
    heading.after(token)
  })
}

function iconIn(inner: Document, identifier: string): HTMLElement {
  const icon = inner.createElement('typo3-backend-icon')
  icon.setAttribute('identifier', identifier)
  icon.setAttribute('size', 'small')

  return icon
}

function readAs(inner: Document, asList: boolean): void {
  if (!asList) {
    inner.body.removeAttribute(attributes.show)

    return
  }

  inner.body.setAttribute(attributes.show, 'list')
}

function itemIn(
  inner: Document,
  word: string,
  identifier: string,
  reading: () => boolean,
  asked: (on: boolean) => void,
): HTMLElement {
  const item = inner.createElement('button')
  // Stryker disable next-line StringLiteral: a button submits by default; jsdom submits nothing, so only a browser can tell
  item.type = 'button'
  item.className = 'dropdown-item dropdown-item-spaced'

  const tick = inner.createElement('span')
  tick.className = 'dropdown-item-status'
  item.append(tick, iconIn(inner, identifier), ` ${word}`)

  item.addEventListener('click', () => {
    asked(!reading())
    mark(item, reading())
  })

  mark(item, reading())

  const holder = inner.createElement('li')
  holder.append(item)

  return holder
}
