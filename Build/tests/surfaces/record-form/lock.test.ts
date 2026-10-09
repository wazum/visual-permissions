import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady } from '#src/surfaces/record-form/form.js'
import { classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/lock.js'

const moduleArrives = (): void => {
  formReady({ doc: document, fields: [] })
}

const formInModule = (): HTMLFormElement => {
  const form = document.createElement('form')
  document.body.append(form)

  return form
}

const fieldInModule = (): HTMLFieldSetElement => {
  const anchor = document.createElement('fieldset')
  anchor.className = 'vperm-anchor'
  document.body.append(anchor)

  return anchor
}

const fieldWithControlInModule = (): { anchor: HTMLFieldSetElement, control: HTMLInputElement } => {
  const anchor = fieldInModule()
  const control = document.createElement('input')
  anchor.append(control)

  return { anchor, control }
}

const send = (form: HTMLFormElement): boolean =>
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))

describe('the form lock', () => {
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

  it('opens the record in the module instead of the sheet', () => {
    const shell = document.createElement('typo3-backend-module-router')
    document.body.append(shell)
    initialise(document, listening.signal)
    const trigger = document.createElement('typo3-backend-contextual-record-edit-trigger')
    trigger.setAttribute('edit-url', '/typo3/record/edit?edit[pages][71]=edit')
    document.body.append(trigger)

    activate()

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })

    expect(trigger.dispatchEvent(press)).toBe(false)
    expect(shell.getAttribute('endpoint')).toBe('/typo3/record/edit?edit[pages][71]=edit')
  })

  it('refuses that sheet in the module document too, where the page layout stands', () => {
    initialise(document, listening.signal)
    const module = document.implementation.createHTMLDocument()
    const trigger = module.createElement('typo3-backend-contextual-record-edit-trigger')
    module.body.append(trigger)
    formReady({ doc: module, fields: [] })
    let heard = false
    trigger.addEventListener('click', () => { heard = true })

    activate()

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })

    expect(trigger.dispatchEvent(press)).toBe(false)
    expect(heard).toBe(false)
  })

  it('leaves a click that lands on nothing of ours alone', () => {
    initialise(document, listening.signal)
    const elsewhere = document.createElement('button')
    document.body.append(elsewhere)

    activate()

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })

    expect(elsewhere.dispatchEvent(press)).toBe(true)
  })

  it('keeps the press away from the trigger the sheet hangs on', () => {
    const shell = document.createElement('typo3-backend-module-router')
    document.body.append(shell)
    initialise(document, listening.signal)
    const trigger = document.createElement('typo3-backend-contextual-record-edit-trigger')
    trigger.setAttribute('edit-url', '/typo3/record/edit?edit[pages][71]=edit')
    document.body.append(trigger)
    let heard = false
    trigger.addEventListener('click', () => { heard = true })

    activate()
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(heard).toBe(false)
  })

  it('lets the sheet open again in the module document once the backend goes away', () => {
    initialise(document, listening.signal)
    const module = document.implementation.createHTMLDocument()
    const trigger = module.createElement('typo3-backend-contextual-record-edit-trigger')
    module.body.append(trigger)
    formReady({ doc: module, fields: [] })

    activate()
    listening.abort()

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })

    expect(trigger.dispatchEvent(press)).toBe(true)
  })

  it('lets the sheet open again once the backend goes away', () => {
    initialise(document, listening.signal)
    const trigger = document.createElement('typo3-backend-contextual-record-edit-trigger')
    trigger.setAttribute('edit-url', '/typo3/record/edit?edit[pages][71]=edit')
    document.body.append(trigger)

    activate()
    listening.abort()

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })

    expect(trigger.dispatchEvent(press)).toBe(true)
  })

  it('waits for a form when an area is picked without one on screen', () => {
    initialise(document, listening.signal)

    activate()
    pickArea('fields')
    const { control } = fieldWithControlInModule()
    moduleArrives()

    expect(control.hasAttribute('inert')).toBe(true)
  })

  it('stops a save that comes from anywhere else while the form is picked', () => {
    initialise(document, listening.signal)
    moduleArrives()

    activate()
    pickArea('fields')

    expect(send(formInModule())).toBe(false)
  })

  it('lets a save through when permissions are hidden', () => {
    initialise(document, listening.signal)
    moduleArrives()

    activate()
    pickArea('fields')
    deactivate()

    expect(send(formInModule())).toBe(true)
  })

  it('lets a save through while the work is in another area', () => {
    initialise(document, listening.signal)
    moduleArrives()

    activate()
    pickArea('modules')

    expect(send(formInModule())).toBe(true)
  })

  // The values are not to be edited while fields are picked, but the field itself is pressed
  // to pick it, and a field holding a record holds that record's fields too
  it('puts the controls of a field out of the way, and the field itself in reach', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const { anchor, control } = fieldWithControlInModule()

    activate()
    pickArea('fields')

    expect(control.hasAttribute('inert')).toBe(true)
    expect(anchor.hasAttribute('inert')).toBe(false)
    expect(anchor.disabled).toBe(false)
  })

  // The form's own controls are locked; ours stand among them and are pressed to decide
  it('leaves a control of ours inside a field open', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const { anchor, control } = fieldWithControlInModule()
    const ours = document.createElement('div')
    ours.className = classes.tableGate
    ours.append(document.createElement('button'))
    anchor.prepend(ours)

    activate()
    pickArea('fields')

    expect(control.hasAttribute('inert')).toBe(true)
    expect(ours.querySelector('button')?.hasAttribute('inert')).toBe(false)
  })

  // A label hands the press on to the control it names, whether that one is out of the way
  // or not, so the press itself must do nothing to the form
  it('lets no press change a value while the fields are picked', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const { anchor, control } = fieldWithControlInModule()
    const label = document.createElement('label')
    anchor.append(label)

    activate()
    pickArea('fields')

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })
    label.dispatchEvent(press)

    expect(press.defaultPrevented).toBe(true)
    expect(control.hasAttribute('inert')).toBe(true)
  })

  // The page layout lives in the same document as the picked form, and its records open as ever
  it('lets a press outside a field do what it was going to do', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const link = document.createElement('a')
    link.href = '/typo3/record/edit?edit[tt_content][82]=edit'
    document.body.append(link)

    activate()
    pickArea('fields')

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })
    link.dispatchEvent(press)

    expect(press.defaultPrevented).toBe(false)
  })

  // Core's own widgets keep a press to themselves, and the form must be no less locked for it
  it('refuses a press the form swallows on its way up', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const { anchor } = fieldWithControlInModule()
    const widget = document.createElement('div')
    anchor.append(widget)
    widget.addEventListener('click', event => { event.stopPropagation() })

    activate()
    pickArea('fields')

    const press = new MouseEvent('click', { bubbles: true, cancelable: true })
    widget.dispatchEvent(press)

    expect(press.defaultPrevented).toBe(true)
  })

  it('gives a field back when permissions are hidden', () => {
    initialise(document, listening.signal)
    moduleArrives()
    const { control } = fieldWithControlInModule()

    activate()
    pickArea('fields')
    deactivate()

    expect(control.hasAttribute('inert')).toBe(false)
  })

  it('stops a save before the form itself hears about it', () => {
    initialise(document, listening.signal)
    moduleArrives()
    activate()
    pickArea('fields')

    const form = formInModule()
    let stopped: boolean | null = null
    form.addEventListener('submit', event => { stopped = event.defaultPrevented }, { capture: true })

    send(form)

    expect(stopped).toBe(true)
  })
})
