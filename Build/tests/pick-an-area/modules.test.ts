import { describe, expect, it } from 'vitest'
import { openedByUs, openModule } from '#src/pick-an-area/modules.js'

describe('the module we asked the backend for', () => {
  it('is told apart from one the admin opened themselves', () => {
    openModule('web_layout')

    expect(openedByUs('records')).toBe(false)
  })

  // The answer stands for one arrival only: the next module to land is the admin's own.
  it('is ours to claim once', () => {
    openModule('web_layout')

    expect(openedByUs('web_layout')).toBe(true)
    expect(openedByUs('web_layout')).toBe(false)
  })
})
