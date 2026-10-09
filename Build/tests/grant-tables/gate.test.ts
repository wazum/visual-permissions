import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit, on } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise } from '#src/grant-tables/gate.js'
import { pickFieldsToGive } from '../platform/session-fixture.js'
import { initialise as lockForm } from '#src/surfaces/record-form/lock.js'
import {
  answerNextWriteWith, asked, cancelNextPassword, forget, holdNextRead, holdNextWrite, refuseNextRead, reply, replyTo, sent,
} from '../__mocks__/typo3-ajax-request.js'

const labels = {
  'grantTables.missing': 'The group may not edit records of this kind',
  'grantTables.give': 'Grant "%s"',
  'grantTables.take': 'Revoke "%s"',
  'grantTables.theirs': 'The group may edit records of this kind',
  'grantTables.handedDown': 'Reached through a subgroup, not by this group itself. Change it on that group.',
  'grantTables.alsoHandedDown': 'Given by this group and through a subgroup. Change it on that subgroup.',
  'platform.refused': 'The backend did not take the change. It is still waiting here.',
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
          <div class="form-irre-header">
            <div class="form-irre-header-cell form-irre-header-icon"><span class="caret"></span></div>
            <button class="form-irre-header-cell"><span>The video</span></button>
            <div class="form-irre-header-cell form-irre-header-control"><button>Delete</button></div>
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
        <div class="panel-heading"><div class="form-irre-header"><button>The poster</button></div></div>
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

const gates = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.tableGate} .callout-body`)].map(said => said.textContent)

describe('the gate a record stands behind while its table is not given', () => {
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

  it('says on the record that the group was not given its table', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual(['The group may not edit records of this kind'])
    })
  })

  it('leaves an answer for a group it has moved on from', async () => {
    const answering = (verdict: string): unknown => ({
      scopes: { fields: { targets: {} }, tablesModify: { targets: { sys_file_reference: verdict }, named: {} } },
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
    await vi.waitFor(() => { expect(gates()).toStrictEqual([labels['grantTables.theirs']]) })

    releaseFirst()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(gates()).toStrictEqual([labels['grantTables.theirs']])
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

  it('offers to take back a table the group may write', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
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
      expect(document.querySelector(`.${classes.tableTake}`)?.textContent).toBe('Revoke "File Reference"')
    })
  })

  it('says of each table on the form where it stands', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
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
      expect(gates()).toStrictEqual([
        'The group may edit records of this kind',
        'The group may not edit records of this kind',
      ])
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
      expect(document.querySelector(`.${classes.tableGive}`)).not.toBeNull()
    })

    expect(document.querySelector(`.${classes.tableGive}`)?.closest('[inert]')).toBeNull()
  })

  it('finds the records from what the server said, not from a box of core\'s', async () => {
    annotatedRecordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates()).toStrictEqual(['The group may not edit records of this kind'])
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

  it('offers to give a table the group was not given', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableGive}`)?.textContent).toBe('Grant "File Reference"')
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
      expect(document.querySelectorAll(`.${classes.tableGive}`)).toHaveLength(1)
    })

    formReady({ doc: document, fields })

    await vi.waitFor(() => {
      expect(document.querySelectorAll(`.${classes.tableGate}`)).toHaveLength(1)
    })

    expect(document.querySelectorAll(`.${classes.tableGive}`)).toHaveLength(1)
  })

  // There is nothing else on this form to decide alongside it
  it('grants the table when the offer is pressed', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })

    sent.length = 0
    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(sent.at(-1)?.body)
        .toStrictEqual({ group: 7, operations: [{ table: 'sys_file_reference', grant: true }] })
    })
  })

  it('grants the table once while the first press is still unanswered', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })

    sent.length = 0
    const letGo = holdNextWrite()
    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()
    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()
    letGo()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent).toHaveLength(1)
  })

  it('grants the table again once the backend turned the first press down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })

    sent.length = 0
    answerNextWriteWith(409)
    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()
    await vi.waitFor(() => {
      expect(document.querySelector<HTMLButtonElement>(`.${classes.tableGive}`)?.disabled).toBe(false)
    })
    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

    await vi.waitFor(() => { expect(sent).toHaveLength(2) })
  })

  it('says that the backend took the table', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })

    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('says nothing about a table the backend turned down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })
    sent.length = 0
    answerNextWriteWith(409)

    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(settled => { setTimeout(settled, 50) })
    expect(told).toBe(0)
  })

  it('says on the band that the backend turned the table down', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })
    answerNextWriteWith(409)

    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

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
      expect(document.querySelector<HTMLElement>(`.${classes.tableGive}`)).not.toBeNull()
    })
    sent.length = 0
    cancelNextPassword()

    document.querySelector<HTMLElement>(`.${classes.tableGive}`)?.click()

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(settled => { setTimeout(settled, 0) })
    expect(gates()).toStrictEqual([labels['grantTables.missing']])
  })

  // Whatever wrote it, the table it stands over may be the group's own by now
  it('turns to taking the table back once the group has been given it', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual(['The group may not edit records of this kind'])
    })

    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'allowed' },
          named: { sys_file_reference: 'File Reference' },
        },
      },
    })
    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.tableTake}`)?.textContent).toBe('Revoke "File Reference"')
    })

    expect(gates()).toStrictEqual(['The group may edit records of this kind'])
  })

  it('takes its word back when the form turns to what the group gets', async () => {
    recordOf('sys_file_reference:title')
    initialise(listening.signal)
    pickFieldsToGive()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(gates())
        .toStrictEqual(['The group may not edit records of this kind'])
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
        .toStrictEqual(['The group may not edit records of this kind'])
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
        .toStrictEqual(['The group may not edit records of this kind'])
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
        .toStrictEqual(['The group may not edit records of this kind'])
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
        .toStrictEqual(['The group may not edit records of this kind'])
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
    expect(document.querySelector(`.${classes.tableGive}`)?.textContent).toBe('')
  })

  it('says a table was handed down, and offers no deed on it', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        tablesModify: {
          targets: { sys_file_reference: 'inherited', sys_file_metadata: 'denied' },
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
      expect(gates()).toStrictEqual([
        'Reached through a subgroup, not by this group itself. Change it on that group.',
        'The group may not edit records of this kind',
      ])
    })

    expect(document.querySelectorAll(`.${classes.tableGive}`)).toHaveLength(1)
    expect(document.querySelector(`.${classes.tableTake}`)).toBeNull()
  })

  it('says a table the group gives itself is handed down too, and offers no deed on it', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
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
      expect(gates()).toStrictEqual(['Given by this group and through a subgroup. Change it on that subgroup.'])
    })
    expect(document.querySelector(`.${classes.tableTake}, .${classes.tableGive}`)).toBeNull()
  })
})
