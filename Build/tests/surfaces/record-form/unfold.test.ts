import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/unfold.js'

const nestedIn14 = (id = 'data-2-tt_content-3-image-sys_file_reference-3'): HTMLElement => {
  const panel = document.createElement('div')
  panel.className = 'form-irre-object panel t3js-not-loaded'
  panel.setAttribute('data-object-id', id)
  panel.innerHTML = `
    <div class="panel-heading">
      <button class="panel-button collapsed" type="button" data-bs-toggle="collapse">
        <span class="caret"></span>
      </button>
    </div>`

  // The backend's own button opens the record and fetches what is in it
  const button = panel.querySelector('.panel-button')
  button?.addEventListener('click', () => {
    button.classList.toggle('collapsed')
    panel.classList.remove('t3js-not-loaded')
  })

  document.body.append(panel)

  return panel
}

const formOnScreen = (): void => { formReady({ doc: document, fields: [] }) }

describe('a record the form has not loaded', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  // 14.3 hangs the press on a button of the panel, and fetches the record's fields with it
  it('opens a record whose fields the backend has not sent yet', () => {
    initialise(listening.signal)
    const panel = nestedIn14()
    formOnScreen()

    activate()
    pickArea('fields')

    expect(panel.querySelector('.panel-button')?.classList.contains('collapsed')).toBe(false)
  })
})
