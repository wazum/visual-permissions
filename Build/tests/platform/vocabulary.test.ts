import { describe, expect, it } from 'vitest'
import { fieldOf, isReachable, tableOf } from '#src/platform/vocabulary.js'

describe('what a group reaches', () => {
  it('counts what it allows itself and what a group behind it allows', () => {
    expect(isReachable('allowed')).toBe(true)
    expect(isReachable('allowedAndInherited')).toBe(true)
    expect(isReachable('inherited')).toBe(true)
  })

  it('does not count what nobody allowed', () => {
    expect(isReachable('denied')).toBe(false)
  })

  it('does not count a table the backend said nothing about', () => {
    expect(isReachable(undefined)).toBe(false)
  })
})

describe('a field token', () => {
  it('names its table and its field', () => {
    expect([tableOf('tt_content:header'), fieldOf('tt_content:header')]).toStrictEqual(['tt_content', 'header'])
  })
})
