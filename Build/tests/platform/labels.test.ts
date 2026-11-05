import { describe, expect, it } from 'vitest'
import { labelOf } from '#src/platform/labels.js'

describe('the labels TYPO3 puts on the page', () => {
  it('reads a label by its name', () => {
    TYPO3.lang = { 'platform.cancel': 'Cancel' }

    expect(labelOf('platform.cancel')).toBe('Cancel')
  })

  it('reads a label missing from the page as nothing', () => {
    expect(labelOf('platform.cancel')).toBe('')
  })
})
