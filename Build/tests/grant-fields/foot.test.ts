import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit, on } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise as paintBody } from '#src/platform/body.js'
import { createDraft, type Draft } from '#src/grant-fields/draft.js'
import { initialise } from '#src/grant-fields/foot.js'
import { initialise as pickFields } from '#src/grant-fields/pick.js'
import { pickFieldsToGive } from '../platform/session-fixture.js'
import { around, drawForm, row } from './form-fixture.js'
import {
  answerNextWriteWith, forget, holdNextWrite, sendNextWriteToLogin, sent,
} from '../__mocks__/typo3-ajax-request.js'

// The form is drawn before the backend has said anything about the fields on it
const unjudged = (token: string): string => `
  <div class="form-group">
    <fieldset class="vperm-anchor" ${attributes.token}="${token}">
      <label class="form-label">${token}</label>
    </fieldset>
  </div>`

const outOfReach = (markup: string): string =>
  markup.replace('class="vperm-anchor"', `class="vperm-anchor" ${attributes.outOfReach}`)

const labels = {
  'grantFields.tally.one': 'The group may edit %1$s of %2$s field',
  'grantFields.tally.many': 'The group may edit %1$s of %2$s fields',
  'grantFields.waiting.one': '%s field waiting to be added',
  'grantFields.waiting.many': '%s fields waiting to be added',
  'grantFields.going.one': '%s field waiting to be taken away',
  'grantFields.going.many': '%s fields waiting to be taken away',
  'platform.cancel': 'Cancel',
  'platform.doAdd': 'Add',
  'platform.doRemove': 'Remove',
  'platform.refused': 'The backend did not take the change. It is still waiting here.',
  'platform.loggedOut': 'Your login has run out. The change was not saved and is still waiting here.',
}

const fieldOf = (token: string): HTMLElement => {
  const field = document.querySelector<HTMLElement>(`[${attributes.token}='${token}']`)
  if (field === null) {
    throw new Error(`no field for ${token}`)
  }

  return field
}

describe('the foot under the fields a group is given', () => {
  let listening: AbortController
  let draft: Draft

  beforeEach(() => {
    vi.useFakeTimers()
    TYPO3.lang = { ...labels }
    draft = createDraft()
    forget()
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    paintBody(listening.signal)
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
    vi.useRealTimers()
  })

  it('stands under the form while the fields are being picked', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceFoot}`)).not.toBeNull()
  })

  // An area can be armed on a screen the form has not reached yet
  it('stands under nothing until a form has arrived', () => {
    initialise(draft, listening.signal)

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()
  })

  // The page layout stands in this area too, and it has no record form
  it('stands under a module that shows no form of ours', () => {
    initialise(draft, listening.signal)
    document.body.innerHTML = '<div class="module-body"><p>a module of core\'s own</p></div>'
    formReady({ doc: document, fields: [] })

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()
  })

  it('lets a press on a module with no form of ours go by without a word', () => {
    initialise(draft, listening.signal)
    document.body.innerHTML = '<div class="module-body"><p>a module of core\'s own</p></div>'
    formReady({ doc: document, fields: [] })
    const failures: string[] = []
    window.addEventListener('error', failure => { failures.push(failure.message) }, { signal: listening.signal })

    document.querySelector('p')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(failures).toStrictEqual([])
  })

  it('stands under nothing while no field of the record can be reached', () => {
    initialise(draft, listening.signal)
    drawForm(outOfReach(row('tt_content:layout', 'denied')))

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()
  })

  it('goes again once the area is put away', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    deactivate()

    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()
  })

  it('stands under nothing while another area is the one being worked in', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    activate()
    pickArea('modules')
    turnTo('pick')

    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()
  })

  // The form is drawn again on every turn
  it('stands under the form once, however often it is drawn', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    turnTo('preview')
    turnTo('pick')

    expect(document.querySelectorAll(`.${classes.faceFoot}`)).toHaveLength(1)
  })

  it('offers nothing to take away until a field is marked', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.faceFoot}`)).not.toBeNull()
    expect(document.querySelector(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('counts the fields once the backend has judged them', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(unjudged('tt_content:header'), unjudged('tt_content:bodytext'))

    activate()
    pickArea('fields')

    // A count of fields nobody has judged yet would say nothing true
    expect(document.querySelector(`.${classes.faceFoot}`)).toBeNull()

    fieldOf('tt_content:header').setAttribute(attributes.verdict, 'allowed')
    fieldOf('tt_content:bodytext').setAttribute(attributes.verdict, 'denied')
    emit('fields-judged', {})

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe('The group may edit 1 of 2 fields')
  })

  // The count says what the preview shows: the fields the group may edit, of all there are
  it('counts the fields the group may edit among all the record has', () => {
    initialise(draft, listening.signal)
    drawForm(
      row('tt_content:header', 'allowed'),
      row('tt_content:layout', 'denied'),
      row('tt_content:bodytext', 'notApplicable'),
      row('tt_content:editlock', 'adminOnly'),
    )

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe('The group may edit 2 of 4 fields')
  })

  it('counts no field whose table is out of reach', () => {
    initialise(draft, listening.signal)
    drawForm(
      row('tt_content:header', 'allowed'),
      row('tt_content:layout', 'denied'),
      outOfReach(row('sys_file_reference:title', 'allowed')),
      outOfReach(row('sys_file_reference:description', 'denied')),
    )

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe('The group may edit 1 of 2 fields')
  })

  // The record holds none of them; they are listed for the kinds of record it could hold
  it('counts no field listed for other kinds of record', () => {
    initialise(draft, listening.signal)
    drawForm(
      row('tt_content:header', 'allowed'),
      row('tt_content:layout', 'denied'),
      `<div class="${classes.otherKinds}">${row('sys_file_reference:autoplay', 'allowed')}</div>`,
    )

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe('The group may edit 1 of 2 fields')
  })

  it('counts one field in the singular', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe('The group may edit 1 of 1 field')
  })

  it('carries no word at all where the backend published none', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    TYPO3.lang = {}

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceApply}`)?.textContent).toBe('')
  })

  it('names the deed it does and the way out of it', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceApply}`)?.textContent).toBe(labels['platform.doAdd'])
    expect(document.querySelector(`.${classes.faceCancel}`)?.textContent).toBe(labels['platform.cancel'])
  })

  it('offers nothing to press while nothing is marked', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'allowed'))

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
    expect(document.querySelector(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('says nothing about waiting while no field is marked', () => {
    initialise(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('')
  })

  it('says how many marked fields are waiting to be given', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('1 field waiting to be added')
  })

  it('counts a field marked with the keyboard as well', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout')
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('1 field waiting to be added')
  })

  it('counts nothing more once the backend page has gone', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    listening.abort()

    draft.toggle(fieldOf('tt_content:layout'))
    window.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('')
  })

  it('drops the marks and turns the form back when the picking is cancelled', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceCancel}`)?.click()
    vi.advanceTimersByTime(280)

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
    expect(document.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('gives the marked fields to the group the form was picked for', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_grant_fields',
      body: { group: 7, operations: [{ field: 'tt_content:layout', grant: true }] },
    }])
  })

  it('counts every field waiting to be added', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fieldOf('tt_content:bodytext').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent)
      .toBe('2 fields waiting to be added')
  })

  // The reader has to be able to read what went wrong, and looking at it is a press
  it('keeps what it said about a turned down change until the marks change', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    const said = document.querySelector(`.${classes.faceCounted}`)?.textContent

    document.querySelector('.tab-content')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(said).toBe('The backend did not take the change. It is still waiting here.')
    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe(said)
  })

  // The form is judged again after any change the backend took, and that says nothing about
  // the change it turned down
  it('keeps what it said about a turned down change while the form is judged again', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)
    emit('fields-judged', {})

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe(labels['platform.refused'])
  })

  it('offers to take away what is marked on the side that shows what the group has', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.faceApply}`)?.textContent).toBe('Remove')
  })

  it('counts the fields waiting to be taken away', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'), row('tt_content:bodytext', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fieldOf('tt_content:bodytext').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent)
      .toBe('2 fields waiting to be taken away')
  })

  it('leaves the form standing on that side when a field is taken away', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.querySelector('form')?.classList.contains(classes.turning)).toBe(false)
    expect(document.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('leaves the form standing when taking a field back is cancelled', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceCancel}`)?.click()

    expect(document.querySelector('form')?.classList.contains(classes.turning)).toBe(false)
    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('clears the marks once the change is taken', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('takes the marked fields away from the group', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:header', 'allowed'))

    activate()
    pickArea('fields')

    fieldOf('tt_content:header').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent[0]?.body).toStrictEqual({
      group: 7,
      operations: [{ field: 'tt_content:header', grant: false }],
    })
  })

  it('gives away the marked row\'s own field and none of the record it holds', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(around(row('sys_file_reference:title', 'denied'), 'tt_content:assets', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:assets').querySelector('label')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent[0]?.body).toStrictEqual({
      group: 7,
      operations: [{ field: 'tt_content:assets', grant: true }],
    })
  })

  it('turns the form over once the fields are handed over', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(0)

    expect(document.querySelector('form')?.classList.contains(classes.turning)).toBe(true)
  })

  it('turns the form back to what the group has once the change is taken', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('keeps the marks standing and says why when the backend turns the change down', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe(labels['platform.refused'])
    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(1)
  })

  it('keeps the marks standing and says why when the login has run out', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    sendNextWriteToLogin()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.querySelector(`.${classes.faceCounted}`)?.textContent).toBe(labels['platform.loggedOut'])
    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(1)
    expect(document.body.getAttribute(attributes.face)).toBe('pick')
  })

  it('sends nothing marked for another group', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    selectGroup(8)
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent).toStrictEqual([])
    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('')
  })

  it('keeps the marks while the form is judged again for the same group', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    emit('fields-judged', {})

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('1 field waiting to be added')
  })

  it('gives the marked fields to the group picked since the form was drawn', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    selectGroup(8)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent[0]?.body).toStrictEqual({ group: 8, operations: [{ field: 'tt_content:layout', grant: true }] })
  })

  it('sends a change once however often it is pressed', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent).toHaveLength(1)
  })

  it('sends the change again once the backend has answered the first time', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(sent).toHaveLength(2)
  })

  it('leaves the next group\'s form alone when the answer comes late', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()
    const letGo = holdNextWrite()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    selectGroup(8)
    letGo()
    await vi.advanceTimersByTimeAsync(280)

    expect(document.body.getAttribute(attributes.face)).toBe('pick')
  })

  it('says that the backend took the fields once the foot has settled', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    const announcements: { marked: boolean, turning: boolean }[] = []
    on('permissions-written', () => {
      announcements.push({
        marked: draft.has(fieldOf('tt_content:layout')),
        turning: document.querySelector('form')?.classList.contains(classes.turning) ?? false,
      })
    }, listening.signal)

    pickFieldsToGive()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(announcements).toStrictEqual([{ marked: false, turning: true }])
  })

  it('says that the backend took the fields even when another group is on screen', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    pickFieldsToGive()
    const letGo = holdNextWrite()

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    selectGroup(8)
    letGo()
    await vi.advanceTimersByTimeAsync(280)

    expect(told).toBe(1)
  })

  it('says nothing about fields the backend turned down', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    pickFieldsToGive()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    await vi.advanceTimersByTimeAsync(280)

    expect(told).toBe(0)
  })

  it('says nothing about fields turned down while another group is on screen', async () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    pickFieldsToGive()
    const letGo = holdNextWrite()
    answerNextWriteWith(409)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector<HTMLElement>(`.${classes.faceApply}`)?.click()
    selectGroup(8)
    letGo()
    await vi.advanceTimersByTimeAsync(280)

    expect(told).toBe(0)
  })

  it('offers nothing to give away until a field is marked', () => {
    initialise(draft, listening.signal)
    pickFields(draft, listening.signal)
    drawForm(row('tt_content:layout', 'denied'))

    pickFieldsToGive()

    const give = document.querySelector<HTMLElement>(`.${classes.faceApply}`)

    expect(give?.hasAttribute('disabled')).toBe(true)

    fieldOf('tt_content:layout').dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(give?.hasAttribute('disabled')).toBe(false)
  })
})
