import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reopenDocument, rememberDocument } from '#src/view-as-user/reopen-document.js'
import { asked, forget, reply } from '../__mocks__/typo3-ajax-request.js'

describe('the document that stood on the screen', () => {
  beforeEach(() => {
    sessionStorage.clear()
    forget()
    document.body.innerHTML = '<typo3-backend-module-router module="web_layout" endpoint="/typo3/module/web/layout?id=63"></typo3-backend-module-router>'
  })

  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('puts the document back into the frame of the screen that lands', async () => {
    reply({ url: '/typo3/record/edit?token=fresh&edit%5Btt_content%5D%5B81%5D=edit' })
    rememberDocument('tt_content:81', '/typo3/module/web/layout?id=63')

    reopenDocument(document)

    await vi.waitFor(() => {
      document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

      expect(document.querySelector('typo3-backend-module-router')?.getAttribute('endpoint'))
        .toContain('/typo3/record/edit?token=fresh')
    })
    expect(asked[0]).toContain('visual_permissions_open_document')
    expect(asked[0]).toContain('table=tt_content')
    expect(asked[0]).toContain('uids=81')
    expect(asked[0]).toContain('returnUrl=')
  })

  it('reads the screen off the shell, not off the address bar', async () => {
    const shell = document.createElement('typo3-backend-module-router')
    shell.setAttribute('endpoint', '/typo3/module/web/layout?token=fresh&id=63')
    document.body.replaceChildren(shell)

    const landing = {
      location: new URL('https://example.com/typo3/main?redirect=web_layout&redirectParams=id%3D63'),
      querySelector: (name: string): Element | null => document.querySelector(name),
      addEventListener: document.addEventListener.bind(document),
    } as unknown as Document

    reply({ url: '/typo3/record/edit?token=fresh&edit%5Btt_content%5D%5B81%5D=edit' })
    rememberDocument('tt_content:81', 'https://example.com/typo3/module/web/layout?id=63')

    reopenDocument(landing)

    await vi.waitFor(() => {
      document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

      expect(shell.getAttribute('endpoint')).toContain('/typo3/record/edit?token=fresh')
    })
    expect(asked[0]).toContain(`returnUrl=${encodeURIComponent('/typo3/module/web/layout?token=fresh&id=63')}`)
  })

  // The module's own document loads this too, and stands at the very URL the note was
  // left for. It holds no shell, so a note taken there is a note nobody puts back.
  it('leaves the note alone in a document that holds no shell', async () => {
    document.body.innerHTML = '<div></div>'
    reply({ url: '/typo3/record/edit?token=fresh' })
    rememberDocument('tt_content:81', document.location.href)

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
    expect(sessionStorage.getItem('vperm.opening')).not.toBeNull()
  })

  it('puts the document back on a screen that names no page', async () => {
    document.body.innerHTML = '<typo3-backend-module-router endpoint="/typo3/module/content/records"></typo3-backend-module-router>'
    reply({ url: '/typo3/record/edit?token=fresh' })
    rememberDocument('tt_content:81', '/typo3/module/content/records')

    reopenDocument(document)

    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })
    expect(asked[0]).toContain('table=tt_content')
  })

  it('asks for nothing when no note was left', async () => {
    reply({ url: '/typo3/record/edit?token=fresh' })

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
  })

  // An empty URL is no URL; putting one empties the screen
  it('leaves the frame alone when the backend names an empty URL', async () => {
    reply({ url: '' })
    rememberDocument('tt_content:81', '/typo3/module/web/layout?id=63')

    reopenDocument(document)

    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })
    await new Promise(resolve => { setTimeout(resolve) })
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(document.querySelector('typo3-backend-module-router')?.getAttribute('endpoint'))
      .toBe('/typo3/module/web/layout?id=63')
  })

  it('leaves the note alone on the same module showing another page', async () => {
    reply({ url: '/typo3/record/edit?token=fresh' })
    rememberDocument('tt_content:81', '/typo3/module/web/layout?id=99')

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
    expect(sessionStorage.getItem('vperm.opening')).not.toBeNull()
  })

  it('leaves the frame alone when the backend names no URL', async () => {
    reply({})
    rememberDocument('tt_content:81', '/typo3/module/web/layout?id=63')

    reopenDocument(document)

    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })
    await new Promise(resolve => { setTimeout(resolve) })
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(document.querySelector('typo3-backend-module-router')?.getAttribute('endpoint'))
      .toBe('/typo3/module/web/layout?id=63')
  })

  // A note is read by a page that may be newer than the one that wrote it, and whatever is
  // under that key may be no note of ours at all.
  it('leaves a note it cannot read alone', async () => {
    sessionStorage.setItem('vperm.opening', 'not a note')
    reply({ url: '/typo3/record/edit?token=fresh' })

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
  })

  // A shell that names no screen yet is a screen still on its way, and the note is for
  // whichever screen lands.
  it('leaves the note alone while the shell names no screen', async () => {
    document.body.innerHTML = '<typo3-backend-module-router></typo3-backend-module-router>'
    reply({ url: '/typo3/record/edit?token=fresh' })
    rememberDocument('tt_content:81', '/typo3/module/web/layout?id=63')

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
    expect(sessionStorage.getItem('vperm.opening')).not.toBeNull()
  })

  // Most screens hold no document at all, and a note saying so would have the screen that
  // lands ask the backend for nothing.
  it('writes no note when no document stood on the screen', () => {
    rememberDocument('', '/typo3/module/web/layout?id=63')

    expect(sessionStorage.getItem('vperm.opening')).toBeNull()
  })

  // The note is written on the screen that is leaving, and that screen runs this too: it
  // must leave the note for the screen it is meant for, or the document is put back where
  // nobody asked for it and is gone by the time the right screen lands.
  it('leaves the note alone on any screen but the one it is meant for', async () => {
    reply({ url: '/typo3/record/edit?token=fresh' })
    rememberDocument('tt_content:81', 'https://example.com/typo3/module/content/records?id=63')

    reopenDocument(document)

    await new Promise(resolve => { setTimeout(resolve) })

    expect(asked).toStrictEqual([])
    expect(sessionStorage.getItem('vperm.opening')).not.toBeNull()
  })
})
