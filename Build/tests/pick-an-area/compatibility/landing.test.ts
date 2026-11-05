import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-an-area/landing.js'
import { forget, setCurrentModule } from '../../__mocks__/typo3-module-menu.js'
import { forget as forgetAsks } from '../../__mocks__/typo3-ajax-request.js'
import { prime } from '../../__mocks__/typo3-persistent-storage.js'

const menu = (...modules: string[]): void => {
  const panel = document.createElement('div')
  panel.id = 'modulemenu'
  const list = document.createElement('ul')

  modules.forEach(module => {
    const item = document.createElement('li')
    const row = document.createElement('a')
    row.className = 'modulemenu-action'
    row.setAttribute('data-modulemenu-identifier', module)
    item.append(row)
    list.append(item)
  })

  panel.append(list)
  document.body.append(panel)
}

const visibleModules =(): string[] =>
  [...document.querySelectorAll<HTMLElement>('#modulemenu [data-modulemenu-identifier]')]
    .filter(row => row.parentElement?.hidden !== true)
    .map(row => row.getAttribute('data-modulemenu-identifier') ?? '')

describe('the modules 13.4 names differently', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    prime({})
    forget()
    forgetAsks()
    deactivate()
    pickArea('pageMounts')
    selectGroup(7)
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('keep the list of records standing under the name 13.4 gives it', () => {
    menu('web_list', 'system_config')
    setCurrentModule('web_layout')
    initialise(document, listening.signal)

    activate()

    expect(visibleModules()).toStrictEqual(['web_list'])
  })
})
