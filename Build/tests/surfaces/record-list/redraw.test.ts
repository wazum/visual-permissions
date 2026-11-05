import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-list/redraw.js'
import { forget as forgetModules, setCurrentModule } from '../../__mocks__/typo3-module-menu.js'
import Viewport from '@typo3/backend/viewport.js'
import { prime, quiet, stored } from '../../__mocks__/typo3-persistent-storage.js'
import { forget, refreshed } from '../../__mocks__/typo3-viewport.js'

// A record opened from the list stands in the list's module, in a form of its own
const recordForm = (): void => {
  const frame = document.createElement('iframe')
  frame.id = 'typo3-contentIframe'
  document.body.replaceChildren(frame)
  const form = document.createElement('form')
  form.setAttribute('name', 'editform')
  frame.contentDocument?.body.append(form)
}

describe('the list of records that stands open', () => {
  let listening: AbortController

  beforeEach(async () => {
    await quiet()
    prime({})
    forget()
    forgetModules()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('is drawn again once the permissions are shown', async () => {
    setCurrentModule('records')
    initialise(document, listening.signal)

    activate()
    await quiet()

    expect(refreshed()).toBe(1)
  })

  it('is drawn from the setting the server already holds', async () => {
    const heldWhenDrawn: unknown[] = []
    const draw = Viewport.ContentContainer.refresh.bind(Viewport.ContentContainer)
    Viewport.ContentContainer.refresh = () => {
      heldWhenDrawn.push((stored()['vperm'] as { session?: { active?: unknown } } | undefined)?.session?.active)
      draw()
    }
    setCurrentModule('records')
    initialise(document, listening.signal)

    activate()
    await quiet()
    Viewport.ContentContainer.refresh = draw

    expect(heldWhenDrawn).toStrictEqual(['true'])
  })

  it('is drawn again once the permissions are hidden', async () => {
    setCurrentModule('records')
    initialise(document, listening.signal)
    activate()
    await quiet()

    deactivate()
    await quiet()

    expect(refreshed()).toBe(2)
  })

  it('stands as it is when another area is picked', async () => {
    setCurrentModule('records')
    initialise(document, listening.signal)
    activate()
    await quiet()

    pickArea('modules')
    await quiet()

    expect(refreshed()).toBe(1)
  })

  it('stands as it is once the page lets go', async () => {
    setCurrentModule('records')
    initialise(document, listening.signal)
    listening.abort()

    activate()
    await quiet()

    expect(refreshed()).toBe(0)
  })

  it('leaves a record opened from it standing', async () => {
    setCurrentModule('records')
    recordForm()
    initialise(document, listening.signal)

    activate()
    await quiet()

    expect(refreshed()).toBe(0)
  })

  it('leaves a record standing that opened while the setting was on its way', async () => {
    setCurrentModule('records')
    initialise(document, listening.signal)

    activate()
    recordForm()
    await quiet()

    expect(refreshed()).toBe(0)
  })

  it('leaves any other module as it stands', async () => {
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()
    await quiet()

    expect(refreshed()).toBe(0)
  })
})
