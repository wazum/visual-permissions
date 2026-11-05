import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { emit, on } from '#src/platform/bus.js'

describe('the bus', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
  })

  it('hands a notification to whoever listens for it', () => {
    const heard: unknown[] = []
    on('permissions-written', detail => heard.push(detail), listening.signal)

    emit('permissions-written', {})

    expect(heard).toStrictEqual([{}])
  })

  it('dispatches a named event, so anything else can listen without asking us', () => {
    let heard = 0
    document.addEventListener('vperm:permissions-written', () => {
      heard += 1
    }, { signal: listening.signal })

    emit('permissions-written', {})

    expect(heard).toBe(1)
  })

  it('says nothing to a listener that has stopped listening', () => {
    let heard = 0
    on('permissions-written', () => {
      heard += 1
    }, listening.signal)

    listening.abort()
    emit('permissions-written', {})

    expect(heard).toBe(0)
  })
})
