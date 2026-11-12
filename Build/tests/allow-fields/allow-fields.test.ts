import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { deactivate, selectGroup } from '#src/platform/session.js'
import { initialise as paintBody } from '#src/platform/body.js'
import { initialise } from '#src/allow-fields/allow-fields.js'
import { pickFieldsToGive } from '../platform/session-fixture.js'
import { drawForm, row } from './form-fixture.js'
import { forget, reply } from '../__mocks__/typo3-ajax-request.js'

describe('the fields a group is allowed', () => {
  let listening: AbortController

  beforeEach(() => {
    TYPO3.lang = {
      'allowFields.tally.many': 'The group may edit %1$s of %2$s fields',
      'allowFields.waiting.one': '%s field waiting to be allowed',
      'platform.cancel': 'Cancel',
      'platform.doAllow': 'Allow',
    }
    forget()
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    paintBody(listening.signal)
    document.body.replaceChildren()
    reply({
      group: { id: 7, title: 'Editors' },
      chain: [],
      scopes: {
        fields: { targets: { 'tt_content:layout': 'denied', 'tt_content:bodytext': 'denied' } },
        tablesModify: { targets: { tt_content: 'allowed' } },
      },
    })
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('counts a picked field in the foot', async () => {
    initialise(listening.signal)
    drawForm(row('tt_content:layout', 'denied'), row('tt_content:bodytext', 'denied'))

    pickFieldsToGive()
    const field = document.querySelector(`[${attributes.token}='tt_content:layout']`)
    await vi.waitFor(() => { expect(field?.getAttribute(attributes.verdict)).toBe('denied') })

    field?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(document.querySelector(`.${classes.faceWaiting}`)?.textContent).toBe('1 field waiting to be allowed')
  })
})
