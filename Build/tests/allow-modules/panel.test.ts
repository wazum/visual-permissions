import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { emit, on } from '#src/platform/bus.js'
import { activate, deactivate, getState, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/allow-modules/modules.js'
import {
  answerNextWriteWith,
  asked,
  cancelNextPassword,
  forget,
  holdNextRead,
  holdNextWrite,
  refuseNextRead,
  refuseNextWrite,
  reply,
  replyTo,
  sent,
} from '../__mocks__/typo3-ajax-request.js'
import { dialog, press } from '../__mocks__/typo3-modal.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'

const menu = (): void => {
  const nav = document.createElement('nav')
  nav.id = 'modulemenu'

  const loose = document.createElement('a')
  loose.setAttribute('data-modulemenu-identifier', 'dashboard')
  loose.setAttribute('title', 'Dashboard')
  loose.setAttribute('href', '/typo3/module/dashboard')
  nav.append(loose)

  const control = document.createElement('button')
  control.setAttribute('data-modulemenu-identifier', 'content')
  control.setAttribute('aria-controls', 'group-content')
  control.setAttribute('title', 'Content')

  const list = document.createElement('ul')
  list.id = 'group-content'
  list.className = 'modulemenu-group-container'

  const groupModules: [string, string][] = [
    ['web_layout', 'Page'],
    ['records', 'List'],
    ['site_configuration', 'Sites'],
    ['content_status', 'Status'],
  ]

  groupModules.forEach(([identifier, name]) => {
    const action = document.createElement('a')
    action.setAttribute('data-modulemenu-identifier', identifier)
    action.setAttribute('title', name)
    action.setAttribute('href', `/typo3/module/${identifier}`)
    list.append(action)
  })

  nav.append(control, list)
  document.body.replaceChildren(nav)
}

const oneModuleMenu = (): void => {
  const nav = document.createElement('nav')
  nav.id = 'modulemenu'
  const action = document.createElement('a')
  action.setAttribute('data-modulemenu-identifier', 'web_layout')
  action.setAttribute('title', 'Page')
  action.setAttribute('href', '/typo3/module/web_layout')
  nav.append(action)
  document.body.replaceChildren(nav)
}

const carrier = (): void => {
  const hidden = document.createElement('span')
  hidden.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Content Reviewers', inherits: [] } }))
  document.body.append(hidden)
  TYPO3.lang = {
    'platform.preview': 'Preview',
    'allowModules.previewFor': 'What %s may open',
    'allowModules.allow': 'Allow modules',
    'allowModules.hint': 'or click a module to remove it',
    'allowModules.alsoAllowed': '"%s" allowed as well, so the group finds the module in the menu',
    'allowModules.outside': 'Choose modules outside the menu',
    'allowModules.takenAway.name': '"%s"',
    'allowModules.takenAway.one': '%s is taken away as well',
    'allowModules.takenAway.many': '%s are taken away as well',
    'allowModules.outside.tally.one': '%1$s of %2$s outside the menu allowed',
    'allowModules.outside.tally.many': '%1$s of %2$s outside the menu allowed',
    'platform.pick': 'Assign',
    'allowModules.pickFor': 'Pick what %s may open',
    'allowModules.tally.one': '%1$s of %2$s menu module allowed',
    'allowModules.tally.many': '%1$s of %2$s menu modules allowed',
    'platform.waiting': '%s waiting to be allowed',
    'allowModules.marked.one': '%1$s of %2$s module marked to remove',
    'allowModules.marked.many': '%1$s of %2$s modules marked to remove',
    'platform.from': 'from a subgroup',
    'platform.cancel': 'Cancel',
    'platform.doAllow': 'Allow',
    'platform.doDisallow': 'Disallow',
    'platform.toAllow': 'to allow',
    'platform.refused': 'The change could not be saved',
    'platform.failed': 'The change could not be sent',
  }
}

const armed = async (): Promise<void> => {
  activate()
  pickArea('modules')
  await vi.waitFor(() => {
    expect(document.querySelector(`.${classes.allowed}`)).not.toBeNull()
  })
}


const outsideTheMenu = {
  title: 'Modules outside the menu the group "%s" may open',
  groups: [
    { label: 'Help', values: [{ value: 'about', label: 'About TYPO3 CMS', icon: '', parent: 'help' }] },
    { label: 'User Tools', values: [{ value: 'user_setup', label: 'User Settings', icon: '', parent: 'user' }] },
  ],
}

const chooseOutside = (): void => {
  ;[...document.querySelectorAll('button')].find(offered => offered.textContent === 'Choose modules outside the menu')?.click()
}

const inPreview = (selector: string): Element | null =>
  document.querySelector(`.${classes.facePreview} ${selector}`)

const inPick = (selector: string): Element | null =>
  document.querySelector(`.${classes.facePick} ${selector}`)

const pickedNames = (): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.facePick} [${attributes.verdict}='allowed']`)]
    .map(row => row.getAttribute('data-modulemenu-identifier'))

describe('the module panel the group sees', () => {
  let listening: AbortController

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    forget()
    forgetNotices()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
    replyTo('visual_permissions_modules_outside_menu', { title: '', groups: [] })
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: {
          targets: {
            dashboard: 'allowed',
            web_layout: 'allowed',
            records: 'denied',
            site_configuration: 'adminOnly',
            content_status: 'inherited',
          },
        },
      },
    })
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('offers to choose the modules outside the menu right above the foot of the assign side', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceFoot}`)?.previousElementSibling?.querySelector('button')?.textContent)
      .toBe('Choose modules outside the menu')
    expect(inPreview(`.${classes.faceChoice}`)).toBeNull()
  })

  it('lists the modules outside the menu the backend offers as boxes to tick', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()

    chooseOutside()

    await vi.waitFor(() => {
      expect([...dialog()?.querySelectorAll('label:has(input[type="checkbox"])') ?? []].map(box => box.textContent.trim()))
        .toStrictEqual(['About TYPO3 CMS', 'User Settings'])
    })
  })

  it('ticks a module outside the menu the group may open', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    reply({ group: { id: 7, title: 'Content Reviewers' }, chain: [], scopes: { modules: { targets: { about: 'allowed', user_setup: 'denied' } } } })

    chooseOutside()

    await vi.waitFor(() => {
      expect([...dialog()?.querySelectorAll('label:has(input:checked)') ?? []].map(box => box.textContent.trim()))
        .toStrictEqual(['About TYPO3 CMS'])
    })
  })

  it('keeps a module outside the menu the group gets from a subgroup ticked, and out of reach', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    reply({ group: { id: 7, title: 'Content Reviewers' }, chain: [], scopes: { modules: { targets: { about: 'inherited' } } } })

    chooseOutside()

    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    const about = [...dialog()?.querySelectorAll('label') ?? []].find(box => box.textContent.trim() === 'About TYPO3 CMS')
    expect([about?.querySelector('input')?.checked, about?.querySelector('input')?.disabled]).toStrictEqual([true, true])
  })

  it('sends the modules outside the menu that were ticked and unticked', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    reply({ group: { id: 7, title: 'Content Reviewers' }, chain: [], scopes: { modules: { targets: { about: 'allowed' } } } })
    chooseOutside()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelectorAll('input').forEach(box => { box.click() })

    await press('apply')

    await vi.waitFor(() => {
      expect(sent).toContainEqual({
        url: '/typo3/ajax/visual_permissions_allow_modules',
        body: { group: 7, operations: [{ module: 'about', allow: false }, { module: 'user_setup', allow: true }] },
      })
    })
  })

  it('tells the admin which parent was allowed along with a module outside the menu', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    replyTo('visual_permissions_allow_modules', { alsoAllowed: ['Status'] })
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    chooseOutside()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()

    await press('apply')

    await vi.waitFor(() => {
      expect(notices).toContainEqual({
        kind: 'info',
        title: '"Status" allowed as well, so the group finds the module in the menu',
        message: undefined,
      })
    })
  })

  it('closes the dialog once the modules outside the menu are written', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    chooseOutside()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()

    await press('apply')

    await vi.waitFor(() => { expect(dialog()).toBeNull() })
  })

  it('keeps the dialog open when the modules outside the menu were not written', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    chooseOutside()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()
    answerNextWriteWith(409)

    await press('apply')

    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await vi.advanceTimersByTimeAsync(0)
    expect(dialog()).not.toBeNull()
  })

  it('opens no dialog of the modules outside the menu when the permissions cannot be read', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    refuseNextRead()

    chooseOutside()

    await vi.waitFor(() => { expect(asked.at(-1)).toContain('visual_permissions_inspect') })
    await vi.advanceTimersByTimeAsync(0)
    expect(dialog()).toBeNull()
  })

  it('opens no dialog when the modules outside the menu cannot be read', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    const release = holdNextRead()
    chooseOutside()
    refuseNextRead()
    release()

    await vi.waitFor(() => { expect(asked.at(-1)).toContain('visual_permissions_modules_outside_menu') })
    await vi.advanceTimersByTimeAsync(0)
    expect(dialog()).toBeNull()
  })

  it('tells everyone the modules outside the menu were written', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    menu()
    carrier()
    initialise(document, listening.signal)
    await armed()
    chooseOutside()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()

    await press('apply')

    await vi.waitFor(() => { expect(told).toBe(1) })
  })

  it('counts the modules outside the menu below the button that chooses them', async () => {
    replyTo('visual_permissions_modules_outside_menu', outsideTheMenu)
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: { modules: { targets: { dashboard: 'allowed', web_layout: 'allowed', records: 'denied', about: 'allowed' } } },
    })
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceChoice}`)?.lastElementChild?.textContent).toBe('1 of 2 outside the menu allowed')
  })

  it('puts both sides on one card, the backend menu turned away, our preview up', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    const card = document.querySelector(`.${classes.panelCard}`)

    expect(card?.querySelector('#modulemenu')).not.toBeNull()
    expect(card?.querySelector(`.${classes.allowed}`)).not.toBeNull()
    expect(document.querySelector('#modulemenu')?.hasAttribute('inert')).toBe(true)
    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
  })

  // Side turned away must not be found by keyboard or card explanation
  it('puts the side turned away out of reach', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(document.querySelector(`.${classes.facePreview}`)?.hasAttribute('inert')).toBe(false)
    expect(document.querySelector(`.${classes.facePick}`)?.hasAttribute('inert')).toBe(true)

    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.facePreview}`)?.hasAttribute('inert')).toBe(true)
    expect(document.querySelector(`.${classes.facePick}`)?.hasAttribute('inert')).toBe(false)
  })

  it('stands its rows in a menu of the kind the backend paints', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceScroll}`)?.classList.contains('modulemenu')).toBe(true)
    expect(inPick(`.${classes.faceScroll}`)?.classList.contains('modulemenu')).toBe(true)
  })

  it('offers every module on the face as a stop for the keyboard', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.getAttribute('tabindex')).toBe('0')
    expect(inPick('[data-modulemenu-identifier="records"]')?.getAttribute('tabindex')).toBe('0')
  })

  // A stop that answers nothing and says nothing is a stop the keyboard is walked through for no reason
  it('passes over a module that answers nothing on the face', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('[data-modulemenu-identifier="content_status"]')?.hasAttribute('tabindex')).toBe(false)
  })

  it('says of a module that answers that it is a control, not a way into the module', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.getAttribute('role')).toBe('button')
    expect(inPick('[data-modulemenu-identifier="records"]')?.getAttribute('role')).toBe('button')
  })

  it('takes the keyboard as the word to mark a module', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.classList.contains(classes.faceMarked))
      .toBe(true)
  })

  it('takes the keyboard as the word to pick a module', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="records"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))

    expect(inPick('[data-modulemenu-identifier="records"]')?.getAttribute(attributes.verdict))
      .toBe('allowed')
  })

  it('leaves another key on a module to the backend', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('leaves the backend its own menu until the modules area is the one worked in', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    activate()
    pickArea('fields')
    await Promise.resolve()
    await Promise.resolve()

    expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
    expect(document.querySelector('#modulemenu')?.hasAttribute('inert')).toBe(false)
  })

  it('gives the menu back when the area is let go of', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)

    pickArea('fields')

    expect(document.querySelector('#modulemenu')?.hasAttribute('inert')).toBe(false)
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
    })
  })

  it('leaves the menu alone when the area is let go of a second time', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    pickArea('fields')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
    })

    pickArea('modules')
    pickArea('fields')

    expect(document.querySelector('#modulemenu')).not.toBeNull()
    expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
  })

  it('leaves a card that belongs to another scope alone', () => {
    menu()
    carrier()
    const theirs = document.createElement('div')
    theirs.className = classes.panelCard
    document.body.prepend(theirs)
    initialise(document, listening.signal)

    activate()
    pickArea('fields')

    expect(theirs.isConnected).toBe(true)
  })

  it('turns the card back and takes our side off it when the area is let go of', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    pickArea('fields')

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.panelCard}`)?.classList.contains(classes.panelCardTurned))
        .toBe(false)
    })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
      expect(document.querySelector(`.${classes.panelCard}`)).toBeNull()
    })
  })

  it('opens on the face that shows what the group has, every time the area is armed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickArea('fields')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.allowed}`)).toBeNull()
    })
    await armed()

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
  })

  it('stays in the area when the keyboard says so again', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(getState().area).toBe('modules')
  })

  it('keeps the allowed modules under the heading of the group they belong to', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    const shape = [...(inPreview(`.${classes.faceScroll}`)?.children ?? [])]
      .map(child => child.className.includes(classes.allowedGroup) ? `# ${child.textContent}` : 'row')

    expect(shape).toEqual(['row', '# Content', 'row', 'row'])
  })

  it('invites adding on the face that shows what the group has', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('button')?.textContent).toBe('Allow modules')
    expect(inPreview('button')?.className).toBe('btn btn-default')
    expect(inPreview(`.${classes.faceHint}`)?.textContent).toBe('or click a module to remove it')
  })

  it('marks an allowed module to be disallowed when it is clicked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.classList.contains(classes.faceMarked))
      .toBe(true)
    expect(sent).toHaveLength(0)
  })

  it('leaves a module that comes from a subgroup where it is', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="content_status"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('shows no module as the one on screen, since none of them can be opened', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    const marks = document.querySelectorAll(`.${classes.allowed} .modulemenu-action-active, .${classes.allowed} [aria-current]`)

    expect(marks).toHaveLength(0)
  })

  it('says what each face will do, not that something is applied', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceApply}`)?.textContent).toBe('Disallow')
    expect(inPick(`.${classes.faceApply}`)?.textContent).toBe('Allow')
  })

  it('offers nothing to press while nothing is marked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
    expect(inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('offers the deed as soon as something is marked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(false)
    expect(inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(false)
  })

  it('counts what is marked to be disallowed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('1 of 2 modules marked to remove')
  })

  it('names the modules outside the menu a module marked to be disallowed takes along', async () => {
    replyTo('visual_permissions_modules_outside_menu', {
      title: '',
      groups: [{ label: 'Content', values: [
        { value: 'web_info_overview', label: 'Status › Pagetree Overview', icon: '', parent: 'content_status' },
        { value: 'web_info_translations', label: 'Status › Localization Overview', icon: '', parent: 'content_status' },
        { value: 'web_info_trash', label: 'Status › Trash', icon: '', parent: 'content_status' },
      ] }],
    })
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: { modules: { targets: { content_status: 'allowed', web_info_overview: 'allowed', web_info_translations: 'denied', web_info_trash: 'allowed' } } },
    })
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="content_status"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPreview(`.${classes.faceWaiting}`)?.textContent)
      .toBe('"Status › Pagetree Overview", "Status › Trash" are taken away as well')
  })

  it('names one module outside the menu a module marked to be disallowed takes along in the singular', async () => {
    replyTo('visual_permissions_modules_outside_menu', {
      title: '',
      groups: [{ label: 'Content', values: [
        { value: 'web_info_overview', label: 'Status › Pagetree Overview', icon: '', parent: 'content_status' },
      ] }],
    })
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: { modules: { targets: { content_status: 'allowed', web_info_overview: 'allowed' } } },
    })
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="content_status"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPreview(`.${classes.faceWaiting}`)?.textContent).toBe('"Status › Pagetree Overview" is taken away as well')
  })

  it('disallows everything marked when the change is applied', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    expect(sent[0]?.body).toEqual({ group: 7, operations: [{ module: 'web_layout', allow: false }] })
  })

  it('forgets the marks when the removal is called off', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPreview(`.${classes.faceCancel}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(sent).toHaveLength(0)
    expect(document.querySelectorAll(`.${classes.faceMarked}`)).toHaveLength(0)
  })

  it('opens no module from either face while the panel is the group\'s', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    const links = [...document.querySelectorAll(`.${classes.allowed} [data-modulemenu-identifier]`)]

    expect(links.filter(link => link.hasAttribute('href'))).toHaveLength(0)
  })

  it('turns to the picking face when asked to change something', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)
  })

  it('shows every module on the picking face, with what the group may do today', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(pickedNames()).toEqual(['dashboard', 'web_layout'])
    expect(inPick('[data-modulemenu-identifier="site_configuration"]')?.getAttribute(attributes.verdict))
      .toBe('adminOnly')
  })

  it('opens every group on the picking face, since nothing there folds', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick('.modulemenu-group-container')?.classList.contains('show')).toBe(true)
  })

  it('names a group of modules with a heading, since a module group cannot be allowed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.allowedGroup}`)?.textContent).toBe('Content')
    expect(inPick('[data-modulemenu-identifier="web"]')).toBeNull()
  })

  it('takes a click on a mark as picking that module', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(pickedNames()).toEqual(['dashboard', 'web_layout', 'records'])
  })

  // What the group already has is disallowed on the preview; do not allow it again
  it('leaves a module the group already had where it is while picking', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="web_layout"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const row = inPick('[data-modulemenu-identifier="web_layout"]')

    expect(row?.getAttribute(attributes.verdict)).toBe('allowed')
    expect(row?.classList.contains(classes.faceMarked)).toBe(false)
  })

  it('says on a module the group already had that it cannot be picked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick('[data-modulemenu-identifier="web_layout"]')?.getAttribute('aria-disabled')).toBe('true')
    expect(inPick('[data-modulemenu-identifier="records"]')?.hasAttribute('aria-disabled')).toBe(false)
  })

  it('takes back a pick made in the same breath', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const row = inPick('[data-modulemenu-identifier="records"]')
    row?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(row?.getAttribute(attributes.verdict)).toBe('allowed')

    row?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(row?.getAttribute(attributes.verdict)).toBe('denied')
  })

  it('leaves a module alone that cannot be allowed for a group', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="site_configuration"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(pickedNames()).toEqual(['dashboard', 'web_layout'])
  })

  // A picked row is filled but does not say whether the group has the module already or is only about to be allowed it
  it('says of a picked module that it is waiting to be allowed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-queued-note: "to allow"')
  })

  it('counts what is picked in the menu above the button for the modules outside it', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceChoice}`)?.firstElementChild?.textContent).toBe('2 of 3 menu modules allowed')
  })

  // XLIFF carries singular and plural separately, no plural rules
  it('counts one module in the singular', async () => {
    oneModuleMenu()
    carrier()
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: { fields: { targets: {} }, modules: { targets: { web_layout: 'allowed' } } },
    })
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceChoice}`)?.firstElementChild?.textContent).toBe('1 of 1 menu module allowed')
  })

  it('says nothing in the foot of the assign side while nothing waits', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceFoot} .${classes.faceTally}`)?.textContent).toBe('')
  })

  // Group has and waiting counts are two separate values; a pick is allowed only when saved
  it('counts what is waiting to be allowed beside what is allowed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick(`.${classes.faceChoice}`)?.firstElementChild?.textContent).toBe('2 of 3 menu modules allowed')
    expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('1 waiting to be allowed')
  })

  it('flashes the module that was just allowed once the card has turned', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: {
          targets: {
            dashboard: 'allowed',
            web_layout: 'allowed',
            records: 'allowed',
            site_configuration: 'adminOnly',
            content_status: 'inherited',
          },
        },
        pageMounts: { targets: {}, order: [], unseen: [] },
      },
    })

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPreview('[data-modulemenu-identifier="records"]')?.classList.contains(classes.justAdded))
        .toBe(true)
    }, { timeout: 2000 })
    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.classList.contains(classes.justAdded))
      .toBe(false)
    expect(document.querySelectorAll(`.${classes.justAdded}`)).toHaveLength(1)
  })

  it('keeps the flash when the panel is drawn again before it shows', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: { targets: { dashboard: 'allowed', web_layout: 'allowed', records: 'allowed' } },
        pageMounts: { targets: {}, order: [], unseen: [] },
      },
    })

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await vi.advanceTimersByTimeAsync(50)
    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(inPreview('[data-modulemenu-identifier="records"]')?.classList.contains(classes.justAdded))
        .toBe(true)
    }, { timeout: 2000 })
  })

  it('lets go of a flash it started when the card it belongs to is gone', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: { targets: { dashboard: 'allowed', web_layout: 'allowed', records: 'allowed' } },
        pageMounts: { targets: {}, order: [], unseen: [] },
      },
    })
    const letGo = holdNextWrite()
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => { expect(sent).toHaveLength(1) })

    deactivate()
    await armed()
    letGo()
    await vi.advanceTimersByTimeAsync(900)

    expect(document.querySelectorAll(`.${classes.justAdded}`)).toHaveLength(0)
  })

  it('flashes nothing when a module was disallowed', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await vi.advanceTimersByTimeAsync(700)

    expect(document.querySelectorAll(`.${classes.justAdded}`)).toHaveLength(0)
  })

  it('lets the flash go once it has been seen', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: { targets: { dashboard: 'allowed', web_layout: 'allowed', records: 'allowed' } },
        pageMounts: { targets: {}, order: [], unseen: [] },
      },
    })

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.justAdded}`)).not.toBeNull()
    }, { timeout: 2000 })

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.justAdded}`)).toBeNull()
    }, { timeout: 2000 })
  })

  it('leaves the face alone when a prompt takes the key', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)
    document.body.append(document.createElement('typo3-backend-modal'))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)
  })

  it('says that the backend took the modules', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('says nothing about modules the backend turned down', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    answerNextWriteWith(409)
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceFoot} .${classes.faceCounted}`)?.textContent).toBe('The change could not be saved')
    })
    expect(told).toBe(0)
  })

  // Backend returns 422 on cancelled password prompt; treat as no change
  it('stays on the picking face when no password was given', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    cancelNextPassword()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await vi.advanceTimersByTimeAsync(50)
    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned))
      .toBe(true)
    expect(inPick('[data-modulemenu-identifier="records"]')?.getAttribute(attributes.verdict))
      .toBe('allowed')
  })

  // The module carries the face's state when painted, not the latest change
  it('sends what was picked when the change is applied, and nothing else', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    expect(sent[0]?.body).toEqual({
      group: 7,
      operations: [{ module: 'records', allow: true }],
    })
  })

  it('says on the face that the backend turned the change down', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    answerNextWriteWith(409)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceFoot} .${classes.faceCounted}`)?.textContent).toBe('The change could not be saved')
    })
    expect(inPick('[data-modulemenu-identifier="records"]')?.getAttribute(attributes.verdict)).toBe('allowed')
  })

  it('flashes nothing the backend turned down once the panel is drawn again', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    answerNextWriteWith(409)
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceFoot} .${classes.faceCounted}`)?.textContent).toBe('The change could not be saved')
    })
    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: { targets: { web_layout: 'allowed', records: 'allowed' } },
        pageMounts: { targets: {}, order: [], unseen: [] },
      },
    })

    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(inPreview('[data-modulemenu-identifier="records"]')).not.toBeNull()
    })
    await vi.advanceTimersByTimeAsync(700)
    expect(document.querySelectorAll(`.${classes.justAdded}`)).toHaveLength(0)
  })

  it('takes one change at a time, since the first is still on its way', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    const letGo = holdNextWrite()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    letGo()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
    })
    expect(sent).toHaveLength(1)
  })

  // Picks made before another group was shown affect a hidden group; ask for nothing then.
  it('asks for nothing once another group is shown', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    selectGroup(8)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()

    expect(sent.some(({ url }) => url.includes('allow_modules'))).toBe(false)
  })

  it('lets go of its deeds the moment another group is picked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('[data-modulemenu-identifier="web_layout"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    const deeds = (): (boolean | undefined)[] => [
      inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled'),
      inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled'),
      inPick(`.${classes.faceApply}`)?.hasAttribute('disabled'),
      inPick(`.${classes.faceCancel}`)?.hasAttribute('disabled'),
    ]

    expect(deeds()).toStrictEqual([false, false, false, false])

    selectGroup(7)

    expect(deeds()).toStrictEqual([false, false, false, false])

    selectGroup(8)

    expect(deeds()).toStrictEqual([true, true, true, true])
  })

  it('says nothing on the face when the reader cancelled the password', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    cancelNextPassword()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await vi.advanceTimersByTimeAsync(20)

    expect(inPick(`.${classes.faceFoot} .${classes.faceCounted}`)?.textContent).toBe('')
  })

  it('turns one card, however often the panel is painted', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const first = document.querySelector(`.${classes.panelCard}`)

    selectGroup(7)
    await vi.advanceTimersByTimeAsync(20)

    expect(document.querySelectorAll(`.${classes.panelCard}`)).toHaveLength(1)
    expect(document.querySelector(`.${classes.panelCard}`)).toBe(first)
  })

  it('turns back to the preview once the change is applied', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
    })
  })

  it('lets the picking be left at any time, since the preview is the view to be in', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(false)

    inPick(`.${classes.faceCancel}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
  })

  it('leaves the picking when the keyboard says so', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
    expect(sent).toHaveLength(0)
  })

  it('forgets the picking when the change is called off', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick(`.${classes.faceCancel}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(sent).toHaveLength(0)
    expect(pickedNames()).toEqual(['dashboard', 'web_layout'])
  })

  // The backend asks for the password in front of the change face; stay there until it takes the change
  it('stays on the picking face until the backend has taken the change', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    const letGo = holdNextWrite()
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)

    letGo()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
    })
  })

  it('stays on the picking face when the backend refuses the change', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    refuseNextWrite()
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)
  })

  it('names both faces in the words the backend was given, and the group with them', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceEyebrow}`)?.textContent).toBe('Preview')
    expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('What Content Reviewers may open')
    expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('2 of 3 menu modules allowed')
    expect(inPick(`.${classes.faceEyebrow}`)?.textContent).toBe('Assign')
    expect(inPick(`.${classes.faceSentence}`)?.textContent).toBe('Pick what Content Reviewers may open')
    expect(inPreview(`.${classes.faceCancel}`)?.textContent).toBe('Cancel')
  })

  it('says nothing at all when the backend hands over no words', async () => {
    menu()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceEyebrow}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceHint}`)?.textContent).toBe('')
    expect(inPreview('button')?.textContent).toBe('')
    expect(inPreview(`.${classes.allowedFrom}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceApply}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceCancel}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceEyebrow}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceSentence}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceApply}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-queued-note: ""')
  })

  it('says nothing about the group where the words name none', async () => {
    menu()
    TYPO3.lang = { 'allowModules.previewFor': 'The modules a group may open' }
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('The modules a group may open')
  })

  it('leaves the group nameless when the backend named none', async () => {
    menu()
    TYPO3.lang = { 'allowModules.previewFor': 'What %s may open' }
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('What  may open')
  })

  it('turns the card to our side once the backend has painted', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.panelCard}`)?.classList.contains(classes.panelCardTurned))
        .toBe(true)
    })
  })

  it('keeps the one card it built when the panel is painted again', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const card = document.querySelector(`.${classes.panelCard}`)

    selectGroup(7)
    await vi.waitFor(() => {
      expect(sent).toHaveLength(0)
    })

    expect(document.querySelectorAll(`.${classes.panelCard}`)).toHaveLength(1)
    expect(document.querySelector(`.${classes.panelCard}`)).toBe(card)
  })

  // Stopping a turn halfway; a repaint lands while a turn still runs
  it('leaves the sides where they stand when the panel is painted again', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const card = document.querySelector(`.${classes.panelCard}`)
    const stage = document.querySelector(`.${classes.allowed}`)
    const face = document.querySelector(`.${classes.facePreview}`)

    if (card === null || stage === null) {
      throw new Error('the panel was never painted')
    }

    const replaceStage = vi.spyOn(stage, 'replaceChildren')
    const appendStage = vi.spyOn(card, 'append')

    selectGroup(7)
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview}`)).not.toBe(face)
    })

    expect(replaceStage).not.toHaveBeenCalled()
    expect(appendStage).not.toHaveBeenCalled()
  })

  it('keeps the coin it turns when the panel is painted again', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const coin = document.querySelector(`.${classes.coin}`)
    const face = document.querySelector(`.${classes.facePreview}`)

    selectGroup(7)
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview}`)).not.toBe(face)
    })

    expect(document.querySelectorAll(`.${classes.coin}`)).toHaveLength(1)
    expect(document.querySelector(`.${classes.coin}`)).toBe(coin)
  })

  it('offers nothing to allow while nothing is picked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('offers the deed as soon as one module is picked', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="records"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(false)
  })

  it('offers nothing to allow again once the pick is taken back', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    const row = inPick('[data-modulemenu-identifier="records"]')
    row?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    row?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('stays on the picking face under another key', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPreview('button')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))

    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(true)
  })

  it('leaves a module the backend said nothing about off the faces', async () => {
    menu()
    const stranger = document.createElement('a')
    stranger.setAttribute('data-modulemenu-identifier', 'some_removed_module')
    document.querySelector('#modulemenu')?.append(stranger)
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('[data-modulemenu-identifier="some_removed_module"]')).toBeNull()
    expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('2 of 3 menu modules allowed')
  })

  it('says where an inherited module comes from, and nothing on what it allows itself', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview('[data-modulemenu-identifier="content_status"] .' + classes.allowedFrom)?.textContent)
      .toBe('from a subgroup')
    expect(inPreview('[data-modulemenu-identifier="web_layout"] .' + classes.allowedFrom)).toBeNull()
  })

  it('leaves a module that cannot be allowed for a group where it is while picking', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="site_configuration"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick('[data-modulemenu-identifier="site_configuration"]')?.getAttribute(attributes.verdict))
      .toBe('adminOnly')
  })

  it('leaves a module a subgroup allows where it is while picking', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()
    inPick('[data-modulemenu-identifier="content_status"]')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick('[data-modulemenu-identifier="content_status"]')?.getAttribute(attributes.verdict))
      .toBe('inherited')
  })

  it('leaves the rows a section holds under a nameless heading', async () => {
    const nav = document.createElement('nav')
    nav.id = 'modulemenu'
    const control = document.createElement('button')
    control.setAttribute('data-modulemenu-identifier', 'content')
    control.setAttribute('aria-controls', 'group-content')
    const list = document.createElement('ul')
    list.id = 'group-content'
    list.className = 'modulemenu-group-container'
    const action = document.createElement('a')
    action.setAttribute('data-modulemenu-identifier', 'web_layout')
    action.setAttribute('aria-current', 'page')
    list.append(action)
    nav.append(control, list)
    document.body.replaceChildren(nav)
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.allowedGroup}`)).toBeNull()
    expect(inPick(`.${classes.allowedGroup}`)?.textContent).toBe('')
    expect(inPreview('[data-modulemenu-identifier="web_layout"]')?.hasAttribute('aria-current')).toBe(false)
  })

  it('keeps a section that stands first under no heading at all', async () => {
    const nav = document.createElement('nav')
    nav.id = 'modulemenu'
    const list = document.createElement('ul')
    list.className = 'modulemenu-group-container'
    const action = document.createElement('a')
    action.setAttribute('data-modulemenu-identifier', 'web_layout')
    action.setAttribute('title', 'Page')
    list.append(action)
    nav.append(list)
    document.body.replaceChildren(nav)
    carrier()
    initialise(document, listening.signal)

    await armed()

    expect(inPreview(`.${classes.allowedGroup}`)).toBeNull()
  })

  it('offers its controls as buttons of their own', async () => {
    menu()
    carrier()
    initialise(document, listening.signal)

    await armed()

    const controls = [...document.querySelectorAll<HTMLButtonElement>(`.${classes.allowed} button`)]

    expect(controls).not.toHaveLength(0)
    controls.forEach(control => { expect(control.type).toBe('button') })
  })
})
