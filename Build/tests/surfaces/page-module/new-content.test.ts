import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { activate, deactivate, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/surfaces/page-module/new-content.js'

const wizardButton = (): HTMLElement => {
  const frame = document.createElement('iframe')
  frame.id = 'typo3-contentIframe'
  document.body.replaceChildren(frame)
  const button = document.createElement('typo3-backend-new-content-element-wizard-button')
  button.append(document.createElement('typo3-backend-icon'), document.createTextNode(' Create new content '))
  frame.contentDocument?.body.append(button)

  return button
}

describe('the button that opens the new content wizard', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    TYPO3.lang = { 'readOnly.previewNewContent': 'Preview new content' }
    listening = new AbortController()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
    TYPO3.lang = {}
  })

  it('offers to preview new content while permissions are shown', () => {
    const button = wizardButton()
    initialise(document, listening.signal)

    activate()

    expect(button.textContent.trim()).toBe('Preview new content')
  })

  it('offers to create new content again once permissions are hidden', () => {
    const button = wizardButton()
    initialise(document, listening.signal)

    activate()
    deactivate()

    expect(button.textContent.trim()).toBe('Create new content')
  })
})
