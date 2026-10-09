import { afterEach, describe, expect, it } from 'vitest'
import {
  notedPlace,
  shellDocument,
  openDocument,
  notedDocument,
  documentIn,
  newRecordIn,
} from '#src/platform/shell.js'

const documentAt = (href: string): Document =>
  ({ location: { href }, querySelector: (): null => null }) as unknown as Document

describe('the screen a user was standing on', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('is the screen the shell holds while the address bar says the shell own route', () => {
    const shell = document.createElement('typo3-backend-module-router')
    shell.setAttribute('endpoint', '/typo3/module/content/records?token=abc&id=63')
    document.body.append(shell)

    const landing = {
      location: { href: 'https://example.com/typo3/main?redirect=records', origin: 'https://example.com' },
      querySelector: (name: string): Element | null => document.querySelector(name),
    } as unknown as Document

    expect(shellDocument(landing)).toBe('https://example.com/typo3/module/content/records?id=63')
  })

  it('is the screen the shell holds whatever the backend route is called', () => {
    const shell = document.createElement('typo3-backend-module-router')
    shell.setAttribute('endpoint', '/cms/module/content/records?token=abc&id=63')
    document.body.append(shell)

    const landing = {
      location: { href: 'https://example.com/cms/main?redirect=records', origin: 'https://example.com' },
      querySelector: (name: string): Element | null => document.querySelector(name),
    } as unknown as Document

    expect(shellDocument(landing)).toBe('https://example.com/cms/module/content/records?id=63')
  })

  // Token belongs to one URL in one session; backend refuses it elsewhere
  it('leaves the session own token out of the screen', () => {
    expect(shellDocument(documentAt('https://example.com/typo3/module/content/records?token=abc&id=63')))
      .toBe('https://example.com/typo3/module/content/records?id=63')
  })

  it('says which document stood in that module screen', () => {
    const href = 'https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B82%2C81%5D=edit'
      + '&returnUrl=%2Ftypo3%2Fmodule%2Fweb%2Flayout%3Fid%3D63&token=def'

    expect(documentIn(documentAt(href))).toBe('tt_content:82,81')
  })

  // The address bar follows the shell only once the document has loaded
  it('names the document the shell holds while the address bar says the shell own route', () => {
    const shell = document.createElement('typo3-backend-module-router')
    shell.setAttribute('endpoint', '/typo3/record/edit?token=abc&edit%5Btt_content%5D%5B3%5D=edit')
    document.body.append(shell)

    const landing = {
      location: {
        href: 'https://example.com/typo3/main?redirect=record_edit&redirectParams=edit%255Btt_content%255D%255B3%255D%3Dedit',
        origin: 'https://example.com',
      },
      querySelector: (name: string): Element | null => document.querySelector(name),
    } as unknown as Document

    expect(documentIn(landing)).toBe('tt_content:3')
  })

  it('is nowhere while the address bar says the shell own route and the shell holds none', () => {
    const landing = {
      location: { href: 'https://example.com/typo3/main?redirect=records', origin: 'https://example.com' },
      querySelector: (name: string): Element | null => document.querySelector(name),
    } as unknown as Document

    expect(shellDocument(landing)).toBe('')

    document.body.append(document.createElement('typo3-backend-module-router'))

    expect(shellDocument(landing)).toBe('')
  })

  it('names no document on a screen that holds none', () => {
    expect(documentIn(documentAt('https://example.com/typo3/module/content/records?id=63'))).toBe('')
    expect(documentIn(documentAt('https://example.com/typo3/record/edit?edit%5Btt_content%5D=edit')))
      .toBe('')
  })

  it('knows the form of a new record that goes after another one', () => {
    expect(newRecordIn(documentAt('https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B-82%5D=new')))
      .toBe(true)
  })

  // The way back is read off the URL whoever sent the reader here wrote, and a note is
  // a place to go back to.
  it('is nowhere when the way back leads off this backend', () => {
    const href = 'https://example.com/typo3/record/edit?edit%5Bpages%5D%5B63%5D=edit'
      + '&returnUrl=https%3A%2F%2Felsewhere.example%2Ftake-me&token=def'

    expect(shellDocument(documentAt(href))).toBe('')
  })

  it('is the module screen a document belongs to', () => {
    const href = 'https://example.com/typo3/record/edit?edit%5Bpages%5D%5B63%5D=edit'
      + '&returnUrl=%2Ftypo3%2Fmodule%2Fweb%2Flayout%3Ftoken%3Dabc%26id%3D63&token=def'

    expect(shellDocument(documentAt(href)))
      .toBe('https://example.com/typo3/module/web/layout?id=63')
  })

  it('is the whole window, not whatever the frame still holds', () => {
    const frame = document.createElement('iframe')
    frame.id = 'typo3-contentIframe'
    frame.src = 'about:blank#/typo3/module/dashboard'
    document.body.append(frame)

    expect(shellDocument(document)).toBe(document.location.href)
  })
})

describe('the frame a document stands in', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  // Put module load before document load; backend needs a module marked
  it('names the document as the screen the backend is on, once the module has loaded', () => {
    const router = document.createElement('typo3-backend-module-router')
    router.setAttribute('module', 'web_layout')
    router.setAttribute('endpoint', '/typo3/module/web/layout?token=stale&id=63')
    document.body.append(router)

    openDocument(document, '/typo3/record/edit?token=fresh')

    expect(router.getAttribute('endpoint')).toBe('/typo3/module/web/layout?token=stale&id=63')

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(router.getAttribute('endpoint')).toBe('/typo3/record/edit?token=fresh')
    expect(router.getAttribute('module')).toBe('web_layout')
  })

  it('puts nothing in a document that holds no shell', () => {
    openDocument(document, '/typo3/record/edit?token=fresh')

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(document.querySelector('[endpoint]')).toBeNull()
  })

  it('puts the document in for the first module that loads and no other', () => {
    const router = document.createElement('typo3-backend-module-router')
    document.body.append(router)
    openDocument(document, '/typo3/record/edit?token=fresh')

    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))
    router.setAttribute('endpoint', '/typo3/module/content/records')
    document.dispatchEvent(new CustomEvent('typo3-module-loaded'))

    expect(router.getAttribute('endpoint')).toBe('/typo3/module/content/records')
  })
})

describe('the note that says where a user was', () => {
  it('reads the screen a note carries', () => {
    expect(notedPlace({ place: '/typo3/module/content/records?id=63' })).toBe('/typo3/module/content/records?id=63')
  })

  it('reads nowhere from a note of another shape, or from no note at all', () => {
    expect(notedPlace({ place: 7 })).toBe('')
    expect(notedPlace({ module: 'records' })).toBe('')
    expect(notedPlace(null)).toBe('')
  })

  it('reads the document a note carries, and no document from a note of another shape', () => {
    expect(notedDocument({ document: 'tt_content:82,81' })).toBe('tt_content:82,81')
    expect(notedDocument({ document: 7 })).toBe('')
    expect(notedDocument({ place: '/typo3/module/content/records' })).toBe('')
    expect(notedDocument(null)).toBe('')
  })
})
