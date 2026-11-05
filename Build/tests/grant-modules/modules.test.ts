import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/grant-modules/modules.js'
import { asked, holdNextRead, refuseNextRead, reply, sent } from '../__mocks__/typo3-ajax-request.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'
import { prime } from '../__mocks__/typo3-persistent-storage.js'

const menu = (...identifiers: string[]): void => {
  const nav = document.createElement('nav')
  nav.id = 'modulemenu'
  identifiers.forEach(identifier => {
    const action = document.createElement('a')
    action.setAttribute('data-modulemenu-identifier', identifier)
    action.setAttribute('title', identifier === 'web_layout' ? 'Page' : identifier)
    nav.append(action)
  })
  document.body.replaceChildren(nav)
}

const inPreview = (identifier: string): Element | null =>
  document.querySelector(`.${classes.facePreview} [data-modulemenu-identifier="${identifier}"]`)

const grantedNames =(): (string | null)[] =>
  [...document.querySelectorAll(`.${classes.facePreview} [data-modulemenu-identifier]`)]
    .map(row => row.getAttribute('data-modulemenu-identifier'))

const verdictOf = (identifier: string): string | null =>
  document.querySelector(`[data-modulemenu-identifier="${identifier}"]`)?.getAttribute(attributes.verdict) ?? null

describe('the modules scope', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forgetNotices()
    deactivate()
    selectGroup(7)
    asked.length = 0
    sent.length = 0
    listening = new AbortController()
    document.body.replaceChildren()
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: {} },
        modules: { targets: { web_layout: 'allowed', records: 'denied', site_configuration: 'adminOnly' } },
      },
    })
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('marks no module and paints no panel when the permissions cannot be read', async () => {
    menu('web_layout', 'records', 'site_configuration')
    TYPO3.lang = { 'platform.notRead': 'Not read' }
    initialise(document, listening.signal)
    refuseNextRead()

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: 'Not read', message: undefined }])
    })
    expect(verdictOf('web_layout')).toBeNull()
    expect(document.querySelector(`.${classes.panelCard}`)).toBeNull()
  })

  it('asks nothing when a stored session says on but names no group', async () => {
    prime({ vperm: { session: { version: '1', active: 'true', groupId: 'null', area: 'modules' } } })
    vi.resetModules()

    const fresh = await import('#src/grant-modules/modules.js')
    menu('web_layout')
    fresh.initialise(document, listening.signal)
    await Promise.resolve()

    expect(asked).toStrictEqual([])
    expect(verdictOf('web_layout')).toBeNull()
  })

  it('shows the group its own module menu while permissions are shown', async () => {
    menu('web_layout', 'records', 'site_configuration')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(grantedNames()).toEqual(['web_layout'])
    })
    await vi.waitFor(() => {
      expect(document.querySelector('#modulemenu')?.hasAttribute('inert')).toBe(true)
    })
  })

  // Painting a late answer would show another group's grants under the wrong name
  it('leaves the rows alone when an answer older than the newest arrives last', async () => {
    menu('web_layout', 'records', 'site_configuration')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(verdictOf('records')).toBe('denied')
    })

    reply({
      group: { id: 8, title: 'Reviewers' },
      chain: [],
      scopes: { fields: { targets: {} }, modules: { targets: { records: 'allowed' } } },
    })
    const releaseOlder = holdNextRead()
    selectGroup(8)

    reply({
      group: { id: 9, title: 'Authors' },
      chain: [],
      scopes: { fields: { targets: {} }, modules: { targets: { records: 'adminOnly' } } },
    })
    selectGroup(9)
    await vi.waitFor(() => {
      expect(verdictOf('records')).toBe('adminOnly')
    })

    releaseOlder()
    await new Promise(settled => { window.setTimeout(settled, 20) })

    expect(verdictOf('records')).toBe('adminOnly')
  })

  it('keeps the panel that was armed again while the last one was still going', async () => {
    menu('web_layout', 'records')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.granted}`)).not.toBeNull()
    })

    deactivate()
    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.granted}`)).not.toBeNull()
    })

    await new Promise(settled => { window.setTimeout(settled, 300) })

    expect(document.querySelector(`.${classes.granted}`)).not.toBeNull()
    expect(document.querySelector('#modulemenu')).not.toBeNull()
  })

  it('hands the backend its own menu back when permissions are hidden', async () => {
    menu('web_layout', 'records')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(grantedNames()).toEqual(['web_layout'])
    })

    deactivate()

    expect(document.querySelector('#modulemenu')?.hasAttribute('inert')).toBe(false)
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.granted}`)).toBeNull()
    })
  })

  it('leaves the rows alone when the answer arrives after permissions were hidden', async () => {
    menu('web_layout')
    initialise(document, listening.signal)
    const letGo = holdNextRead()

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })
    deactivate()
    letGo()
    await new Promise(settled => { window.setTimeout(settled, 20) })

    expect(verdictOf('web_layout')).toBeNull()
  })

  it('says what the group may do with every module in the menu', async () => {
    menu('web_layout', 'site_configuration')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(verdictOf('web_layout')).toBe('allowed')
      expect(verdictOf('site_configuration')).toBe('adminOnly')
    })
  })

  it('takes the verdicts away when permissions are hidden', async () => {
    menu('web_layout')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(verdictOf('web_layout')).toBe('allowed')
    })

    deactivate()

    await vi.waitFor(() => {
      expect(verdictOf('web_layout')).toBeNull()
    })
  })

  it('says nothing about the control that opens a group of modules', async () => {
    menu('web_layout')
    const container = document.createElement('button')
    container.setAttribute('data-modulemenu-identifier', 'site_configuration')
    container.setAttribute('aria-controls', 'group-site')
    document.querySelector('#modulemenu')?.append(container)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(verdictOf('web_layout')).toBe('allowed')
    })
    expect(container.getAttribute(attributes.verdict)).toBeNull()
  })

  it('says nothing about a module named outside the menu', async () => {
    menu('site_configuration')
    const elsewhere = document.createElement('a')
    elsewhere.setAttribute('data-modulemenu-identifier', 'web_layout')
    document.body.append(elsewhere)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(verdictOf('site_configuration')).toBe('adminOnly')
    })
    expect(elsewhere.getAttribute(attributes.verdict)).toBeNull()
  })

  it('asks nothing when the backend shows no module menu', async () => {
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(asked).toStrictEqual([])
    })
  })

  it('asks nothing when the menu holds no module of its own', async () => {
    menu()
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(asked).toStrictEqual([])
    })
  })

  it('leaves a module the backend says nothing about alone', async () => {
    menu('web_layout', 'some_removed_module')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(verdictOf('web_layout')).toBe('allowed')
    })
    expect(verdictOf('some_removed_module')).toBeNull()
  })

  it('reads the truth again once the panel has applied a change', async () => {
    menu('web_layout', 'records')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    await vi.waitFor(() => {
      expect(inPreview('web_layout')).not.toBeNull()
    })
    const read = asked.length

    document.querySelector(`.${classes.facePreview} [data-modulemenu-identifier="web_layout"]`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector(`.${classes.facePreview} .${classes.faceApply}`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await vi.waitFor(() => {
      expect(asked.length).toBe(read + 1)
    })
  })
})
