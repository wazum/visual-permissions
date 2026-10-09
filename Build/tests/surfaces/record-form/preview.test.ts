import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise as fieldsPreview } from '#src/grant-fields/preview.js'
import { initialise as tablesPreview } from '#src/grant-tables/preview.js'
import { forget } from '../../__mocks__/typo3-ajax-request.js'
import {
  backendSays, childRecord, fieldHolding, onScreen, row, drawForm, groupForm, formWithTwoTabs,
} from './preview-fixture.js'

describe('the record form as the group sees it', () => {
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

  // A palette keeps its headline and its box, and both would stand over nothing
  it('takes a section every field of which is gone off the form too', () => {
    drawForm(row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.form-section')?.hasAttribute('hidden')).toBe(true)
  })

  it('leaves the fields of a flexform standing inside the field that holds them', () => {
    drawForm(`
      <div class="form-group">
        <fieldset class="vperm-anchor" ${attributes.token}="tt_content:pi_flexform" ${attributes.verdict}="notApplicable" ${attributes.inside}="">
          <label class="form-label">Plugin Options</label>
          <div class="tab-content">
            <div class="tab-pane" id="sheet">
              <div class="form-section"><input type="text" name="settings.limit"></div>
            </div>
          </div>
        </fieldset>
      </div>`)

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('[name="settings.limit"]')?.closest('[hidden]')).toBeNull()
  })

  it('takes the tab of a pane with nothing left in it off the form as well', () => {
    drawForm(row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.nav-item')?.hasAttribute('hidden')).toBe(true)
  })

  it('opens a tab that still stands when the one on screen is taken away', () => {
    formWithTwoTabs(row('tt_content:layout', 'denied'), row('tt_content:assets', 'allowed'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.tab-pane.active')?.id).toBe('media')
  })

  // The reader was looking at that tab, and it still holds something of theirs
  it('leaves the tab on screen open when it still stands', () => {
    formWithTwoTabs(row('tt_content:layout', 'allowed'), row('tt_content:assets', 'allowed'))
    document.querySelector<HTMLElement>('[data-typo3-tab="#media"]')?.click()

    activate()
    pickArea('fields')
    groupForm(document)

    // The one on the far left stands too, and is not opened over it
    expect(document.querySelector('.tab-pane.active')?.id).toBe('media')
  })

  it('opens no other tab when none of them stands', () => {
    formWithTwoTabs(row('tt_content:layout', 'denied'), row('tt_content:assets', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.nav-link.active')?.textContent).toBe('General')
  })

  // A form of one sheet has panes and no tabs at all
  it('takes an emptied pane that no tab stands for off the form', () => {
    drawForm(row('tt_content:layout', 'denied'))
    document.querySelector('.nav-tabs')?.remove()

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.tab-pane')?.hasAttribute('hidden')).toBe(true)
  })

  // The server says what holds each field it draws; core's class for a record is not that word
  it('names the record\'s own table from what the server said, not from core\'s markup', () => {
    document.body.innerHTML = `
      <form name="editform"><div class="typo3-TCEforms">
        <div class="tab-content">
          <div class="tab-pane" id="general">
            <fieldset class="form-section">
              <div class="panel">
                <fieldset class="vperm-anchor" ${attributes.token}="sys_file_reference:title"
                  ${attributes.verdict}="notApplicable" ${attributes.inside}="tt_content-82-assets"></fieldset>
              </div>
              <div class="form-group">
                <fieldset class="vperm-anchor" ${attributes.token}="tt_content:header"
                  ${attributes.verdict}="notApplicable" ${attributes.inside}=""></fieldset>
              </div>
            </fieldset>
          </div>
        </div>
      </div></form>`
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'denied', sys_file_reference: 'denied' },
      { tt_content: 'Page Content', sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.nothingTheirs} .${classes.tableName}`)?.textContent).toBe('Page Content')
  })

  // Core can draw a record inside the first field of the form, ahead of every field of its own
  it('names the record\'s own table, not that of a record drawn before it', () => {
    drawForm(fieldHolding('tt_content:assets', 'notApplicable', childRecord(
      'The video',
      row('sys_file_reference:title', 'notApplicable'),
    )))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(
      document,
      { tt_content: 'denied', sys_file_reference: 'denied' },
      { tt_content: 'Page Content', sys_file_reference: 'File Reference' },
    )

    expect(document.querySelector(`.${classes.nothingTheirs} .${classes.tableName}`)?.textContent).toBe('Page Content')
  })

  // Core puts rows on a form that hold no field of their own, an inline record's room among them
  it('leaves no room standing that holds no field of theirs', () => {
    drawForm(
      row('tt_content:header', 'denied'),
      '<div class="form-group"><span>Media elements</span><button>Add media file</button></div>',
    )
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector('.form-section')?.hasAttribute('hidden')).toBe(true)
    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent)
      .toBe('The group may not edit records of this kind')
  })

  it('says why a record without tabs is empty', () => {
    document.body.innerHTML = `
      <form name="editform">
        <div class="typo3-TCEforms">
          <fieldset class="form-section">${row('sys_file_reference:title', 'allowed')}</fieldset>
        </div>
      </form>`
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { sys_file_reference: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs} .callout-body`)?.textContent)
      .toBe('The group may not edit records of this kind')
  })

  it('says nothing of the kind while a field of theirs is still standing', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'denied'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document)

    expect(document.querySelector(`.${classes.nothingTheirs}`)).toBe(null)
  })

  it('takes its own word back with the rest when the form is given back', () => {
    drawForm(row('tt_content:header', 'notApplicable'))
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })
    pickArea('modules')
    groupForm(document, { tt_content: 'denied' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)).toBe(null)
    expect(onScreen()).toStrictEqual(['tt_content:header'])
  })

  it('gives the whole form back when the permissions are hidden', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)
    deactivate()
    groupForm(document)

    expect(onScreen()).toStrictEqual(['tt_content:header', 'tt_content:layout'])
  })

  it('hides nothing for the tables once that part has gone with its page', () => {
    const gone = new AbortController()
    tablesPreview(gone.signal)
    gone.abort()
    drawForm(row('tt_content:header', 'notApplicable'))

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'denied' })

    expect(onScreen()).toStrictEqual(['tt_content:header'])
  })

  it('says nothing about an empty record once the part that would explain it has gone', () => {
    const gone = new AbortController()
    fieldsPreview(gone.signal)
    gone.abort()
    drawForm(`<div class="form-group">
      <fieldset class="vperm-anchor" ${attributes.token}="tt_content:header" ${attributes.inside}=""></fieldset>
    </div>`)
    backendSays()

    activate()
    pickArea('fields')
    groupForm(document, { tt_content: 'allowed' })

    expect(document.querySelector(`.${classes.nothingTheirs}`)).toBeNull()
  })

  it('gives the whole form back when the work moves to another area', () => {
    drawForm(row('tt_content:header', 'notApplicable'), row('tt_content:layout', 'denied'))

    activate()
    pickArea('fields')
    groupForm(document)
    pickArea('modules')
    groupForm(document)

    expect(onScreen()).toStrictEqual(['tt_content:header', 'tt_content:layout'])
  })
})
