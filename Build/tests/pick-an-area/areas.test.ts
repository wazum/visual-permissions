import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/areas.js'

const navigation = (collapsed: boolean): HTMLElement => {
  const element = document.createElement('typo3-backend-content-navigation')

  if (collapsed) {
    element.setAttribute('navigation-collapsed', '')
  }

  document.body.append(element)

  return element
}

const group = (open: boolean): HTMLElement => {
  const nav = document.createElement('nav')
  nav.id = 'modulemenu'
  const control = document.createElement('button')
  control.setAttribute('aria-controls', 'group-content')
  control.setAttribute('aria-expanded', String(open))
  const list = document.createElement('ul')
  list.id = 'group-content'
  list.className = open
    ? 'modulemenu-group-container collapse show'
    : 'modulemenu-group-container collapse'
  nav.append(control, list)
  document.body.replaceChildren(nav)

  return list
}

const isOpen = (list: HTMLElement): boolean => list.classList.contains('show')

const controlSays = (): string | null =>
  document.querySelector('[aria-controls="group-content"]')?.getAttribute('aria-expanded') ?? null

const controlIsUnusable = (): boolean =>
  document.querySelector('[aria-controls="group-content"]')?.getAttribute('aria-disabled') === 'true'

const controlKeepsItsFocus = (): boolean =>
  document.querySelector('[aria-controls="group-content"]')?.hasAttribute('disabled') === false

describe('the page tree that was folded away', () => {
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

  it('comes back while permissions are shown, before any area is picked', () => {
    const element = navigation(true)
    initialise(document, listening.signal)

    activate()

    expect(element.hasAttribute('navigation-collapsed')).toBe(false)
  })

  it('folds away again when permissions are hidden', () => {
    const element = navigation(true)
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(element.hasAttribute('navigation-collapsed')).toBe(true)
  })

  it('stays where the admin left it when it was already open', () => {
    const element = navigation(false)
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(element.hasAttribute('navigation-collapsed')).toBe(false)
  })

})

describe('the module groups', () => {
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

  it('opens a shut group when the panel is picked to work in', () => {
    const list = group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    expect(isOpen(list)).toBe(true)
    expect(controlSays()).toBe('true')
  })

  it('stays shut while the work is in another area', () => {
    const list = group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    expect(isOpen(list)).toBe(false)
  })

  it('shuts it again when the panel is let go of', () => {
    const list = group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    pickArea('fields')

    expect(isOpen(list)).toBe(false)
    expect(controlSays()).toBe('false')
  })

  it('takes the option to shut a group away while the panel is picked', () => {
    group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    expect(controlIsUnusable()).toBe(true)
  })

  it('leaves the control able to take focus, so the menu can still be walked', () => {
    group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    expect(controlKeepsItsFocus()).toBe(true)
  })

  it('gives the option back when the panel is let go of', () => {
    group(false)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    pickArea('fields')

    expect(controlIsUnusable()).toBe(false)
  })

  it('leaves a shut list outside the module menu alone', () => {
    group(false)
    const elsewhere = document.createElement('ul')
    elsewhere.className = 'modulemenu-group-container collapse'
    document.body.append(elsewhere)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')

    expect(isOpen(elsewhere)).toBe(false)
  })

  it('opens and shuts a group that has no control of its own', () => {
    const list = group(false)
    document.querySelector('[aria-controls="group-content"]')?.remove()
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    expect(isOpen(list)).toBe(true)

    pickArea('fields')

    expect(isOpen(list)).toBe(false)
  })

  it('leaves a group the admin had open alone', () => {
    const list = group(true)
    initialise(document, listening.signal)

    activate()
    pickArea('modules')
    pickArea('fields')

    expect(isOpen(list)).toBe(true)
    expect(controlSays()).toBe('true')
  })
})

describe('a drag in the backend', () => {
  let listening: AbortController

  const drag = (): boolean => {
    const node = document.createElement('div')
    node.draggable = true
    document.body.replaceChildren(node)

    return !node.dispatchEvent(new Event('dragstart', { bubbles: true, cancelable: true }))
  }

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

  it('does not start while permissions are shown', () => {
    initialise(document, listening.signal)

    activate()

    expect(drag()).toBe(true)
  })

  it('never reaches what is dragged while permissions are shown', () => {
    const node = document.createElement('div')
    let heard = false
    node.addEventListener('dragstart', () => { heard = true })
    document.body.replaceChildren(node)
    initialise(document, listening.signal)
    activate()

    node.dispatchEvent(new Event('dragstart', { bubbles: true, cancelable: true }))

    expect(heard).toBe(false)
  })

  it('starts as usual while permissions are hidden', () => {
    initialise(document, listening.signal)

    expect(drag()).toBe(false)
  })

  it('starts as usual once the areas are let go of', () => {
    initialise(document, listening.signal)
    activate()

    listening.abort()

    expect(drag()).toBe(false)
  })
})
