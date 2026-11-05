import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit, on } from '#src/platform/bus.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { initialise as fieldsPreview } from '#src/grant-fields/preview.js'
import { initialise as gate } from '#src/grant-tables/gate.js'
import { initialise as tablesPreview } from '#src/grant-tables/preview.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'
import {
  backendSays, childRecord, fieldHolding, onScreen, recordsOnScreen, row, drawForm, groupForm,
} from '../surfaces/record-form/preview-fixture.js'

describe('the tables of the form as the group sees it', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forget()
    deactivate()
    selectGroup(7)
    document.body.replaceChildren()
    listening = new AbortController()
    tablesPreview(listening.signal)
    fieldsPreview(listening.signal)
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  // A field everyone gets is still out of reach while the table it belongs to is
  it('takes every field of a table the group may not write off the form', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'allowed'))

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    expect(onScreen()).toStrictEqual([])
  })

  // Core hands a group no child of a table it may not write, so the record is not on their form
  it('takes a child record of such a table away whole', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed', sys_file_reference: 'denied' })

    expect(recordsOnScreen()).toStrictEqual([])
  })

  it('draws no field of such a table on the side where the fields are given', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('sys_file_reference:title', 'allowed'))

    activate()
    pickArea('fields')
    turnTo('pick')
    groupForm(document, { tt_content: 'allowed', sys_file_reference: 'denied' })

    expect(onScreen()).toStrictEqual(['tt_content:header'])
  })

  // Which field holds a record is the server's word, not a matter of how core nests boxes
  it('says it on the field the server named, whatever core drew the record in', () => {
    document.body.innerHTML = `
      <form name="editform">
        <div class="tab-content">
          <div class="tab-pane" id="general">
            <fieldset class="form-section">
              <div class="form-group">
                <fieldset class="vperm-anchor" ${attributes.token}="tt_content:assets"
                  ${attributes.field}="tt_content-82-assets" ${attributes.verdict}="notApplicable"
                  ${attributes.inside}=""></fieldset>
              </div>
              <div class="panel">
                <fieldset class="vperm-anchor" ${attributes.token}="sys_file_reference:title"
                  ${attributes.verdict}="allowed" ${attributes.inside}="tt_content-82-assets"></fieldset>
              </div>
            </fieldset>
          </div>
        </div>
      </form>`
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied' },
      { sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.tableNote}`)?.textContent)
      .toBe('This is empty for the group: it may not edit "File Reference"')
  })

  it('says why a child record is missing from the form the group gets', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied' },
      { sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.tableNote}`)?.textContent)
      .toBe('This is empty for the group: it may not edit "File Reference"')
    // The backend already has a quiet notice, and this is one
    expect(document.querySelector(`.${classes.tableNote}`)?.className)
      .toBe(`callout callout-notice callout-sm ${classes.tableNote}`)
  })

  it('offers no table where a child record is missing', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied' },
      { sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.tableNote}`)).not.toBe(null)
    expect(document.querySelector(`.${classes.tableNote} button`)).toBe(null)
  })

  // That side keeps the record, and says it on the record itself
  it('says no such word on the side where the fields are given away', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))
    backendSays()

    activate()
    pickArea('fields')
    turnTo('pick')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied' },
      { sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.tableNote}`)).toBe(null)
  })

  it('says it once for a field, however many records it held', () => {
    drawForm(fieldHolding(
      'tt_content:assets',
      'notApplicable',
      childRecord('The video', row('sys_file_reference:title', 'allowed'))
        + childRecord('The poster', row('sys_file_reference:description', 'allowed')),
    ))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied' },
      { sys_file_reference: 'File Reference' },
    )

    expect([...document.querySelectorAll(`.${classes.tableNote}`)].map(note => note.textContent))
      .toStrictEqual(['This is empty for the group: it may not edit "File Reference"'])
  })

  it('says it once for each table, naming that table', () => {
    drawForm(
      fieldHolding('tt_content:assets', 'notApplicable', childRecord(
        'The video',
        row('sys_file_reference:title', 'allowed'),
      )),
      fieldHolding('tt_content:media', 'notApplicable', childRecord(
        'The caption',
        row('sys_file_metadata:alternative', 'allowed'),
      )),
    )
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'allowed', sys_file_reference: 'denied', sys_file_metadata: 'denied' },
      { sys_file_reference: 'File Reference', sys_file_metadata: 'File Metadata' },
    )

    expect([...document.querySelectorAll(`.${classes.tableNote}`)].map(note => note.textContent))
      .toStrictEqual([
        'This is empty for the group: it may not edit "File Reference"',
        'This is empty for the group: it may not edit "File Metadata"',
      ])
  })

  // The table has still to be decided, and the record's own row is where that is said
  it('leaves such a child record standing where the fields are given, holding no field', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))

    activate()
    pickArea('fields')
    turnTo('pick')
    groupForm(document, { tt_content: 'allowed', sys_file_reference: 'denied' })

    expect(recordsOnScreen()).toStrictEqual(['The video'])
    expect(onScreen()).toStrictEqual(['tt_content:assets'])
  })

  // A heading standing over nothing reads as a section whose fields went missing
  it('takes a section emptied by such a table off the side where the fields are given', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'allowed'),
    )))

    activate()
    pickArea('fields')
    turnTo('pick')
    groupForm(document, { tt_content: 'allowed', sys_file_reference: 'denied' })

    expect(document.querySelector('.form-irre-object .form-section')?.hasAttribute('hidden')).toBe(true)
  })

  it('says no such word on the side where the fields are given', () => {
    drawForm(row('sys_file_reference:title', 'allowed'))
    backendSays()

    activate()
    pickArea('fields')
    turnTo('pick')
    groupForm(document, { sys_file_reference: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)).toBe(null)
  })

  it('offers the table when the table is what the group has not got', () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' }, { tt_content: 'Page Content' })

    const note = document.querySelector(`.${classes.nothingTheirs}`)

    expect(note?.querySelector(`.${classes.tableGive}`)?.textContent).toBe('Grant "Page Content"')
  })

  it('says so in the band the side that gives tables away draws', () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)?.classList.contains(classes.tableGate)).toBe(true)
  })

  it('grants the table when the offer is pressed', async () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    document.querySelector<HTMLElement>(`.${classes.nothingTheirs} .${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(sent.at(-1)?.body).toStrictEqual({ group: 7, operations: [{ table: 'tt_content', grant: true }] })
    })
  })

  it('says that the backend took the table', async () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    document.querySelector<HTMLElement>(`.${classes.nothingTheirs} .${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('keeps its word while the taken table is read back', async () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    document.querySelector<HTMLElement>(`.${classes.nothingTheirs} .${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
    await new Promise(settled => { setTimeout(settled, 0) })
    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent)
      .toBe('The group may not edit records of this kind')
  })

  // A table only administrators may write cannot be granted to anyone, so there is no deed
  it('offers nothing for a table nobody can be given', () => {
    drawForm(row('be_groups:title', 'allowed'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { be_groups: 'adminOnly' }, { be_groups: 'Backend usergroup' })

    const note = document.querySelector(`.${classes.nothingTheirs}`)

    expect(note?.querySelector('.callout-body')?.textContent)
      .toBe('Only administrators may edit records of this kind')
    expect(note?.querySelector('button')).toBeNull()
  })

  it('says why the form is empty when none of it is theirs', () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent)
      .toBe('The group may not edit records of this kind')
  })

  it('keeps saying why the form is empty when the gate looks again', () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()
    gate(listening.signal)
    formReady({ doc: document, fields: [] })

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })
    emit('permissions-written', {})

    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent)
      .toBe('The group may not edit records of this kind')
  })

  it('carries no word at all where the backend published none', () => {
    drawForm(row('tt_content:header', 'notApplicable'))

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent).toBe('')
  })
})
