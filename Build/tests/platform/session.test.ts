import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import {
  activate, deactivate, getState, hideControls, pickArea, selectGroup, showControls, subscribe,
  turnTo,
} from '#src/platform/session.js'
import { prime, quiet, stored } from '../__mocks__/typo3-persistent-storage.js'

const written = quiet

describe('session', () => {
  beforeEach(async () => {
    localStorage.clear()
    hideControls()
    deactivate()
    pickArea('modules')
    selectGroup(null)
    // Call written() after the writes; it clears the settings this test checks
    await written()
    prime({})
  })

  // Without afterEach, failed tests leave module documents behind
  afterEach(() => {
    document.querySelectorAll('#typo3-contentIframe, typo3-backend-switch-user')
      .forEach(left => { left.remove() })
    // The session was handed over; the page that lands is a new one
    document.body.removeAttribute(attributes.handingOver)
  })

  // There is always an area to work in; a state with none is invalid
  it('starts in the leftmost area with nothing stored', async () => {
    prime({})

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().area).toBe('modules')
  })

  it('starts in the leftmost area when the settings name none', async () => {
    prime({ vperm: { session: { version: '1', active: 'false', groupId: '13', area: 'null' } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().area).toBe('modules')
  })

  it('remembers which area an admin picked to work in', () => {
    selectGroup(13)
    activate()

    pickArea('modules')

    expect(getState().area).toBe('modules')
  })

  // Which side is up belongs to the screen it is on, not to the settings
  it('turns to the other side and back without writing anything down', async () => {
    selectGroup(13)
    activate()
    await written()

    turnTo('pick')

    expect(getState().face).toBe('pick')

    turnTo('preview')

    expect(getState().face).toBe('preview')
    expect(stored()['vperm']).not.toHaveProperty('face')
  })

  it('comes back to the preview when another area is picked', () => {
    selectGroup(13)
    activate()
    turnTo('pick')

    pickArea('modules')

    expect(getState().face).toBe('preview')
  })

  it('comes back to the preview when another screen is loaded', () => {
    selectGroup(13)
    activate()
    turnTo('pick')

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(getState().face).toBe('preview')
  })

  it('refuses to show permissions while no group is selected', () => {
    activate()

    expect(getState().active).toBe(false)
    expect(getState().open).toBe(false)
  })

  it('keeps showing permissions when another group is picked', () => {
    selectGroup(13)
    activate()

    selectGroup(18)

    expect(getState().active).toBe(true)
  })

  it('stops showing permissions when the group is dropped', () => {
    selectGroup(13)
    activate()

    selectGroup(null)

    expect(getState().active).toBe(false)
  })

  it('writes nothing while the session is handed over', async () => {
    const exitButton = document.createElement('typo3-backend-switch-user')
    exitButton.setAttribute('mode', 'exit')
    document.body.append(exitButton)
    // Call reset() before written(); reset() does not cancel in-flight writes
    await written()
    prime({})

    selectGroup(13)
    activate()
    pickArea('fields')
    await written()

    expect(stored()).toStrictEqual({})
  })

  it('remembers the selected group across a page load', async () => {
    selectGroup(13)
    await written()

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().groupId).toBe(13)
  })

  it('remembers the picked area across a page load', async () => {
    selectGroup(13)
    activate()
    pickArea('pageMounts')
    await written()

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().area).toBe('pageMounts')
  })

  it('remembers the mode across a page load', async () => {
    selectGroup(13)
    activate()
    await written()

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().active).toBe(true)
    // The mode is remembered, the side is not: a page load opens on the preview
    expect(fresh.getState().face).toBe('preview')
  })

  it('remembers that the controls were shown across a page load', async () => {
    showControls()
    await written()

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().open).toBe(true)
  })

  // Taking controls away strands a coloured backend with nothing to switch off
  it('switches the mode off when the controls are taken away', () => {
    selectGroup(13)
    showControls()
    activate()

    hideControls()

    expect(getState().open).toBe(false)
    expect(getState().active).toBe(false)
  })

  // The controls are the only way back from the mode; no other exit path
  it('brings the controls up when the mode goes on without them', () => {
    selectGroup(13)

    activate()

    expect(getState().open).toBe(true)
  })

  it('starts with the mode off', async () => {
    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().active).toBe(false)
  })

  it('starts with the controls away when nothing is stored', async () => {
    prime({})

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().open).toBe(false)
  })

  it('leaves the mode off when the stored session says it was off', async () => {
    prime({ vperm: { session: { version: '1', open: 'true', active: 'false', groupId: '13', area: 'modules' } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().active).toBe(false)
  })

  it('refuses to show permissions for a stored group of none', async () => {
    prime({ vperm: { session: { version: '1', open: 'true', active: 'false', groupId: '0', area: 'modules' } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')
    fresh.activate()

    expect(fresh.getState().active).toBe(false)
  })

  it('starts with the controls away when the stored session is of an older make', async () => {
    prime({ vperm: { session: { version: '0', open: 'true', active: 'true', groupId: '13', area: 'modules' } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().open).toBe(false)
    expect(fresh.getState().face).toBe('preview')
  })

  it('starts with the controls away when the stored session says they were', async () => {
    prime({ vperm: { session: { version: '1', open: 'false', active: 'false', groupId: '13', area: 'modules' } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().open).toBe(false)
  })

  it('starts in the leftmost area when the stored area is no word at all', async () => {
    prime({ vperm: { session: { version: '1', open: 'true', active: 'false', groupId: '13', area: 7 } } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().area).toBe('modules')
  })

  it('lands on the screen the admin is standing on when the mode goes on', () => {
    selectGroup(13)
    pickArea('other')
    deactivate()

    activate()

    expect(getState().area).toBe('fields')
  })

  it('turns the mode on', () => {
    selectGroup(13)
    activate()

    expect(getState().active).toBe(true)
  })

  it('turns the mode off again', () => {
    selectGroup(13)
    activate()
    deactivate()

    expect(getState().active).toBe(false)
  })

  it('keeps the area an admin was in when the mode goes off', () => {
    selectGroup(13)
    activate()
    pickArea('modules')

    deactivate()

    expect(getState().area).toBe('modules')
  })

  it('keeps the picked area while the module on screen stays the same', async () => {
    const router = document.createElement('typo3-backend-module-router')
    router.setAttribute('module', 'web_layout')
    document.body.append(router)

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')
    fresh.selectGroup(13)
    fresh.activate()
    fresh.pickArea('modules')

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(fresh.getState().area).toBe('modules')

    router.remove()
  })

  it('keeps the picked area when another module is loaded', async () => {
    const router = document.createElement('typo3-backend-module-router')
    router.setAttribute('module', 'web_layout')
    document.body.append(router)

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')
    fresh.selectGroup(13)
    fresh.activate()
    fresh.pickArea('modules')

    router.setAttribute('module', 'records')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(fresh.getState().area).toBe('modules')

    router.remove()
  })

  it('leaves what another page of the same user stored alone when a module is loaded', async () => {
    prime({ vperm: { session: { version: '1', active: 'false', groupId: '13', area: 'modules' } } })

    vi.resetModules()
    await import('#src/platform/session.js')
    await written()

    prime({ vperm: { session: { version: '1', active: 'true', groupId: '13', area: 'pageMounts' } } })

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    await written()

    expect(stored()).toStrictEqual({
      vperm: { session: { version: '1', active: 'true', groupId: '13', area: 'pageMounts' } },
    })
  })

  it('stores the mode in the backend user settings', async () => {
    selectGroup(13)
    activate()
    pickArea('modules')

    await vi.waitFor(() => {
      expect(stored()).toEqual({
        vperm: {
          session: { version: '1', open: 'true', active: 'true', groupId: '13', area: 'modules' },
        },
      })
    })
  })

  it.each([
    ['settings from another version', { version: '99', active: 'true' }],
    ['settings that are not an object', 'active'],
    ['settings that are null', null],
  ])('starts with the mode off and on the preview after %s', async (_case, held) => {
    prime({ vperm: { session: held } })

    vi.resetModules()
    const fresh = await import('#src/platform/session.js')

    expect(fresh.getState().active).toBe(false)
    expect(fresh.getState().face).toBe('preview')
  })

  it('keeps a subscriber that passes no signal', () => {
    selectGroup(13)
    const seen: boolean[] = []
    subscribe(state => seen.push(state.active))

    activate()

    expect(seen).toEqual([true])
  })

  it('tells subscribers what the state became', () => {
    selectGroup(13)
    const seen: boolean[] = []
    const listening = new AbortController()
    subscribe(state => seen.push(state.active), listening.signal)

    activate()
    deactivate()
    listening.abort()
    activate()

    expect(seen).toEqual([true, false])
  })
})
