import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { viewableUsers } from '#src/view-as-user/users.js'
import {
  answerNextReadWith, asked, forget, headersSent, refuseNextRead, replyTo, tagNextAnswer,
} from '../__mocks__/typo3-ajax-request.js'

describe('the users an admin may view as', () => {
  beforeEach(() => {
    forget()
  })

  afterEach(() => {
    forget()
  })

  it('asks for the users an admin may view as', async () => {
    await viewableUsers()

    expect(asked).toStrictEqual(['/typo3/ajax/visual_permissions_viewable_users'])
  })

  it('asks whether the list it holds still stands, and keeps it when it does', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: 'Anna Huber', groups: [] }],
    })
    tagNextAnswer('"abc"')

    const first = await viewableUsers()
    answerNextReadWith(304)
    const again = await viewableUsers()

    expect(headersSent.at(-1)).toMatchObject({ 'If-None-Match': '"abc"' })
    expect(again).toStrictEqual(first)
  })

  it('answers a 304 with the list it holds rather than with the body', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: 'Anna Huber', groups: [] }],
    })
    tagNextAnswer('"abc"')
    await viewableUsers()

    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 9, username: 'nobody', realName: 'Nobody', groups: [] }],
    })
    answerNextReadWith(304)
    const again = await viewableUsers()

    expect(again.users.map(user => user.id)).toStrictEqual([2])
  })

  it('takes the new list when the backend answers with one', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: 'Anna Huber', groups: [] }],
    })
    tagNextAnswer('"abc"')
    await viewableUsers()

    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 3, username: 'author', realName: 'Max Berger', groups: [] }],
    })
    const again = await viewableUsers()

    expect(again.users.map(user => user.id)).toStrictEqual([3])
  })

  it('holds nothing when the answer carries no tag', async () => {
    replyTo('viewable_users', { recent: [], users: [] })
    tagNextAnswer('"abc"')
    await viewableUsers()

    await viewableUsers()
    await viewableUsers()

    expect(headersSent.at(-1)).toStrictEqual({})
  })

  it('hands a refusal that is no 304 back to the caller', async () => {
    answerNextReadWith(400)

    const refused = await viewableUsers()
      .catch((thrown: unknown) => (thrown as { raw: () => { status: number } }).raw().status)

    expect(refused).toBe(400)
  })

  it('hands the fault a failed request carries back to the caller', async () => {
    refuseNextRead()

    await expect(viewableUsers()).rejects.toThrow('the backend refused')
  })
})
