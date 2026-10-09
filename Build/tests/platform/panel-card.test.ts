import { afterEach, describe, expect, it, vi } from 'vitest'
import { burst, counted, createFlash } from '#src/platform/panel-card.js'

describe('a count in words', () => {
  it('takes the singular for one and the plural for any other number', () => {
    TYPO3.lang = { 'things.one': '%s thing', 'things.many': '%s things' }

    expect([counted('things', 1, 1), counted('things', 0, 0), counted('things', 2, 2)])
      .toStrictEqual(['1 thing', '0 things', '2 things'])
  })
})

describe('the flash on a card', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('lights what was added once the card has turned, then lets it go', () => {
    vi.useFakeTimers()
    const flash = createFlash(500)
    const seen: boolean[] = []

    flash.add('records')
    flash.start(() => { seen.push(flash.isLit('records')) })
    vi.advanceTimersByTime(500 + burst)

    expect(seen).toStrictEqual([true, false])
  })

  it('lights nothing once it is stopped before the card has turned', () => {
    vi.useFakeTimers()
    const flash = createFlash(500)
    let repainted = 0

    flash.add('records')
    flash.start(() => { repainted += 1 })
    flash.stop()
    vi.advanceTimersByTime(500 + burst)

    expect(repainted).toBe(0)
  })
})
