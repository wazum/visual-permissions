import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeFields } from '#src/allow-fields/write.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the fields a group is allowed', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends the fields a group is to hold', async () => {
    await writeFields(7, [{ field: 'tt_content:header', allow: true }])

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_allow_fields',
      body: { group: 7, operations: [{ field: 'tt_content:header', allow: true }] },
    }])
  })
})
