import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { routes } from '#src/platform/routes.js'
import { createLatestInspect, documentUrl, inspect, isWriting, write, type WriteOutcome } from '#src/platform/transport.js'
import {
  answer,
  answerNextWriteWith,
  breakNextWriteAnswer,
  asked,
  forget,
  holdNextRead,
  holdNextWrite,
  refuseNextWrite,
  sendNextWriteToLogin,
} from '../__mocks__/typo3-ajax-request.js'
import { forgetSessionChecks, sessionChecks } from '../__mocks__/typo3-login-refresh.js'
import { on } from '#src/platform/bus.js'

const sendWrite = async (): Promise<WriteOutcome> => write(routes.grant_tables, {})

describe('the changes the panels ask the backend for', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    forget()
    forgetSessionChecks()
  })

  afterEach(() => {
    listening.abort()
    forget()
  })

  it('names the table and the records a document URL is asked for', async () => {
    await documentUrl('pages:3,5', '/typo3/module/web/layout')

    expect(asked).toStrictEqual([
      '/typo3/ajax/visual_permissions_open_document'
      + '?table=pages&uids=3%2C5&returnUrl=%2Ftypo3%2Fmodule%2Fweb%2Flayout',
    ])
  })

  // The other scopes ask about the group alone, not tables
  it('asks about the group alone when no table is named', async () => {
    await inspect(7)

    expect(asked).toStrictEqual(['/typo3/ajax/visual_permissions_inspect?group=7'])
  })

  it('drops an answer a newer question has overtaken', async () => {
    const latest = createLatestInspect()
    const letGo = holdNextRead()

    const first = latest.inspect(7)
    const second = latest.inspect(8)
    letGo()

    expect([await first, await second]).toStrictEqual([null, answer])
  })

  it('drops an answer nobody waits for anymore', async () => {
    const latest = createLatestInspect()

    const asking = latest.inspect(7)
    latest.drop()

    await expect(asking).resolves.toBeNull()
  })

  // What comes back from the login page reads like an answer of ours, and nothing was written
  it('says a change the backend sent to the login page was never taken', async () => {
    sendNextWriteToLogin()

    await expect(sendWrite())
      .resolves.toBe('loggedOut')
  })

  // The login is core's own, and so is the dialog that asks for the password again
  it('leaves it to the backend to ask for the password again', async () => {
    sendNextWriteToLogin()

    await sendWrite()

    expect(sessionChecks()).toBe(1)
  })

  it('leaves saying that the backend took a change to whoever asked for it', async () => {
    vi.useFakeTimers()
    let announced = 0
    on('permissions-written', () => { announced += 1 }, listening.signal)

    await sendWrite()
    vi.runAllTimers()
    vi.useRealTimers()

    expect(announced).toBe(0)
  })

  it.each([[300], [500]])('says a change answered with %i failed', async status => {
    answerNextWriteWith(status)

    await expect(sendWrite()).resolves.toBe('failed')
  })

  // A refusal is worth reporting, a cancelled prompt is not, a fault is a fault
  it('says a change the backend turned down was refused', async () => {
    answerNextWriteWith(409)

    await expect(sendWrite()).resolves.toBe('refused')
  })

  it('says a change the reader left the password prompt on was cancelled', async () => {
    answerNextWriteWith(422)

    await expect(sendWrite()).resolves.toBe('cancelled')
  })

  // Core can hand back an answer it cannot read itself, and that is a fault, not a crash
  it('says a change whose answer cannot be read failed', async () => {
    breakNextWriteAnswer()

    await expect(sendWrite()).resolves.toBe('failed')
  })

  it('says a change is under way until the backend answers it', async () => {
    const letGo = holdNextWrite()

    const sending = sendWrite()
    const underWay = isWriting()
    letGo()
    await sending

    expect([underWay, isWriting()]).toStrictEqual([true, false])
  })

  it('says a change is under way while a later one is still unanswered', async () => {
    const first = sendWrite()
    const letGo = holdNextWrite()
    const second = sendWrite()
    await first

    const underWay = isWriting()
    letGo()
    await second

    expect([underWay, isWriting()]).toStrictEqual([true, false])
  })

  it('says a change that never got out failed', async () => {
    refuseNextWrite()

    await expect(sendWrite()).resolves.toBe('failed')
  })
})
