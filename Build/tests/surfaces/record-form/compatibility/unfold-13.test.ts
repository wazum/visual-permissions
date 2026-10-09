import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/compatibility/unfold-13.js'

const nested = (answers = true, id = 'data-13-tt_content-42-assets'): HTMLElement => {
  const panel = document.createElement('div')
  panel.className = 'form-irre-object panel panel-collapsed'
  panel.setAttribute('data-object-id', id)
  panel.innerHTML = `
    <div class="panel-heading" data-bs-toggle="formengine-file">
      <div class="form-irre-header">
        <div class="form-irre-header-cell form-irre-header-icon"><span class="caret"></span></div>
        <button class="form-irre-header-cell form-irre-header-button"></button>
      </div>
    </div>
    <div class="panel-collapse"></div>`
  if (answers) {
    panel.querySelector('.panel-heading')?.addEventListener('click', () => {
      panel.classList.toggle('panel-collapsed')
      panel.classList.toggle('panel-visible')
    })
  }

  document.body.append(panel)

  return panel
}

const isOpen = (panel: HTMLElement): boolean => panel.classList.contains('panel-visible')

const formOnScreen = (): void => { formReady({ doc: document, fields: [] }) }

describe('a record 13.4 folded away in the form', () => {
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

  // Fields of a folded child are not on the page at all; cannot be marked
  it('opens so its own fields can be marked', () => {
    initialise(listening.signal)
    const panel = nested()
    formOnScreen()

    activate()
    pickArea('fields')

    expect(isOpen(panel)).toBe(true)
  })

  it('opens a record that arrives after the work moved to the form', () => {
    initialise(listening.signal)
    pickArea('modules')
    activate()
    pickArea('fields')

    const panel = nested()
    formOnScreen()

    expect(isOpen(panel)).toBe(true)
  })

  it('folds again when the work moves off the form', () => {
    initialise(listening.signal)
    const panel = nested()
    formOnScreen()

    activate()
    pickArea('fields')
    pickArea('modules')

    expect(isOpen(panel)).toBe(false)
  })

  // Redundant-looking test but required to prevent silent data loss on double-click
  it('is asked to open only once while core fetches its fields', () => {
    initialise(listening.signal)
    const panel = nested(false)
    let asked = 0
    panel.addEventListener('click', () => { asked += 1 })
    formOnScreen()

    activate()
    pickArea('fields')
    formOnScreen()

    expect(asked).toBe(1)
  })

  // Unfolded record must outlive the page that draws it open
  it('folds a record back that the form came back with open', () => {
    const before = new AbortController()
    initialise(before.signal)
    nested()
    formOnScreen()
    activate()
    pickArea('fields')
    before.abort()
    document.body.replaceChildren()

    initialise(listening.signal)
    const panel = nested()
    panel.classList.replace('panel-collapsed', 'panel-visible')
    formOnScreen()
    pickArea('modules')

    expect(isOpen(panel)).toBe(false)
  })

  it('leaves a record the admin already had open alone', () => {
    initialise(listening.signal)
    const open = nested()
    open.classList.replace('panel-collapsed', 'panel-visible')
    formOnScreen()

    activate()
    pickArea('fields')
    pickArea('modules')

    expect(isOpen(open)).toBe(true)
  })

  it('leaves a record alone that the admin opened after it was folded back', () => {
    initialise(listening.signal)
    const panel = nested()
    formOnScreen()

    activate()
    pickArea('fields')
    pickArea('modules')
    panel.classList.replace('panel-collapsed', 'panel-visible')
    pickArea('fields')
    pickArea('modules')

    expect(isOpen(panel)).toBe(true)
  })

  it('remembers only the record it opened itself', () => {
    initialise(listening.signal)
    const theirs = nested(true, 'data-13-tt_content-43-assets')
    theirs.classList.replace('panel-collapsed', 'panel-visible')
    const ours = nested()
    formOnScreen()

    activate()
    pickArea('fields')
    pickArea('modules')

    expect(isOpen(theirs)).toBe(true)
    expect(isOpen(ours)).toBe(false)
  })

  it('leaves a record the admin folded away again alone', () => {
    initialise(listening.signal)
    const panel = nested()
    formOnScreen()

    activate()
    pickArea('fields')
    panel.querySelector<HTMLElement>('.panel-heading')?.click()
    pickArea('modules')

    expect(isOpen(panel)).toBe(false)
  })
})
