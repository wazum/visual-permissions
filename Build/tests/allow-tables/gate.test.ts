import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit, on } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise } from '#src/allow-tables/gate.js'
import { pickFieldsToGive } from '../platform/session-fixture.js'
import { initialise as lockForm } from '#src/surfaces/record-form/lock.js'
import {
  answerNextWriteWith, asked, cancelNextPassword, forget, holdNextRead, holdNextWrite, refuseNextRead, reply, replyTo, sent,
} from '../__mocks__/typo3-ajax-request.js'

const labels = {
  'allowTables.inherited': 'Reached through a subgroup, not by this group itself. Change it on that group.',
  'platform.refused': 'The change could not be saved. It is still waiting here.',
  'be_groups.tables_modify.permissions.none': 'No Access',
  'be_groups.tables_modify.permissions.select': 'Read',
  'be_groups.tables_modify.permissions.modify': 'Read & Write',
}

// The server says which field holds which, so the gate needs no box of core's to find them
const annotatedRecordOf = (token: string): void => {
  document.body.innerHTML = `
    <form name="editform">
      <div class="form-group">
        <fieldset class="vperm-anchor" ${attributes.token}="tt_content:assets"
          ${attributes.field}="tt_content-82-assets" ${attributes.inside}="">
          <div class="form-group">
            <fieldset class="vperm-anchor" ${attributes.token}="${token}"
              ${attributes.field}="sys_file_reference-7-title"
              ${attributes.inside}="tt_content-82-assets"></fieldset>
          </div>
        </fieldset>
      </div>
    </form>`

  TYPO3.lang = { ...labels }
}

const recordOf = (token: string): void => {
  document.body.innerHTML = `
    <form name="editform">
      <div class="form-group">
      <fieldset class="vperm-anchor" ${attributes.token}="tt_content:assets"
        ${attributes.field}="tt_content-82-assets" ${attributes.inside}="">
      <fieldset>
      <legend class="form-legend">Media elements</legend>
      <div class="form-irre-object">
        <div class="panel-heading">
          <div class="panel-heading-row">
            <button class="panel-button"><span class="caret"></span><div class="panel-title"><span>The video</span></div></button>
            <div class="panel-actions"><button>Delete</button></div>
          </div>
        </div>
        <div class="panel-collapse">
          <div class="form-group">
            <fieldset class="vperm-anchor" ${attributes.token}="${token}"
              ${attributes.field}="sys_file_reference-7-title"
              ${attributes.inside}="tt_content-82-assets"></fieldset>
          </div>
        </div>
      </div>
      </fieldset>
      </fieldset>
      </div>
    </form>`

  TYPO3.lang = { ...labels }
}

// The server marks a field of the record the form is for as held by nothing
const formOf = (token: string): void => {
  document.body.innerHTML = `
    <form name="editform">
      <div class="typo3-TCEforms">
        <div><ul class="nav nav-tabs"><li class="nav-item"><button data-typo3-tab="#one">General</button></li></ul></div>
        <div class="tab-content">
          <div class="tab-pane active" id="one">
            <div class="form-group">
              <fieldset class="vperm-anchor" ${attributes.token}="${token}"
                ${attributes.field}="tt_content-82-header" ${attributes.inside}=""></fieldset>
            </div>
          </div>
        </div>
      </div>
    </form>`

  TYPO3.lang = { ...labels }
}

const anotherRecordOf = (token: string): void => {
  const field = document.createElement('div')

  field.className = 'form-group'
  field.innerHTML = `
    <fieldset class="vperm-anchor" ${attributes.token}="tt_content:media"
      ${attributes.field}="tt_content-82-media" ${attributes.inside}="">
      <div class="form-irre-object">
        <div class="panel-heading"><div class="panel-heading-row"><button class="panel-button">The poster</button></div></div>
        <div class="panel-collapse">
          <div class="form-group">
            <fieldset class="vperm-anchor" ${attributes.token}="${token}"
              ${attributes.field}="sys_file_reference-9-title"
              ${attributes.inside}="tt_content-82-media"></fieldset>
          </div>
        </div>
      </div>
    </fieldset>`
  document.querySelector('form')?.append(field)
}

const levels = (): [string, string | null][] =>
  [...document.querySelectorAll(`.${classes.tableLevels} [role="radio"]`)]
    .map(level => [level.textContent, level.getAttribute('aria-checked')])

const level = (name: string): HTMLButtonElement | undefined =>
  [...document.querySelectorAll<HTMLButtonElement>(`.${classes.tableLevels} [role="radio"]`)]
    .find(option => option.textContent === name)

const chosen = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.tableLevels} [aria-checked="true"]`)].map(option => option.textContent)

const gates = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.tableGate} .callout-body`)].map(said => said.textContent)

describe('the gate a record stands behind while its table is not allowed', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    forget()
    listening = new AbortController()
    document.body.replaceChildren()
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'denied' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('leaves it to the switch to say where the group stands', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })
    expect(gates()).toStrictEqual([''])
  })

  it('leaves an answer for a group it has moved on from', async () => {
    const answering = (verdict: string): unknown => ({
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: { targets: { sys_file_reference: verdict }, named: {} },
      },
    })
    replyTo('group=7', answering('denied'))
    replyTo('group=8', answering('allowed'))
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    activate()
    pickArea('fields')
    const releaseFirst = holdNextRead()
    turnTo('pick')
    formReady({ doc: document, fields: [] })
    selectGroup(8)
    await vi.waitFor(() => { expect(chosen()).toStrictEqual(['Read & Write']) })

    releaseFirst()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(chosen()).toStrictEqual(['Read & Write'])
  })

  it('leaves an answer that comes after the form has turned to what the group gets', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    activate()
    pickArea('fields')
    const release = holdNextRead()
    turnTo('pick')
    formReady({ doc: document, fields: [] })
    turnTo('preview')

    release()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(gates()).toStrictEqual([])
  })

  it('stands over the whole form for the table the record itself belongs to', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: { targets: { tt_content: 'denied' }, named: { tt_content: 'Page Content' } },
      },
    })
    formOf('tt_content:header')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableName}`)?.textContent).toBe('Page Content')
    })

    // Above the tabs: what it says holds however the form is folded into them
    expect(document.querySelector('.typo3-TCEforms')?.firstElementChild?.className)
      .toContain(classes.tableGate)
  })

  it('says nothing on a record whose table the backend left out', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_metadata: 'denied' },
          named: { sys_file_metadata: 'File Metadata' },
        },
      },
    })
    recordOf('sys_file_reference:title')
    anotherRecordOf('sys_file_metadata:alternative')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect([...document.querySelectorAll(`.${classes.tableName}`)].map(one => one.textContent))
        .toStrictEqual(['File Metadata'])
    })
  })

  it('names the table it stands over and says which one that is', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableName}`)?.textContent).toBe('File Reference')
    })

    expect(document.querySelector(`.${classes.tableToken}`)?.textContent).toBe('sys_file_reference')
  })

  it('chooses reading and writing for a table the group may write', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'allowed' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toStrictEqual([['No Access', 'false'], ['Read', 'false'], ['Read & Write', 'true']])
    })
  })

  it('chooses reading for a table the group may only read', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesModify: { targets: { sys_file_reference: 'denied' }, named: { sys_file_reference: 'File Reference' } },
        tablesSelect: { targets: { sys_file_reference: 'allowed' } },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toStrictEqual([['No Access', 'false'], ['Read', 'true'], ['Read & Write', 'false']])
    })
  })

  it('says of each table on the form where it stands', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'allowed', sys_file_metadata: 'denied' },
          named: { sys_file_reference: 'File Reference', sys_file_metadata: 'File Metadata' },
        },
      },
    })
    recordOf('sys_file_reference:title')
    anotherRecordOf('sys_file_metadata:alternative')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(chosen()).toStrictEqual(['Read & Write', 'No Access'])
    })
  })

  // The controls of a field are put out of the way while the fields are picked, and the
  // offer stands among them
  it('stands where it can still be pressed while the form is locked', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    lockForm(document, listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableLevels}`)).not.toBeNull()
    })

    expect(document.querySelector(`.${classes.tableLevels}`)?.closest('[inert]')).toBeNull()
  })

  it('finds the records from what the server said, not from a box of core\'s', async () => {
    annotatedRecordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(chosen()).toStrictEqual(['No Access'])
    })
  })

  it('stands at the top of the field whose records it is about', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableGate}`)).not.toBeNull()
    })

    const gate = document.querySelector(`.${classes.tableGate}`)

    // Under the field's own heading and right above the records, so it is read as being
    // about them and not about the form it stands on
    expect(gate?.nextElementSibling?.classList.contains('form-irre-object')).toBe(true)
    expect(gate?.closest(`[${attributes.field}]`)?.getAttribute(attributes.field))
      .toBe('tt_content-82-assets')
  })

  // The backend already has a quiet notice, and this is one
  it('draws it as one of the backend\'s own notices', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableGate}`)?.className)
        .toBe(`callout callout-notice callout-sm ${classes.tableGate}`)
    })

  })

  it('offers the levels core names, the one the group has chosen', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toStrictEqual([['No Access', 'true'], ['Read', 'false'], ['Read & Write', 'false']])
    })
  })

  // The form is looked at again on every change, and the record gains nothing each time
  it('offers it once however often the form is read again', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    const fields = [...document.querySelectorAll(`[${attributes.token}]`)]

    formReady({ doc: document, fields })

    await vi.waitFor(() => {
      expect(document.querySelectorAll(`.${classes.tableLevels}`)).toHaveLength(1)
    })

    formReady({ doc: document, fields })

    await vi.waitFor(() => {
      expect(document.querySelectorAll(`.${classes.tableGate}`)).toHaveLength(1)
    })

    expect(document.querySelectorAll(`.${classes.tableLevels}`)).toHaveLength(1)
  })

  // There is nothing else on this form to decide alongside it
  it('writes the level that is pressed', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })

    sent.length = 0
    level('Read')?.click()

    await vi.waitFor(() => {
      expect(sent.at(-1)?.body)
        .toStrictEqual({ group: 7, operations: [{ table: 'sys_file_reference', select: true, modify: false }] })
    })
  })

  it('names the switch after its table for whoever cannot see it', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`[role="radiogroup"].${classes.tableLevels}`)?.getAttribute('aria-label'))
        .toBe('File Reference')
    })
  })

  it('takes reading and writing away when no access is pressed', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: { sys_file_reference: 'allowed' } },
        tablesModify: { targets: { sys_file_reference: 'allowed' }, named: { sys_file_reference: 'File Reference' } },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => { expect(levels()).toHaveLength(3) })
    sent.length = 0

    level('No Access')?.click()

    await vi.waitFor(() => {
      expect(sent.at(-1)?.body)
        .toStrictEqual({ group: 7, operations: [{ table: 'sys_file_reference', select: false, modify: false }] })
    })
  })

  it('writes once while the first press is still unanswered', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })

    sent.length = 0
    const letGo = holdNextWrite()
    level('Read')?.click()
    level('Read & Write')?.click()
    letGo()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent).toHaveLength(1)
  })

  it('writes again once the backend turned the first press down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })

    sent.length = 0
    answerNextWriteWith(409)
    level('Read')?.click()
    await vi.waitFor(() => {
      expect(level('Read')?.disabled).toBe(false)
    })
    level('Read')?.click()

    await vi.waitFor(() => { expect(sent).toHaveLength(2) })
  })

  it('says that the backend took the level', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })

    level('Read')?.click()

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('says nothing about a level the backend turned down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })
    sent.length = 0
    answerNextWriteWith(409)

    level('Read')?.click()

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(settled => { setTimeout(settled, 50) })
    expect(told).toBe(0)
  })

  it('says on the band that the backend turned the level down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })
    answerNextWriteWith(409)

    level('Read')?.click()

    await vi.waitFor(() => {
      expect(gates()).toStrictEqual([labels['platform.refused']])
    })
  })

  it('keeps its word when the password prompt is cancelled', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(levels()).toHaveLength(3)
    })
    sent.length = 0
    cancelNextPassword()

    level('Read')?.click()

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(settled => { setTimeout(settled, 0) })
    expect(gates()).toStrictEqual([''])
    expect(chosen()).toStrictEqual(['No Access'])
  })

  // Whatever wrote it, the table it stands over may be the group's own by now
  it('chooses the level the group has once something else wrote it', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })

    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'allowed' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(levels()).toStrictEqual([['No Access', 'false'], ['Read', 'false'], ['Read & Write', 'true']])
    })
  })

  it('takes its word back when the form turns to what the group gets', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })

    asked.length = 0
    turnTo('preview')

    expect(gates()).toStrictEqual([])
    expect(asked, 'the backend was asked about a screen this has nothing to say about')
      .toStrictEqual([])
  })

  it('takes its word back when the permissions are hidden', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })

    asked.length = 0
    deactivate()

    expect(gates()).toStrictEqual([])
    expect(asked, 'the backend was asked about a screen this has nothing to say about')
      .toStrictEqual([])
  })

  // The record form stands under every area, and only one of them is about its fields
  it('takes its word back when the work moves to another area', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })

    asked.length = 0
    pickArea('modules')

    expect(gates()).toStrictEqual([])
    expect(asked, 'the backend was asked about a screen this has nothing to say about')
      .toStrictEqual([])
  })

  it('asks the backend about the tables the records on screen belong to', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(asked[0]).toContain('tables%5B0%5D=sys_file_reference')
    })
  })

  it('says nothing when the permissions cannot be read', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })

    refuseNextRead()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates()).toStrictEqual([])
    })
  })

  // Core fetches a closed record's fields only when it is opened, and until then nothing on
  // it says which table it is
  it('says nothing on a record whose fields have not been fetched yet', async () => {
    recordOf('sys_file_reference:title')

    const closed = document.querySelector('.form-irre-object')?.cloneNode(true) as Element

    closed.querySelector('.panel-collapse')?.replaceChildren()
    document.querySelector('form')?.append(closed)

    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual([''])
    })
  })

  it('carries no word at all where the backend published none', async () => {
    recordOf('sys_file_reference:title')
    TYPO3.lang = {}
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableGate}`)).not.toBeNull()
    })

    // What the table is called comes from the group's permissions, not from the words
    expect(gates()).toStrictEqual([''])
    expect(levels().map(([word]) => word)).toStrictEqual(['', '', ''])
  })

  it('stands an inherited level as the floor, with the reason on every level below it', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: { sys_file_reference: 'inherited' } },
        tablesModify: {
          targets: { sys_file_reference: 'inherited' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(levels()).toStrictEqual([['No Access', 'false'], ['Read', 'false'], ['↳ Read & Write', 'true']])
    })
    expect([...document.querySelectorAll<HTMLButtonElement>(`.${classes.tableLevels} [role="radio"]`)]
      .map(option => [option.disabled, option.title]))
      .toStrictEqual([[true, labels['allowTables.inherited']], [true, labels['allowTables.inherited']], [false, '']])
  })

  it('keeps the levels below the floor out of reach once the backend turned a press down', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: { sys_file_reference: 'inherited' } },
        tablesModify: { targets: { sys_file_reference: 'denied' }, named: { sys_file_reference: 'File Reference' } },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => { expect(levels()).toHaveLength(3) })
    sent.length = 0
    answerNextWriteWith(409)

    level('Read & Write')?.click()
    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(level('No Access')?.disabled).toBe(true)
    expect(level('↳ Read')?.disabled).toBe(false)
  })

  it('stands a level the group also gives itself on the floor its subgroup lays', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesSelect: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'allowedAndInherited' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(chosen()).toStrictEqual(['↳ Read & Write'])
    })
    expect(level('Read')?.disabled).toBe(true)
  })
})
