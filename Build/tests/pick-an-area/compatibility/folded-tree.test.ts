import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/compatibility/folded-tree.js'

const scaffold = (className: string): HTMLElement => {
  const element = document.createElement('div')
  element.className = className
  document.body.append(element)

  return element
}

const expanded = (element: HTMLElement): boolean => element.classList.contains('scaffold-content-navigation-expanded')

describe('the page tree 13.4 folded away', () => {
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

  it('comes back while permissions are shown, and folds away again when they are hidden', () => {
    const element = scaffold('t3js-scaffold scaffold-content-navigation-available')
    initialise(document, listening.signal)

    activate()
    expect(expanded(element)).toBe(true)

    deactivate()

    expect(expanded(element)).toBe(false)
  })

  it('stays where the admin left it when it was already open', () => {
    const element = scaffold('t3js-scaffold scaffold-content-navigation-available scaffold-content-navigation-expanded')
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(expanded(element)).toBe(true)
  })

  it('leaves a backend alone that has no page tree to show', () => {
    const element = scaffold('t3js-scaffold')
    initialise(document, listening.signal)

    activate()

    expect(expanded(element)).toBe(false)
  })
})
