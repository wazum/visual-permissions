import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { initialise } from '#src/surfaces/record-form/switch-type.js'

const editUrl = 'https://example.com/typo3/record/edit?token=t&edit%5Btt_content%5D%5B1%5D=edit'

const formAt = (href: string, view: Window | null = window): Document => {
  const doc = document.implementation.createHTMLDocument()
  Object.defineProperty(doc, 'URL', { value: href })
  Object.defineProperty(doc, 'defaultView', { value: view })
  doc.body.innerHTML = '<div class="module-docheader-buttons"><div class="btn-toolbar"></div></div>'

  return doc
}

const switchIn = (doc: Document, label: string, name: string, values: readonly string[], inside = ''): HTMLSelectElement => {
  const anchor = doc.createElement('fieldset')
  anchor.className = 'vperm-anchor'
  anchor.setAttribute(attributes.switch, label)
  anchor.setAttribute(attributes.inside, inside)
  const named = doc.createElement('label')
  named.className = 'form-label'
  named.textContent = `${label} [${name}]`
  const select = doc.createElement('select')
  select.name = name
  select.setAttribute('data-formengine-field-change-event', 'change')
  for (const value of values) {
    select.append(new Option(value, value))
  }
  anchor.append(named, select)
  doc.body.append(anchor)

  return select
}

const headerSwitches = (doc: Document): HTMLElement[] => [...doc.querySelectorAll<HTMLElement>(`.${classes.typeSwitch}`)]

const pick = (doc: Document, value: string, at = 0): void => {
  const picker = headerSwitches(doc)[at]?.querySelector('select')
  if (picker == null) {
    throw new Error('no type in the header')
  }

  picker.value = value
  picker.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('the type switch', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('offers the type of the record in the header, under the name the backend gives it', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc).map(control => [control.querySelector('select')?.getAttribute('aria-label'), control.querySelector('select')?.value]))
      .toStrictEqual([['Type', 'text']])
  })

  it('offers the choices of the form under their own names', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')

    formReady({ doc, fields: [] })

    expect([...headerSwitches(doc)[0]?.querySelectorAll('option') ?? []].map(choice => choice.textContent))
      .toStrictEqual(['text', 'textmedia'])
  })

  it('offers every other field that switches the form beside the type', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    switchIn(doc, 'Variant', 'data[tt_content][1][tx_variant]', ['plain', 'boxed'])
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc).map(control => control.querySelector('select')?.getAttribute('aria-label')))
      .toStrictEqual(['Type', 'Variant'])
  })

  it('leaves the type of a record shown inside the form out of the header', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    switchIn(doc, 'Kind', 'data[tx_child][4][kind]', ['one', 'two'], 'tt_content-1-children')
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc)).toHaveLength(1)
  })

  it('offers the type once however often the header is drawn again', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')
    formReady({ doc, fields: [] })

    selectGroup(8)

    expect(headerSwitches(doc)).toHaveLength(1)
  })

  it('offers no choice in the header for a box that reloads the form', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Hidden', 'data[tt_content][1][hidden]', []).replaceWith(Object.assign(doc.createElement('input'), { type: 'checkbox' }))
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('fields')

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc)).toHaveLength(0)
  })

  it('offers no type in the header while the mode is off', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    initialise(listening.signal, vi.fn())

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc)).toHaveLength(0)
  })

  it('offers no type in the header while the work is in another area', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    initialise(listening.signal, vi.fn())
    activate()
    pickArea('modules')

    formReady({ doc, fields: [] })

    expect(headerSwitches(doc)).toHaveLength(0)
  })

  it('loads the form again with the type picked in the header', () => {
    const doc = formAt(editUrl)
    switchIn(doc, 'Type', 'data[tt_content][1][CType]', ['text', 'textmedia'])
    const loads = vi.fn()
    initialise(listening.signal, loads)
    activate()
    pickArea('fields')
    formReady({ doc, fields: [] })

    pick(doc, 'textmedia')

    expect(new URL(String(loads.mock.calls[0]?.[1])).searchParams.get('vperm[value][tt_content][1][CType]')).toBe('textmedia')
  })

  it('starts a new record with the type picked, since it gets a new id on every load', () => {
    const doc = formAt('https://example.com/typo3/record/edit?token=t&edit%5Btt_content%5D%5B25%5D=new')
    switchIn(doc, 'Type', 'data[tt_content][NEW6a1b][CType]', ['text', 'textmedia'])
    const loads = vi.fn()
    initialise(listening.signal, loads)
    activate()
    pickArea('fields')
    formReady({ doc, fields: [] })

    pick(doc, 'textmedia')

    expect(new URL(String(loads.mock.calls[0]?.[1])).searchParams.get('defVals[tt_content][CType]')).toBe('textmedia')
  })

  it('loads the stored record again once the mode is switched off', () => {
    const doc = formAt(`${editUrl}&vperm%5Bvalue%5D%5Btt_content%5D%5B1%5D%5BCType%5D=textmedia`)
    const loads = vi.fn()
    activate()
    initialise(listening.signal, loads)
    formReady({ doc, fields: [] })

    deactivate()

    expect(loads).toHaveBeenCalledWith(doc, editUrl)
  })

  it('loads the stored record when the form with the type picked arrives after the mode was switched off', () => {
    const doc = formAt(`${editUrl}&vperm%5Bvalue%5D%5Btt_content%5D%5B1%5D%5BCType%5D=textmedia`)
    const loads = vi.fn()
    initialise(listening.signal, loads)

    formReady({ doc, fields: [] })

    expect(loads).toHaveBeenCalledWith(doc, editUrl)
  })

  it('leaves a form that shows the stored type alone when the mode is switched off', () => {
    const doc = formAt(editUrl)
    const loads = vi.fn()
    activate()
    initialise(listening.signal, loads)
    formReady({ doc, fields: [] })

    deactivate()

    expect(loads).not.toHaveBeenCalled()
  })

  it('leaves a form the browser has already left alone when the mode is switched off', () => {
    const doc = formAt(`${editUrl}&vperm%5Bvalue%5D%5Btt_content%5D%5B1%5D%5BCType%5D=textmedia`, null)
    const loads = vi.fn()
    activate()
    initialise(listening.signal, loads)
    formReady({ doc, fields: [] })

    deactivate()

    expect(loads).not.toHaveBeenCalled()
  })

  it('loads nothing when the mode is switched off before any form was shown', () => {
    const loads = vi.fn()
    activate()
    initialise(listening.signal, loads)

    deactivate()

    expect(loads).not.toHaveBeenCalled()
  })

  it('keeps the type picked on the form loaded for it while the mode is on', () => {
    const doc = formAt(`${editUrl}&vperm%5Bvalue%5D%5Btt_content%5D%5B1%5D%5BCType%5D=textmedia`)
    const loads = vi.fn()
    activate()
    initialise(listening.signal, loads)

    formReady({ doc, fields: [] })

    expect(loads).not.toHaveBeenCalled()
  })
})
