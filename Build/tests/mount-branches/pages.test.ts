import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { pages } from '#src/mount-branches/pages.js'
import { answerNextWriteWith, forget, refuseNextWrite, sent } from '../__mocks__/typo3-ajax-request.js'

describe('the page mounts', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('sends the branches a group is to mount', async () => {
    await pages.write(7, ['18'], true, new Map())

    expect(sent).toStrictEqual([{
      url: '/typo3/ajax/visual_permissions_mount_pages',
      body: { group: 7, operations: [{ page: 18, mount: true }] },
    }])
  })

  it('keeps the branches in the order the backend gave them, named as the tree names its rows', () => {
    const none = { targets: {} }

    expect(pages.mounted({
      fields: { targets: {}, givenBy: {} },
      modules: none,
      pageMounts: { targets: { 30: 'allowed', 25: 'inherited' }, order: [30, 25], unseen: [] },
      fileMounts: { targets: {}, named: {} },
      tablesModify: { targets: {}, named: {} },
      tablesSelect: none,
      fieldValues: none,
      pageTypes: none,
      fileOperations: none,
    })).toStrictEqual({ targets: { 30: 'allowed', 25: 'inherited' }, order: ['30', '25'], named: {}, unseen: [] })
  })

  it('says of a mount too what became of it', async () => {
    answerNextWriteWith(409)

    await expect(pages.write(7, ['18'], true, new Map())).resolves.toBe('refused')
  })

  it('says of a mount that never got out that it failed', async () => {
    refuseNextWrite()

    await expect(pages.write(7, ['18'], true, new Map())).resolves.toBe('failed')
  })
})
