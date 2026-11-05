import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeFields } from '#src/grant-fields/write.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the fields a group is given', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends the fields a group is to hold', async () => {
    await writeFields(7, [{ field: 'tt_content:header', grant: true }])

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_grant_fields',
      body: { group: 7, operations: [{ field: 'tt_content:header', grant: true }] },
    }])
  })
})
