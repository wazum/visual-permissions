import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { emit, on } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise } from '#src/grant-fields/fields.js'
import { createJudgement } from '#src/grant-fields/judgement.js'
import { initialise as fieldsPreview } from '#src/grant-fields/preview.js'
import { initialise as tablesPreview } from '#src/grant-tables/preview.js'
import { asked, forget, holdNextRead, refuseNextRead, reply, replyTo } from '../__mocks__/typo3-ajax-request.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'
import { prime } from '../__mocks__/typo3-persistent-storage.js'
import recorded from '../../../Contract/inspect-response.json'

const anchor = (token: string): HTMLElement => {
  const element = document.createElement('div')
  element.setAttribute(attributes.token, token)
  document.body.append(element)

  return element
}

const fieldInRow = (token: string): HTMLElement => {
  const row = document.createElement('div')
  row.className = 'form-group'
  row.append(anchor(token))
  document.body.append(row)

  return row.firstElementChild as HTMLElement
}

const verdicts = (): (string | null)[] =>
  [...document.querySelectorAll(`[${attributes.token}]`)]
    .map(element => element.getAttribute(attributes.verdict))

describe('the fields scope', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forgetNotices()
    deactivate()
    selectGroup(7)
    forget()
    listening = new AbortController()
    tablesPreview(listening.signal)
    fieldsPreview(listening.signal)
    document.body.replaceChildren()
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'notApplicable', 'pages:layout': 'denied' } },
        tablesModify: { targets: { pages: 'allowed', tt_content: 'allowed' } },
      },
    })
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('says what the group may do with every field on screen', async () => {
    anchor('pages:title')
    anchor('pages:layout')
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual(['notApplicable', 'denied'])
    })
  })

  it('reads the answer the backend was recorded giving', async () => {
    reply(recorded)
    anchor('pages:TSconfig')
    anchor('pages:nav_title')
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual(['adminOnly', 'denied'])
    })
  })

  it('takes a field the group was not given off the form once the verdicts land', async () => {
    const kept = fieldInRow('pages:title')
    const taken = fieldInRow('pages:layout')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [kept, taken] })

    await vi.waitFor(() => {
      expect(taken.closest('.form-group')?.hasAttribute('hidden')).toBe(true)
    })
    expect(kept.closest('.form-group')?.hasAttribute('hidden')).toBe(false)
  })

  it('leaves an answer for a group it has moved on from', async () => {
    replyTo('group=7', { scopes: { fields: { targets: { 'pages:layout': 'denied' } }, tablesModify: { targets: {} } } })
    replyTo('group=8', { scopes: { fields: { targets: { 'pages:layout': 'allowed' } }, tablesModify: { targets: {} } } })
    anchor('pages:layout')
    initialise(createJudgement(), listening.signal)
    const releaseFirst = holdNextRead()
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    selectGroup(8)
    await vi.waitFor(() => { expect(verdicts()).toStrictEqual(['allowed']) })

    releaseFirst()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(verdicts()).toStrictEqual(['allowed'])
  })

  it('shows the fields the group was not given once the form is turned over', async () => {
    const taken = fieldInRow('pages:layout')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')
    formReady({ doc: document, fields: [taken] })
    await vi.waitFor(() => { expect(taken.closest('.form-group')?.hasAttribute('hidden')).toBe(true) })

    turnTo('pick')

    expect(taken.closest('.form-group')?.hasAttribute('hidden')).toBe(false)
  })

  it('asks nothing again when the form is turned over', async () => {
    anchor('pages:layout')
    initialise(createJudgement(), listening.signal)
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => { expect(verdicts()).toStrictEqual(['denied']) })
    asked.length = 0

    turnTo('pick')

    expect(asked).toStrictEqual([])
  })

  it('asks nothing at all when no field of ours is on screen', async () => {
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [] })
    await Promise.resolve()

    expect(asked).toStrictEqual([])
  })

  it('takes the fields of a table the group may not write off the form', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'notApplicable' } },
        tablesModify: { targets: { pages: 'denied' } },
      },
    })

    const field = fieldInRow('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [field] })

    await vi.waitFor(() => {
      expect(field.closest('.form-group')?.hasAttribute('hidden')).toBe(true)
    })
  })

  // The count and the picking read this mark, so all three agree on what is out of reach
  it('marks the fields of a table the group may not write as out of reach', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'allowed', 'tt_content:header': 'allowed' } },
        tablesModify: { targets: { pages: 'denied', tt_content: 'allowed' } },
      },
    })

    const theirs = fieldInRow('pages:title')
    const ours = fieldInRow('tt_content:header')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [theirs, ours] })

    await vi.waitFor(() => {
      expect(theirs.hasAttribute(attributes.outOfReach)).toBe(true)
    })
    expect(ours.hasAttribute(attributes.outOfReach)).toBe(false)
  })

  it('takes the out of reach mark off when permissions are hidden', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'allowed' } },
        tablesModify: { targets: { pages: 'denied' } },
      },
    })

    const field = fieldInRow('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')
    formReady({ doc: document, fields: [field] })
    await vi.waitFor(() => {
      expect(field.hasAttribute(attributes.outOfReach)).toBe(true)
    })

    deactivate()

    expect(field.hasAttribute(attributes.outOfReach)).toBe(false)
  })

  // A table only administrators may write is nobody's to be given, so its fields are no more
  // in reach than those of a table the group was refused
  it('marks the fields of a table nobody can be given as out of reach too', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'be_groups:title': 'allowed' } },
        tablesModify: { targets: { be_groups: 'adminOnly' } },
      },
    })

    const field = fieldInRow('be_groups:title')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [field] })

    await vi.waitFor(() => {
      expect(field.hasAttribute(attributes.outOfReach)).toBe(true)
    })
  })

  // Whatever wrote it, what the backend now holds is what the form has to show
  it('reads the record again when the backend has taken a change', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'tt_content:header': 'allowed' } },
        tablesModify: { targets: { tt_content: 'allowed' } },
      },
    })

    const field = fieldInRow('tt_content:header')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')
    formReady({ doc: document, fields: [field] })

    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })

    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(asked).toHaveLength(2)
    })
  })

  it('brings the fields of a granted table back into reach', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'allowed', 'tt_content:header': 'allowed' } },
        tablesModify: { targets: { pages: 'denied', tt_content: 'denied' } },
      },
    })

    const theirs = fieldInRow('pages:title')
    const other = fieldInRow('tt_content:header')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [theirs, other] })
    await vi.waitFor(() => {
      expect(theirs.hasAttribute(attributes.outOfReach)).toBe(true)
    })

    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'pages:title': 'allowed', 'tt_content:header': 'allowed' } },
        tablesModify: { targets: { pages: 'allowed', tt_content: 'denied' } },
      },
    })
    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(theirs.hasAttribute(attributes.outOfReach)).toBe(false)
    })
    expect(other.hasAttribute(attributes.outOfReach)).toBe(true)
  })

  // The form is drawn before the backend answers, so the rest of the page is told when it has
  it('says when the fields have been judged', async () => {
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: { fields: { targets: { 'pages:title': 'allowed' } }, tablesModify: { targets: {} } },
    })

    const field = fieldInRow('pages:title')
    const heard: string[] = []
    on('fields-judged', () => { heard.push(field.getAttribute(attributes.verdict) ?? '') }, listening.signal)
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [field] })

    await vi.waitFor(() => {
      expect(heard).toStrictEqual(['allowed'])
    })
  })

  it('says on a field that a subgroup gives it', () => {
    TYPO3.lang = { 'platform.from': 'from a subgroup' }
    const field = fieldInRow('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    pickArea('fields')

    formReady({ doc: document, fields: [field] })

    expect(document.body.getAttribute('style')).toContain('--vperm-inherited-note: "from a subgroup"')
  })

  it('asks about the tables the fields on screen belong to', async () => {
    anchor('pages:title')
    anchor('tt_content:header')
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(asked[0]).toContain('tables%5B0%5D=pages&tables%5B1%5D=tt_content')
    })
  })

  it('says the permissions could not be read and marks no field', async () => {
    TYPO3.lang = { 'platform.notRead': 'Not read' }
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    refuseNextRead()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: 'Not read', message: undefined }])
    })
    expect(verdicts()).toStrictEqual([null])
  })

  it('says nothing at all when the words for a failed read are missing', async () => {
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    refuseNextRead()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: '', message: undefined }])
    })
  })

  it('asks nothing when a stored session says on but names no group', async () => {
    prime({ vperm: { session: { version: '1', active: 'true', groupId: 'null', area: 'fields' } } })
    vi.resetModules()

    const fresh = await import('#src/grant-fields/fields.js')
    const form = await import('#src/surfaces/record-form/form.js')
    anchor('pages:title')
    fresh.initialise(createJudgement(), listening.signal)

    form.formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await Promise.resolve()

    expect(verdicts()).toStrictEqual([null])
    expect(asked).toStrictEqual([])
  })

  it('leaves a field the backend says nothing about unmarked', async () => {
    anchor('pages:title')
    anchor('pages:unknown_to_the_backend')
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })

    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual(['notApplicable', null])
    })
  })

  it('ignores markup that carries no field', async () => {
    anchor('pages:title')
    document.body.append(document.createElement('p'))
    initialise(createJudgement(), listening.signal)
    activate()

    formReady({ doc: document, fields: [...document.body.children] })

    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual(['notApplicable'])
    })
    expect(document.querySelector('p')?.hasAttribute(attributes.verdict)).toBe(false)
    expect(asked[0]).toBe('/typo3/ajax/visual_permissions_inspect?group=7&tables%5B0%5D=pages')
  })

  it('asks nothing while no field is on screen', () => {
    initialise(createJudgement(), listening.signal)

    activate()

    expect(asked).toStrictEqual([])
  })

  it('says nothing while the mode is off', async () => {
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)

    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await Promise.resolve()

    expect(verdicts()).toStrictEqual([null])
    expect(asked).toStrictEqual([])
  })

  it('leaves an answer alone that arrives after the mode went off', async () => {
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    const release = holdNextRead()
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    deactivate()

    release()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(verdicts()).toStrictEqual([null])
  })

  it('says nothing about a form that has gone before its answer came', async () => {
    let judged = 0
    on('fields-judged', () => { judged += 1 }, listening.signal)
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    const release = holdNextRead()
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    formReady({ doc: document, fields: [] })

    release()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(judged).toBe(0)
  })

  it('marks nothing once it was let go before the answer came', async () => {
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    const release = holdNextRead()
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    listening.abort()

    release()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(verdicts()).toStrictEqual([null])
  })

  it('takes the marks back when the mode goes off', async () => {
    anchor('pages:title')
    initialise(createJudgement(), listening.signal)
    activate()
    formReady({ doc: document, fields: [...document.querySelectorAll(`[${attributes.token}]`)] })
    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual(['notApplicable'])
    })

    deactivate()

    await vi.waitFor(() => {
      expect(verdicts()).toStrictEqual([null])
    })
  })
})
