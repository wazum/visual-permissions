import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { emit } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/show-menu.js'

const close = '<a class="btn t3js-editform-close" href="#">Close</a>'

const labels = {
  'recordForm.show': 'Show',
  'recordForm.show.listOnly': 'List only',
  'recordForm.show.identifiers': 'Identifiers',
}

const backendSays = (): void => {
  TYPO3.lang = { ...labels }
}

const drawForm = (): void => {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="module-docheader module-docheader-buttons">
      <div class="module-docheader-column module-docheader-column-grow">
        <div class="btn-toolbar">${close}</div>
      </div>
    </div>
    <form name="editform">
      <fieldset class="vperm-anchor" data-vperm-token="tt_content:header">
        <label class="form-label">Header</label>
      </fieldset>
    </form>`)

  formReady({ doc: document, fields: [] })
}

const menuItem = (label: string): HTMLElement | undefined =>
  [...document.querySelectorAll<HTMLElement>(`.${classes.showMenu} .dropdown-item`)]
    .find(item => item.textContent.trim() === label)

describe('the menu that says how much of a form is shown', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
    backendSays()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('stands in the row of buttons while the fields are picked', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')

    const menu = document.querySelector(`.btn-toolbar > .${classes.showMenu}`)

    expect(menu?.querySelector('.dropdown-toggle')?.textContent.trim()).toBe('Show')
    expect(menu?.querySelector('typo3-backend-icon')?.getAttribute('identifier')).toBe('actions-filter')
  })

  it('offers nothing to show while no field of the record can be reached', () => {
    initialise(listening.signal)
    drawForm()
    document.querySelector('.vperm-anchor')?.setAttribute(attributes.outOfReach, '')

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })

  // The backend judges the fields after the form is drawn, and that is when it is known
  it('closes the menu down once the backend has judged the fields', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    document.querySelector('.vperm-anchor')?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })

  // Core writes an icon beside each of its own items, between the tick and the word
  it('names each entry with an icon of its own', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')

    expect(menuItem('List only')?.querySelector('typo3-backend-icon')?.getAttribute('identifier'))
      .toBe('actions-list')
    expect(menuItem('Identifiers')?.querySelector('typo3-backend-icon')?.getAttribute('identifier'))
      .toBe('actions-tag')
    expect([...document.querySelectorAll(`.${classes.showMenu} typo3-backend-icon`)].map(icon => icon.getAttribute('size')))
      .toStrictEqual(['small', 'small', 'small'])
  })

  // A permission is written for tt_content:header, and the form says only "Header"
  it('says under a field name what that field is called in TCA', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('Identifiers')?.click()

    expect(document.querySelector(`.${classes.fieldToken}`)?.textContent).toBe('tt_content:header')
  })

  // The names and the marks are what a permission is read from; the controls say nothing
  it('leaves the fields their names alone when the list is chosen', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()

    expect(document.body.getAttribute(attributes.show)).toBe('list')
  })

  it('gives the record back as core draws it when the list is switched off', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()
    menuItem('List only')?.click()

    expect(document.body.hasAttribute(attributes.show)).toBe(false)
  })

  // Core marks the item it is doing, and the menu is core's own
  it('says in the menu whether the list is on', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()

    expect(menuItem('List only')?.getAttribute('aria-selected')).toBe('true')

    menuItem('List only')?.click()

    expect(menuItem('List only')?.getAttribute('aria-selected')).toBe('false')
  })

  // The tick beside an item is core's to draw, from the status it reads and the room it leaves
  it('marks that item the way core marks its own', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()

    expect(menuItem('List only')?.getAttribute('data-dropdowntoggle-status')).toBe('active')
    expect(menuItem('List only')?.querySelector('.dropdown-item-status')).not.toBeNull()

    menuItem('List only')?.click()

    expect(menuItem('List only')?.hasAttribute('data-dropdowntoggle-status')).toBe(false)
  })

  it('gives the record back whole when permissions are hidden', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()
    deactivate()

    expect(document.body.hasAttribute(attributes.show)).toBe(false)
  })

  // How much a reader wants to see is about the reader, not about the record they opened
  it('draws the next record the way the last one was read', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()

    document.body.replaceChildren()
    document.body.removeAttribute(attributes.show)
    backendSays()
    drawForm()

    expect(document.body.getAttribute(attributes.show)).toBe('list')
  })

  it('draws the next record as a form once the list was switched off again', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('List only')?.click()
    menuItem('List only')?.click()

    document.body.replaceChildren()
    backendSays()
    drawForm()

    expect(document.body.hasAttribute(attributes.show)).toBe(false)
  })

  it('stands nowhere while another area is picked', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('modules')

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })

  it('stands nowhere on a page that holds no field to judge', () => {
    initialise(listening.signal)
    drawForm()
    document.querySelector('.vperm-anchor')?.remove()

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })

  it('takes the names away again, and says so in the menu', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('Identifiers')?.click()

    expect(menuItem('Identifiers')?.getAttribute('aria-selected')).toBe('true')

    menuItem('Identifiers')?.click()

    expect(document.querySelector(`.${classes.fieldToken}`)).toBeNull()
    expect(menuItem('Identifiers')?.getAttribute('aria-selected')).toBe('false')
  })

  it('opens the way core opens its own dropdowns', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')

    const toggle = document.querySelector(`.${classes.showMenu} .dropdown-toggle`)

    expect(toggle?.getAttribute('data-bs-toggle')).toBe('dropdown')
    expect(toggle?.getAttribute('aria-expanded')).toBe('false')
    expect(toggle?.nextElementSibling?.className).toBe('dropdown-menu')
  })

  it('writes no word the backend did not give', () => {
    TYPO3.lang = {}
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')

    expect([...document.querySelectorAll(`.${classes.showMenu} button`)].map(control => control.textContent.trim()))
      .toStrictEqual(['', '', ''])
  })

  it('names only the fields that show a name of their own', () => {
    initialise(listening.signal)
    drawForm()
    document.querySelector('form')?.insertAdjacentHTML(
      'beforeend',
      '<div class="vperm-anchor" data-vperm-token="tt_content:hidden"></div>',
    )

    activate()
    pickArea('fields')
    menuItem('Identifiers')?.click()

    expect([...document.querySelectorAll(`.${classes.fieldToken}`)].map(token => token.textContent))
      .toStrictEqual(['tt_content:header'])
  })

  it('names the fields on the next record as well', () => {
    initialise(listening.signal)
    drawForm()

    activate()
    pickArea('fields')
    menuItem('Identifiers')?.click()

    document.body.replaceChildren()
    backendSays()
    drawForm()

    expect(document.querySelector(`.${classes.fieldToken}`)?.textContent).toBe('tt_content:header')
  })

  it('stands nowhere on a form with no row of buttons', () => {
    initialise(listening.signal)
    drawForm()
    document.querySelector('.module-docheader')?.remove()

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })

  it('waits for a form before it stands anywhere', () => {
    initialise(listening.signal)

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.showMenu}`)).toBeNull()
  })
})
