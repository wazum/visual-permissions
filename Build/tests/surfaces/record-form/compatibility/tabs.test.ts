import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { initialise } from '#src/surfaces/record-form/compatibility/tabs.js'

const formArrives = (): void => { formReady({ doc: document, fields: [] }) }

describe('the control that opens a tab', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => { listening.abort() })

  it('carries the name 14.3 gives it when 13.4 drew the form', () => {
    initialise(listening.signal)
    document.body.innerHTML = `
      <button class="nav-link" data-bs-toggle="tab" data-bs-target="#general">General</button>`

    formArrives()

    expect(document.querySelector('.nav-link')?.getAttribute('data-typo3-tab')).toBe('#general')
  })
})
