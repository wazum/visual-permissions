import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  notePlace,
  rememberUser,
  lastPlace,
} from '#src/view-as-user/places.js'

describe('where the user being read was last', () => {
  beforeEach(() => {
    sessionStorage.clear()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('says where a user was last read, for the next switch to land on', () => {
    sessionStorage.setItem('vperm.seen', JSON.stringify({
      2: { place: '/typo3/module/content/records?id=63' },
    }))

    expect(lastPlace('2')).toBe('/typo3/module/content/records?id=63')
  })

  it('says nowhere for a user nobody has read yet', () => {
    expect(lastPlace('2')).toBe('')
  })

  it('notes where the user was when the admin left them', () => {
    rememberUser('3')
    const userDocument = {
      location: {
        href: 'https://example.com/typo3/record/edit?edit%5Btt_content%5D%5B81%5D=edit'
          + '&returnUrl=%2Ftypo3%2Fmodule%2Fweb%2Flayout%3Fid%3D63&token=abc',
      },
    } as unknown as Document

    notePlace(userDocument)

    expect(JSON.parse(sessionStorage.getItem('vperm.seen') ?? '{}')).toStrictEqual({
      3: {
        place: 'https://example.com/typo3/module/web/layout?id=63',
        document: 'tt_content:81',
      },
    })
  })

  it('keeps a screen for each user being read', () => {
    rememberUser('3')
    notePlace(document)
    rememberUser('2')

    expect(lastPlace('3')).toBe(document.location.href)
    expect(lastPlace('2')).toBe('')
  })

  it('notes nothing when no user is being read', () => {
    notePlace(document)

    expect(sessionStorage.getItem('vperm.seen')).toBeNull()
  })

  // Browsers throw rather than saying no when told to keep no site data at all
  it('says nowhere when the tab refuses to be asked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })

    expect(lastPlace('2')).toBe('')
  })

  it('notes nothing when the tab refuses to hold a note', () => {
    rememberUser('3')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })

    expect(() => { notePlace(document) }).not.toThrow()
  })
})
