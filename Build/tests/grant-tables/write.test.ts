import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeTable } from '#src/grant-tables/write.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the tables a group is given', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends the tables a group is to hold', async () => {
    await writeTable(7, 'sys_file_reference', true)

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_grant_tables',
      body: { group: 7, operations: [{ table: 'sys_file_reference', grant: true }] },
    }])
  })
})
