import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/unfold.js'

const nestedIn14 = (id = 'data-2-tt_content-3-image-sys_file_reference-3', shut = true, into: Element = document.body): HTMLElement => {
  const panel = document.createElement('div')
  panel.className = `form-irre-object panel${shut ? ' t3js-not-loaded' : ''}`
  panel.setAttribute('data-object-id', id)
  panel.innerHTML = `
    <div class="panel-heading">
      <button class="panel-button${shut ? ' collapsed' : ''}" type="button" data-bs-toggle="collapse">
        <span class="caret"></span>
      </button>
    </div>
    <div class="panel-collapse"></div>`

  // The backend's own button opens the record and fetches what is in it
  const button = panel.querySelector('.panel-button')
  button?.addEventListener('click', () => {
    button.classList.toggle('collapsed')
    panel.classList.remove('t3js-not-loaded')
  })

  into.append(panel)

  return panel
}

const isShut = (panel: Element): boolean | undefined => panel.querySelector(':scope > .panel-heading .panel-button')?.classList.contains('collapsed')

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

  it('leaves an open record open while the record inside it is still folded', () => {
    initialise(listening.signal)
    const parent = nestedIn14('data-1-tx_news_domain_model_news-2-content_elements-tt_content-3', false)
    const child = nestedIn14('data-2-tt_content-3-image-sys_file_reference-3', true, parent.querySelector('.panel-collapse') ?? parent)
    formOnScreen()

    activate()
    pickArea('fields')

    expect(isShut(parent)).toBe(false)
    expect(isShut(child)).toBe(false)
  })

  it('folds a record back although the admin folded the record inside it again', () => {
    initialise(listening.signal)
    const parent = nestedIn14('data-1-tx_news_domain_model_news-2-content_elements-tt_content-3')
    const child = nestedIn14('data-2-tt_content-3-image-sys_file_reference-3', true, parent.querySelector('.panel-collapse') ?? parent)
    formOnScreen()
    activate()
    pickArea('fields')
    child.querySelector<HTMLElement>('.panel-button')?.click()

    deactivate()

    expect(isShut(parent)).toBe(true)
  })
})
