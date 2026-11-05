import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initialise } from '#src/surfaces/record-form/compatibility/docheader.js'

describe('the head FormEngine hangs its own button in', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    document.body.replaceChildren()
  })

  afterEach(() => { listening.abort() })

  it('calls a head that arrives later by that name too', async () => {
    initialise(document, listening.signal)

    const head = document.createElement('div')
    head.className = 'module-docheader module-docheader-buttons t3js-module-docheader-buttons'
    document.body.append(head)

    await vi.waitFor(() => {
      expect(head.classList.contains('t3js-module-docheader-bar-buttons')).toBe(true)
    })
  })

  it('calls a head standing now by the name 13.4 looks for', () => {
    const head = document.createElement('div')
    head.className = 'module-docheader module-docheader-buttons t3js-module-docheader-buttons'
    document.body.append(head)

    initialise(document, listening.signal)

    expect(head.classList.contains('t3js-module-docheader-bar-buttons')).toBe(true)
  })

  it('calls a head that arrives deeper in the page by that name too', async () => {
    const panel = document.createElement('div')
    document.body.append(panel)
    initialise(document, listening.signal)

    const head = document.createElement('div')
    head.className = 'module-docheader module-docheader-buttons t3js-module-docheader-buttons'
    panel.append(head)

    await vi.waitFor(() => {
      expect(head.classList.contains('t3js-module-docheader-bar-buttons')).toBe(true)
    })
  })

  it('stops watching the page when the backend lets go', async () => {
    initialise(document, listening.signal)
    listening.abort()

    const head = document.createElement('div')
    head.className = 'module-docheader module-docheader-buttons t3js-module-docheader-buttons'
    document.body.append(head)
    await new Promise(settled => { setTimeout(settled, 10) })

    expect(head.classList.contains('t3js-module-docheader-bar-buttons')).toBe(false)
  })
})
