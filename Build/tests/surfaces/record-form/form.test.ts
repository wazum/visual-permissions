import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { formReady, onFormReady } from '#src/surfaces/record-form/form.js'

describe('the record form', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
  })

  it('hands the form and its fields to whoever waits for it', () => {
    const field = document.createElement('div')
    const heard: unknown[] = []
    onFormReady(form => { heard.push(form) }, listening.signal)

    formReady({ doc: document, fields: [field] })

    expect(heard).toStrictEqual([{ doc: document, fields: [field] }])
  })

  it('stops handing it over once the listener has gone', () => {
    const gone = new AbortController()
    let heard = 0
    onFormReady(() => { heard += 1 }, gone.signal)

    gone.abort()
    formReady({ doc: document, fields: [] })

    expect(heard).toBe(0)
  })

  it('hands nothing to a listener that came after its page was gone', () => {
    const gone = new AbortController()
    gone.abort()
    let heard = 0
    onFormReady(() => { heard += 1 }, gone.signal)

    formReady({ doc: document, fields: [] })

    expect(heard).toBe(0)
  })
})
