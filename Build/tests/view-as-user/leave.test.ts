import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { initialise } from '#src/view-as-user/leave.js'
import { noteRoomWidth, rememberUser } from '#src/view-as-user/places.js'
import { selectGroup } from '#src/platform/session.js'
import { prime, quiet, stored } from '../__mocks__/typo3-persistent-storage.js'

const exitButton = 'typo3-backend-switch-user[mode="exit"]'

describe('leaving a user behind', () => {
  let listening: AbortController

  beforeEach(() => {
    listening = new AbortController()
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div><ul class="toolbar-list"><li class="dropdown-menu">'
      + `<${exitButton.replace('[mode="exit"]', '')} mode="exit" class="btn btn-sm btn-default">`
      + 'Exit switch user mode'
      + '</typo3-backend-switch-user></li></ul>'
  })

  afterEach(() => {
    document.body.removeAttribute(attributes.leaving)
    vi.restoreAllMocks()
    sessionStorage.clear()
    listening.abort()
  })

  // A browser told to keep no site data at all throws rather than taking a note. Being
  // stuck in somebody else's backend is a far worse place to leave an admin than their
  // own starting page.
  it('sends the backend on its way even when the tab refuses to hold a note', () => {
    rememberUser('2')
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })
    initialise(document, listening.signal)

    document.querySelector<HTMLElement>(exitButton)?.click()

    expect(document.body.getAttribute(attributes.leaving)).toBe('up')
  })

  // The admin wants to return to the last screen, not the user's start page
  it('notes where the user was before the screen goes', () => {
    rememberUser('2')
    initialise(document, listening.signal)

    document.querySelector<HTMLElement>(exitButton)?.click()

    expect(JSON.parse(sessionStorage.getItem('vperm.seen') ?? '{}')).toHaveProperty('2')
  })

  // The way back ends where View ended, so its room is as wide as the one the admin left
  // The way back starts on the line the admin's controls started on, at the end of the module panel
  it('lets the site reach to the end of the module panel', () => {
    globalThis.ResizeObserver = class {
      observe(): void { /* The panel is not changed here */ }
      disconnect(): void { /* Nothing to let go of */ }
    } as unknown as typeof ResizeObserver
    document.body.insertAdjacentHTML('afterbegin', `<style>.${classes.leaveRoom} { margin-inline-start: 24px }</style><div class="scaffold-sidebar"></div>`)
    document.querySelector('.topbar-site-container')?.insertAdjacentHTML('afterbegin', '<div class="topbar-site"></div>')
    const at = (left: number, right: number) => () => ({ left, right, top: 0, bottom: 0, width: right - left, height: 0, x: left, y: 0, toJSON: () => ({}) })
    const [panel, site] = [...document.querySelectorAll<HTMLElement>('.scaffold-sidebar, .topbar-site')]
    if (panel === undefined || site === undefined) {
      throw new Error('no module panel and site in the document')
    }

    panel.getBoundingClientRect = at(0, 240)
    site.getBoundingClientRect = at(56, 164)

    initialise(document, listening.signal)

    expect(site.style.flexBasis).toBe('160px')
  })

  it('stands the way back in a room as wide as the controls the admin left', () => {
    noteRoomWidth(640)
    initialise(document, listening.signal)

    expect(document.querySelector<HTMLElement>(`.${classes.leaveRoom}`)?.style.getPropertyValue('--vperm-room-width'))
      .toBe('640px')
  })

  // Core's own switch leaves no note of ours, and the room then fits the way back alone
  it('gives the way back a room of its own width when no admin room was noted', () => {
    initialise(document, listening.signal)

    expect(document.querySelector<HTMLElement>(`.${classes.leaveRoom}`)?.style.getPropertyValue('--vperm-room-width'))
      .toBe('')
  })

  it('says on the button what leaving is', () => {
    initialise(document, listening.signal)

    expect(document.querySelector(`.${classes.leaveUser}`)?.textContent).toContain('Leave user view')
  })

  it('shows on the button which keys leave the view', () => {
    initialise(document, listening.signal)

    expect(document.querySelector(`.${classes.leaveUser} kbd`)?.textContent).toBe('⌘⇧V')
    expect(document.querySelector(`.${classes.leaveUser}`)?.getAttribute('aria-keyshortcuts'))
      .toBe('meta+shift+v')
  })

  it('leaves core its word and its keys where the backend published no settings', () => {
    delete TYPO3.settings.visualPermissions

    initialise(document, listening.signal)

    const wayOut = document.querySelector(`.${classes.leaveUser}`)

    expect(wayOut?.textContent).toBe('Exit switch user mode')
    expect(wayOut?.querySelector('kbd')).toBeNull()
  })

  it('leaves the keys off the button where an installation says so', () => {
    TYPO3.settings.visualPermissions = { switchUserKey: 'v', keysOnButtons: false, leave: 'Leave user view' }

    initialise(document, listening.signal)

    expect(document.querySelector(`.${classes.leaveUser} kbd`)).toBeNull()
  })

  it('sends the backend on its way when the key is pressed', () => {
    rememberUser('2')
    initialise(document, listening.signal)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', metaKey: true, shiftKey: true }))

    expect(document.body.getAttribute(attributes.leaving)).toBe('up')
  })

  it('stops sending the backend away once the page lets go', () => {
    initialise(document, listening.signal)
    const ours = document.querySelector<HTMLElement>(`.topbar-site-container ${exitButton}`)

    listening.abort()
    ours?.click()

    expect(document.body.hasAttribute(attributes.leaving)).toBe(false)
  })

  it('leaves the way out where core put it when the header has no room', () => {
    document.querySelector('.topbar-site-container')?.remove()

    initialise(document, listening.signal)

    expect(document.querySelector(`.toolbar-list ${exitButton}`)).not.toBeNull()
    expect(document.querySelector(`.${classes.leaveRoom}`)).toBeNull()
  })

  it('leaves the way out in the document when the room goes', async () => {
    initialise(document, listening.signal)
    prime({})

    listening.abort()
    selectGroup(13)
    await quiet()

    expect(stored()).toStrictEqual({})
  })

  // An empty room holds the header open for nothing; remove it when the page closes
  it('takes the room with it once the page lets go', () => {
    initialise(document, listening.signal)

    listening.abort()

    expect(document.querySelector(`.topbar-site-container .${classes.leaveRoom}`)).toBeNull()
  })

  it('stands as tall as the button whose place it takes', () => {
    initialise(document, listening.signal)

    const stood = document.querySelector(exitButton)

    expect(stood?.classList.contains('btn-sm')).toBe(false)
    expect(stood?.classList.contains('btn')).toBe(true)
  })

  it('sends the backend on its way when the way back is pressed', () => {
    initialise(document, listening.signal)

    document.querySelector<HTMLElement>(exitButton)?.click()

    expect(document.body.getAttribute(attributes.leaving)).toBe('up')
  })

  it('leaves the header alone when nobody was switched to', () => {
    document.querySelector(exitButton)?.remove()

    initialise(document, listening.signal)

    expect(document.querySelector('.topbar-site-container')?.children).toHaveLength(0)
  })

  it('leaves core its own way back in the user menu', () => {
    initialise(document, listening.signal)

    expect(document.querySelector(`.dropdown-menu ${exitButton}`)).not.toBeNull()
    expect(document.querySelector(`.topbar-site-container ${exitButton}`)).not.toBeNull()
  })

  it('stands the way back in the header in room of its own', () => {
    initialise(document, listening.signal)

    const stood = document.querySelector(
      `.topbar-site-container .${classes.leaveRoom} ${exitButton}`,
    )

    expect(stood).not.toBeNull()
    expect(stood?.classList.contains(classes.leaveUser)).toBe(true)
  })
})
