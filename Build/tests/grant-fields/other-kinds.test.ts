import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { emit } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { initialise } from '#src/grant-fields/other-kinds.js'

const anchor = (token: string): string =>
  `<fieldset class="${classes.anchor}" ${attributes.token}="${token}"><label class="form-label">${token}</label></fieldset>`

// What core draws for a field holding records, and what the server lists after them
const holding = (listed: readonly string[]): void => {
  document.body.innerHTML = `
    <fieldset class="${classes.anchor}" ${attributes.token}="tt_content:assets">
      <div class="panel-group">
        <div class="form-irre-object panel" data-object-id="data-3-tt_content-3-assets-sys_file_reference-1">
          <div class="panel-collapse collapse show">${anchor('sys_file_reference:title')}</div>
        </div>
      </div>
      <div class="${classes.otherKinds}">
        <div class="form-section-headline">Only on other kinds of "File Reference"</div>
        ${listed.map(token => `<div class="form-group">${anchor(token)}</div>`).join('')}
      </div>
    </fieldset>`
}

const section = (): Element | null => document.querySelector(`.${classes.otherKinds}`)

const formOnScreen = (): void => { formReady({ doc: document, fields: [] }) }

describe('the fields only other kinds of record show', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
  })

  // The server can only add it after the field; it belongs with the records, after the last
  it('stands at the end of the records it is about', () => {
    initialise(listening.signal)
    holding(['sys_file_reference:autoplay'])

    formOnScreen()

    expect(document.querySelector('.panel-group')?.lastElementChild).toBe(section())
  })

  // Which kinds of record the field holds is the server's to know; the page does not guess again
  it('keeps every field the server listed', () => {
    initialise(listening.signal)
    holding(['sys_file_reference:title', 'sys_file_reference:autoplay'])

    formOnScreen()

    expect([...document.querySelectorAll(`.${classes.otherKinds} .form-group:not([hidden])`)]).toHaveLength(2)
  })

  it('lists the fields of a table the group may write', () => {
    initialise(listening.signal)
    holding(['sys_file_reference:autoplay'])

    formOnScreen()
    emit('fields-judged', {})

    expect(section()?.hasAttribute('hidden')).toBe(false)
  })

  it('lists nothing of a table the group may not write', () => {
    initialise(listening.signal)
    holding(['sys_file_reference:autoplay'])
    formOnScreen()

    document.querySelectorAll(`.${classes.otherKinds} [${attributes.token}]`)
      .forEach(row => { row.setAttribute(attributes.outOfReach, '') })
    emit('fields-judged', {})

    expect(section()?.hasAttribute('hidden')).toBe(true)
  })
})
