import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/record-form/close.js'

interface Engine {
  asked: number
  preventExitIfNotSaved: (callback: (leave: boolean) => void) => void
}

const formEngine = (): Engine => {
  const frame = document.createElement('iframe')
  frame.id = 'typo3-contentIframe'
  document.body.replaceChildren(frame)
  const engine: Engine = {
    asked: 0,
    preventExitIfNotSaved () { this.asked += 1 },
  }
  Object.assign(frame.contentWindow ?? {}, { TYPO3: { FormEngine: engine } })
  document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

  return engine
}

describe('closing a record form', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('leaves at once while permissions are shown', () => {
    initialise(document, listening.signal)
    const engine = formEngine()
    activate()
    let left = false

    engine.preventExitIfNotSaved(leave => { left = leave })

    expect(left).toBe(true)
  })

  it('asks as the backend does while permissions are hidden', () => {
    initialise(document, listening.signal)
    const engine = formEngine()

    engine.preventExitIfNotSaved(() => { /* core calls back once it was answered */ })

    expect(engine.asked).toBe(1)
  })

  it('holds the form before anything else hears the module has loaded', () => {
    let left = false
    const leadAway = (): void => {
      const frame = document.querySelector<HTMLIFrameElement>('#typo3-contentIframe')
      const engine = (frame?.contentWindow as unknown as { TYPO3: { FormEngine: Engine } }).TYPO3.FormEngine
      engine.preventExitIfNotSaved(leave => { left = leave })
    }
    document.addEventListener('typo3-module-loaded', leadAway, { once: true })
    initialise(document, listening.signal)
    activate()

    formEngine()

    expect(left).toBe(true)
  })

  it('asks as the backend does once the forms are let go of', () => {
    initialise(document, listening.signal)
    activate()
    listening.abort()
    const engine = formEngine()

    engine.preventExitIfNotSaved(() => { /* core calls back once it was answered */ })

    expect(engine.asked).toBe(1)
  })

  it('leaves a module that holds no form alone', () => {
    initialise(document, listening.signal)
    const frame = document.createElement('iframe')
    frame.id = 'typo3-contentIframe'
    document.body.replaceChildren(frame)
    Object.assign(frame.contentWindow ?? {}, { TYPO3: {} })

    expect(() => document.dispatchEvent(new CustomEvent('typo3-module-loaded'))).not.toThrow()
  })
})
