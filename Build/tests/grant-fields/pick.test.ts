import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { emit } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { createDraft, type Draft } from '#src/grant-fields/draft.js'
import { initialise } from '#src/grant-fields/pick.js'
import { pickFieldsToGive } from '../platform/session-fixture.js'
import { around, drawForm, row } from './form-fixture.js'

const labels = {
  'platform.toAdd': 'to add',
  'grantFields.toTakeAway': 'to take away',
  'grantFields.grantTab': 'Grant all on this tab',
}

const fieldOf = (token: string): HTMLElement => {
  const field = document.querySelector<HTMLElement>(`[${attributes.token}='${token}']`)
  if (field === null) {
    throw new Error(`no field for ${token}`)
  }

  return field
}

describe('picking the fields a group may edit', () => {
  let listening: AbortController
  let draft: Draft

  beforeEach(() => {
    TYPO3.lang = { ...labels }
    draft = createDraft()
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  // The field is the control: you press the field itself, never a checkbox beside it
  it('marks a field to be given when it is pressed', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').querySelector('label')?.click()

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(true)
  })

  it('marks a field to be given when Enter is pressed on it', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(true)
  })

  it('offers a field that can be picked to the keyboard', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(fieldOf('tt_content:layout').getAttribute('tabindex')).toBe('0')
  })

  it('offers the fields of a table the group was just given', () => {
    initialise(draft, listening.signal)
    drawForm(row('sys_file_reference:title', 'denied').replace('class="vperm-anchor"', `class="vperm-anchor" ${attributes.outOfReach}`))

    pickFieldsToGive()

    // The fields scope takes the mark off when it has read the group again
    document.querySelector(`[${attributes.outOfReach}]`)?.removeAttribute(attributes.outOfReach)
    emit('fields-judged', {})

    expect(fieldOf('sys_file_reference:title').getAttribute('tabindex')).toBe('0')
  })

  it('marks the field the press landed in, not the field that holds its record', () => {
    initialise(draft, listening.signal)
    drawForm(around(row('sys_file_reference:title', 'denied'), 'tt_content:assets', 'denied'))

    pickFieldsToGive()

    fieldOf('sys_file_reference:title').querySelector('label')?.click()

    expect(fieldOf('sys_file_reference:title').classList.contains(classes.faceMarked)).toBe(true)
    expect(fieldOf('tt_content:assets').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('leaves a field that holds a record alone when nobody can be given it', () => {
    initialise(draft, listening.signal)
    drawForm(around(row('sys_file_reference:title', 'denied'), 'tt_content:assets', 'notApplicable'))

    pickFieldsToGive()

    fieldOf('tt_content:assets').querySelector('label')?.click()

    expect(fieldOf('tt_content:assets').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('offers no switch on a field nobody can be given', () => {
    initialise(draft, listening.signal)
    drawForm(around(row('sys_file_reference:title', 'denied'), 'tt_content:assets', 'notApplicable'))

    pickFieldsToGive()

    expect(fieldOf('tt_content:assets').hasAttribute('role')).toBe(false)
  })

  it('offers the fields once the backend has judged them', () => {
    initialise(draft, listening.signal)
    document.body.innerHTML = `
      <form name="editform">
        <fieldset class="vperm-anchor" ${attributes.token}="tt_content:layout"></fieldset>
      </form>`
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    pickFieldsToGive()

    fieldOf('tt_content:layout').setAttribute(attributes.verdict, 'denied')
    emit('fields-judged', {})

    expect(fieldOf('tt_content:layout').getAttribute('role')).toBe('switch')
  })

  // The mode is turned on from the backend page, where no form of ours stands yet
  it('offers nothing while no form has arrived at all', () => {
    initialise(draft, listening.signal)

    pickFieldsToGive()

    expect(document.querySelectorAll('[role="switch"]')).toHaveLength(0)
  })

  it('marks nothing when a key that is not a press is used', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('says a field that can be picked is a switch, and whether it is on', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const picked = fieldOf('tt_content:layout')

    expect(picked.getAttribute('role')).toBe('switch')
    expect(picked.getAttribute('aria-checked')).toBe('false')

    picked.querySelector('label')?.click()

    expect(picked.getAttribute('aria-checked')).toBe('true')
  })

  it('says the switch is on for a field the group already has, and not to be flipped here', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'), row('tt_content:layout', 'inherited'))

    pickFieldsToGive()

    const has = fieldOf('tt_content:header')

    expect(has.getAttribute('role')).toBe('switch')
    expect(has.getAttribute('aria-checked')).toBe('true')
    expect(has.getAttribute('aria-disabled')).toBe('true')
    expect(fieldOf('tt_content:layout').getAttribute('aria-disabled')).toBe('true')
  })

  it('leaves a field the group already has alone', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'), row('tt_content:layout', 'inherited'))

    pickFieldsToGive()

    fieldOf('tt_content:header').querySelector('label')?.click()
    fieldOf('tt_content:layout').querySelector('label')?.click()

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('takes the offer back on the side that shows what the group has', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    turnTo('preview')

    expect(fieldOf('tt_content:layout').hasAttribute('tabindex')).toBe(false)
  })

  // A switch that cannot be thrown is a lie about the row, whatever it says it is set to
  it('is no longer a switch on the side that shows what the group has', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    turnTo('preview')

    expect(fieldOf('tt_content:layout').hasAttribute('role')).toBe(false)
    expect(fieldOf('tt_content:layout').hasAttribute('aria-checked')).toBe(false)
    expect(fieldOf('tt_content:layout').hasAttribute('aria-disabled')).toBe(false)
  })

  // Space is what a toggle answers to, and the page must not scroll under it
  it('marks a field to be given when space is pressed on it', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const pressed = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })

    fieldOf('tt_content:layout').dispatchEvent(pressed)

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(true)
    expect(pressed.defaultPrevented).toBe(true)
  })

  it('takes the mark off again when the field is pressed a second time', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('marks a field to be taken away when it is pressed on the side that shows what they have', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').querySelector('label')?.click()

    expect(fieldOf('tt_content:header').classList.contains(classes.faceMarked)).toBe(true)
  })

  it('says a field the group has is a switch that is on, and off once it is marked', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    const theirs = fieldOf('tt_content:header')

    expect(theirs.getAttribute('role')).toBe('switch')
    expect(theirs.getAttribute('aria-checked')).toBe('true')

    theirs.querySelector('label')?.click()

    expect(theirs.getAttribute('aria-checked')).toBe('false')
  })

  // A field reached through a subgroup is that group's to take away, not this one's
  it('leaves a field the group has through a subgroup alone', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'inherited'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').querySelector('label')?.click()

    expect(fieldOf('tt_content:header').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('says on a marked field what it is waiting for', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').querySelector('label')?.click()

    // In the heading, where it is read beside the name and the mark
    expect(fieldOf('tt_content:layout').querySelector('label')?.getAttribute(attributes.waiting))
      .toBe('to add')
  })

  it('leaves the keyboard on the field it has just turned', async () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const field = fieldOf('tt_content:layout')
    // A browser drops the focus the moment the field it stands on stops being reachable
    let dropped = false
    // A set over a missing value says the field had been out of the keyboard's reach
    new MutationObserver(seen => {
      dropped ||= seen.some(change => change.oldValue === null)
    }).observe(field, { attributes: true, attributeOldValue: true, attributeFilter: ['tabindex'] })

    field.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await Promise.resolve()

    expect(dropped).toBe(false)
  })

  // The foot's own buttons answer Enter, and every other control on the form keeps its key
  it('leaves a key press that lands on no field to the control it lands on', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const elsewhere = document.createElement('button')
    document.body.append(elsewhere)

    const press = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    elsewhere.dispatchEvent(press)

    expect(press.defaultPrevented).toBe(false)
  })

  // A strike over the whole heading crosses that word too, so the name stands in a box of its
  // own and the strike goes there
  it('keeps a field name apart from the word waiting beside it', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')

    expect(fieldOf('tt_content:layout').querySelector(`.${classes.fieldName}`)?.textContent)
      .toBe('tt_content:layout')
  })

  it('says on a marked field what it is waiting for on the side that takes fields back', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').querySelector('label')?.click()

    expect(fieldOf('tt_content:header').querySelector('label')?.getAttribute(attributes.waiting))
      .toBe('to take away')
  })

  it('takes that word off again when the field is no longer waiting for anything', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const heading = fieldOf('tt_content:layout').querySelector('label')
    heading?.click()
    heading?.click()

    expect(heading?.hasAttribute(attributes.waiting)).toBe(false)
  })

  // The fields are offered again on every press and every answer from the backend
  it('gives a field name one box however often the fields are offered again', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    emit('fields-judged', {})

    const heading = fieldOf('tt_content:layout').querySelector('label')

    expect(heading?.querySelectorAll(`.${classes.fieldName}`)).toHaveLength(1)
    expect(heading?.textContent).toBe('tt_content:layout')
  })

  // Core draws containers that carry a verdict and no heading of their own
  it('gives a field with no heading back to the other side all the same', () => {
    initialise(draft, listening.signal)
    drawForm(`
      <div class="form-group">
        <fieldset class="vperm-anchor" ${attributes.token}="tt_content:layout"
          ${attributes.verdict}="denied"></fieldset>
      </div>`)

    pickFieldsToGive()
    turnTo('preview')

    expect(fieldOf('tt_content:layout').hasAttribute('tabindex')).toBe(false)
  })

  it('says nothing beside a marked field where the backend published no word', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    TYPO3.lang = {}

    pickFieldsToGive()

    fieldOf('tt_content:layout').querySelector('label')?.click()

    expect(fieldOf('tt_content:layout').querySelector('label')?.hasAttribute(attributes.waiting))
      .toBe(false)
  })

  it('marks nothing on the side that shows what the group has', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('marks nothing when the press lands on no field at all', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    document.querySelector('.tab-content')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('marks nothing while the field has not been judged', () => {
    initialise(draft, listening.signal)
    document.body.innerHTML = `
      <form name="editform">
        <div class="form-group">
          <fieldset class="vperm-anchor" inert ${attributes.token}="tt_content:layout"></fieldset>
        </div>
        <div class="form-group"><label>a row of core's own</label></div>
      </form>`
    formReady({ doc: document, fields: [] })

    pickFieldsToGive()

    document.querySelectorAll('.form-group')
      .forEach(each => { each.dispatchEvent(new MouseEvent('click', { bubbles: true })) })

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('picks nothing once the backend page has gone', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    listening.abort()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fieldOf('tt_content:layout')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(draft.has(fieldOf('tt_content:layout'))).toBe(false)
  })

  it('leaves a field whose table is out of reach alone', () => {
    initialise(draft, listening.signal)
    drawForm(row('sys_file_reference:title', 'denied').replace('class="vperm-anchor"', `class="vperm-anchor" ${attributes.outOfReach}`))

    pickFieldsToGive()

    fieldOf('sys_file_reference:title').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fieldOf('sys_file_reference:title').classList.contains(classes.faceMarked)).toBe(false)
  })

  // Nobody can be given a field everyone already has, so pressing it decides nothing
  it('leaves a field nobody can be given alone', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:editlock', 'adminOnly'))

    pickFieldsToGive()

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fieldOf('tt_content:editlock').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fieldOf('tt_content:header').classList.contains(classes.faceMarked)).toBe(false)
    expect(fieldOf('tt_content:editlock').classList.contains(classes.faceMarked)).toBe(false)
  })

  it('marks a field when the press lands on the row it stands in', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(true)
  })

  // Unfolding a record adds fields, and the form is handed over again for them
  it('marks a field once the form has been handed over again', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    formReady({ doc: document, fields: [] })

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(draft.has(fieldOf('tt_content:layout'))).toBe(true)
  })

  it('shows no field marked for another group', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    selectGroup(8)

    expect(fieldOf('tt_content:layout').getAttribute('aria-checked')).toBe('false')
  })

  it('marks every field of its own the tab holds to be given at once', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:header', 'allowed'), row('tt_content:date', 'denied'))

    pickFieldsToGive()

    document.querySelector<HTMLElement>(`.${classes.tabGive}`)?.click()

    expect([...document.querySelectorAll(`.${classes.faceMarked}`)].map(field => field.getAttribute(attributes.token)))
      .toStrictEqual(['tt_content:layout', 'tt_content:date'])
  })

  it('disables the grant button of a tab with nothing to grant', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    pickFieldsToGive()

    expect(document.querySelector<HTMLButtonElement>(`.${classes.tabGive}`)?.disabled).toBe(true)
  })

  it('offers no tab at once on the side that shows what the group has', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    turnTo('preview')

    expect(document.querySelectorAll(`.${classes.tabGive}`)).toHaveLength(0)
  })

  it('offers a tab at once only once however often the fields are offered again', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    emit('fields-judged', {})

    expect(document.querySelectorAll(`.${classes.tabGive}`)).toHaveLength(1)
  })

  // A section that opens the tab draws no edge on top; one standing below the button would
  it('offers the tab at once inside its first section, so the section still opens the tab', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(document.querySelector('.tab-pane > :first-child')?.classList.contains('form-section')).toBe(true)
  })

  it('says what taking the tab at once does', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.tabGive}`)?.textContent).toBe('Grant all on this tab')
  })

  it('keeps a field marked that was marked before the tab was taken at once', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    document.querySelector<HTMLElement>(`.${classes.tabGive}`)?.click()

    expect(fieldOf('tt_content:layout').classList.contains(classes.faceMarked)).toBe(true)
  })

  it('leaves the fields of records the tab holds to their own table', () => {
    initialise(draft, listening.signal)
    drawForm(around(row('sys_file_reference:title', 'denied', 'tt_content-1-image'), 'tt_content:image', 'allowed'))

    pickFieldsToGive()

    document.querySelector<HTMLElement>(`.${classes.tabGive}`)?.click()

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })
})
