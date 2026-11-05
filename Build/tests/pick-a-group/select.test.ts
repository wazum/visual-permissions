import Persistent from '@typo3/backend/storage/persistent.js'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes, elements } from '#src/platform/contract.js'
import { deactivate, getState, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/pick-a-group/select.js'
import { prime, quiet as written } from '../__mocks__/typo3-persistent-storage.js'

const trigger = (): HTMLButtonElement => {
  const element = document.querySelector<HTMLButtonElement>(`[${attributes.group}]`)
  if (element === null) {
    throw new Error('no group button in the document')
  }

  return element
}

const picker = (): HTMLElement => {
  const element = document.querySelector<HTMLElement>(elements.picker)
  if (element === null) {
    throw new Error('no picker in the document')
  }

  return element
}

const settled = async (): Promise<void> => {
  await (picker() as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete
}

const rows = (): HTMLElement[] =>
  [...picker().querySelectorAll<HTMLElement>(`.${classes.pickerList} [role="option"]`)]

const field = (): HTMLInputElement => {
  const input = picker().querySelector('input')
  if (input === null) {
    throw new Error('the picker has no search field')
  }

  return input
}

const row = (at: number): HTMLElement => {
  const found = rows()[at]
  if (found === undefined) {
    throw new Error(`the picker has no row ${String(at)}`)
  }

  return found
}

const putHeaderInDocument = (more: Record<number, { title: string }> = {}): void => {
  const button = document.createElement('button')
  button.setAttribute(attributes.group, '')
  button.textContent = 'Backend group'

  const carrier = document.createElement('span')
  carrier.setAttribute(attributes.groups, JSON.stringify({
    2: { title: 'Institute Editors', disabled: false, inherits: [{ groupId: 13, title: 'Editors', depth: 1 }] },
    13: { title: 'Editors', disabled: true, inherits: [] },
    ...Object.fromEntries(Object.entries(more).map(([id, group]) => [id, { ...group, disabled: false, inherits: [] }])),
  }))
  TYPO3.lang = {
    'pickAGroup.search': 'Search groups',
    'pickAGroup.detail': 'Inherits from',
    'pickAGroup.detail.none': 'Inherits from no other group',
    'pickAGroup.inherits.one': 'inherits 1 group',
    'pickAGroup.inherits.many': 'inherits %s groups',
    'platform.picker.empty': 'Nothing matches',
    'platform.picker.key.move': 'move',
    'platform.picker.key.close': 'close',
    'pickAGroup.key.take': 'select',
    'pickAGroup.disabled': 'disabled',
    'pickAGroup.recent': 'Recently shown',
    'pickAGroup.all': 'All groups',
  }

  document.body.replaceChildren(button, carrier)
}

describe('the group picker', () => {
  let listening: AbortController

  beforeEach(async () => {
    localStorage.clear()
    deactivate()
    selectGroup(null)
    await written()
    prime({})
    listening = new AbortController()
    putHeaderInDocument()
  })

  afterEach(() => {
    listening.abort()
  })

  it('does nothing when the document has no group button', () => {
    document.body.replaceChildren()

    expect(() => {
      initialise(document, listening.signal)
    }).not.toThrow()
  })

  it('hands the picker every word the backend has for the list', () => {
    TYPO3.lang = {
      'pickAGroup.search': 'Search groups',
      'platform.picker.count': 'count',
      'pickAGroup.total.one': 'one group',
      'pickAGroup.total.many': 'many groups',
      'platform.picker.key.move': 'move',
      'pickAGroup.key.take': 'select',
      'platform.picker.key.close': 'close',
      'platform.picker.key.clear': 'clear',
      'pickAGroup.key.detail': 'detail',
      'platform.picker.empty': 'Nothing matches',
    }

    initialise(document, listening.signal)

    const handed = picker() as unknown as { words: Record<string, string>, placeholder: string }

    expect(handed.placeholder).toBe('Search groups')
    expect(handed.words).toStrictEqual({
      countMany: 'count',
      totalOne: 'one group',
      totalMany: 'many groups',
      move: 'move',
      take: 'select',
      close: 'close',
      clear: 'clear',
      detail: 'detail',
      empty: 'Nothing matches',
      loading: '',
      failed: '',
      retry: '',
    })
  })

  it('answers the picker and the button no more once the page lets go', () => {
    initialise(document, listening.signal)
    const list = picker()
    selectGroup(null)

    listening.abort()
    trigger().click()
    list.dispatchEvent(new CustomEvent('vperm:picked', { detail: { id: '2' } }))
    list.dispatchEvent(new CustomEvent('vperm:detail-picked', { detail: { id: '13' } }))

    expect(getState().groupId).toBeNull()
    expect(list.hasAttribute('data-open')).toBe(false)
  })

  it('lists the groups without a word where the backend published none', async () => {
    TYPO3.lang = {}
    initialise(document, listening.signal)
    const handed = picker() as unknown as { words: Record<string, string>, placeholder: string }

    trigger().click()
    await settled()

    expect(handed.placeholder).toBe('')
    expect(Object.values(handed.words)).toStrictEqual(Array.from({ length: 12 }, () => ''))
    // The keys are picker's own; everything else is backend's text
    expect(picker().textContent.split(/\s+/).filter(word => word !== '' && !'↑↓⇥↵esc'.includes(word)))
      .toStrictEqual(['Editors', 'Institute', 'Editors', 'Editors'])

    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await settled()

    expect(picker().textContent.split(/\s+/).filter(word => word !== '' && !'↑↓⇥↵esc'.includes(word)))
      .toStrictEqual(['Editors', 'Institute', 'Editors', 'Institute', 'Editors', 'Editors'])
  })

  it('offers every group the backend published', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect(rows().map(each => each.textContent.trim().split('\n')[0])).toEqual([
      'Editors',
      'Institute Editors',
    ])
  })

  // Move to another module is a new page; groups searched for last persist
  it('has the groups searched for last back on the next page', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()
    field().value = 'insti'
    field().dispatchEvent(new Event('input', { bubbles: true }))
    trigger().click()
    await written()

    listening.abort()
    listening = new AbortController()
    putHeaderInDocument()
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect(field().value).toBe('insti')
  })

  it('tells the picker what to say when a search finds no group', async () => {
    initialise(document, listening.signal)
    await settled()

    const search = picker().querySelector('input')
    if (search !== null) {
      search.value = 'nothing of the sort'
      search.dispatchEvent(new Event('input', { bubbles: true }))
    }

    await settled()

    expect(picker().querySelector(`.${classes.pickerList}`)?.textContent.trim())
      .toBe('Nothing matches')
  })

  it('tells the picker that the return key selects a group', async () => {
    initialise(document, listening.signal)
    await settled()

    expect(document.querySelector(`.${classes.pickerHints}`)?.textContent).toContain('select')
  })

  it('opens the picker on the button that asked for it', async () => {
    initialise(document, listening.signal)

    trigger().click()
    await settled()

    expect(picker().hasAttribute('data-open')).toBe(true)
  })

  it('hangs the picker under the button that opened it', async () => {
    initialise(document, listening.signal)
    trigger().getBoundingClientRect = () =>
      ({ bottom: 48, right: 700, left: 600, top: 8 }) as DOMRect

    trigger().click()
    await settled()

    expect(picker().style.top).toBe('54px')
  })

  it('says beside each group whether it is disabled and what it inherits', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect(rows().map(each => each.textContent.replace(/\s+/g, ' ').trim())).toEqual([
      'Editors disabled',
      'Institute Editors inherits 1 group',
    ])
  })

  // XLIFF carries singular and plural words for each count; no plural rules.
  it('counts more than one inherited group in the plural', async () => {
    document.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, JSON.stringify({
      2: {
        title: 'Institute Editors',
        disabled: false,
        inherits: [{ groupId: 13, title: 'Editors', depth: 1 }, { groupId: 18, title: 'Readers', depth: 2 }],
      },
    }))
    initialise(document, listening.signal)

    trigger().click()
    await settled()

    expect(rows().map(each => each.textContent.replace(/\s+/g, ' ').trim()))
      .toEqual(['Institute Editors inherits 2 groups'])
  })

  it('indents each inherited group by how far below the group it stands', async () => {
    document.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, JSON.stringify({
      2: {
        title: 'Institute Editors',
        disabled: false,
        inherits: [{ groupId: 13, title: 'Editors', depth: 1 }, { groupId: 18, title: 'Readers', depth: 2 }],
      },
    }))
    initialise(document, listening.signal)

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll<HTMLElement>(`.${classes.pickerDetail} [role="option"]`)]
      .map(detail => detail.style.getPropertyValue('--vperm-picker-depth'))).toEqual(['0', '1'])
  })

  it('walks one step up the chain from the detail pane', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await settled()
    picker().querySelector<HTMLButtonElement>(`.${classes.pickerDetail} [role="option"]`)?.click()

    expect(getState().groupId).toBe(13)
  })

  it('heads the pane with what the group inherits, and says so when it inherits nothing', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect(picker().querySelector(`.${classes.pickerDetail} p`)?.textContent.trim())
      .toBe('Inherits from no other group')

    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await settled()

    expect(picker().querySelector(`.${classes.pickerDetail} p`)?.textContent.trim())
      .toBe('Inherits from')
  })

  it('says what the field searches', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect(field().placeholder).toBe('Search groups')
  })

  it('shows the group that is on screen, and says to choose one while none is', async () => {
    initialise(document, listening.signal)

    expect(trigger().textContent.trim()).toBe('Backend group')

    trigger().click()
    await settled()
    row(0).click()

    expect(trigger().textContent.trim()).toBe('Editors')
  })

  it('names the group the session already holds, and follows it wherever it changes', () => {
    selectGroup(2)

    initialise(document, listening.signal)

    expect(trigger().textContent.trim()).toBe('Institute Editors')

    selectGroup(13)

    expect(trigger().textContent.trim()).toBe('Editors')
  })

  it('lines the picker up with the right edge of the button', async () => {
    initialise(document, listening.signal)
    trigger().getBoundingClientRect = () =>
      ({ bottom: 48, right: 700, left: 508, top: 8 }) as DOMRect
    // Panel width is 560px; jsdom does not lay out elements
    Object.defineProperty(picker(), 'offsetWidth', { value: 560, configurable: true })

    trigger().click()
    await settled()

    expect(picker().style.left).toBe('140px')
  })

  it('lists the group shown before first, under a heading of its own, and leaves out the one shown now', async () => {
    initialise(document, listening.signal)
    selectGroup(2)
    selectGroup(13)

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Institute Editors', 'All groups', 'Editors'])
  })

  it('has the groups shown last back on the next page, newest first', async () => {
    putHeaderInDocument({ 20: { title: 'Authors' }, 21: { title: 'Reviewers' } })
    initialise(document, listening.signal)
    for (const groupId of [2, 13, 20, 21]) {
      selectGroup(groupId)
    }
    await written()

    listening.abort()
    listening = new AbortController()
    putHeaderInDocument({ 20: { title: 'Authors' }, 21: { title: 'Reviewers' } })
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Authors', 'Editors', 'Institute Editors', 'All groups', 'Reviewers'])
  })

  it('lists only the three groups shown last as recent, as core does for users', async () => {
    putHeaderInDocument({ 20: { title: 'Authors' }, 21: { title: 'Reviewers' }, 22: { title: 'Translators' } })
    initialise(document, listening.signal)
    for (const groupId of [2, 13, 20, 21, 22]) {
      selectGroup(groupId)
    }

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Reviewers', 'Authors', 'Editors', 'All groups', 'Institute Editors', 'Translators'])
  })

  it('keeps no place among the recent groups for a stored one that is no group', async () => {
    prime({ vperm: { recentGroups: ['x', '98', '99', '13'] } })
    initialise(document, listening.signal)

    selectGroup(2)
    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Editors', 'All groups', 'Institute Editors'])
  })

  it('moves a group shown again to the front of the recent ones, once', async () => {
    putHeaderInDocument({ 20: { title: 'Authors' } })
    initialise(document, listening.signal)
    for (const groupId of [2, 13, 2, 20]) {
      selectGroup(groupId)
    }

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Institute Editors', 'Editors', 'All groups', 'Authors'])
  })

  it('keeps no place among the recent groups for dropping the group', async () => {
    putHeaderInDocument({ 20: { title: 'Authors' }, 21: { title: 'Reviewers' } })
    initialise(document, listening.signal)
    for (const groupId of [2, null, 13, 20, 21]) {
      selectGroup(groupId)
    }

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Authors', 'Editors', 'Institute Editors', 'All groups', 'Reviewers'])
  })

  it('lists the group dropped last as recent while none is shown', async () => {
    initialise(document, listening.signal)
    for (const groupId of [2, 13, null]) {
      selectGroup(groupId)
    }

    trigger().click()
    await settled()

    expect([...picker().querySelectorAll(`.${classes.pickerList} .dropdown-header, .${classes.pickerList} [role="option"] > span:first-child`)]
      .map(each => each.textContent.trim())).toEqual(['Recently shown', 'Editors', 'Institute Editors'])
  })

  it('writes the recent groups down only when the group changes', async () => {
    initialise(document, listening.signal)
    selectGroup(2)
    await written()
    const writes = vi.spyOn(Persistent, 'set')

    pickArea('fields')
    await written()

    expect(writes.mock.calls.filter(([key]) => key === 'vperm.recentGroups')).toHaveLength(0)
  })

  it('records the group an admin takes', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    row(0).click()

    expect(getState().groupId).toBe(13)
  })

  it('takes the picker away with the backend page', async () => {
    initialise(document, listening.signal)
    trigger().click()
    await settled()

    listening.abort()

    expect(document.querySelector(elements.picker)).toBeNull()
  })
})
