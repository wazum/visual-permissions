import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes, elements } from '#src/platform/contract.js'
import { initialise } from '#src/view-as-user/switch.js'
import type { Shell } from '#src/view-as-user/module-shell.js'
import { keep } from '#src/platform/persistence.js'
import { getState, selectGroup } from '#src/platform/session.js'
import {
  asked, forget, holdNextRead, refuseNextRead, reply, replyTo, sent,
} from '../__mocks__/typo3-ajax-request.js'
import { prime, quiet, stored } from '../__mocks__/typo3-persistent-storage.js'

const userPicker = (): HTMLElement => {
  const picker = document.querySelector<HTMLElement>(elements.picker)
  if (picker === null) {
    throw new Error('no user picker in the document')
  }

  return picker
}

const settled = async (): Promise<void> => {
  await (userPicker() as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete
}

const openPicker = async (): Promise<void> => {
  document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()
  await vi.waitFor(() => {
    expect(userPicker().querySelectorAll(`.${classes.pickerList} [role="option"]`).length).toBeGreaterThan(0)
  })
  await settled()
}

const press = (key: string): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, metaKey: true, shiftKey: true }))
}

const viewAs = async (name: string): Promise<void> => {
  await openPicker()
  const row = [...userPicker().querySelectorAll<HTMLElement>(`.${classes.pickerList} [role="option"]`)]
    .find(each => each.textContent.includes(name))

  if (row === undefined) {
    throw new Error(`no row for ${name}`)
  }

  row.click()
}

describe('switching to a user from the header', () => {
  let listening: AbortController
  const went: string[] = []
  const handed: { url: string, fields: Readonly<Record<string, string>> }[] = []

  const watching = (): Shell => ({
    go: url => { went.push(url) },
    handOver: (url, fields) => { handed.push({ url, fields }) },
  })

  const start = (): boolean => initialise(document, listening.signal, watching())

  beforeEach(async () => {
    // Wait after the route answers; the test before left a write on the wire
    await new Promise(resolve => { setTimeout(resolve) })
    prime({})
    forget()
    went.length = 0
    handed.length = 0
    TYPO3.settings.visualPermissions = { switchUserKey: 'v' }
    listening = new AbortController()
    document.body.innerHTML = '<div class="scaffold-header"><div class="topbar-site-container">'
      + '</div></div><typo3-backend-module-router module="records"></typo3-backend-module-router>'
      + `<button ${attributes.viewAs}>view as</button>`
      + `<span ${attributes.groups}='{"10":{"title":"Editors","inherits":[]},`
      + '"13":{"title":"Reviewers","inherits":[]}}\'></span>'
    TYPO3.lang = {
      'viewAsUser.search': 'Search users',
      'viewAsUser.recent': 'Recently viewed',
      'viewAsUser.all': 'All users',
      'platform.picker.key.move': 'move',
      'platform.picker.key.close': 'close',
      'viewAsUser.key.take': 'view as',
      'viewAsUser.detail.one': 'In 1 group',
      'viewAsUser.detail.many': 'In %s groups',
      'viewAsUser.detail.none': 'In no group',
      'viewAsUser.groups.one': 'in 1 group',
      'viewAsUser.groups.many': 'in %s groups',
      'viewAsUser.key.detail': 'their groups',
      'viewAsUser.total.one': '%d user',
      'viewAsUser.total.many': '%d users',
      'viewAsUser.loading': 'Loading users',
      'viewAsUser.failed': 'No list of users',
      'platform.picker.retry': 'Try again',
    }

    replyTo('viewable_users', {
      recent: [],
      users: [
        { id: 2, username: 'editor', realName: '', groups: [10] },
        { id: 5, username: 'eud449107', realName: 'Anna Huber', groups: [] },
      ],
    })
  })

  afterEach(() => {
    // A slide still waiting would hand over during the test after this one
    document.body.dispatchEvent(new Event('animationend'))
    document.body.removeAttribute(attributes.leaving)
    // The session was handed over; the page that lands is a new one
    document.body.removeAttribute(attributes.handingOver)
    vi.restoreAllMocks()
    sessionStorage.clear()
    listening.abort()
  })

  it('says the page is staying when no screen was noted to go back to', () => {
    expect(start()).toBe(false)
  })

  it('has the users searched for last back on the next page', async () => {
    start()
    await openPicker()
    const field = userPicker().querySelector('input')
    if (field !== null) {
      field.value = 'huber'
      field.dispatchEvent(new Event('input', { bubbles: true }))
    }
    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()
    await quiet()

    listening.abort()
    listening = new AbortController()
    start()
    await openPicker()

    expect(userPicker().querySelector('input')?.value).toBe('huber')
  })

  it('lists the groups the user under the pointer is in', async () => {
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll<HTMLElement>(`.${classes.pickerDetail} [role="option"]`)]
      .map(each => each.textContent.trim())).toEqual(['Editors'])
  })

  // The catalogue holds only groups the admin may inspect; it omits others
  it('leaves out a group it cannot name', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: '', groups: [10, 99] }],
    })
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll<HTMLElement>(`.${classes.pickerDetail} [role="option"]`)]
      .map(each => each.textContent.trim())).toEqual(['Editors'])
  })

  it('puts the groups a user is in in their own order, by name', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: '', groups: [13, 10] }],
    })
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll<HTMLElement>(`.${classes.pickerDetail} [role="option"]`)]
      .map(each => each.textContent.trim())).toEqual(['Editors', 'Reviewers'])
  })

  it('heads the pane with how many groups the user is in', async () => {
    start()

    await openPicker()

    expect(userPicker().querySelector(`.${classes.pickerDetail} p`)?.textContent.trim())
      .toBe('In 1 group')
  })

  it('says so rather than counting to zero for a user in no group', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: '', groups: [] }],
    })
    start()

    await openPicker()

    expect(userPicker().querySelector(`.${classes.pickerDetail} p`)?.textContent.trim())
      .toBe('In no group')
  })

  it('says beside a user how many groups they are in', async () => {
    start()

    await openPicker()

    expect(userPicker().querySelector(`.${classes.pickerList} [role="option"]`)?.textContent).toContain('in 1 group')
  })

  it('lists the users without a word where the backend published none', async () => {
    TYPO3.lang = {}
    replyTo('viewable_users', {
      recent: [2],
      users: [
        { id: 2, username: 'editor', realName: '', groups: [] },
        { id: 5, username: 'eud449107', realName: 'Anna Huber', groups: [10] },
      ],
    })
    start()

    await openPicker()

    // The keys are the picker's; everything else is the backend's text
    const said = userPicker().textContent.split(/\s+/)
      .filter(word => word !== '' && !'↑↓⇥↵esc'.includes(word))

    expect(said).toStrictEqual(['editor', 'Anna', 'Huber', 'eud449107', 'editor'])

    userPicker().querySelector('input')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    await settled()

    const alsoSaid = userPicker().textContent.split(/\s+/)
      .filter(word => word !== '' && !'↑↓⇥↵esc'.includes(word))

    expect(alsoSaid).toStrictEqual(['editor', 'Anna', 'Huber', 'eud449107', 'Anna', 'Huber', 'Editors'])
  })

  // XLIFF carries singular and plural words for each count; no plural rules.
  it('counts more than one group in the plural', async () => {
    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: '', groups: [10, 13] }],
    })
    start()

    await openPicker()

    expect(userPicker().querySelector(`.${classes.pickerList} [role="option"]`)?.textContent)
      .toContain('in 2 groups')
    expect(userPicker().querySelector(`.${classes.pickerDetail} p`)?.textContent.trim())
      .toBe('In 2 groups')
  })

  it('shows a group the moment it is picked out of a user pane', async () => {
    start()
    await openPicker()

    userPicker().querySelector<HTMLButtonElement>(`.${classes.pickerDetail} [role="option"]`)?.click()

    expect(getState().groupId).toBe(10)
  })

  it('says so when the list cannot be had', async () => {
    refuseNextRead()
    start()

    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()

    await vi.waitFor(() => {
      expect(userPicker().textContent).toContain('No list of users')
    })
  })

  it('asks the backend again when the reader says to try again', async () => {
    refuseNextRead()
    start()
    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()
    await vi.waitFor(() => {
      expect(userPicker().textContent).toContain('No list of users')
    })

    ;[...userPicker().querySelectorAll('button')].find(button => button.textContent.trim() === 'Try again')?.click()

    await vi.waitFor(() => {
      expect(userPicker().querySelectorAll(`.${classes.pickerList} [role="option"]`)).toHaveLength(2)
    })
  })

  it('says the list is on its way until the backend has answered', async () => {
    const release = holdNextRead()
    start()

    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()

    await vi.waitFor(() => {
      expect(userPicker().textContent).toContain('Loading users')
    })

    release()

    await vi.waitFor(() => {
      expect(userPicker().textContent).not.toContain('Loading users')
    })
  })

  it('tells the picker that the return key views as a user', async () => {
    start()

    await openPicker()

    expect(document.querySelector(`.${classes.pickerHints}`)?.textContent)
      .toContain('view as')
  })

  it('tells the picker that the tab key shows the groups of a user', async () => {
    start()

    await openPicker()

    expect(document.querySelector(`.${classes.pickerHints}`)?.textContent)
      .toContain('their groups')
  })

  it.each([
    ['', '2 users'],
    ['huber', '1 user'],
  ])('counts the users found for "%s"', async (search, count) => {
    start()
    await openPicker()

    const field = userPicker().querySelector('input')
    if (field !== null) {
      field.value = search
      field.dispatchEvent(new Event('input', { bubbles: true }))
    }

    await vi.waitFor(() => {
      expect(userPicker().querySelector(`.${classes.pickerTally}`)?.textContent).toBe(count)
    })
  })

  it('asks for a user in the words of the backend', async () => {
    start()

    await openPicker()

    expect(userPicker().querySelector('input')?.getAttribute('placeholder')).toBe('Search users')
  })

  it('asks for the users when the picker is opened', async () => {
    start()

    await openPicker()

    expect(asked.filter(url => url.includes('viewable_users'))).toHaveLength(1)
  })

  it('asks again every time it opens, so a renamed user is named anew', async () => {
    start()
    await openPicker()

    replyTo('viewable_users', {
      recent: [],
      users: [{ id: 2, username: 'editor', realName: 'Johnny Cash', groups: [] }],
    })
    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()

    await vi.waitFor(() => { expect(userPicker().textContent).toContain('Johnny Cash') })
  })

  it('puts the users core last switched to at the top, in core its own order', async () => {
    replyTo('viewable_users', {
      recent: [5, 2],
      users: [
        { id: 2, username: 'editor', realName: '', groups: [] },
        { id: 5, username: 'eud449107', realName: 'Anna Huber', groups: [] },
        { id: 7, username: 'someone', realName: '', groups: [] },
      ],
    })
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll(`.${classes.pickerList} [role="option"]`)]
      .map(row => row.getAttribute('data-id'))).toEqual(['5', '2', '7'])
    expect([...userPicker().querySelectorAll('.dropdown-header')]
      .map(each => each.textContent)).toEqual(['Recently viewed', 'All users'])
  })

  // Core remembers an id, not a user; ViewableUsers decides who may still be viewed
  it('leaves out a remembered user who is no longer viewable', async () => {
    replyTo('viewable_users', {
      recent: [99, 2],
      users: [{ id: 2, username: 'editor', realName: '', groups: [] }],
    })
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll(`.${classes.pickerList} [role="option"]`)]
      .map(row => row.getAttribute('data-id'))).toEqual(['2'])
  })

  it('names a user by their real name, and falls back to the one they sign in with', async () => {
    start()

    await openPicker()

    expect([...userPicker().querySelectorAll(`.${classes.pickerList} [role="option"]`)]
      .map(row => [...row.querySelectorAll('span')]
        .map(part => part.textContent.replace(/\s+/g, ' ').trim())))
      .toEqual([['editor', 'in 1 group'], ['Anna Huber', 'eud449107']])
  })

  // One write at a time; whoever asks last wins, others lose their changes
  it('keeps everything the admin had when a user is picked and viewed in one turn', async () => {
    prime({ vperm: { session: { version: '1', active: 'true', groupId: '13', area: 'pageMounts' } } })
    reply({ success: true, url: '/typo3/main?token=abc' })

    start()

    await viewAs('editor')

    await vi.waitFor(() => { expect(stored()['vperm']).toHaveProperty('returnTo') })

    expect(stored()['vperm']).toMatchObject({
      session: { version: '1', active: 'true', groupId: '13', area: 'pageMounts' },
    })
  })

  // Controls belong to the page they were found on; answering after page unload switches a user nobody asked for
  it('answers the picker no more once the page lets go', async () => {
    selectGroup(null)
    start()
    const picker = userPicker()

    listening.abort()
    picker.dispatchEvent(new CustomEvent('vperm:picked', { detail: { id: '2' } }))
    picker.dispatchEvent(new CustomEvent('vperm:retry'))
    picker.dispatchEvent(new CustomEvent('vperm:detail-picked', { detail: { id: '10' } }))
    await quiet()
    await new Promise(resolve => { setTimeout(resolve) })

    expect(sent).toStrictEqual([])
    expect(asked).toStrictEqual([])
    expect(getState().groupId).toBeNull()
  })

  it('stops answering the button once the page lets go', async () => {
    start()

    listening.abort()
    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()
    await quiet()
    await new Promise(resolve => { setTimeout(resolve) })

    expect(sent).toStrictEqual([])
    expect(asked).toStrictEqual([])
  })

  // Select fires change on pointer leave; answers with the next click in one event
  it('keeps the group picked in the same turn as the switch', async () => {
    reply({ success: true, url: '/typo3/main?token=abc' })
    start()

    selectGroup(13)
    await viewAs('editor')

    await vi.waitFor(() => { expect(stored()['vperm']).toHaveProperty('returnTo') })

    expect(stored()['vperm']).toMatchObject({ session: { groupId: '13' } })
  })

  // A browser told to keep no site data at all throws rather than taking a note. The
  // switch is what the admin pressed for, and no note is worth losing that.
  it('asks core to switch even when the tab refuses to hold a note', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('nope', 'SecurityError')
    })

    start()

    await viewAs('editor')

    // The page slides away before it is left, so the handover waits on the slide
    document.body.dispatchEvent(new Event('animationend'))

    await vi.waitFor(() => { expect(handed[0]?.fields['targetUser']).toBe('2') })
  })

  it('shows on the button which keys view as a user', () => {
    start()

    expect(document.querySelector(`[${attributes.viewAs}] kbd`)?.textContent).toBe('⌘⇧V')
    expect(document.querySelector(`[${attributes.viewAs}]`)?.getAttribute('aria-keyshortcuts'))
      .toBe('meta+shift+v')
  })

  it('leaves the keys off the button where an installation says so', () => {
    TYPO3.settings.visualPermissions = { switchUserKey: 'v', keysOnButtons: false }

    start()

    expect(document.querySelector(`[${attributes.viewAs}] kbd`)).toBeNull()
  })

  it('registers no key on a page that carries no settings of ours', () => {
    delete TYPO3.settings.visualPermissions

    start()

    expect(document.querySelector(`[${attributes.viewAs}] kbd`)).toBeNull()
    expect(document.querySelector(`[${attributes.viewAs}]`)?.hasAttribute('aria-keyshortcuts'))
      .toBe(false)
  })

  it('switches to the user viewed last when the key is pressed', async () => {
    replyTo('viewable_users', {
      recent: [5],
      users: [
        { id: 2, username: 'editor', realName: '', groups: [10] },
        { id: 5, username: 'eud449107', realName: 'Anna Huber', groups: [] },
      ],
    })
    start()

    press('v')

    await vi.waitFor(() => {
      expect(handed[0]?.fields['targetUser']).toBe('5')
    })
  })

  // Core remembers who was switched to, not who may still be switched to
  it('opens the picker when nobody viewed lately may still be viewed', async () => {
    replyTo('viewable_users', {
      recent: [5],
      users: [{ id: 2, username: 'editor', realName: '', groups: [10] }],
    })
    start()

    press('v')

    await vi.waitFor(() => { expect(userPicker().hasAttribute('data-open')).toBe(true) })

    expect(handed).toStrictEqual([])
  })

  it('opens the picker when the list cannot be had at all', async () => {
    start()
    refuseNextRead()

    press('v')

    await vi.waitFor(() => { expect(userPicker().hasAttribute('data-open')).toBe(true) })

    expect(handed).toStrictEqual([])
  })

  // A page that stays behind goes on asking the backend, and an answer to one of those
  // questions carries the session that was just replaced
  it('leaves the page to hand the session over', async () => {
    const handed: { url: string, fields: Record<string, string> }[] = []

    initialise(document, listening.signal, {
      go: () => undefined,
      handOver: (url, fields) => { handed.push({ url, fields }) },
    })
    await viewAs('editor')

    await vi.waitFor(() => {
      expect(handed[0]?.url).toContain('view_as_user')
      expect(handed[0]?.fields).toEqual({ targetUser: '2', screen: '' })
    })
  })

  it('lets go of the controls once the signal is aborted', async () => {
    start()

    listening.abort()
    document.querySelector<HTMLElement>(`[${attributes.viewAs}]`)?.click()

    await new Promise(resolve => { setTimeout(resolve) })

    expect(sent).toStrictEqual([])
    expect(stored()).toStrictEqual({})
    expect(document.querySelector(elements.picker)).toBeNull()
  })

  // The backend is told where they were, and sends the browser there once it has handed over
  it('names the screen the user was last read on', async () => {
    sessionStorage.setItem('vperm.seen', JSON.stringify({
      2: { place: '/typo3/record/edit?edit%5Btt_content%5D%5B81%5D=edit' },
    }))

    initialise(document, listening.signal, watching())
    await viewAs('editor')
    document.body.dispatchEvent(new Event('animationend'))

    await vi.waitFor(() => {
      expect(handed[0]?.fields['screen']).toBe('/typo3/record/edit?edit%5Btt_content%5D%5B81%5D=edit')
    })
  })

  it('takes their document along when switching to them', async () => {
    sessionStorage.setItem('vperm.seen', JSON.stringify({
      2: { place: '/typo3/module/web/layout?id=63', document: 'tt_content:81' },
    }))

    initialise(document, listening.signal, watching())
    await viewAs('editor')

    await vi.waitFor(() => { expect(handed).toHaveLength(1) })
    document.body.dispatchEvent(new Event('animationend'))

    expect(JSON.parse(sessionStorage.getItem('vperm.opening') ?? '{}')).toStrictEqual({
      record: 'tt_content:81',
      screen: '/typo3/module/web/layout?id=63',
    })
  })

  // The way back in the user's header ends where View ended in the admin's
  it('notes how wide the controls stood when switching to a user', async () => {
    const room = document.createElement('div')
    room.className = classes.viewAsControls
    vi.spyOn(room, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 640, 40))
    document.body.append(room)

    initialise(document, listening.signal, watching())
    await viewAs('editor')

    await vi.waitFor(() => { expect(handed).toHaveLength(1) })

    expect(sessionStorage.getItem('vperm.room')).toBe('640')
  })

  it('takes the document along to the screen it comes back to', async () => {
    prime({ vperm: { returnTo: { place: '/typo3/module/web/layout?id=63', document: 'tt_content:81' } } })

    initialise(document, listening.signal, { go: () => undefined, handOver: () => undefined })

    await vi.waitFor(() => {
      expect(JSON.parse(sessionStorage.getItem('vperm.opening') ?? '{}')).toStrictEqual({
        record: 'tt_content:81',
        screen: '/typo3/module/web/layout?id=63',
      })
    })
  })

  it('goes back to the screen the admin left', async () => {
    prime({ vperm: { returnTo: {
      place: '/typo3/record/edit?edit[tt_content][82]=edit',
    } } })
    const went: string[] = []

    initialise(document, listening.signal, {
      go: url => { went.push(url) },
      handOver: () => undefined,
    })

    await vi.waitFor(() => {
      expect(went).toStrictEqual(['/typo3/record/edit?edit[tt_content][82]=edit'])
    })
  })

  it('hands over nothing once the backend page has gone', async () => {
    start()
    await openPicker()

    const picker = userPicker()

    listening.abort()
    picker.dispatchEvent(new CustomEvent('vperm:picked', { detail: { id: '2' } }))
    await quiet()
    document.body.dispatchEvent(new Event('animationend'))
    await new Promise(resolve => { setTimeout(resolve) })

    expect(handed).toStrictEqual([])
  })

  it('slides the backend away before it goes to the user', async () => {
    initialise(document, listening.signal, watching())
    await viewAs('editor')

    await vi.waitFor(() => { expect(document.body.getAttribute(attributes.leaving)).toBe('down') })
    expect(handed).toStrictEqual([])

    document.body.dispatchEvent(new Event('animationend'))

    await vi.waitFor(() => { expect(handed).toHaveLength(1) })
  })

  it('asks for nothing when the picker is only opened', async () => {
    start()

    await openPicker()

    expect(sent).toStrictEqual([])
  })

  it.each([
    ['the note holds no place', { vperm: { returnTo: { place: 42 } } }],
    ['nothing was written down', {}],
  ])('leaves the screen alone when %s', async (_, settings) => {
    prime(settings)

    initialise(document, listening.signal, watching())
    await quiet()

    expect(went).toStrictEqual([])
  })


  // The note is crossed out before going back: going there navigates, and an unanswered
  // write would go with it and send every later page load to the same place again.
  it('crosses the place off, and goes there once however often it comes back', async () => {
    const went: string[] = []
    const goes = { go: (url: string) => { went.push(url) }, handOver: () => undefined }

    prime({ vperm: { returnTo: { place: '/typo3/module/manage/forms' } } })
    initialise(document, listening.signal, goes)
    await quiet()

    expect(stored()).toMatchObject({ vperm: { returnTo: { place: '' } } })

    // The page that lands writes its own settings back from a copy taken before the note
    // was crossed out, and puts the place back with it.
    let landings = 2

    while (landings > 0) {
      landings -= 1
      prime({ vperm: { returnTo: { place: '/typo3/module/manage/forms' } } })
      initialise(document, listening.signal, goes)
      await quiet()
    }

    expect(went).toEqual(['/typo3/module/manage/forms'])

    await viewAs('editor')
    prime({ vperm: { returnTo: { place: '/typo3/module/manage/forms' } } })
    initialise(document, listening.signal, goes)
    await quiet()

    expect(went).toHaveLength(2)
  })

  // Whose backend is being read is the tab's business: the next page is theirs, and a
  // note of ours in their settings would be a note in somebody else's.
  it('remembers in the tab whose backend is about to be read', async () => {
    start()

    await viewAs('editor')

    await vi.waitFor(() => { expect(sessionStorage.getItem('vperm.viewing')).toBe('2') })
  })

  // A write that lands after the switch is turned away, and the answer takes the new
  // session's cookie with it, which drops the admin at the login screen.
  it('writes nothing of ours once the switch has been asked for', async () => {
    start()
    await viewAs('editor')

    await vi.waitFor(() => { expect(document.body.hasAttribute(attributes.handingOver)).toBe(true) })

    const held = JSON.stringify(stored())

    void keep('vperm.userSearch', 'huber')
    await quiet()

    expect(JSON.stringify(stored())).toBe(held)
  })

  // Two writes race over settings; write down before switching to avoid losing the first write
  it('writes down the screen it is leaving before it asks core to switch', async () => {
    start()
    await viewAs('editor')

    await vi.waitFor(() => {
      expect(stored()).toMatchObject({ vperm: { returnTo: { place: document.location.href } } })
    })
  })
})
