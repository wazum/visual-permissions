import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { activate, deactivate, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/landing.js'
import { current, forget, shown, setCurrentModule } from '../__mocks__/typo3-module-menu.js'
import { asked, forget as forgetAsks, reply } from '../__mocks__/typo3-ajax-request.js'
import { prime, quiet, stored } from '../__mocks__/typo3-persistent-storage.js'
import { openedByUs } from '#src/pick-an-area/modules.js'

const menu = (...modules: string[]): void => {
  const panel = document.createElement('div')
  panel.id = 'modulemenu'
  const list = document.createElement('ul')

  modules.forEach(module => {
    const item = document.createElement('li')
    const row = document.createElement('a')
    row.className = 'modulemenu-action'
    row.setAttribute('data-modulemenu-identifier', module)
    item.append(row)
    list.append(item)
  })

  panel.append(list)
  document.body.append(panel)
}

const grouped = (name: string, ...modules: string[]): void => {
  const group = document.createElement('li')
  group.className = 'modulemenu-group'
  const heading = document.createElement('a')
  heading.setAttribute('data-modulemenu-identifier', name)
  heading.setAttribute('aria-controls', `${name}-container`)
  const container = document.createElement('ul')
  container.className = 'modulemenu-group-container'

  modules.forEach(module => {
    const item = document.createElement('li')
    const row = document.createElement('a')
    row.setAttribute('data-modulemenu-identifier', module)
    item.append(row)
    container.append(item)
  })

  group.append(heading, container)
  document.querySelector('#modulemenu ul')?.append(group)
}

const groupOf = (name: string): HTMLElement | null =>
  document.querySelector<HTMLElement>(`[data-modulemenu-identifier="${name}"]`)?.closest('.modulemenu-group') ?? null

const shell = (module: string): void => {
  const router = document.createElement('typo3-backend-module-router')
  router.setAttribute('module', module)
  router.setAttribute('endpoint', '/typo3/module/web/layout?token=fresh&id=63')
  document.body.append(router)
}

const formOn = (url: string): Document => ({
  location: new URL(url),
  querySelector: (name: string): Element | null => document.querySelector(name),
  querySelectorAll: (name: string): NodeListOf<Element> => document.querySelectorAll(name),
  addEventListener: document.addEventListener.bind(document),
} as unknown as Document)

const visibleModules =(): string[] =>
  [...document.querySelectorAll<HTMLElement>('#modulemenu [data-modulemenu-identifier]')]
    .filter(row => row.parentElement?.hidden !== true)
    .map(row => row.getAttribute('data-modulemenu-identifier') ?? '')

describe('the modules a session of ours keeps to', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    prime({})
    forget()
    forgetAsks()
    deactivate()
    pickArea('pageMounts')
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('opens a module that shows permissions when this one shows none', () => {
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()

    expect(shown()).toStrictEqual(['web_layout'])
  })

  // The fields are read on the record itself, and a screen left under the record's feet takes
  // with it whatever the form had started to ask core
  it('stays on the record the mode was switched on over', () => {
    shell('record_edit')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)

    activate()

    expect(shown()).toStrictEqual([])
  })

  it('stays on the form of a new record', () => {
    shell('record_edit')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B5%5D=new'), listening.signal)

    activate()

    expect(shown()).toStrictEqual([])
  })

  // Core stands a record opened from a module in that module, with its tree beside it
  it('stands the record the mode was switched on over in a module that shows permissions', () => {
    shell('record_edit')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)

    activate()

    expect(current()).toBe('web_layout')
  })

  // The mode was left on in the page mounts, and a record is opened by its own URL
  it('opens a record opened on its own inside a module while another area is worked in', async () => {
    shell('record_edit')
    reply({ url: '/typo3/record/edit?token=fresh&edit%5Btt_content%5D%5B82%5D=edit' })
    activate()
    pickArea('pageMounts')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)
    turnTo('preview')

    expect(shown()).toStrictEqual(['web_layout'])

    await vi.waitFor(() => {
      document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))

      expect(document.querySelector('typo3-backend-module-router')?.getAttribute('endpoint'))
        .toContain('/typo3/record/edit?token=fresh')
    })
  })

  it('opens a module that shows permissions each time the mode goes on', () => {
    setCurrentModule('web_layout')
    initialise(document, listening.signal)
    activate()
    deactivate()
    forget()
    setCurrentModule('system_config')

    activate()

    expect(shown()).toStrictEqual(['web_layout'])
  })

  it('leaves the admin in a module of core opened while the permissions are on', () => {
    setCurrentModule('web_layout')
    initialise(document, listening.signal)
    activate()
    forget()

    setCurrentModule('help_AboutAbout')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'help_AboutAbout' } }))

    expect(shown()).toStrictEqual([])
  })

  it('opens no module when this one shows permissions already', () => {
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(shown()).toStrictEqual([])
  })

  it('asks for no record when the screen the admin leaves holds none', async () => {
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    await quiet()

    expect(asked).toStrictEqual([])
  })

  it('puts the record back into the first module to land, and no other', async () => {
    shell('record_edit')
    reply({ url: '/typo3/record/edit?token=fresh&edit%5Btt_content%5D%5B82%5D=edit' })
    activate()
    pickArea('pageMounts')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)
    turnTo('preview')
    // Call setAttribute('module', 'w'); without it, the screen hangs on the shell module
    document.querySelector('typo3-backend-module-router')?.setAttribute('module', 'web_layout')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await quiet()

    await vi.waitFor(() => {
      expect(asked.filter(url => url.includes('open_document'))).toHaveLength(1)
    })
  })

  it('asks for the record with the URL of the module that landed', async () => {
    shell('record_edit')
    reply({ url: '/typo3/record/edit?token=fresh&edit%5Btt_content%5D%5B82%5D=edit' })
    activate()
    pickArea('pageMounts')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)
    turnTo('preview')
    document.querySelector('typo3-backend-module-router')?.setAttribute('module', 'web_layout')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))

    await vi.waitFor(() => {
      expect(asked.find(url => url.includes('open_document')))
        .toContain('returnUrl=%2Ftypo3%2Fmodule%2Fweb%2Flayout%3Ftoken%3Dfresh%26id%3D63')
    })
  })

  it('leaves the module standing when core names no URL for the record', async () => {
    shell('record_edit')
    reply({ url: '' })
    activate()
    pickArea('pageMounts')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)
    turnTo('preview')
    document.querySelector('typo3-backend-module-router')?.setAttribute('module', 'web_layout')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))
    await vi.waitFor(() => { expect(asked.find(url => url.includes('open_document'))).toBeDefined() })
    await new Promise(resolve => { setTimeout(resolve) })

    expect(document.querySelector('typo3-backend-module-router')?.getAttribute('endpoint'))
      .toBe('/typo3/module/web/layout?token=fresh&id=63')
  })

  it('asks for the record with no way back on a page that carries no shell', async () => {
    reply({ url: '/typo3/record/edit?token=fresh' })
    activate()
    pickArea('pageMounts')
    initialise(formOn('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%5D=edit'), listening.signal)
    turnTo('preview')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'web_layout' } }))

    await vi.waitFor(() => {
      expect(asked.find(url => url.includes('open_document'))).toMatch(/&returnUrl=$/)
    })
  })

  it('lands the admin in a module of our own asking', () => {
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()

    expect(openedByUs('web_layout')).toBe(true)
  })

  it('opens the module the permissions were last worked in', () => {
    prime({ vperm: { module: 'media_management' } })
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()

    expect(shown()).toStrictEqual(['media_management'])
  })

  // The menu is the one way into a module that shows no permissions
  it('folds away the modules that show no permissions', () => {
    menu('web_layout', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(visibleModules()).toStrictEqual(['web_layout'])
  })

  it('keeps the page permissions module standing', () => {
    menu('permissions_pages', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(visibleModules()).toStrictEqual(['permissions_pages'])
  })

  it('keeps the list of records standing', () => {
    menu('records', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(visibleModules()).toStrictEqual(['records'])
  })

  it('leaves a group standing while one of its modules still shows permissions', () => {
    menu()
    grouped('web', 'web_layout', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(groupOf('web')?.hidden).toBe(false)
  })

  // The note is where to come back to when the permissions go back on.
  it('notes no module the admin moves to while the permissions are hidden', async () => {
    await quiet()
    prime({})
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await quiet()

    expect((stored()['vperm'] as { module?: string } | undefined)?.module).toBeUndefined()
  })

  it('notes nothing when the module that landed is not named', async () => {
    await quiet()
    prime({})
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: {} }))
    await quiet()

    expect((stored()['vperm'] as { module?: string } | undefined)?.module).toBeUndefined()
  })

  it('notes no module that shows no permissions', async () => {
    await quiet()
    prime({})
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'system_config' } }))
    await quiet()

    expect((stored()['vperm'] as { module?: string } | undefined)?.module).toBeUndefined()
  })

  it('notes no module once the page lets go', async () => {
    await quiet()
    prime({})
    setCurrentModule('web_layout')
    initialise(document, listening.signal)
    activate()

    listening.abort()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await quiet()

    expect((stored()['vperm'] as { module?: string } | undefined)?.module).toBeUndefined()
  })

  it('lands in the first module of ours when what was noted is no word at all', () => {
    prime({ vperm: { module: 7 } })
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()

    expect(shown()).toStrictEqual(['web_layout'])
  })

  it('lands in the first module of ours when the noted one shows no permissions', () => {
    prime({ vperm: { module: 'system_config' } })
    setCurrentModule('system_config')
    initialise(document, listening.signal)

    activate()

    expect(shown()).toStrictEqual(['web_layout'])
  })

  it('folds away a group with no module left standing in it', () => {
    menu('web_layout')
    grouped('system', 'system_config', 'backend_user_management')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(groupOf('system')?.hidden).toBe(true)
  })

  // Domain rule: folded row in panel is a grant that nobody can give away
  it('lists every module again while the modules are the scope being worked in', () => {
    menu('web_layout', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    expect(visibleModules()).toStrictEqual(['web_layout', 'system_config'])
  })

  it('notes the module the admin moves to while the permissions are on', async () => {
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded', { detail: { module: 'records' } }))
    await quiet()

    expect((stored()['vperm'] as { module: string }).module).toBe('records')
  })
})
