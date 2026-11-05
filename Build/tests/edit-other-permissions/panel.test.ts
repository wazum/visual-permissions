import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, showControls } from '#src/platform/session.js'
import { initialise } from '#src/edit-other-permissions/panel.js'
import {
  asked, cancelNextPassword, forget, holdNextRead, holdNextWrite, refuseNextRead, refuseNextWrite, reply, replyTo, sendNextWriteToLogin, sent,
} from '../__mocks__/typo3-ajax-request.js'
import { forgetItems, processed } from '../__mocks__/typo3-java-script-item-processor.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'
import { prime } from '../__mocks__/typo3-persistent-storage.js'

const framed = (): HTMLElement => {
  const host = document.createElement('div')
  host.className = classes.frame
  host.setAttribute(attributes.area, 'fields')
  host.setAttribute(attributes.ground, 'module')
  document.body.append(host)

  return host
}

const words = (): void => {
  const carrier = document.createElement('span')
  carrier.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Lorem', inherits: [] } }))
  document.body.append(carrier)
  TYPO3.lang = {
    'rm.saveDoc': 'Save',
    'notification.record_saved.title.singular': 'Record saved',
    'editOtherPermissions.notSaved': 'Not saved',
    'platform.notRead': 'Not read',
  }
}

const saveButton = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(`.${classes.face} .module-docheader button`)

const shownFace = (): HTMLElement | null =>
  document.querySelector<HTMLElement>(`.${classes.frame}[${attributes.area}="fields"] .${classes.face}`)

describe('the panel of the other permissions', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forget()
    forgetItems()
    forgetNotices()
    deactivate()
    selectGroup(null)
    pickArea('modules')
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('stays off the page when a stored session says on but names no group', async () => {
    prime({ vperm: { session: { version: '1', active: 'true', groupId: 'null', area: 'other' } } })
    vi.resetModules()

    const fresh = await import('#src/edit-other-permissions/panel.js')
    framed()
    words()
    fresh.initialise(document, listening.signal)
    await Promise.resolve()

    expect(shownFace()).toBeNull()
    expect(asked).toStrictEqual([])
  })

  it('gives the save back and says so when the write is turned down', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    refuseNextWrite()

    saveButton()?.click()

    await vi.waitFor(() => { expect(notices).toStrictEqual([{ kind: 'error', title: 'Not saved', message: undefined }]) })
    expect(saveButton()?.querySelector('typo3-backend-icon')?.getAttribute('identifier')).toBe('actions-document-save')
  })

  it('says the record was not saved when the login ran out', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    sendNextWriteToLogin()

    saveButton()?.click()

    await vi.waitFor(() => { expect(notices).toStrictEqual([{ kind: 'error', title: 'Not saved', message: undefined }]) })
  })

  it('says nothing when the password prompt is cancelled', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    cancelNextPassword()

    saveButton()?.click()

    await vi.waitFor(() => {
      expect(saveButton()?.querySelector('typo3-backend-icon')?.getAttribute('identifier')).toBe('actions-document-save')
    })
    expect(notices).toStrictEqual([])
  })

  it('says so when the form cannot be read', async () => {
    framed()
    words()
    refuseNextRead()
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: 'Not read', message: undefined }])
    })
  })

  it('lets go of the form name when the panel leaves', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(shownFace()).not.toBeNull() })
    TYPO3.settings.FormEngine = { formName: 'editform' }

    deactivate()

    expect(TYPO3.settings.FormEngine.formName).toBeUndefined()
  })

  it('carries the head FormEngine hangs its own button in', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => {
      const bar = document.querySelector('.t3js-module-docheader-buttons')

      expect(bar?.lastElementChild?.querySelector('[role="toolbar"]')).toBeInstanceOf(HTMLElement)
    })
  })

  it('names the group whose record it shows', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.head} strong`)?.textContent.trim()).toBe('Lorem')
    })
  })

  it('names nobody when the group is not one the select knows', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][99][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(99)
    activate()

    pickArea('other')

    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    expect(document.querySelector(`.${classes.head} strong`)?.textContent).toBe('')
  })

  it('spins the save while the write is on the wire', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    const releaseWrite = holdNextWrite()

    saveButton()?.click()

    await vi.waitFor(() => {
      expect(saveButton()?.querySelector('typo3-backend-icon')?.getAttribute('identifier')).toBe('spinner-circle')
    })
    releaseWrite()
    await vi.waitFor(() => {
      expect(saveButton()?.querySelector('typo3-backend-icon')?.getAttribute('identifier')).toBe('actions-document-save')
    })
  })

  it('says the record was saved, in the words the backend gives it', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    saveButton()?.click()

    await vi.waitFor(() => { expect(notices).toStrictEqual([{ kind: 'success', title: 'Record saved', message: undefined }]) })
  })

  it('carries no word at all where the backend published none', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    expect(saveButton()?.textContent.trim()).toBe('')

    saveButton()?.click()

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'success', title: '', message: undefined }])
    })

    refuseNextWrite()
    saveButton()?.click()

    await vi.waitFor(() => {
      expect(notices.at(-1)).toStrictEqual({ kind: 'error', title: '', message: undefined })
    })
  })

  it('sends the fields to the backend when the save is pressed', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]" value="options.saveDocNew = 1">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    saveButton()?.click()

    await vi.waitFor(() => { expect(sent).toHaveLength(1) })

    // Send plain values; a form's body cannot be read twice after submission
    expect(sent[0]?.body).toStrictEqual({
      'group': '7',
      'data[be_groups][7][TSconfig]': 'options.saveDocNew = 1',
    })
  })

  it('sends one save while the last one is still unanswered', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]" value="options.saveDocNew = 1">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    const letGo = holdNextWrite()

    saveButton()?.click()
    saveButton()?.click()
    letGo()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent).toHaveLength(1)
  })

  it('keeps the save off when its answer comes while the next group is still on its way', async () => {
    framed()
    words()
    document.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, JSON.stringify({
      7: { title: 'Lorem', inherits: [] },
      8: { title: 'Ipsum', inherits: [] },
    }))
    replyTo('group=7', { html: '<input name="data[be_groups][7][TSconfig]" value="options.saveDocNew = 1">', scriptItems: [] })
    replyTo('group=8', { html: '<input name="data[be_groups][8][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => {
      expect(shownFace()?.querySelector('input')?.getAttribute('name')).toBe('data[be_groups][7][TSconfig]')
    })
    const letGo = holdNextWrite()
    saveButton()?.click()
    holdNextRead()
    selectGroup(8)
    letGo()
    await vi.waitFor(() => { expect(notices).toHaveLength(1) })

    saveButton()?.click()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent).toHaveLength(1)
  })

  it('saves nothing while the form of the next group is still on its way', async () => {
    framed()
    words()
    document.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, JSON.stringify({
      7: { title: 'Lorem', inherits: [] },
      8: { title: 'Ipsum', inherits: [] },
    }))
    replyTo('group=7', { html: '<input name="data[be_groups][7][TSconfig]" value="options.saveDocNew = 1">', scriptItems: [] })
    replyTo('group=8', { html: '<input name="data[be_groups][8][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => {
      expect(shownFace()?.querySelector('input')?.getAttribute('name')).toBe('data[be_groups][7][TSconfig]')
    })
    holdNextRead()
    selectGroup(8)

    saveButton()?.click()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(sent).toStrictEqual([])
  })

  it('carries the save the record screen carries', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => { expect(saveButton()?.textContent.trim()).toBe('Save') })
  })

  it('builds the panel out of the widgets the record screen is built of', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    expect(document.querySelector('form[name="editform"]')?.className).toBe('module-body')
    expect(saveButton()?.parentElement?.className).toBe('btn-toolbar')
    expect(saveButton()?.className).toBe('btn btn-sm btn-default')

    const mark = saveButton()?.querySelector('typo3-backend-icon')

    expect(mark?.getAttribute('identifier')).toBe('actions-document-save')
    expect(mark?.getAttribute('size')).toBe('small')
  })

  it('saves without letting the form go off on its own', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })
    let sentOff = false
    document.querySelector('form[name="editform"]')
      ?.addEventListener('submit', event => { event.preventDefault(); sentOff = true })

    saveButton()?.click()

    expect(sentOff).toBe(false)
  })

  it('shows the form the backend rendered for the group', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => {
      expect(shownFace()?.querySelector('input')?.getAttribute('name'))
        .toBe('data[be_groups][7][TSconfig]')
    })
  })

  it('stands the fields in a form the way the record screen does', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => {
      expect(shownFace()?.querySelector('input')?.closest('form')?.getAttribute('name'))
        .toBe('editform')
    })
  })

  it('asks once while the same group stands', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(shownFace()).not.toBeNull() })

    pickArea('other')
    showControls()

    expect(asked).toHaveLength(1)
  })

  it('leaves an answer for a group it has moved on from', async () => {
    framed()
    replyTo('group=7', { html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    replyTo('group=9', { html: '<input name="data[be_groups][9][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    const releaseFirst = holdNextRead()
    pickArea('other')
    selectGroup(9)
    await vi.waitFor(() => {
      expect(shownFace()?.querySelector('input')?.getAttribute('name')).toBe('data[be_groups][9][TSconfig]')
    })

    releaseFirst()
    await new Promise(settled => { setTimeout(settled, 0) })

    expect(shownFace()?.querySelector('input')?.getAttribute('name')).toBe('data[be_groups][9][TSconfig]')
  })

  it('takes the form away when the group is dropped', async () => {
    framed()
    words()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    selectGroup(null)

    expect(saveButton()).toBeNull()
  })

  it('sends the plain values of the form and leaves a file behind', async () => {
    framed()
    words()
    reply({
      html: '<input name="data[be_groups][7][TSconfig]" value="a"><input type="file" name="picked">',
      scriptItems: [],
    })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(saveButton()).not.toBeNull() })

    saveButton()?.click()

    await vi.waitFor(() => { expect(sent).toHaveLength(1) })

    expect(sent[0]?.body).toStrictEqual({ 'group': '7', 'data[be_groups][7][TSconfig]': 'a' })
  })

  it('runs the modules the fields it stands need', async () => {
    const item = { type: 'javaScriptModuleInstruction', payload: { name: '@typo3/backend/form-engine/element/lorem-element.js' } }
    framed()
    reply({ html: '<input name="data[be_groups][7][subgroup]">', scriptItems: [item] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()

    pickArea('other')

    await vi.waitFor(() => { expect(processed).toStrictEqual([item]) })
  })

  it('takes the form away when permissions are hidden', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(shownFace()).not.toBeNull() })

    deactivate()

    expect(shownFace()).toBeNull()
  })

  it('leaves the column to the module while another area is armed', async () => {
    framed()
    reply({ html: '<input name="data[be_groups][7][TSconfig]">', scriptItems: [] })
    initialise(document, listening.signal)
    selectGroup(7)
    activate()
    pickArea('other')
    await vi.waitFor(() => { expect(shownFace()).not.toBeNull() })

    pickArea('modules')

    expect(shownFace()).toBeNull()
  })
})
