import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { reply } from '../__mocks__/typo3-ajax-request.js'
import { prime } from '../__mocks__/typo3-persistent-storage.js'

describe('the module panel on arrival', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    prime({ vperm: { session: { version: 1, active: true, groupId: 7, area: 'modules' } } })
    listening = new AbortController()
    document.body.replaceChildren()

    const nav = document.createElement('nav')
    nav.id = 'modulemenu'
    const action = document.createElement('a')
    action.setAttribute('data-modulemenu-identifier', 'web_layout')
    action.setAttribute('title', 'Page')
    nav.append(action)

    const hidden = document.createElement('span')
    hidden.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Content Reviewers', inherits: [] } }))
    TYPO3.lang = { 'platform.preview': 'Preview' }

    document.body.append(nav, hidden)

    reply({
      group: { id: 7, title: 'Content Reviewers' },
      chain: [],
      scopes: { fields: { targets: {} }, modules: { targets: { web_layout: 'allowed' } } },
    })
  })

  afterEach(() => {
    listening.abort()
  })

  it('opens on the face that shows what the group has', async () => {
    const { initialise } = await import('#src/grant-modules/modules.js')

    initialise(document, listening.signal)

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.coin}`)).not.toBeNull()
    })
    expect(document.querySelector(`.${classes.coin}`)?.classList.contains(classes.coinTurned)).toBe(false)
  })
})
