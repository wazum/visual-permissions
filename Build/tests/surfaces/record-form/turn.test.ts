import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { classes } from '#src/platform/contract.js'
import { flipForm } from '#src/surfaces/record-form/turn.js'

const drawForm = (): HTMLElement => {
  document.body.innerHTML = '<form name="editform"><div class="tab-content"></div></form>'

  return document.querySelector('form') as HTMLElement
}

describe('turning the record form over', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.replaceChildren()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the other side halfway through the turn', () => {
    const form = drawForm()
    let turned = false

    flipForm(document, () => { turned = true })

    expect(form.classList.contains(classes.turning)).toBe(true)
    expect(turned).toBe(false)

    vi.advanceTimersByTime(280)

    expect(turned).toBe(true)
  })

  it('shows the other side at once where there is no form to turn', () => {
    let turned = false

    flipForm(document, () => { turned = true })

    expect(turned).toBe(true)
  })

  it('leaves the form still again once it has landed, and not before', () => {
    const form = drawForm()

    flipForm(document, () => undefined)
    vi.advanceTimersByTime(280)

    expect(form.classList.contains(classes.turning)).toBe(true)

    vi.advanceTimersByTime(280)

    expect(form.classList.contains(classes.turning)).toBe(false)
  })
})
