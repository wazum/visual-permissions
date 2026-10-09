import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit } from '#src/platform/bus.js'
import { verdicts } from '#src/platform/contract.js'
import { activate, deactivate, getState, pickArea, selectGroup, turnTo } from '#src/platform/session.js'
import { createDraft } from '#src/grant-fields/draft.js'
import { initialise as pickFields } from '#src/grant-fields/pick.js'
import { initialise as judgeFields } from '#src/grant-fields/fields.js'
import { initialise as drawMarks } from '#src/grant-fields/mark-card.js'
import { createJudgement } from '#src/grant-fields/judgement.js'
import { formReady } from '#src/surfaces/record-form/form.js'
import { forget, reply } from '../__mocks__/typo3-ajax-request.js'
import { drawForm, row } from './form-fixture.js'

const wordsIn = (file: string): Map<string, string> => {
  const xliff = new DOMParser().parseFromString(
    readFileSync(resolve(process.cwd(), '../Resources/Private/Language', file), 'utf8'),
    'application/xml',
  )

  return new Map([...xliff.querySelectorAll('trans-unit')].map(unit => [
    unit.id,
    (unit.querySelector('target') ?? unit.querySelector('source'))?.textContent ?? '',
  ]))
}

const labels = verdicts.flatMap(verdict => [`grantFields.mark.${verdict}.title`, `grantFields.mark.${verdict}.meaning`])

describe.each(['locallang.xlf', 'de.locallang.xlf'])('%s', file => {
  const words = wordsIn(file)

  it.each(labels)('says %s', label => {
    expect(words.get(label) ?? '').not.toBe('')
  })
})

const markOf = (token: string): HTMLButtonElement | null =>
  document.querySelector(`[data-vperm-token="${token}"] .vperm-mark`)

const cardOf = (): HTMLElement => document.querySelector<HTMLElement>('[role="dialog"]') ?? document.createElement('div')

const judged = (targets: Record<string, string>, givenBy: Record<string, number[]> = {}): void => {
  reply({
    group: { id: 7, title: 'Editors' },
    chain: [
      { groupId: 7, title: 'Editors', depth: 0 },
      { groupId: 6, title: 'Consectetur', depth: 1 },
      { groupId: 5, title: 'Aliquam', depth: 2 },
    ],
    scopes: { fields: { targets, givenBy }, tablesModify: { targets: { pages: 'allowed' } } },
  })
}

describe('a field\'s mark', () => {
  let listening: AbortController

  beforeEach(() => {
    TYPO3.lang = Object.fromEntries(wordsIn('locallang.xlf'))
    localStorage.clear()
    forget()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
    const judgement = createJudgement()
    judgeFields(judgement, listening.signal)
    drawMarks(judgement, listening.signal)
    activate()
    pickArea('fields')
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it.each([
    ['allowed', 'Allowed'],
    ['allowedAndInherited', 'Allowed, and inherited'],
    ['inherited', 'Inherited'],
    ['denied', 'Not allowed'],
    ['neverEditable', 'Read-only'],
    ['adminOnly', 'Administrators only'],
    ['notApplicable', 'Open to all editors'],
  ])('is named for a field the group finds %s', async (verdict, name) => {
    judged({ 'pages:title': verdict })

    drawForm(row('pages:title', verdict))

    await vi.waitFor(() => {
      expect(markOf('pages:title')?.getAttribute('aria-label')).toBe(name)
    })
  })

  it('marks the fields of a form in a document of its own', async () => {
    judged({ 'pages:title': 'denied' })
    const frame = document.implementation.createHTMLDocument()
    frame.body.innerHTML = row('pages:title', 'denied')

    formReady({ doc: frame, fields: [...frame.querySelectorAll('[data-vperm-token]')] })

    await vi.waitFor(() => {
      expect(frame.querySelector('.vperm-mark')?.getAttribute('aria-label')).toBe('Not allowed')
    })
  })

  it('leaves a field without a heading unmarked', async () => {
    judged({ 'pages:title': 'denied', 'pages:slug': 'denied' })

    drawForm(row('pages:title', 'denied'), row('pages:slug', 'denied').replace(/<label[^>]*>.*?<\/label>/, ''))

    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    expect(document.querySelectorAll('.vperm-mark')).toHaveLength(1)
  })

  it('opens a card that says what it means', async () => {
    judged({ 'pages:title': 'denied' })
    drawForm(row('pages:title', 'denied'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    const mark = markOf('pages:title')
    expect([mark?.getAttribute('aria-haspopup'), mark?.getAttribute('aria-expanded')]).toStrictEqual(['dialog', 'false'])
    const sent = vi.fn((event: Event) => { event.preventDefault() })
    document.forms[0]?.addEventListener('submit', sent)

    mark?.click()

    expect(sent).not.toHaveBeenCalled()
    expect(mark?.getAttribute('aria-controls')).toBe(cardOf().id)
    expect(cardOf().hasAttribute('data-open')).toBe(true)
    expect(cardOf().getAttribute('aria-labelledby')).toBe(cardOf().querySelector('h2')?.id)
    expect(cardOf().querySelector('h2')?.textContent).toBe('Not allowed')
    expect(cardOf().querySelector('p')?.textContent).toBe('The group may not edit this field.')
    expect(markOf('pages:title')?.getAttribute('aria-expanded')).toBe('true')
  })

  it('names the groups that give an inherited field, and shows the one pressed', async () => {
    judged({ 'pages:nav_title': 'inherited' }, { 'pages:nav_title': [6, 5] })
    drawForm(row('pages:nav_title', 'inherited'))
    await vi.waitFor(() => { expect(markOf('pages:nav_title')).not.toBeNull() })

    markOf('pages:nav_title')?.click()

    expect(cardOf().querySelector('h3')?.textContent).toBe('Given by')
    expect([...cardOf().querySelectorAll('li')].map(line => line.querySelector('span')?.textContent))
      .toStrictEqual(['Consectetur', 'Aliquam'])
    const show = [...cardOf().querySelectorAll('button')]
    expect(show.map(button => [button.textContent, button.getAttribute('aria-label')])).toStrictEqual([
      ['Show group', 'Show group "Consectetur"'],
      ['Show group', 'Show group "Aliquam"'],
    ])

    show[1]?.click()

    expect(getState().groupId).toBe(5)
    expect(cardOf().hasAttribute('data-open')).toBe(false)
  })

  it('names no group for a field the group gives itself', async () => {
    judged({ 'pages:title': 'allowed', 'pages:nav_title': 'inherited' }, { 'pages:nav_title': [6] })
    drawForm(row('pages:title', 'allowed'), row('pages:nav_title', 'inherited'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })

    markOf('pages:title')?.click()

    expect(cardOf().textContent).toBe('AllowedThe group may edit this field.')
  })

  it('hands the keyboard to the card it opens, but not the pointer', async () => {
    judged({ 'pages:nav_title': 'inherited' }, { 'pages:nav_title': [6] })
    drawForm(row('pages:nav_title', 'inherited'))
    await vi.waitFor(() => { expect(markOf('pages:nav_title')).not.toBeNull() })
    const mark = markOf('pages:nav_title')
    mark?.focus()

    mark?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(document.activeElement).toBe(mark)

    mark?.click()
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Show group "Consectetur"')
  })

  it('takes the keyboard back from the card it closes', async () => {
    judged({ 'pages:nav_title': 'inherited' }, { 'pages:nav_title': [6] })
    drawForm(row('pages:nav_title', 'inherited'))
    await vi.waitFor(() => { expect(markOf('pages:nav_title')).not.toBeNull() })
    const mark = markOf('pages:nav_title')
    mark?.click()

    cardOf().hidePopover()

    expect(document.activeElement).toBe(mark)
    expect(mark?.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens under the pointer after a moment, and lets go a moment after the pointer left', async () => {
    judged({ 'pages:title': 'denied' })
    drawForm(row('pages:title', 'denied'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    vi.useFakeTimers()
    const mark = markOf('pages:title')
    const open = (): boolean => cardOf().hasAttribute('data-open')

    mark?.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(349)
    expect(open()).toBe(false)
    vi.advanceTimersByTime(1)
    expect(open()).toBe(true)

    mark?.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(249)
    cardOf().dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(1000)
    expect(open()).toBe(true)

    cardOf().dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(249)
    expect(open()).toBe(true)
    vi.advanceTimersByTime(1)
    expect(open()).toBe(false)
  })

  it('lets go of the card a moment after the pointer leaves the mark, and leaves the keyboard where it was', async () => {
    judged({ 'pages:title': 'denied' })
    drawForm(row('pages:title', 'denied'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    vi.useFakeTimers()
    const elsewhere = document.createElement('input')
    document.body.append(elsewhere)
    elsewhere.focus()
    markOf('pages:title')?.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(350)

    markOf('pages:title')?.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(249)
    expect(cardOf().hasAttribute('data-open')).toBe(true)
    vi.advanceTimersByTime(1)

    expect(cardOf().hasAttribute('data-open')).toBe(false)
    expect(document.activeElement).toBe(elsewhere)
  })

  it('carries an open card over to the next mark the pointer enters', async () => {
    judged({ 'pages:title': 'denied', 'pages:slug': 'notApplicable' })
    drawForm(row('pages:title', 'denied'), row('pages:slug', 'notApplicable'))
    await vi.waitFor(() => { expect(markOf('pages:slug')).not.toBeNull() })
    vi.useFakeTimers()
    markOf('pages:title')?.click()

    markOf('pages:title')?.dispatchEvent(new MouseEvent('mouseleave'))
    markOf('pages:slug')?.dispatchEvent(new MouseEvent('mouseenter'))

    expect(cardOf().querySelector('h2')?.textContent).toBe('Open to all editors')
    vi.advanceTimersByTime(1000)
    expect(cardOf().hasAttribute('data-open')).toBe(true)
    expect([markOf('pages:title'), markOf('pages:slug')].map(mark => mark?.getAttribute('aria-expanded')))
      .toStrictEqual(['false', 'true'])
  })

  it('says what the field became once the group is judged again', async () => {
    judged({ 'pages:title': 'denied' })
    drawForm(row('pages:title', 'denied'))
    await vi.waitFor(() => { expect(markOf('pages:title')?.getAttribute('aria-label')).toBe('Not allowed') })

    judged({ 'pages:title': 'allowed' })
    emit('permissions-written', {})

    await vi.waitFor(() => { expect(markOf('pages:title')?.getAttribute('aria-label')).toBe('Allowed') })
    expect(document.querySelectorAll('.vperm-mark')).toHaveLength(1)
  })

  it('is pressed without pressing its field', async () => {
    pickFields(createDraft(), listening.signal)
    turnTo('preview')
    judged({ 'pages:title': 'allowed' })
    drawForm(row('pages:title', 'allowed'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    const field = document.querySelector('[data-vperm-token="pages:title"]')

    markOf('pages:title')?.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(field?.getAttribute('aria-checked')).toBe('true')

    markOf('pages:title')?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }))
    expect(field?.getAttribute('aria-checked')).toBe('true')
  })

  it('stays out of the name a field strikes when it waits to change', async () => {
    pickFields(createDraft(), listening.signal)
    judged({ 'pages:title': 'denied' })
    drawForm(row('pages:title', 'denied'))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })

    turnTo('pick')

    const heading = document.querySelector('[data-vperm-token="pages:title"] .form-label')
    expect(heading?.querySelector('.vperm-field-name .vperm-mark')).toBeNull()
    expect(heading?.lastElementChild).toBe(markOf('pages:title'))
  })

  it.each([
    ['preview', 'allowed', false, 'Press the field to take it away'],
    ['preview', 'allowed', true, 'Press again to keep it'],
    ['pick', 'denied', false, 'Press the field to give it'],
    ['pick', 'denied', true, 'Press again to leave it out'],
    ['preview', 'inherited', false, null],
    ['preview', 'notApplicable', false, null],
  ] as const)('on the %s side, says for a field the group finds %s (marked: %s) what a press does', async (face, verdict, marked, hint) => {
    pickFields(createDraft(), listening.signal)
    turnTo(face)
    judged({ 'pages:title': verdict })
    drawForm(row('pages:title', verdict))
    await vi.waitFor(() => { expect(markOf('pages:title')).not.toBeNull() })
    if (marked) {
      document.querySelector<HTMLElement>('[data-vperm-token="pages:title"]')?.click()
    }

    markOf('pages:title')?.click()

    expect(cardOf().querySelector('footer')?.textContent ?? null).toBe(hint)
  })
})
