import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-list/redraw.js'
import { forget as forgetModules, setCurrentModule } from '../../../__mocks__/typo3-module-menu.js'
import { prime, quiet } from '../../../__mocks__/typo3-persistent-storage.js'
import { forget, refreshed } from '../../../__mocks__/typo3-viewport.js'

describe('the list of records 13.4 names differently', () => {
  let listening: AbortController

  beforeEach(async () => {
    await quiet()
    prime({})
    forget()
    forgetModules()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('is drawn again once the permissions are shown', async () => {
    setCurrentModule('web_list')
    initialise(document, listening.signal)

    activate()
    await quiet()

    expect(refreshed()).toBe(1)
  })
})
