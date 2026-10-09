import { afterEach, describe, expect, it, vi } from 'vitest'
import '#src/platform/picker/picker.js'
import { classes, elements } from '#src/platform/contract.js'
import type { PickerEntry, PickerWords } from '#src/platform/picker/picker.js'
import { prime, quiet as written, stored } from '../../__mocks__/typo3-persistent-storage.js'

const words: PickerWords = {
  countMany: '%d of %d',
  totalOne: '1 user',
  totalMany: '%d users',
  move: 'move',
  take: 'view as',
  close: 'close',
  clear: 'clear',
  detail: 'inherits',
  loading: 'Loading users…',
  failed: 'The list of users could not be loaded',
  retry: 'Try again',
  empty: 'Nothing matches',
}

const entry = (id: string, title: string, subtitle: string, note: string): PickerEntry => ({
  id, title, subtitle, note, detail: [], detailHeading: '',
})

const users: PickerEntry[] = [
  entry('10', 'Hans Huber', 'eud668282', 'in 2 groups'),
  entry('11', 'Maria Hubmann', 'eud771903', 'in 1 group'),
]

const groups: PickerEntry[] = [
  entry('7', 'Content Reviewers', '', 'inherits 1 group'),
  entry('3', 'Editors', '', 'inherits no group'),
]

const picker = (entries: PickerEntry[]): HTMLElement => {
  const element = document.createElement(elements.picker)
  Object.assign(element, { entries, words, placeholder: 'Search' })
  document.body.append(element)

  return element
}

const settled = async (element: HTMLElement): Promise<void> => {
  await (element as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete
}

const rows = (element: HTMLElement): HTMLElement[] =>
  [...element.querySelectorAll<HTMLElement>(`.${classes.pickerList} [role="option"]`)]

const field = (element: HTMLElement): HTMLInputElement => {
  const input = element.querySelector('input')
  if (input === null) {
    throw new Error('the picker has no search field')
  }

  return input
}

const open = (element: HTMLElement, trigger: HTMLElement): void => {
  (element as HTMLElement & { openedBy(by: HTMLElement): void }).openedBy(trigger)
}

const openedBy = (element: HTMLElement): HTMLElement => {
  const trigger = document.createElement('button')
  document.body.append(trigger)
  open(element, trigger)

  return trigger
}

const press = (element: HTMLElement, key: string, shiftKey = false): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })
  field(element).dispatchEvent(event)

  return event
}

const type = async (element: HTMLElement, query: string): Promise<void> => {
  field(element).value = query
  field(element).dispatchEvent(new Event('input', { bubbles: true }))
  await settled(element)
}

afterEach(() => {
  document.body.replaceChildren()
  prime({})
})

describe('the picker', () => {
  it.each([['users', users], ['groups', groups]] as const)(
    'shows every %s entry before anything is typed',
    async (_kind, entries) => {
      const element = picker([...entries])
      await settled(element)

      expect(rows(element)).toHaveLength(2)
    },
  )

  it.each([['users', users, 'hub', 2], ['groups', groups, 'edit', 1]] as const)(
    'keeps only what matches in %s',
    async (_kind, entries, typed, left) => {
      const element = picker([...entries])
      await settled(element)

      await type(element, typed)

      expect(rows(element)).toHaveLength(left)
    },
  )

  it('makes the first row active as soon as there is one', async () => {
    const element = picker([...users])
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
  })

  it('moves the active row down without moving focus', async () => {
    const element = picker([...users])
    await settled(element)
    field(element).focus()

    press(element, 'ArrowDown')
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)
    expect(document.activeElement).toBe(field(element))
  })

  it.each([['ArrowLeft'], ['ArrowRight']] as const)(
    'leaves %s to the field, so the caret still moves in a browser',
    async key => {
      const element = picker([...users])
      await settled(element)

      expect(press(element, key).defaultPrevented).toBe(false)
    },
  )

  it('takes nothing when the return is pressed with no row to take', async () => {
    const element = picker([...users])
    await settled(element)
    const taken: string[] = []
    element.addEventListener('vperm:picked', event => {
      taken.push((event as CustomEvent<{ id: string }>).detail.id)
    })

    await type(element, 'nobody')
    const key = press(element, 'Enter')

    expect(taken).toEqual([])
    expect(key.defaultPrevented).toBe(false)
  })

  it('takes the active row on enter', async () => {
    const element = picker([...users])
    await settled(element)
    const taken: string[] = []
    element.addEventListener('vperm:picked', event => {
      taken.push((event as CustomEvent<{ id: string }>).detail.id)
    })

    press(element, 'ArrowDown')
    await settled(element)
    press(element, 'Enter')

    expect(taken).toEqual(['11'])
  })

  it('lists what the active entry is tied to', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detailHeading: 'Inherits from',
      detail: [
        { id: '3', title: 'Editors', depth: 0 },
        { id: '9', title: 'Everyone', depth: 1 },
      ],
    }])
    await settled(element)

    expect([...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]
      .map(row => row.textContent.trim())).toEqual(['Editors', 'Everyone'])
  })

  it('takes a detail row', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    const taken: string[] = []
    element.addEventListener('vperm:detail-picked', event => {
      taken.push((event as CustomEvent<{ id: string }>).detail.id)
    })

    element.querySelector<HTMLButtonElement>(`.${classes.pickerDetail} [role="option"]`)?.click()

    expect(taken).toEqual(['3'])
  })

  it('leaves the pointer out of it while the keys are driving', async () => {
    vi.useFakeTimers()
    const element = picker([...users])
    await settled(element)
    press(element, 'ArrowDown')
    await settled(element)

    rows(element)[0]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(80)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)
    vi.useRealTimers()
  })

  it('hands the list back to the pointer the moment it moves again', async () => {
    vi.useFakeTimers()
    const element = picker([...users])
    await settled(element)
    press(element, 'ArrowDown')
    await settled(element)

    element.dispatchEvent(new MouseEvent('pointermove', { bubbles: true }))
    rows(element)[0]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(80)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
    vi.useRealTimers()
  })

  it('makes a row active once the pointer rests on it', async () => {
    vi.useFakeTimers()
    const element = picker([...users])
    await settled(element)

    rows(element)[1]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(80)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)
    vi.useRealTimers()
  })

  it('leaves the target alone for a row the pointer only crossed', async () => {
    vi.useFakeTimers()
    const element = picker([...users])
    await settled(element)
    const first = rows(element)[0]?.id

    rows(element)[1]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(20)
    rows(element)[1]?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
    vi.advanceTimersByTime(80)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(first)
    vi.useRealTimers()
  })

  it('puts focus in the field when it opens, so the arrows reach the list', async () => {
    const element = picker([...users])
    await settled(element)

    openedBy(element)
    await settled(element)

    expect(document.activeElement).toBe(field(element))
  })

  it('closes on escape and gives the button its focus back', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await settled(element)

    press(element, 'Escape')
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('closes again when the button that opened it is pressed a second time', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await settled(element)

    open(element, trigger)
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
  })

  it('keeps what was typed for the next time it opens', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await type(element, 'hub')

    open(element, trigger)
    open(element, trigger)
    await settled(element)

    expect(field(element).value).toBe('hub')
    expect(rows(element)).toHaveLength(2)
  })

  // Move to another module is a new page; the name is fixed once set
  it('gives the text back on the next page under the name the list was given', async () => {
    const first = picker([...users])
    Object.assign(first, { remembers: 'vperm.picker.lorem' })
    await settled(first)
    const trigger = openedBy(first)
    await type(first, 'hub')

    open(first, trigger)
    await written()
    first.remove()

    const next = picker([...users])
    Object.assign(next, { remembers: 'vperm.picker.lorem' })
    openedBy(next)
    await settled(next)

    expect(field(next).value).toBe('hub')
  })

  it('writes nothing down for a list that was given no name', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await type(element, 'hub')

    open(element, trigger)
    await written()

    expect(stored()).toStrictEqual({})
  })

  it('closes when a press lands anywhere else on the page', async () => {
    const element = picker([...users])
    await settled(element)
    openedBy(element)
    await settled(element)

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
  })

  it('opens beside a frame it is not allowed to read', async () => {
    const element = picker([...users])
    await settled(element)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    Object.defineProperty(frame, 'contentDocument', { value: null })

    openedBy(element)
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(true)

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
    frame.remove()
  })

  it('stays open when the press lands on one of its own rows', async () => {
    const element = picker([...users])
    await settled(element)
    openedBy(element)
    await settled(element)

    rows(element)[0]?.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(true)
  })

  it('takes a press in its stride before it has ever been opened', async () => {
    const element = picker([...users])
    await settled(element)

    document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
    expect(rows(element)).toHaveLength(2)
  })

  it('stays open when the press lands on it or on the button that opened it', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await settled(element)

    field(element).dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(true)

    trigger.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(true)
  })

  it('closes when the press lands in a frame the page holds', async () => {
    const element = picker([...users])
    await settled(element)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    openedBy(element)
    await settled(element)

    frame.contentDocument?.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }))
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
  })

  it('closes on escape wherever the key was pressed', async () => {
    const element = picker([...users])
    await settled(element)
    const frame = document.createElement('iframe')
    document.body.append(frame)
    const trigger = openedBy(element)
    await settled(element)

    frame.contentDocument?.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    )
    await settled(element)

    expect(element.hasAttribute('data-open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('puts a heading over the first entry that carries one', async () => {
    const element = picker([
      { ...entry('10', 'Hans Huber', '', ''), heading: 'Recently viewed' },
      { ...entry('11', 'Maria Hubmann', '', ''), heading: 'All users' },
    ])
    await settled(element)

    expect([...element.querySelectorAll('.dropdown-header')].map(each => each.textContent))
      .toEqual(['Recently viewed', 'All users'])
  })

  it('says the button is closed again however the panel was dismissed', async () => {
    const element = picker([...users])
    await settled(element)
    const trigger = openedBy(element)
    await settled(element)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    element.removeAttribute('data-open')
    element.dispatchEvent(new Event('toggle'))
    await settled(element)

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('draws only the best of a long list', async () => {
    const many = Array.from({ length: 5000 }, (_, at) =>
      entry(String(at), `Hans Huber ${String(at)}`, '', ''))
    const element = picker(many)
    await settled(element)

    expect(rows(element)).toHaveLength(50)
  })

  it('says how many it drew and how many there are', async () => {
    const many = Array.from({ length: 5000 }, (_, at) =>
      entry(String(at), `Hans Huber ${String(at)}`, '', ''))
    const element = picker(many)
    await settled(element)

    await type(element, 'huber')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent.trim())
      .toBe('50 of 5000')
  })

  it('counts the whole list when it is drawing all of it', async () => {
    const element = picker([...users])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent.trim())
      .toBe('2 users')
  })

  it('counts one of a kind in the singular', async () => {
    const element = picker([entry('10', 'Hans Huber', 'eud668282', '')])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent.trim())
      .toBe('1 user')
  })

  // A reader searching for someone they viewed an hour ago wants to know which match that was. D8
  it('puts no heading over a row that carries none', async () => {
    const element = picker([
      { ...entry('10', 'Hans Huber', '', ''), heading: 'Recently viewed' },
      entry('11', 'Maria Hubmann', '', ''),
    ])
    await settled(element)

    expect([...element.querySelectorAll('.dropdown-header')].map(one => one.textContent))
      .toEqual(['Recently viewed'])
  })

  it('leaves the rows in the order they were handed over while nothing is typed', async () => {
    const element = picker([
      { ...entry('10', 'Xaver Bernd', '', ''), heading: 'Recently viewed' },
      { ...entry('11', 'Bernd Huber', '', ''), heading: 'All users' },
      { ...entry('12', 'Yvonne Bernd', '', ''), heading: 'Recently viewed' },
    ])
    await settled(element)

    expect(rows(element).map(row => row.querySelector('span')?.textContent))
      .toEqual(['Xaver Bernd', 'Bernd Huber', 'Yvonne Bernd'])
  })

  it('keeps a row whose only match opens no word at all', async () => {
    const element = picker([entry('10', 'Hans Huber', '', '')])
    await settled(element)

    await type(element, 'u')

    expect(rows(element).map(row => row.querySelector('span')?.textContent))
      .toEqual(['Hans Huber'])
  })

  it('puts the rows under a heading before those under none, best first', async () => {
    const element = picker([
      { ...entry('10', 'Xaver Bernd', '', ''), heading: 'Recently viewed' },
      { ...entry('11', 'Bernd Huber', '', ''), heading: 'Recently viewed' },
      entry('12', 'Bernd Gamma', '', ''),
    ])
    await settled(element)

    await type(element, 'bernd')

    expect(rows(element).map(row => row.querySelector('span')?.textContent))
      .toEqual(['Bernd Huber', 'Xaver Bernd', 'Bernd Gamma'])
    expect([...element.querySelectorAll('.dropdown-header')].map(one => one.textContent))
      .toEqual(['Recently viewed'])
    expect(element.querySelector('.dropdown-header')?.nextElementSibling?.textContent)
      .toContain('Bernd Huber')
  })

  it('keeps a heading above the rows of another that score better', async () => {
    const element = picker([
      { ...entry('10', 'Xaver Bernd', '', ''), heading: 'Recently viewed' },
      { ...entry('11', 'Bernd Huber', '', ''), heading: 'All users' },
      { ...entry('12', 'Yvonne Bernd', '', ''), heading: 'Recently viewed' },
    ])
    await settled(element)

    await type(element, 'bernd')

    expect(rows(element).map(row => row.querySelector('span')?.textContent))
      .toEqual(['Xaver Bernd', 'Yvonne Bernd', 'Bernd Huber'])
  })

  it('keeps the headings while searching, where both sides still match', async () => {
    const element = picker([
      { ...entry('10', 'Hans Huber', '', ''), heading: 'Recently viewed' },
      { ...entry('11', 'Maria Hubmann', '', ''), heading: 'All users' },
      { ...entry('12', 'Peter Almer', '', ''), heading: 'All users' },
    ])
    await settled(element)

    await type(element, 'hub')

    expect([...element.querySelectorAll('.dropdown-header')].map(each => each.textContent))
      .toEqual(['Recently viewed', 'All users'])
  })

  it('matches a query that runs from the name into the username', async () => {
    const element = picker([
      entry('1', 'Bernd Werner', 'tu10000501', ''),
      entry('2', 'Bernd Werner', 'tu10000999', ''),
    ])
    await settled(element)

    await type(element, 'bernd wern 501')

    expect(rows(element).map(row => row.dataset['id'])).toEqual(['1'])
  })

  it('marks letters that stand apart one by one', async () => {
    const element = picker([entry('1', 'Bernd Werner', '', '')])
    await settled(element)

    await type(element, 'bw')

    expect([...rows(element)[0]?.querySelectorAll('mark') ?? []].map(one => one.textContent))
      .toEqual(['B', 'W'])
  })

  it('leaves the name of a row whole around the marks', async () => {
    const element = picker([entry('1', 'Bernd Werner', '', '')])
    await settled(element)

    await type(element, 'wern')

    expect(rows(element)[0]?.querySelector('span')?.textContent).toBe('Bernd Werner')
  })

  it('marks the match on both sides of a query that runs across them', async () => {
    const element = picker([entry('1', 'Bernd Werner', 'tu10000501', '')])
    await settled(element)

    await type(element, 'bernd wern 501')

    expect([...rows(element)[0]?.querySelectorAll('mark') ?? []].map(m => m.textContent))
      .toEqual(['Bernd Wern', '501'])
  })

  it('says in the footer what the keys do', async () => {
    const element = picker([...users])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent)
      .toContain('move')
    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent)
      .toContain('view as')
  })

  it('puts the backend own search glyph beside the field', async () => {
    const element = picker([...users])
    await settled(element)

    const glyph = element.querySelector('typo3-backend-icon')

    expect(glyph?.getAttribute('identifier')).toBe('actions-search')
    expect(glyph?.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('keeps the active row in view as it moves', async () => {
    const element = picker([...users])
    await settled(element)
    const scrolled = vi.spyOn(HTMLElement.prototype, 'scrollIntoView')

    press(element, 'ArrowDown')
    await settled(element)

    expect(scrolled.mock.instances.at(-1)).toBe(rows(element)[1])
    expect(scrolled).toHaveBeenLastCalledWith({ block: 'nearest' })
  })

  it('moves the active row into the detail pane on tab, focus staying in the field', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    openedBy(element)
    await settled(element)

    press(element, 'Tab')
    await settled(element)

    const first = element.querySelector(`.${classes.pickerDetail} [role="option"]`)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(first?.id)
    expect(document.activeElement).toBe(field(element))
  })

  it('walks back up the list and stops at the first row', async () => {
    const element = picker([...users])
    await settled(element)

    press(element, 'ArrowDown')
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)

    press(element, 'ArrowUp')
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)

    press(element, 'ArrowUp')
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
  })

  it('says which row of the list is the one being stood on', async () => {
    const element = picker([...users])
    await settled(element)

    expect(rows(element).map(row => row.getAttribute('aria-selected'))).toEqual(['true', 'false'])

    press(element, 'ArrowDown')
    await settled(element)

    expect(rows(element).map(row => row.getAttribute('aria-selected'))).toEqual(['false', 'true'])
  })

  it('marks no row of the pane while the list is the one being walked', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    expect([...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]
      .map(row => row.getAttribute('aria-selected'))).toEqual(['false'])
  })

  it('lets a tab back out go by while the list is the one being walked', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    const key = press(element, 'Tab', true)
    await settled(element)

    expect(key.defaultPrevented).toBe(false)
    expect(rows(element)[0]?.getAttribute('aria-selected')).toBe('true')
  })

  it('stops at the last row of the list and of the pane', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [
        { id: '3', title: 'Editors', depth: 0 },
        { id: '9', title: 'Everyone', depth: 0 },
      ],
    }])
    await settled(element)

    press(element, 'ArrowDown')
    press(element, 'ArrowDown')
    await settled(element)

    expect(rows(element)[0]?.getAttribute('aria-selected')).toBe('true')

    press(element, 'Tab')
    press(element, 'ArrowDown')
    press(element, 'ArrowDown')
    await settled(element)

    const pane = [...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]

    expect(pane.map(row => row.getAttribute('aria-selected'))).toEqual(['false', 'true'])
  })

  it('keeps its place in the pane when the tab or a shifted key comes again', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [
        { id: '3', title: 'Editors', depth: 0 },
        { id: '9', title: 'Everyone', depth: 0 },
      ],
    }])
    const marks = (): (string | null)[] =>
      [...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]
        .map(row => row.getAttribute('aria-selected'))
    await settled(element)

    press(element, 'Tab')
    press(element, 'ArrowDown')
    await settled(element)

    expect(marks()).toEqual(['false', 'true'])

    press(element, 'Tab')
    await settled(element)

    expect(marks()).toEqual(['false', 'true'])

    press(element, 'ArrowDown', true)
    await settled(element)

    expect(marks()).toEqual(['false', 'true'])
  })

  it('crosses into no pane for a key that is not the tab', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    press(element, 'a')
    await settled(element)

    expect([...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]
      .map(row => row.getAttribute('aria-selected'))).toEqual(['false'])
  })

  it('lets the tab go by when no row is left to cross from', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    await type(element, 'nobody')
    const key = press(element, 'Tab')
    await settled(element)

    expect(key.defaultPrevented).toBe(false)
    expect(element.textContent.replace(/\s+/g, ' ').trim())
      .toBe('Nothing matches ↑↓ move ⇥ inherits ↵ view as esc clear 0 users')
  })

  it('lets the tab go by when the row has no detail to cross into', async () => {
    const element = picker([entry('7', 'Content Reviewers', '', '')])
    await settled(element)

    const key = press(element, 'Tab')
    await settled(element)

    expect(key.defaultPrevented).toBe(false)
    expect(element.querySelector(`.${classes.pickerDetail} [role="option"]`)).toBeNull()
  })

  it('comes back to the list when the tab is taken back out of the pane', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    press(element, 'Tab')
    await settled(element)

    const back = press(element, 'Tab', true)
    await settled(element)

    expect(back.defaultPrevented).toBe(true)
    expect(field(element).getAttribute('aria-activedescendant'))
      .toBe(rows(element)[0]?.id)
  })

  it('walks the pane with the same arrows once the tab has crossed into it', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [
        { id: '3', title: 'Editors', depth: 0 },
        { id: '9', title: 'Everyone', depth: 0 },
      ],
    }])
    await settled(element)
    press(element, 'Tab')
    await settled(element)

    press(element, 'ArrowDown')
    await settled(element)

    const pane = [...element.querySelectorAll(`.${classes.pickerDetail} [role="option"]`)]

    expect(field(element).getAttribute('aria-activedescendant')).toBe(pane[1]?.id)
    expect(pane[1]?.getAttribute('aria-selected')).toBe('true')
  })

  it('says in the footer which key crosses into the pane', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent).toContain('inherits')
  })

  it('opens on the first row of the list, whatever the last visit left', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    const trigger = openedBy(element)
    await settled(element)
    await type(element, 'rev')
    press(element, 'Tab')
    await settled(element)
    press(element, 'Escape')

    open(element, trigger)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
    expect(field(element).value).toBe('')
  })

  it.each([['loading'], ['failed']] as const)('counts nothing while %s', async state => {
    const element = picker([])
    Object.assign(element, { state })
    await settled(element)

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent.trim()).toBe('')
  })

  it.each([['loading'], ['failed']] as const)(
    'draws no rows while %s, whatever the last answer left behind',
    async state => {
      const element = picker([...users])
      await settled(element)
      Object.assign(element, { state })
      await settled(element)

      expect(rows(element)).toHaveLength(0)
    },
  )

  it('says the list could not be had, and offers to ask again', async () => {
    const element = picker([])
    Object.assign(element, { state: 'failed' })
    await settled(element)
    const asked: number[] = []
    element.addEventListener('vperm:retry', () => { asked.push(1) })

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent)
      .toContain('The list of users could not be loaded')

    element.querySelector<HTMLButtonElement>(`.${classes.pickerList} button`)?.click()

    expect(asked).toHaveLength(1)
  })

  it('says the list is on its way while it is being fetched', async () => {
    const element = picker([])
    Object.assign(element, { state: 'loading' })
    await settled(element)

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent.trim())
      .toBe('Loading users…')
  })

  it('counts what it found and how many of them it shows', async () => {
    const many = Array.from({ length: 60 }, (_, at) => entry(String(at), `Bernd ${String(at)}`, '', ''))
    const element = picker([...many, entry('x', 'Zulu Singleton', '', '')])
    await settled(element)

    await type(element, 'bernd')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('50 of 60')

    await type(element, 'zulu')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('1 user')
  })

  it('counts a list that fills the cap exactly as a whole', async () => {
    const fifty = Array.from({ length: 50 }, (_, at) => entry(String(at), `Bernd ${String(at)}`, '', ''))
    const element = picker(fifty)
    await settled(element)

    await type(element, 'bernd')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('50 users')
    expect(element.querySelector(`.${classes.pickerList} > p`)).toBeNull()
  })

  it('counts nothing over a long list when no words were handed over', async () => {
    const element = document.createElement(elements.picker)
    Object.assign(element, {
      entries: Array.from({ length: 60 }, (_, at) => entry(String(at), `Bernd ${String(at)}`, '', '')),
    })
    document.body.append(element)
    await settled(element)

    await type(element, 'bernd')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('')
  })

  it('says nothing anywhere when the backend handed over no words', async () => {
    const element = document.createElement(elements.picker)
    Object.assign(element, { entries: [...users] })
    document.body.append(element)
    await settled(element)

    expect(field(element).getAttribute('placeholder')).toBe('')
    expect(element.getAttribute('popover')).toBe('manual')

    Object.assign(element, { state: 'loading' })
    await settled(element)

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent.trim()).toBe('')

    Object.assign(element, { state: 'failed' })
    await settled(element)

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent.trim()).toBe('')

    Object.assign(element, { state: 'ready' })
    await type(element, 'hans')

    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('')

    await type(element, '')

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent.replace(/\s+/g, ' ').trim())
      .toBe('↑↓ ⇥ ↵ esc')
    expect(element.querySelector(`.${classes.pickerTally}`)?.textContent).toBe('')

    await type(element, 'nobody')

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent.trim()).toBe('')
    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent.replace(/\s+/g, ' ').trim())
      .toBe('↑↓ ⇥ ↵ esc')
  })

  it('says so rather than standing empty when nothing matches', async () => {
    const element = picker([...users])
    await settled(element)

    await type(element, 'nobody')

    expect(element.querySelector(`.${classes.pickerList}`)?.textContent.trim())
      .toBe('Nothing matches')
  })

  it('keeps the tab order off both lists', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    expect([...element.querySelectorAll('[role="listbox"]')]
      .map(list => list.getAttribute('tabindex'))).toEqual(['-1', '-1'])
  })

  it('heads the pane with the whole name of the row shown', async () => {
    const element = picker([{
      ...entry('7', 'Bernd Werner Steinberger', 'tu10000021', ''),
      detailHeading: 'In 1 group',
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerHead}`)?.textContent)
      .toContain('Bernd Werner Steinberger')
  })

  it('comes back to the list when the pointer rests on a row of it', async () => {
    vi.useFakeTimers()
    const element = picker([
      { ...entry('7', 'Content Reviewers', '', ''), detail: [{ id: '3', title: 'Editors', depth: 0 }] },
      { ...entry('8', 'Content Writers', '', ''), detail: [{ id: '4', title: 'Writers', depth: 0 }] },
    ])
    await settled(element)
    press(element, 'Tab')
    await settled(element)

    rows(element)[1]?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    vi.advanceTimersByTime(80)
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)
    vi.useRealTimers()
  })

  it('comes back to the list as soon as something is typed', async () => {
    const element = picker([
      { ...entry('7', 'Content Reviewers', '', ''), detail: [{ id: '3', title: 'Editors', depth: 0 }] },
      { ...entry('8', 'Content Writers', '', ''), detail: [{ id: '4', title: 'Writers', depth: 0 }] },
    ])
    await settled(element)
    press(element, 'Tab')
    await settled(element)

    await type(element, 'writ')

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
  })

  it('comes back out of the pane on shift tab', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    press(element, 'Tab')
    await settled(element)

    field(element).dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Tab', shiftKey: true, bubbles: true, cancelable: true,
    }))
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[0]?.id)
  })

  it('takes the pane row the field is standing on when the return key comes', async () => {
    const element = picker([{
      ...entry('7', 'Content Reviewers', '', ''),
      detail: [{ id: '3', title: 'Editors', depth: 0 }],
    }])
    await settled(element)
    const taken: string[] = []
    element.addEventListener('vperm:detail-picked', event => {
      taken.push((event as CustomEvent<{ id: string }>).detail.id)
    })

    press(element, 'Tab')
    await settled(element)
    press(element, 'Enter')

    expect(taken).toEqual(['3'])
  })

  it('moves the active row on an arrow pressed outside the field', async () => {
    const element = picker([...users])
    await settled(element)

    element.querySelector('[role="listbox"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await settled(element)

    expect(field(element).getAttribute('aria-activedescendant')).toBe(rows(element)[1]?.id)
  })

  it('says the key clears the field while something is in it', async () => {
    const element = picker([...users])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent).toContain('close')

    await type(element, 'hub')

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent).toContain('clear')
  })

  it('empties the field on escape, and leaves the panel standing', async () => {
    const element = picker([...users])
    await settled(element)
    openedBy(element)
    await type(element, 'hub')

    press(element, 'Escape')
    await settled(element)

    expect(field(element).value).toBe('')
    expect(element.hasAttribute('data-open')).toBe(true)
  })

  it('says in the footer which key closes it', async () => {
    const element = picker([...users])
    await settled(element)

    expect(element.querySelector(`.${classes.pickerHints}`)?.textContent).toContain('close')
  })

  it('marks where the match was found', async () => {
    const element = picker([...users])
    await settled(element)

    await type(element, 'hub')

    expect(rows(element)[0]?.querySelector('mark')?.textContent).toBe('Hub')
  })
})
