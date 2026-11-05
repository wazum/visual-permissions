import { describe, expect, it } from 'vitest'
import { match } from '#src/platform/picker/match.js'

describe('match', () => {
  it('finds letters that follow one another anywhere in the word', () => {
    expect(match('hub', 'Hans Huber')?.at).toEqual([5, 6, 7])
  })

  it('says nothing when a letter is missing', () => {
    expect(match('xyz', 'Hans Huber')).toBeNull()
  })

  it('says nothing when a later letter is missing after the first one was found', () => {
    expect(match('hz', 'Hans Huber')).toBeNull()
  })

  it('ignores case on both sides', () => {
    expect(match('HANS', 'hans huber')?.at).toEqual([0, 1, 2, 3])
  })

  it('matches letters that are spread apart', () => {
    expect(match('hh', 'Hans Huber')?.at).toEqual([0, 5])
  })

  it('ranks a run of touching letters above the same letters spread apart', () => {
    const together = match('hub', 'Hans Huber')
    const apart = match('hub', 'Hastings Ulm Berg')

    expect(together?.score).toBeGreaterThan(apart?.score ?? 0)
  })

  it('ranks letters that open words above letters inside one', () => {
    const opening = match('hh', 'Hans Huber')
    const inside = match('hh', 'Achhammer')

    expect(opening?.score).toBeGreaterThan(inside?.score ?? 0)
  })

  it('ranks a run above letters that merely open words', () => {
    const run = match('he', 'Here')
    const scattered = match('he', 'Hans Ell')

    expect(run?.score).toBeGreaterThan(scattered?.score ?? 0)
  })

  it('ranks a match at the front above the same match further in', () => {
    const front = match('hub', 'Huber Hans')
    const later = match('hub', 'Hans Huber')

    expect(front?.score).toBeGreaterThan(later?.score ?? 0)
  })

  it('takes the best run, not the last one it found', () => {
    expect(match('ab', 'ab a b')?.at).toEqual([0, 1])
  })

  it('keeps the first of two matches that score the same', () => {
    expect(match('a', 'b a c a')?.at).toEqual([2])
  })

  it('ranks the name that is the word above one that merely holds it', () => {
    const only = match('hub', 'Huber')
    const among = match('hub', 'Hans Huber')

    expect(only?.score).toBeGreaterThan(among?.score ?? 0)
  })

  it('matches everything at no score when nothing was typed', () => {
    expect(match('', 'Hans Huber')).toEqual({ score: 0, at: [] })
  })

  it('finds a username typed in full', () => {
    expect(match('eud668282', 'eud668282')?.at).toHaveLength(9)
  })
})
