import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeTable } from '#src/allow-tables/write.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the tables a group is allowed', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends how far a group is to reach into a table', async () => {
    await writeTable(7, 'sys_file_reference', true, false)

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_allow_tables',
      body: { group: 7, operations: [{ table: 'sys_file_reference', select: true, modify: false }] },
    }])
  })
})
