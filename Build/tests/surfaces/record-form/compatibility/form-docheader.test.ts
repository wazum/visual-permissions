import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { initialise } from '#src/surfaces/record-form/compatibility/form-docheader.js'

const formArrives = (): void => { formReady({ doc: document, fields: [] }) }

describe('the header of a form 13.4 drew', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    document.body.innerHTML = `
      <div class="module-docheader">
        <div class="module-docheader-bar module-docheader-bar-navigation">
          <div class="module-docheader-bar-column-left"></div>
          <div class="module-docheader-bar-column-right"></div>
        </div>
        <div class="module-docheader-bar module-docheader-bar-buttons">
          <div class="module-docheader-bar-column-left"><div class="btn-toolbar"></div></div>
        </div>
      </div>`
  })

  afterEach(() => { listening.abort() })

  it('names its rows and the column the page path stands in the way 14.3 does', () => {
    initialise(listening.signal)

    formArrives()

    expect(document.querySelector('.module-docheader-navigation > .module-docheader-column-breadcrumb'))
      .toBe(document.querySelector('.module-docheader-bar-navigation > .module-docheader-bar-column-left'))
    expect(document.querySelector('.module-docheader-buttons'))
      .toBe(document.querySelector('.module-docheader-bar-buttons'))
  })
})
