import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { writeModules } from '#src/allow-modules/write.js'
import { forget, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the modules a group is allowed', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends the modules a group is to hold', async () => {
    await writeModules(7, [{ module: 'web_layout', allow: true }])

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_allow_modules',
      body: { group: 7, operations: [{ module: 'web_layout', allow: true }] },
    }])
  })
})
