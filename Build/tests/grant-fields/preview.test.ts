import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise as paintBody } from '#src/platform/body.js'
import { initialise as fieldsPreview } from '#src/grant-fields/preview.js'
import { initialise as tablesPreview } from '#src/grant-tables/preview.js'
import { forget } from '../__mocks__/typo3-ajax-request.js'
import { backendSays, onScreen, row, drawForm, groupForm } from '../surfaces/record-form/preview-fixture.js'

describe('the fields of the form as the group sees it', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forget()
    deactivate()
    selectGroup(7)
    document.body.replaceChildren()
    listening = new AbortController()
    paintBody(listening.signal)
    tablesPreview(listening.signal)
    fieldsPreview(listening.signal)
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('takes a field the group was not given off the form', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(onScreen()).toStrictEqual(['tt_content:header'])
  })

  // Core hides such a field from everyone but an administrator, so the group never sees it
  it('takes a field only administrators get off the form as well', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:editlock', 'adminOnly'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(onScreen()).toStrictEqual(['tt_content:header'])
  })

  it('offers the other side when the table is theirs and no field is', () => {
    drawForm(row('tt_content:header', 'denied'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed' }, { tt_content: 'Page Content' })

    const note = document.querySelector(`.${classes.nothingTheirs}`)

    expect(note?.querySelector('.callout-body')?.textContent)
      .toBe('The group may edit "Page Content", but no field of this record yet')
    expect(note?.querySelector('button')?.textContent).toBe('Assign permissions')
    expect(note?.querySelector('button')?.className).toBe('btn btn-default btn-sm')
  })

  it('draws it as one of the backend\'s own notices', () => {
    drawForm(row('tt_content:header', 'denied'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)?.matches('.callout.callout-notice')).toBe(true)
  })

  it('turns the form over to the picking when that offer is pressed', () => {
    drawForm(row('tt_content:header', 'denied'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed' }, {})

    vi.useFakeTimers()
    document.querySelector<HTMLElement>(`.${classes.nothingTheirs} button`)?.click()
    vi.advanceTimersByTime(280)
    vi.useRealTimers()

    expect(document.body.getAttribute(attributes.face)).toBe('pick')
  })

  it('carries no word on the other side\'s deed either where none was published', () => {
    drawForm(row('tt_content:header', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)?.textContent).toBe('')
  })

  it('gives the whole form back on the side where the fields are given', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)
    turnTo('pick')
    groupForm(document)

    expect(onScreen()).toStrictEqual(['tt_content:header', 'tt_content:layout'])
  })
})
