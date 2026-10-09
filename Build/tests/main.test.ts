import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { forget } from './__mocks__/typo3-ajax-request.js'
import { prime, quiet, stored } from './__mocks__/typo3-persistent-storage.js'

describe('the backend page', () => {
  const sentTo: string[] = []
  const href = window.location.href

  beforeEach(() => {
    document.body.innerHTML = ''
    sessionStorage.clear()
    prime({})
    forget()
    sentTo.length = 0
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href, assign: (url: string) => sentTo.push(url) },
    })
  })

  afterEach(() => {
    for (const painted of [attributes.arriving, attributes.active, attributes.picked, attributes.face]) {
      document.body.removeAttribute(painted)
    }
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  // A module document written in the user's session runs on as the admin once the way back
  // was taken; were it to start, it would take the way back for itself and the backend page
  // would stay on the module core remembers
  it('starts nothing in a document the backend shows inside its frame', async () => {
    prime({ vperm: { returnTo: { place: 'https://example.com/typo3/module/content/records', document: '' } } })
    vi.spyOn(window, 'top', 'get').mockReturnValue({} as Window)

    vi.resetModules()
    await import('#src/main.js')
    await quiet()

    expect(stored()).toStrictEqual({
      vperm: { returnTo: { place: 'https://example.com/typo3/module/content/records', document: '' } },
    })
  })

  it('puts back the document the screen before it carried along', async () => {
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div><typo3-backend-module-router module="web_layout" '
      + 'endpoint="/typo3/module/web/layout?token=fresh&id=63"></typo3-backend-module-router>'
    sessionStorage.setItem('vperm.opening', JSON.stringify({
      record: 'tt_content:81',
      screen: '/typo3/module/web/layout?id=63',
    }))

    vi.resetModules()
    await import('#src/main.js')

    // Taken off the note as it is acted on, so the next page of the backend leaves the
    // reader where they then are.
    await vi.waitFor(() => { expect(sessionStorage.getItem('vperm.opening')).toBeNull() })
  })

  // A page on its way to the screen the admin left is not that screen yet, however much
  // the URL says so: the note has to outlive that page, or the document is put back
  // into a page that is already leaving and nobody sees the document at all.
  it('leaves the document note alone on a page that is on its way somewhere else', async () => {
    prime({
      vperm: {
        returnTo: { place: 'https://example.com/typo3/module/web/layout?id=63', document: 'tt_content:82' },
      },
    })
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div><typo3-backend-module-router module="web_layout" '
      + 'endpoint="/typo3/module/web/layout?token=fresh&id=63"></typo3-backend-module-router>'

    vi.resetModules()
    await import('#src/main.js')
    await quiet()

    expect(sessionStorage.getItem('vperm.opening')).not.toBeNull()
  })

  // Core lands the admin on its own screen and this page goes on to the one they left: a
  // screen only passed through is not worth showing, and the note belongs to the page that
  // stays.
  it('keeps a page on its way somewhere else under wraps, and the note with it', async () => {
    prime({
      vperm: {
        returnTo: { place: 'https://example.com/typo3/module/web/layout?id=63', document: '' },
      },
    })
    sessionStorage.setItem('vperm.arriving', 'up')

    vi.resetModules()
    await import('#src/main.js')
    await quiet()

    expect(document.body.hasAttribute(attributes.settling)).toBe(true)
    expect(document.body.hasAttribute(attributes.arriving)).toBe(false)
    expect(sessionStorage.getItem('vperm.arriving')).toBe('up')
  })

  it('paints the mode onto the page as it starts', async () => {
    prime({ vperm: { session: { version: '1', open: 'true', active: 'true', groupId: '13', area: 'pageMounts' } } })

    vi.resetModules()
    await import('#src/main.js')

    expect(document.body.getAttribute(attributes.picked)).toBe('pageMounts')
  })

  it('slides in when the page before it slid away', async () => {
    sessionStorage.setItem('vperm.arriving', 'yes')

    vi.resetModules()
    await import('#src/main.js')

    expect(document.body.hasAttribute(attributes.settling)).toBe(true)

    await vi.waitFor(() => {
      expect(document.body.hasAttribute(attributes.settling)).toBe(false)
    }, { timeout: 3000 })
  })
})
