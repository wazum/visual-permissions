import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { keep } from '#src/platform/persistence.js'
import { handOverSession } from '#src/platform/shell.js'
import { prime, quiet, refuseNextSet, stored } from '../__mocks__/typo3-persistent-storage.js'

const written = quiet

describe('persistence', () => {
  beforeEach(async () => {
    localStorage.clear()
    await written()
    prime({})
  })

  afterEach(() => {
    // The session was handed over; the page that lands is a new one
    document.body.removeAttribute(attributes.handingOver)
  })

  it('keeps both of two writes asked for in the same breath', async () => {
    void keep('vperm.userSearch', 'huber')
    void keep('vperm.groupSearch', 'editors')

    await written()

    expect(stored()).toStrictEqual({ vperm: { userSearch: 'huber', groupSearch: 'editors' } })
  })

  it('keeps a write asked for after one the backend refused', async () => {
    refuseNextSet()
    keep('vperm.userSearch', 'huber').catch(() => undefined)
    void keep('vperm.groupSearch', 'editors')

    await written()

    expect(stored()).toStrictEqual({ vperm: { groupSearch: 'editors' } })
  })

  // Writes leave one at a time, so one asked for while it was ours can leave after it is not
  it('drops a write of ours that was still waiting when the session was handed over', async () => {
    void keep('vperm.userSearch', 'huber')
    handOverSession(document)

    await written()

    expect(stored()).toStrictEqual({})
  })

  it('writes nothing while the session is handed over', async () => {
    const exitButton = document.createElement('typo3-backend-switch-user')
    exitButton.setAttribute('mode', 'exit')
    document.body.append(exitButton)

    void keep('vperm.userSearch', 'huber')
    await written()
    exitButton.remove()

    expect(stored()).toStrictEqual({})
  })
})
