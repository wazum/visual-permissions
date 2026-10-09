import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { initialise } from '#src/platform/body.js'
import { activate, deactivate, hideControls, pickArea, selectGroup } from '#src/platform/session.js'
import { prime, quiet } from '../__mocks__/typo3-persistent-storage.js'

const moduleDocument = (): Document | null => {
  const frame = document.createElement('iframe')
  frame.id = 'typo3-contentIframe'
  document.body.append(frame)

  return frame.contentDocument
}

describe('the body the mode is painted on', () => {
  let listening: AbortController

  beforeEach(async () => {
    localStorage.clear()
    hideControls()
    deactivate()
    pickArea('modules')
    selectGroup(null)
    await quiet()
    prime({})
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    document.querySelectorAll('#typo3-contentIframe').forEach(left => { left.remove() })
  })

  it('marks both documents with the area that is picked', () => {
    const inner = moduleDocument()
    initialise(listening.signal)

    selectGroup(13)
    activate()
    pickArea('modules')

    expect(document.body.getAttribute(attributes.picked)).toBe('modules')
    expect(inner?.body.getAttribute(attributes.picked)).toBe('modules')

    pickArea('fields')

    expect(document.body.getAttribute(attributes.picked)).toBe('fields')
    expect(inner?.body.getAttribute(attributes.picked)).toBe('fields')
  })

  it('takes the mark off both documents when the permissions are hidden', () => {
    const inner = moduleDocument()
    initialise(listening.signal)

    selectGroup(13)
    activate()
    pickArea('modules')
    deactivate()

    expect(document.body.hasAttribute(attributes.picked)).toBe(false)
    expect(inner?.body.hasAttribute(attributes.picked)).toBe(false)
  })

  // Every area opens on the side that shows what the group has, as the panels do
  it('marks both documents with the side that is up, and opens on the preview', () => {
    const inner = moduleDocument()
    initialise(listening.signal)

    selectGroup(13)
    activate()

    expect(document.body.getAttribute(attributes.face)).toBe('preview')
    expect(inner?.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('takes the side off both documents when the permissions are hidden', () => {
    const inner = moduleDocument()
    initialise(listening.signal)

    selectGroup(13)
    activate()
    deactivate()

    expect(document.body.hasAttribute(attributes.face)).toBe(false)
    expect(inner?.body.hasAttribute(attributes.face)).toBe(false)
  })

  it('marks the document while the mode is on', () => {
    initialise(listening.signal)

    selectGroup(13)
    activate()
    expect(document.body.getAttribute(attributes.active)).toBe('')

    deactivate()
    expect(document.body.hasAttribute(attributes.active)).toBe(false)
  })

  it('marks the module document too, where the same stylesheet is loaded', () => {
    const inner = moduleDocument()
    initialise(listening.signal)

    selectGroup(13)
    activate()
    expect(inner?.body.getAttribute(attributes.active)).toBe('')

    deactivate()
    expect(inner?.body.hasAttribute(attributes.active)).toBe(false)
  })

  it('marks the next module document that is loaded', async () => {
    vi.resetModules()
    const fresh = await import('#src/platform/session.js')
    const body = await import('#src/platform/body.js')
    body.initialise(listening.signal)
    fresh.selectGroup(13)
    fresh.activate()

    const inner = moduleDocument()
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(inner?.body.getAttribute(attributes.active)).toBe('')
  })

  // A page load brings the module with it, and the module may have landed first
  it('marks a module that was already standing when the page came back', async () => {
    prime({ vperm: { session: { version: '1', open: 'true', active: 'true', groupId: '13', area: 'fields' } } })
    const inner = moduleDocument()

    vi.resetModules()
    const body = await import('#src/platform/body.js')
    body.initialise(listening.signal)

    expect(inner?.body.hasAttribute(attributes.active)).toBe(true)
    expect(inner?.body.getAttribute(attributes.picked)).toBe('fields')
  })

  // The frame stands in the page before the module it will hold has been asked for
  it('lets the backend start beside a module frame that holds no page yet', () => {
    const inner = moduleDocument()
    inner?.documentElement.remove()

    expect(() => { initialise(listening.signal) }).not.toThrow()
  })

  it('marks the page still when the installation wants no animation', () => {
    const inner = moduleDocument()
    initialise(listening.signal)
    pickArea('fields')

    expect(document.body.hasAttribute(attributes.still)).toBe(false)

    TYPO3.settings.visualPermissions = { animation: false }
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(document.body.hasAttribute(attributes.still)).toBe(true)
    expect(inner?.body.hasAttribute(attributes.still)).toBe(true)

    delete TYPO3.settings.visualPermissions
  })

  it('lets the page move when the backend sends no settings of ours', () => {
    const held = { ...TYPO3.settings.visualPermissions }
    delete TYPO3.settings.visualPermissions

    initialise(listening.signal)
    TYPO3.settings.visualPermissions = held

    expect(document.body.hasAttribute(attributes.still)).toBe(false)
  })
})
