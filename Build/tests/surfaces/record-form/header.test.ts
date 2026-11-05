import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit } from '#src/platform/bus.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { attributes, classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup, subscribe, turnTo } from '#src/platform/session.js'
import { initialise as paintBody } from '#src/platform/body.js'
import { initialise } from '#src/surfaces/record-form/header.js'

const save = '<button name="_savedok">Save</button>'
const close = '<a class="btn t3js-editform-close" href="#">Close</a>'

const backendSays = (
  labels: Record<string, string> = {
    'platform.preview': 'Preview',
    'recordForm.previewFor': 'The form as the group "%s" sees it',
    'recordForm.add': 'Assign permissions',
    'platform.pick': 'Assign',
    'recordForm.pickFor': 'Pick what the group "%s" may edit',
    'platform.cancel': 'Cancel',
  },
  groups: Record<string, unknown> = { 7: { title: 'Institute Editors', disabled: false, inherits: [] } },
): void => {
  const carrier = document.createElement('span')
  carrier.setAttribute(attributes.groups, JSON.stringify(groups))
  document.body.append(carrier)
  TYPO3.lang = { ...labels }
}

const docheader = (...buttons: string[]): void => {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="module-docheader module-docheader-navigation">
      <div class="module-docheader-column"></div>
      <div class="module-docheader-column module-docheader-column-breadcrumb">
        <typo3-breadcrumb label="Breadcrumb">Root</typo3-breadcrumb>
      </div>
      <div class="module-docheader-column"></div>
    </div>
    <div class="module-docheader module-docheader-buttons">
      <div class="module-docheader-column module-docheader-column-grow">
        <div class="btn-toolbar">${buttons.join('')}</div>
      </div>
      <div class="module-docheader-column">
        <div class="btn-toolbar">
          <div class="btn-group">
            <a class="btn" href="/typo3/module/record/history">History</a>
            <button class="btn">Info</button>
          </div>
        </div>
      </div>
    </div>
    <form name="editform">
      <h1>Edit Page Content on page "West Wing"</h1>
      <fieldset class="vperm-anchor" data-vperm-token="tt_content:header" data-vperm-inside=""></fieldset>
    </form>`)

  formReady({ doc: document, fields: [] })
}

const docheaderWithoutForm = (...buttons: string[]): void => {
  docheader(...buttons)
  document.querySelector(`.${classes.anchor}`)?.remove()

  formReady({ doc: document, fields: [] })
}

const ourLine = '.module-docheader-navigation .module-docheader-column-breadcrumb'

const said = (part: string): string | undefined =>
  document.querySelector(`${ourLine} .${classes.headBar} .${part}`)?.textContent ?? undefined

const visibleHeaderControls = (): string[] =>
  [...document.querySelectorAll('.module-docheader-buttons :is(button, a)')]
    .filter(control => control.closest('[hidden]') === null)
    .map(control => control.textContent.trim())

describe('the header of a form we have taken over', () => {
  let listening: AbortController

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    paintBody(listening.signal)
    document.body.replaceChildren()
    backendSays()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
    vi.useRealTimers()
  })

  it('says whose form this is while the form is picked to work in', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    expect(said(classes.faceEyebrow)).toBe('Preview')
    expect(said(classes.faceSentence)).toBe('The form as the group "Institute Editors" sees it')
  })

  it('gives the header back when permissions are hidden', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    deactivate()

    expect(said(classes.faceSentence)).toBe(undefined)
  })

  // The way into the picking is a button of the form like any other, so it stands with them
  it('stands the way into the picking beside the way out', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    expect(visibleHeaderControls()).toEqual(['Close', 'Assign permissions'])
  })

  it('marks the way into the picking with a small icon set off from its name', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    const way = [...document.querySelectorAll('.module-docheader-buttons button')]
      .find(control => control.textContent.trim() === 'Assign permissions')
    const mark = way?.querySelector('typo3-backend-icon')

    expect(mark?.getAttribute('identifier')).toBe('actions-check-square')
    expect(mark?.getAttribute('size')).toBe('small')
    expect(way?.textContent).toBe(' Assign permissions')
  })

  // A record is closed from the side that shows it; the other side is left through its foot
  it('takes the way out away while the fields are given away', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    turnTo('pick')

    expect(visibleHeaderControls()).toEqual([])
  })

  // Core's buttons are taken off the row; the ones we put there are ours to keep
  it('leaves a control of ours standing in the row', () => {
    initialise(document, listening.signal)
    docheader(save, close)
    const ours = document.createElement('button')
    ours.className = classes.showMenu
    ours.textContent = 'Show'
    document.querySelector('.module-docheader-buttons .btn-toolbar')?.append(ours)

    activate()
    pickArea('fields')
    turnTo('pick')

    expect(ours.hasAttribute('hidden')).toBe(false)
  })

  // The other side would stand empty: a record no field of which can be given has nothing to pick
  it('offers no way into the picking while the form has nothing to pick', () => {
    initialise(document, listening.signal)
    docheader(save, close)
    document.querySelector(`.${classes.anchor}`)?.setAttribute(attributes.outOfReach, '')

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.headButton}`)).toBeNull()
  })

  it('turns the form over once nothing is left to pick', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    turnTo('pick')
    document.querySelector(`.${classes.anchor}`)?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    expect(document.querySelector('form[name="editform"]')?.classList.contains(classes.turning)).toBe(true)
  })

  it('turns the form over when only the records it holds are left in reach', () => {
    initialise(document, listening.signal)
    docheader(save, close)
    document.querySelector('form[name="editform"]')?.insertAdjacentHTML(
      'beforeend',
      '<fieldset class="vperm-anchor" data-vperm-token="sys_file_reference:title" data-vperm-inside="tt_content-82-assets"></fieldset>',
    )

    activate()
    pickArea('fields')
    turnTo('pick')
    document.querySelector('[data-vperm-token="tt_content:header"]')?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    expect(document.querySelector('form[name="editform"]')?.classList.contains(classes.turning)).toBe(true)
  })

  it('leaves a record with nothing to pick still while it shows what the group gets', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    document.querySelector(`.${classes.anchor}`)?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    expect(document.querySelector('form[name="editform"]')?.classList.contains(classes.turning)).toBe(false)
  })

  it('turns a record with nothing to pick to what the group gets', async () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    turnTo('pick')
    document.querySelector(`.${classes.anchor}`)?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    await vi.waitFor(() => { expect(document.body.getAttribute(attributes.face)).toBe('preview') })
  })

  // The backend judges the fields after the form is drawn, and that is when it is known
  it('takes that way away once the backend has judged the fields', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    document.querySelector(`.${classes.anchor}`)?.setAttribute(attributes.outOfReach, '')
    emit('fields-judged', {})

    expect(document.querySelector(`.${classes.headButton}`)).toBeNull()
  })

  it('carries no word at all where the backend published none', () => {
    document.body.replaceChildren()
    backendSays({})
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    expect(said(classes.faceEyebrow)).toBe('')
    expect(said(classes.faceSentence)).toBe('')
    expect(document.querySelector(`.${classes.headButton}`)?.textContent.trim()).toBe('')
  })

  it('names nobody when the group is not one the backend names', () => {
    document.body.replaceChildren()
    backendSays(undefined, {})
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    expect(said(classes.faceSentence)).toBe('The form as the group "" sees it')
  })

  it('says nothing on a header that has no row to say it in', () => {
    initialise(document, listening.signal)
    document.body.insertAdjacentHTML('beforeend', `
      <div class="module-docheader module-docheader-buttons">
        <div class="module-docheader-column module-docheader-column-grow">
          <div class="btn-toolbar">${save}${close}</div>
        </div>
      </div>
      <fieldset class="vperm-anchor" data-vperm-token="tt_content:header" data-vperm-inside=""></fieldset>`)
    formReady({ doc: document, fields: [] })

    activate()
    pickArea('fields')

    expect(document.querySelector(`.${classes.headBar}`)).toBe(null)
    expect(visibleHeaderControls()).toEqual(['Close', 'Assign permissions'])
  })

  it('waits for a form when an area is picked without one on screen', () => {
    initialise(document, listening.signal)

    activate()
    pickArea('fields')
    docheader(save, close)

    expect(said(classes.faceEyebrow)).toBe('Preview')
    expect(visibleHeaderControls()).toEqual(['Close', 'Assign permissions'])
  })

  // The page layout stands in this area too
  it('leaves the header to a module that shows no form', () => {
    initialise(document, listening.signal)
    docheaderWithoutForm(save, close)

    activate()
    pickArea('fields')

    expect(said(classes.faceSentence)).toBe(undefined)
    expect(visibleHeaderControls()).toEqual(['Save', 'Close', 'History', 'Info'])
  })

  it('offers the way to the side where the fields are given', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    const turn = document.querySelector<HTMLElement>(`.${classes.headButton}`)

    expect(turn?.textContent.trim()).toBe('Assign permissions')
    // It stands among core's own controls and wears what they wear
    expect(turn?.className).toBe(`btn btn-default btn-sm ${classes.headButton}`)
    expect(turn?.querySelector('typo3-backend-icon')?.getAttribute('identifier'))
      .toBe('actions-check-square')

    turn?.click()

    // The form turns over, and shows its other side halfway through
    expect(document.querySelector('form')?.classList.contains(classes.turning)).toBe(true)

    vi.advanceTimersByTime(280)

    expect(document.body.getAttribute(attributes.face)).toBe('pick')
  })

  // The way back stands in the foot with the rest of what the picking decides
  it('says what the other side is for, and leaves the deciding to the foot', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    turnTo('pick')

    expect(said(classes.faceEyebrow)).toBe('Assign')
    expect(said(classes.faceSentence)).toBe('Pick what the group "Institute Editors" may edit')
    expect(document.querySelector(`.${classes.headButton}`)).toBeNull()
  })

  // The form's own heading repeats what the header and the record itself already say
  it('takes the form its own heading away while the header is ours', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    expect(document.querySelector('h1')?.hasAttribute('hidden')).toBe(true)

    deactivate()

    expect(document.querySelector('h1')?.hasAttribute('hidden')).toBe(false)
  })

  // Escape means cancel on every other area, and the form is no different
  it('turns back to what the group has when escape is pressed', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    turnTo('pick')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    vi.advanceTimersByTime(280)

    expect(document.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('says what it shows on a form core offers no way out of', () => {
    initialise(document, listening.signal)
    backendSays()
    docheader(save)

    activate()
    pickArea('fields')

    expect(said(classes.faceEyebrow)).toBe('Preview')
  })

  // Unfolding a record adds fields, and the form is handed over again for them
  it('turns back once for one escape after the form was handed over again', () => {
    initialise(document, listening.signal)
    docheader(save, close)
    formReady({ doc: document, fields: [] })

    activate()
    pickArea('fields')
    turnTo('pick')

    const turns: string[] = []
    subscribe(state => { turns.push(state.face) }, listening.signal)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    vi.advanceTimersByTime(280)

    expect(turns).toStrictEqual(['preview'])
  })

  // There is nothing to leave on the side that shows what the group has
  it('leaves escape to the backend while the preview is up', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    vi.advanceTimersByTime(280)

    expect(document.querySelector('form')?.classList.contains(classes.turning)).toBe(false)
    expect(document.body.getAttribute(attributes.face)).toBe('preview')
  })

  it('keeps the path to the record, which says where the form stands', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')

    const path = document.querySelector('typo3-breadcrumb')

    expect(path?.closest('[hidden]')).toBe(null)
    expect(path?.textContent).toBe('Root')
  })

  it('says it once when the form is drawn again', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    formReady({ doc: document, fields: [] })

    expect(document.querySelectorAll(`.${classes.headBar}`)).toHaveLength(1)
  })

  it('gives core its controls back when permissions are hidden', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('fields')
    deactivate()

    expect(visibleHeaderControls()).toEqual(['Save', 'Close', 'History', 'Info'])
  })

  it('leaves the header alone while another area is picked to work in', () => {
    initialise(document, listening.signal)
    docheader(save, close)

    activate()
    pickArea('modules')

    expect(said(classes.faceSentence)).toBe(undefined)
    expect(visibleHeaderControls()).toEqual(['Save', 'Close', 'History', 'Info'])
  })
})
