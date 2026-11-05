import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { classes } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/mount-branches/mount-branches.js'
import { asked, forget, holdNextRead, refuseNextRead, reply } from '../__mocks__/typo3-ajax-request.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'
import { prime } from '../__mocks__/typo3-persistent-storage.js'

const treeComponent = (): Element => {
  const component = document.createElement('typo3-backend-navigation-component-pagetree')
  const rows = document.createElement('div')
  rows.id = 'typo3-pagetree'
  component.append(rows)

  return component
}

const tree = (): void => {
  document.body.replaceChildren(treeComponent())
}

const pageTree = (): Element | null => document.querySelector('#typo3-pagetree')

const mounted = (...pages: number[]): void => {
  reply({
    group: { id: 7, title: 'Content Reviewers' },
    chain: [],
    scopes: {
      fields: { targets: {} },
      modules: { targets: {} },
      pageMounts: {
        targets: Object.fromEntries(pages.map(page => [String(page), 'allowed'])),
        order: pages,
        unseen: [],
      },
    },
  })
}

const previewTree = (): Element | null =>
  document.querySelector(`.${classes.facePreview} vperm-page-tree`)

describe('the pages scope', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    forgetNotices()
    deactivate()
    selectGroup(7)
    forget()
    listening = new AbortController()
    document.body.replaceChildren()
    mounted()
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('asks what the group has mounted', async () => {
    tree()
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(asked.some(url => url.includes('visual_permissions_inspect?group=7'))).toBe(true)
    })
  })

  it('builds no card when the permissions cannot be read', async () => {
    tree()
    TYPO3.lang = { 'platform.notRead': 'Not read' }
    initialise(document, listening.signal)
    refuseNextRead()

    activate()
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: 'Not read', message: undefined }])
    })
    expect(document.querySelector(`.${classes.panelCard}`)).toBeNull()
  })

  it('asks nothing when a stored session says on but names no group', async () => {
    prime({ vperm: { session: { version: '1', active: 'true', groupId: 'null', area: 'pageMounts' } } })
    vi.resetModules()

    const fresh = await import('#src/mount-branches/mount-branches.js')
    tree()
    fresh.initialise(document, listening.signal)
    await Promise.resolve()

    expect(asked).toStrictEqual([])
  })

  it('leaves the backend alone while another area is worked in', async () => {
    tree()
    initialise(document, listening.signal)

    pickArea('fields')
    activate()

    await vi.waitFor(() => {
      expect(asked).toStrictEqual([])
    })
  })

  it('keeps the page tree on the picking side of the card', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(pageTree()?.closest(`.${classes.facePick}`)).not.toBeNull()
    })
    expect(pageTree()?.closest(`.${classes.panelCard}`)?.parentElement?.tagName.toLowerCase())
      .toBe('typo3-backend-navigation-component-pagetree')
  })

  it('turns the card to what the group has mounted', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    await vi.waitFor(() => {
      const card = document.querySelector(`.${classes.panelCard}`)

      expect(card?.classList.contains(classes.panelCardTurned)).toBe(true)
    })
  })

  it('gives the page tree back when permissions are hidden', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    deactivate()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.panelCard}`)).toBeNull()
    })
    expect(pageTree()?.parentElement?.tagName.toLowerCase())
      .toBe('typo3-backend-navigation-component-pagetree')
  })

  it('builds no card when the answer arrives after permissions were hidden', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)
    const letGo = holdNextRead()

    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(asked).toHaveLength(1)
    })
    deactivate()
    letGo()
    await new Promise(settled => { window.setTimeout(settled, 20) })

    expect(document.querySelector(`.${classes.panelCard}`)).toBeNull()
  })

  it('paints over a page tree that arrives late', async () => {
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    tree()

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
  })

  it('paints over a page tree that arrives deep inside the backend', async () => {
    const holder = document.createElement('div')
    document.body.append(holder)
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    holder.append(treeComponent())

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
  })

  it('asks once while the tree keeps drawing before the answer comes', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)
    const release = holdNextRead()

    activate()
    pickArea('pageMounts')
    pageTree()?.append(document.createElement('div'))
    await new Promise(resolve => { setTimeout(resolve, 0) })
    pageTree()?.append(document.createElement('div'))
    await new Promise(resolve => { setTimeout(resolve, 0) })
    release()

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    expect(asked.filter(url => url.includes('group=7'))).toHaveLength(1)
  })

  it('paints over a page tree the backend draws again after the answer', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)
    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    tree()

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
  })

  it('stops watching for a tree once the backend goes away', async () => {
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    listening.abort()
    tree()
    await new Promise(resolve => { setTimeout(resolve, 0) })
    await new Promise(resolve => { setTimeout(resolve, 0) })

    expect(asked).toStrictEqual([])
    expect(previewTree()).toBeNull()
  })

  it('keeps the tree it has already built while the same group is shown', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const built = previewTree()

    mounted(3)
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(asked.filter(url => url.includes('group=7')).length).toBeGreaterThan(1)
    })
    await new Promise(resolve => { setTimeout(resolve, 0) })
    await new Promise(resolve => { setTimeout(resolve, 0) })

    expect(previewTree()).toBe(built)
  })

  it('builds another tree for another group', async () => {
    tree()
    mounted(3)
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const built = previewTree()

    mounted(3)
    selectGroup(8)

    await vi.waitFor(() => {
      expect(previewTree()).not.toBe(built)
    })
  })

  it('leaves another area its own card', async () => {
    tree()
    const elsewhere = document.createElement('div')
    elsewhere.className = `${classes.panelCard} ${classes.panelCardTurned}`
    const face = document.createElement('div')
    face.className = `${classes.face} ${classes.facePick}`
    const scroll = document.createElement('div')
    scroll.className = classes.faceScroll
    const row = document.createElement('a')
    scroll.append(row)
    face.append(scroll)
    elsewhere.append(face)
    document.body.append(elsewhere)

    initialise(document, listening.signal)
    pickArea('modules')
    activate()

    expect(elsewhere.classList.contains(classes.panelCardTurned)).toBe(true)
    await vi.waitFor(() => {
      expect(row.parentElement).toBe(scroll)
    })
  })

  // A folded tree or one in a module without it is not there at all
  it('asks nothing where there is no page tree', async () => {
    initialise(document, listening.signal)

    activate()
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(asked).toStrictEqual([])
    })
  })
})
