import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { attributes, classes } from '#src/platform/contract.js'
import { emit, on } from '#src/platform/bus.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/mount-branches/mount-branches.js'
import {
  answerNextWriteWith,
  asked,
  cancelNextPassword,
  forget,
  holdNextRead,
  holdNextWrite,
  refuseNextWrite,
  reply,
  replyTo,
  sent,
} from '../__mocks__/typo3-ajax-request.js'
import { type PageTree, type PreparedNode } from '../__mocks__/typo3-page-tree.js'
import { coreTree } from '../__mocks__/typo3-tree.js'
import { shown } from '../__mocks__/typo3-module-menu.js'
import { chosen } from '../__mocks__/typo3-module-state-storage.js'

const tree = (): void => {
  const component = document.createElement('typo3-backend-navigation-component-pagetree')
  const rows = document.createElement('div')
  rows.id = 'typo3-pagetree'
  rows.append(coreTree('typo3-backend-navigation-component-pagetree-tree', [
    { identifier: '0', depth: 0 },
    { identifier: '1', depth: 1 },
    { identifier: '3', depth: 2 },
  ]))
  component.append(rows)
  document.body.replaceChildren(component)
}

const backendTree = (): { getNodeClasses: (node: unknown) => string[] } | null =>
  document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`) as
    unknown as { getNodeClasses: (node: unknown) => string[] } | null

const classesOnPickSide = (page: number, depth = 0): string[] =>
  backendTree()?.getNodeClasses({ identifier: String(page), depth }) ?? []

const pick = (page: number, depth = 0): void => {
  previewTree()?.selectNode({ identifier: String(page), depth })
}


const pickInTree = (page: number, propagate = true): void => {
  document.querySelector(`.${classes.facePick} #typo3-pagetree`)
    ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
      bubbles: true,
      detail: { node: { identifier: String(page), depth: 0 }, propagate },
    }))
}

const pickedByTree = (page: number): void => {
  previewTree()?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
    detail: { node: { identifier: String(page), depth: 0 }, propagate: false },
  }))
}

// The branch a row stands under says whether a page is inside a mount or on the way down to one
const classesOn = (page: number, depth = 0, under: string[] = []): string[] =>
  previewTree()?.getNodeClasses({ identifier: String(page), depth, __parents: under }) ?? []

const carrier = (): void => {
  const hidden = document.createElement('span')
  hidden.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Content Reviewers', inherits: [] } }))
  document.body.append(hidden)
  TYPO3.lang = {
    'platform.preview': 'Preview',
    'platform.pick': 'Assign',
    'platform.cancel': 'Cancel',
    'platform.doAdd': 'Add',
    'platform.doRemove': 'Remove',
    'platform.from': 'from a subgroup',
    'mountBranches.pages.previewFor': 'What %s may work in',
    'mountBranches.pages.add': 'Add page mounts',
    'mountBranches.pages.hint': 'or click a branch to remove it',
    'mountBranches.pages.pickFor': 'Pick what %s may work in',
    'mountBranches.pages.tally.one': '%s branch mounted',
    'mountBranches.pages.tally.many': '%s branches mounted',
    'platform.waiting': '%s waiting to be added',
    'mountBranches.pages.marked.one': '%1$s of %2$s branch marked to remove',
    'mountBranches.pages.marked.many': '%1$s of %2$s branches marked to remove',
    'mountBranches.pages.unseen.one': '%s page the group cannot see:',
    'mountBranches.pages.unseen.many': '%s pages the group cannot see:',
    'mountBranches.pages.unseenWhy': 'their page permissions show them to nobody in the group.',
    'mountBranches.pages.unseenLink': 'Page permissions of "%s"',
    'mountBranches.pages.unseenPage': '"%s"',
    'platform.toAdd': 'to add',
    'platform.refused': 'The backend did not take the change',
    'platform.failed': 'The change could not be sent',
  }
}

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

const mountedAndInherited = (own: readonly number[], inheritedPages: readonly number[]): void => {
  reply({
    group: { id: 7, title: 'Content Reviewers' },
    chain: [],
    scopes: {
      fields: { targets: {} },
      modules: { targets: {} },
      pageMounts: {
        targets: {
          ...Object.fromEntries(own.map(page => [String(page), 'allowed'])),
          ...Object.fromEntries(inheritedPages.map(page => [String(page), 'inherited'])),
        },
        order: [...own, ...inheritedPages],
        unseen: [],
      },
    },
  })
}

const mountedButUnseen = (...titles: string[]): void => {
  const pages = titles.map((_, index) => index + 3)

  reply({
    group: { id: 7, title: 'Content Reviewers' },
    chain: [],
    scopes: {
      fields: { targets: {} },
      modules: { targets: {} },
      pageMounts: {
        targets: Object.fromEntries(pages.map(page => [String(page), 'allowed'])),
        order: pages,
        unseen: titles.map((title, index) => ({
          page: index + 3,
          title,
          link: `/typo3/module/system/permissions?id=${String(index + 3)}`,
        })),
      },
    },
  })
}

const previewTree = (): PageTree | null =>
  document.querySelector<PageTree>(`.${classes.facePreview} vperm-page-tree`)

const armed = async (): Promise<void> => {
  activate()
  pickArea('pageMounts')
  await vi.waitFor(() => {
    expect(document.querySelector(`.${classes.facePreview}`)).not.toBeNull()
  })
}

const inPreview = (selector: string): Element | null =>
  document.querySelector(`.${classes.facePreview} ${selector}`)

const inPick = (selector: string): Element | null =>
  document.querySelector(`.${classes.facePick} ${selector}`)

const card = (): Element | null => document.querySelector(`.${classes.panelCard}`)

describe('the mounts panel', () => {
  let listening: AbortController

  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    deactivate()
    selectGroup(7)
    forget()
    listening = new AbortController()
    document.body.replaceChildren()
    tree()
    carrier()
    mounted(3, 5)
    initialise(document, listening.signal)
  })

  afterEach(() => {
    deactivate()
    listening.abort()
  })

  it('hides a page with no mount above or below it', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    const prepared = previewTree()?.prepareNodes([
      { identifier: '1', depth: 0, __parents: [] },
      { identifier: '9', depth: 1, __parents: ['1'] },
    ])

    expect(prepared?.[1]?.__hidden).toBe(true)
  })

  it('hides a page standing beside the mount rather than above it', async () => {
    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })

    const prepared = previewTree()?.prepareNodes([
      { identifier: '1', depth: 0, __parents: [] },
      { identifier: '3', depth: 1, __parents: ['1'] },
      { identifier: '9', depth: 1, __parents: ['1'] },
    ])

    expect(prepared?.[0]?.__hidden).toBe(false)
    expect(prepared?.[1]?.__hidden).not.toBe(true)
    expect(prepared?.[2]?.__hidden).toBe(true)
  })

  it('keeps a page the mount hangs from on the way down', async () => {
    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })

    const prepared = previewTree()?.prepareNodes([
      { identifier: '1', depth: 0, __parents: [] },
      { identifier: '3', depth: 1, __parents: ['1'] },
    ])

    expect(prepared?.[0]?.__hidden).toBe(false)
    expect(prepared?.[0]?.__expanded).toBe(true)
  })

  // Closing a row on the way down hides the mount it was drawn for; do not close there
  it('refuses to close a page that only leads down to a mount', async () => {
    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })
    const parent: PreparedNode = { identifier: '1', depth: 0, __parents: [], __expanded: true }
    const mounted: PreparedNode = { identifier: '3', depth: 1, __parents: [], __expanded: true }

    previewTree()?.hideChildren(parent)
    previewTree()?.hideChildren(mounted)

    expect(parent.__expanded).toBe(true)
    expect(mounted.__expanded).toBe(false)
  })

  it('marks a page that only leads down to a mount as the way there', async () => {
    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })

    expect(classesOn(1)).toContain(classes.mountContext)
    expect(classesOn(3)).not.toContain(classes.mountContext)
    expect(classesOn(41, 1, ['3'])).not.toContain(classes.mountContext)
  })

  it('names the group whose mounts are shown', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceSentence}`)?.textContent)
        .toBe('What Content Reviewers may work in')
    })
  })

  it('offers nothing to choose above the foot', async () => {
    await armed()

    const foot = document.querySelector(`.${classes.facePreview} > .${classes.faceFoot}`)

    expect(foot?.previousElementSibling?.querySelector('button')).toBeNull()
  })

  it('links a mounted page the group cannot see to its page permissions', async () => {
    mountedButUnseen('Ipsum')

    await armed()

    await vi.waitFor(() => {
      const link = document.querySelector(`.${classes.facePreview} a[aria-label='Page permissions of "Ipsum"']`)

      expect(link?.getAttribute('href')).toBe('/typo3/module/system/permissions?id=3')
    })
  })

  it('opens the page permissions with that page chosen in the tree', async () => {
    mountedButUnseen('Ipsum')
    await armed()
    await vi.waitFor(() => {
      expect(inPreview(`.${classes.unseenPages} a`)).not.toBeNull()
    })

    inPreview(`.${classes.unseenPages} a`)?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

    expect(chosen('web')).toBe('3')
    expect(shown()).toContain('permissions_pages')
  })

  it('names a mounted page the group cannot see in quotes', async () => {
    mountedButUnseen('Ipsum')

    await armed()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} a[href$='id=3']`)?.textContent).toBe('"Ipsum"')
    })
  })

  it('says how many mounted pages the group cannot see, and why', async () => {
    mountedButUnseen('Ipsum', 'Lorem')

    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.unseenPages}`)?.textContent)
        .toContain('2 pages the group cannot see: their page permissions show them to nobody in the group.')
    })
  })

  it('lists the mounted pages the group cannot see', async () => {
    mountedButUnseen('Ipsum', 'Lorem')

    await armed()

    await vi.waitFor(() => {
      expect([...document.querySelectorAll(`.${classes.unseenPages} ul > li > a`)].map(line => line.textContent))
        .toStrictEqual(['"Ipsum"', '"Lorem"'])
    })
  })

  it('counts a single page the group cannot see as one', async () => {
    mountedButUnseen('Ipsum')

    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.unseenPages} b`)?.textContent).toBe('1 page the group cannot see:')
    })
  })

  it('marks the row of a mounted page the group cannot see', async () => {
    mountedButUnseen('Ipsum')

    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })

    expect(classesOn(3)).toContain(classes.mountUnseen)
  })

  it('says nothing about pages the group cannot see when it can see every mount', async () => {
    await armed()
    await vi.waitFor(() => { expect(previewTree()).not.toBeNull() })

    expect(inPreview(`.${classes.unseenPages}`)).toBeNull()
  })

  it('names each page the group cannot see once, however often the panel is drawn', async () => {
    mountedButUnseen('Ipsum')
    await armed()
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} a[href$='id=3']`)).not.toBeNull()
    })
    mountedButUnseen('Lorem')

    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} a[href$='id=3']:last-of-type`)?.textContent).toBe('"Lorem"')
    })
    expect(document.querySelectorAll(`.${classes.facePreview} a[href$='id=3']`)).toHaveLength(1)
  })

  it('names the group whose mounts are picked', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceSentence}`)?.textContent)
        .toBe('Pick what Content Reviewers may work in')
    })
  })

  it('says on each side what it is, in words the backend carries', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceEyebrow}`)?.textContent).toBe('Preview')
    })
    expect(inPick(`.${classes.faceEyebrow}`)?.textContent).toBe('Assign')
    expect(inPreview(`.${classes.faceBar} button`)?.textContent).toBe('Add page mounts')
    expect(inPreview(`.${classes.faceHint}`)?.textContent).toBe('or click a branch to remove it')
    expect(inPreview(`.${classes.faceApply}`)?.textContent).toBe('Remove')
    expect(inPick(`.${classes.faceApply}`)?.textContent).toBe('Add')
    expect(inPick(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-queued-note: "to add"')
    expect(inPreview(`.${classes.faceBar} button`)?.className).toBe('btn btn-default')
  })

  it('stays silent about words the backend does not carry', async () => {
    TYPO3.lang = {}

    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceBar} button`)).not.toBeNull()
    })
    expect(inPreview(`.${classes.faceEyebrow}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceEyebrow}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceSentence}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceBar} button`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceHint}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceApply}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceCancel}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceApply}`)?.textContent).toBe('')
    expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('')
    expect(inPick(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-queued-note: ""')
    expect(inPreview(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-inherited-note: ""')
  })

  it('says what the side is for even where the group has no name', async () => {
    document.querySelector(`[${attributes.groups}]`)?.setAttribute(attributes.groups, '{}')

    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceSentence}`)?.textContent).toBe('What  may work in')
    })
  })

  it('says what the group mounts on the side it shows them on', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('2 branches mounted')
    })
  })

  it('says what the group mounts while more are picked', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceTally}`)?.textContent).toBe('2 branches mounted')
    })
  })

  it('turns to the page tree when more pages are to be mounted', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(card()?.classList.contains(classes.panelCardTurned)).toBe(true)
    })

    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)
  })

  it('turns back to the preview when the picking is left', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(true)
  })

  it('lets the picking be left at any time, since the preview is the view to be in', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(inPick(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(false)

    inPick(`.${classes.faceCancel}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(true)
  })

  it('keeps the side turned away out of the reader\'s way', async () => {
    // What the pointer may reach must not wait for a frame; the turn itself does
    const frames: FrameRequestCallback[] = []
    const waiting = vi.spyOn(window, 'requestAnimationFrame')
      .mockImplementation(frame => {
        frames.push(frame)

        return 0
      })

    await armed()

    expect(document.querySelector(`.${classes.facePick}`)?.hasAttribute('inert')).toBe(true)
    expect(document.querySelector(`.${classes.facePreview}`)?.hasAttribute('inert')).toBe(false)

    waiting.mockRestore()
    frames.forEach(frame => { frame(0) })
  })

  it('asks the backend for the whole tree, not for the mounts alone', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(asked.some(url => url.includes('page_tree_browser_configuration'))).toBe(true)
    })
    expect(asked.find(url => url.includes('page_tree_browser_configuration')))
      .not.toContain('alternativeEntryPoints')
  })

  it('shows no tree at all for a group that mounts nothing', async () => {
    mounted()
    await armed()

    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceTally}`)?.textContent).toBe('0 branches mounted')
    })
    expect(previewTree()).toBeNull()
    expect(asked.some(url => url.includes('page_tree_browser_configuration'))).toBe(false)
  })

  it('builds the tree once the group mounts something', async () => {
    mounted()
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).toBeNull()
    })

    mounted(3)
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
  })

  it('hands the preview tree the configuration the backend answered with', async () => {
    replyTo('page_tree_browser_configuration', { dataUrl: '/fetchData?readOnly=1' })

    await armed()

    await vi.waitFor(() => {
      expect(previewTree()?.setup).toStrictEqual({ dataUrl: '/fetchData?readOnly=1' })
    })
  })

  // No renaming, no dragging pages; mounting is not editing
  it('lets nothing be edited on the preview tree', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    expect([previewTree()?.allowNodeEdit, previewTree()?.allowNodeDrag, previewTree()?.allowNodeSorting])
      .toEqual([false, false, false])
  })

  it('marks a branch root picked on the preview tree', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    pick(3)

    expect(classesOn(3)).toContain(classes.faceMarked)
  })

  it('leaves a page below a branch root alone', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    pick(41, 1)

    expect(classesOn(41, 1)).not.toContain(classes.faceMarked)
  })

  it('says a page below a branch root is no mount of its own', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    expect(classesOn(41, 1, ['3'])).toContain(classes.mountInside)
    expect(classesOn(3)).not.toContain(classes.mountInside)
  })

  // Being picked marks a branch; selected would duplicate the backend's paint state
  it('paints no branch as the backend paints a selected one', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    expect(previewTree()?.getNodeClasses({ identifier: '3', depth: 0, checked: true }))
      .not.toContain('node-selected')
  })

  it('marks nothing when the tree picks a node by itself', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)

    pickedByTree(3)

    expect(classesOn(3)).toContain(classes.faceMarked)
  })

  it('takes a mark back when the branch is picked again', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    pick(3)
    pick(3)

    expect(classesOn(3)).not.toContain(classes.faceMarked)
  })

  it('has the tree paint again once a branch is marked', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const painted = previewTree()?.repainted() ?? 0

    pick(3)

    expect(previewTree()?.repainted()).toBe(painted + 1)
  })

  it('keeps the classes the backend paints its own rows with', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pickInTree(9)

    expect(classesOn(3)).toContain('node')
    expect(classesOnPickSide(9)).toContain('node')
  })

  // A group cannot have a root branch; marking one is invalid
  it('picks nothing that is no page of its own', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    pickInTree(0)

    expect(classesOnPickSide(0)).not.toContain(classes.mountPicked)
    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('picks nothing that lies inside a branch the group mounts', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    document.querySelector(`.${classes.facePick} #typo3-pagetree`)
      ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
        bubbles: true,
        detail: { node: { identifier: '41', depth: 2, __parents: ['0', '3'] }, propagate: true },
      }))

    expect(classesOnPickSide(41)).not.toContain(classes.mountPicked)
    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('keeps to one set of marks when the picking side is built on again', async () => {
    mounted(3)
    await armed()
    await vi.waitFor(() => {
      expect(backendTree()).not.toBeNull()
    })

    const before = classesOnPickSide(3)
    const installation = document.createElement('div')
    installation.className = 'node'
    installation.setAttribute('data-id', '0')
    document.querySelector(`.${classes.facePick}`)?.append(installation)
    await vi.advanceTimersByTimeAsync(0)

    expect(classesOnPickSide(3)).toStrictEqual(before)
  })

  it('keeps every mark while the same group is shown again', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)
    const read = asked.length

    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(asked.length).toBeGreaterThan(read)
    })
    await vi.advanceTimersByTimeAsync(0)
    await vi.advanceTimersByTimeAsync(0)

    expect(classesOn(3)).toContain(classes.faceMarked)
  })

  it('offers the removal only once a branch is marked', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceApply}`)).not.toBeNull()
    })

    expect(inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
    expect(inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(true)

    pick(3)

    expect(inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(false)
    expect(inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled')).toBe(false)
  })

  it('lets go of every mark when the marking is cancelled', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)

    inPreview(`.${classes.faceCancel}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(classesOn(3)).not.toContain(classes.faceMarked)
  })

  // A panel belongs to the group it was built for; sending marks changes a hidden group
  it('asks for nothing once another group is shown', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)

    selectGroup(8)

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await Promise.resolve()

    expect(sent.some(({ url }) => url.includes('mount_pages'))).toBe(false)
  })

  it('leaves the side alone when an answer older than the newest arrives last', async () => {
    mounted(3, 5)
    await armed()

    mounted(11)
    const releaseOlder = holdNextRead()
    selectGroup(8)

    mounted(21, 22, 23)
    selectGroup(9)
    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceCounted}`)?.textContent).toBe('3 branches mounted')
    })

    releaseOlder()
    await vi.advanceTimersByTimeAsync(20)

    expect(inPreview(`.${classes.faceCounted}`)?.textContent).toBe('3 branches mounted')
  })

  // Area armed again inside the moment leaves no tree; keep the card that was armed
  it('keeps the card that was armed again while the last one was still going', async () => {
    mounted(3, 5)
    await armed()

    deactivate()
    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview}`)).not.toBeNull()
    })

    await vi.advanceTimersByTimeAsync(300)

    expect(document.querySelector(`.${classes.panelCard}`)).not.toBeNull()
    expect(previewTree()).not.toBeNull()
  })

  it('keeps the tree it painted while the last card was still going', async () => {
    mounted(3, 5)
    await armed()

    deactivate()
    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview}`)).not.toBeNull()
    })
    const painted = previewTree()

    await vi.advanceTimersByTimeAsync(300)

    expect(previewTree()).toBe(painted)
  })

  it('gives the backend its own way of painting a node back when the area is let go of', async () => {
    mounted(3, 5)
    await armed()

    const theirs = backendTree()
    if (theirs === null) {
      throw new Error('the backend tree is not on the picking side')
    }

    expect(theirs.getNodeClasses({ identifier: '3', depth: 0, checked: true }))
      .not.toContain('node-selected')

    deactivate()
    await vi.advanceTimersByTimeAsync(300)

    expect(theirs.getNodeClasses({ identifier: '3', depth: 0, checked: true }))
      .toContain('node-selected')
  })

  it('asks for no new paint when the tree changes nothing it keeps out of sight', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    )
    const painted = (): number => Number(theirs?.getAttribute('data-repainted') ?? '0')
    const before = painted()

    const row = document.createElement('div')
    row.className = 'node'
    row.setAttribute('data-id', '3')
    theirs?.append(row)
    await vi.advanceTimersByTimeAsync(50)

    expect(painted()).toBe(before)
  })

  it('gives back only the row it took out of sight', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    ) as unknown as { nodes: PreparedNode[] } | null

    if (theirs !== null) {
      theirs.nodes = [
        { identifier: '0', depth: 0 },
        { identifier: '1', depth: 1, __hidden: true },
      ]
    }

    deactivate()
    await vi.advanceTimersByTimeAsync(300)

    const hidden = (theirs?.nodes ?? [])
      .filter(node => node.__hidden === true).map(node => node.identifier)

    expect(hidden).toStrictEqual(['1'])
  })

  it('leaves the installation alone once the tree is handed back', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    )

    deactivate()
    await vi.advanceTimersByTimeAsync(50)

    const row = document.createElement('div')
    row.className = 'node'
    row.setAttribute('data-id', '0')
    theirs?.append(row)
    await vi.advanceTimersByTimeAsync(50)

    const held = (theirs as unknown as { nodes: PreparedNode[] } | null)?.nodes ?? []

    expect(held.find(node => node.identifier === '0')?.__hidden).toBe(false)
  })

  it('takes the installation off the side when a row for it is painted', async () => {
    mounted(3, 5)
    await armed()

    const late = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    ) as unknown as { nodes: PreparedNode[] } | null

    if (late !== null) {
      late.nodes = [{ identifier: '0', depth: 0 }, { identifier: '3', depth: 1 }]
    }

    const row = document.createElement('div')
    row.className = 'node'
    row.setAttribute('data-id', '0')
    document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`)
      ?.append(row)

    await vi.advanceTimersByTimeAsync(50)

    expect((late?.nodes ?? []).find(node => node.identifier === '0')?.__hidden).toBe(true)
  })

  it('takes the tree over when it arrives after the card was built', async () => {
    document.body.replaceChildren()
    const component = document.createElement('typo3-backend-navigation-component-pagetree')
    const rows = document.createElement('div')
    rows.id = 'typo3-pagetree'
    component.append(rows)
    document.body.append(component)
    carrier()
    mounted(3, 5)
    listening.abort()
    listening = new AbortController()
    initialise(document, listening.signal)
    await armed()

    const late = coreTree('typo3-backend-navigation-component-pagetree-tree', [
      { identifier: '0', depth: 0 },
      { identifier: '3', depth: 1 },
    ])
    document.querySelector(`.${classes.facePick} .${classes.faceScroll}`)?.append(late)

    await vi.advanceTimersByTimeAsync(50)

    const shown = ((late as unknown as { nodes: PreparedNode[] }).nodes)
      .filter(node => node.__hidden !== true).map(node => node.identifier)

    expect(shown).toStrictEqual(['3'])
  })

  // Rows that arrive after the card was built are unseen by the card; no row for unseen install
  it('shows no row for the installation in rows that arrive later', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    ) as unknown as { prepareNodes: (nodes: PreparedNode[]) => PreparedNode[] } | null
    const shown = (theirs?.prepareNodes([
      { identifier: '0', depth: 0 },
      { identifier: '7', depth: 1 },
    ]) ?? []).filter(node => node.__hidden !== true).map(node => node.identifier)

    expect(shown).toStrictEqual(['7'])
  })

  // The row is borrowed from the backend; return it or the tree is left without a root
  it('shows the installation again when the area is let go of', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    ) as unknown as { nodes: PreparedNode[] } | null

    deactivate()
    await vi.advanceTimersByTimeAsync(300)

    const shown = (theirs?.nodes ?? [])
      .filter(node => node.__hidden !== true)
      .map(node => node.identifier)

    expect(shown).toStrictEqual(['0', '1', '3'])
  })

  // The installation row does not answer any questions; do not show it
  it('shows no row for the installation the tree stands on', async () => {
    mounted(3, 5)
    await armed()

    const theirs = document.querySelector(
      `.${classes.facePick} typo3-backend-navigation-component-pagetree-tree`,
    ) as unknown as { nodes: PreparedNode[] } | null
    const shown = (theirs?.nodes ?? [])
      .filter(node => node.__hidden !== true)
      .map(node => node.identifier)

    expect(shown).toStrictEqual(['1', '3'])
  })

  // Row 0 is the root, not a page; the first page is 1
  it('picks the first page in the tree like any other', async () => {
    mounted(3, 5)
    await armed()

    pickInTree(0)

    expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('')

    pickInTree(1)

    expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('1 waiting to be added')
  })

  it('lets go of its deeds the moment another group is picked', async () => {
    mounted(3, 5)
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)
    pickInTree(9)

    const deeds = (): (boolean | undefined)[] => [
      inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled'),
      inPreview(`.${classes.faceCancel}`)?.hasAttribute('disabled'),
      inPick(`.${classes.faceApply}`)?.hasAttribute('disabled'),
      inPick(`.${classes.faceCancel}`)?.hasAttribute('disabled'),
    ]

    expect(deeds()).toStrictEqual([false, false, false, false])

    selectGroup(7)

    expect(deeds()).toStrictEqual([false, false, false, false])

    selectGroup(8)

    expect(deeds()).toStrictEqual([true, true, true, true])
  })

  // A subgroup's branch is not this group's to take down; it stays mounted
  it('leaves a branch a subgroup mounts alone', async () => {
    mountedAndInherited([3], [49])
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    pick(49)

    expect(classesOn(49)).not.toContain(classes.faceMarked)
    expect(inPreview(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('says on the row that a subgroup mounts it', async () => {
    mountedAndInherited([3], [49])
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    expect(classesOn(49)).toContain(classes.mountInherited)
    expect(classesOn(3)).not.toContain(classes.mountInherited)
    expect(inPreview(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-inherited-note: "from a subgroup"')
  })

  // Row with nothing to do must not take the press or paint itself as picked; expander still works
  it('refuses a press on a row with nothing to do on it', async () => {
    mountedAndInherited([3], [49])
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    const rowFor = (page: number): Element => {
      const row = document.createElement('div')
      row.className = 'node'
      row.setAttribute('data-id', String(page))
      row.setAttribute('aria-level', '1')
      // A press lands on the name inside the row, not the row itself.
      row.append(document.createElement('span'))
      previewTree()?.append(row)

      return row
    }

    const pressOn = (row: Element): MouseEvent => {
      const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
      row.firstElementChild?.dispatchEvent(press)

      return press
    }

    // Subgroup's mount is fixed once set; cannot be taken by parent group
    expect(pressOn(rowFor(49)).defaultPrevented).toBe(true)
    expect(pressOn(rowFor(3)).defaultPrevented).toBe(false)
  })

  it('lets a press that lands on no row of the tree alone', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    const press = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    previewTree()?.dispatchEvent(press)

    expect(press.defaultPrevented).toBe(false)
  })

  it('asks for nothing while nothing is marked', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await Promise.resolve()

    expect(sent.some(({ url }) => url.includes('mount_pages'))).toBe(false)
  })

  // The tree belongs to the group it was mounted from; a shared mount does not copy it
  it('builds the tree again for another group that mounts the same branches', async () => {
    mounted(3, 5)
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    const before = previewTree()

    mounted(3, 5)
    selectGroup(8)

    await vi.waitFor(() => {
      expect(previewTree()).not.toBe(before)
    })
  })

  // A mark is a change asked for on one group; showing another starts over.
  it('lets go of every mark when another group is shown', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)

    selectGroup(8)

    await vi.waitFor(() => {
      expect(classesOn(3)).not.toContain(classes.faceMarked)
    })
  })

  it('keeps the backend from opening a page picked to be mounted', async () => {
    await armed()

    const own = document.querySelector(`.${classes.facePick} #typo3-pagetree`)
    let opened = false

    own?.addEventListener('typo3:tree:node-selected', () => { opened = true })
    own?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
      bubbles: true,
      detail: { node: { identifier: '9', depth: 0 }, propagate: true },
    }))

    expect(opened).toBe(false)
  })

  // Preview tree is the panel's own; clicks say something about a mount, not a page to open
  it('keeps the backend out of the tree that shows the mounts', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    const watching = new AbortController()
    let opened = false

    card()?.addEventListener('typo3:tree:node-selected', () => { opened = true }, {
      signal: watching.signal,
    })
    previewTree()?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
      bubbles: true,
      detail: { node: { identifier: '41', depth: 1 }, propagate: true },
    }))
    watching.abort()

    expect(opened).toBe(false)
  })

  it('offers the addition only once a page is picked to be mounted', async () => {
    await armed()

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)

    pickInTree(9)

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(false)
  })

  it('keeps every page waiting to be mounted painted', async () => {
    await armed()

    pickInTree(9)
    pickInTree(11)

    expect(classesOnPickSide(9)).toContain(classes.mountPicked)
    expect(classesOnPickSide(11)).toContain(classes.mountPicked)
  })

  it('lets go of a page picked twice over', async () => {
    await armed()

    pickInTree(9)
    pickInTree(9)

    expect(classesOnPickSide(9)).not.toContain(classes.mountPicked)
  })

  it('paints no page as the backend paints a selected one', async () => {
    await armed()

    expect(backendTree()?.getNodeClasses({ identifier: '9', depth: 0, checked: true }))
      .not.toContain('node-selected')
  })

  it('shows a page the group already mounts as one it has', async () => {
    await armed()

    expect(classesOnPickSide(3)).toContain(classes.mountAlready)
    expect(classesOnPickSide(9)).not.toContain(classes.mountAlready)
  })

  it('takes no pick on a page the group already mounts', async () => {
    await armed()

    pickInTree(3)

    expect(inPick(`.${classes.faceApply}`)?.hasAttribute('disabled')).toBe(true)
  })

  it('counts what is marked to be taken away beside what is mounted', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    pick(3)

    expect(inPreview(`.${classes.faceTally}`)?.textContent)
      .toBe('1 of 2 branches marked to remove')
  })

  // A filled row means the group is about to mount the page, not that it already has
  it('says of a picked page that it is waiting to be mounted', async () => {
    await armed()

    expect(inPick(`.${classes.faceScroll}`)?.getAttribute('style'))
      .toContain('--vperm-queued-note: "to add"')
  })

  it('counts what is waiting to be mounted beside what is mounted', async () => {
    await armed()

    pickInTree(9)

    expect(inPick(`.${classes.faceTally}`)?.firstChild?.textContent).toBe('2 branches mounted')
    expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('1 waiting to be added')
  })

  it('sends the marked branches to be taken away', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toStrictEqual([{
        url: '/typo3/ajax/visual_permissions_mount_pages',
        body: { group: 7, operations: [{ page: 3, mount: false }] },
      }])
    })
  })

  it('sends the picked pages to be mounted', async () => {
    await armed()
    pickInTree(9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toStrictEqual([{
        url: '/typo3/ajax/visual_permissions_mount_pages',
        body: { group: 7, operations: [{ page: 9, mount: true }] },
      }])
    })
  })

  it('says that the backend took the pages', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    await armed()
    pickInTree(9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('says nothing about pages the backend turned down', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    await armed()
    pickInTree(9)
    answerNextWriteWith(409)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceCounted}`)?.textContent).toBe('The backend did not take the change')
    })
    expect(told).toBe(0)
  })

  it('says on the side that the backend turned the change down', async () => {
    await armed()
    pickInTree(9)
    answerNextWriteWith(409)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceCounted}`)?.textContent).toBe('The backend did not take the change')
    })
    expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('1 waiting to be added')
  })

  it('says on the side that the change never got through', async () => {
    await armed()
    pickInTree(9)
    answerNextWriteWith(500)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceCounted}`)?.textContent).toBe('The change could not be sent')
    })
  })

  it('flashes nothing the backend turned down once the tree is drawn again', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    answerNextWriteWith(409)
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceCounted}`)?.textContent).toBe('The backend did not take the change')
    })
    mounted(3, 5, 9)
    const read = asked.length

    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(asked.length).toBeGreaterThan(read)
    })
    await vi.advanceTimersByTimeAsync(700)
    expect(classesOn(9)).not.toContain(classes.justAdded)
  })

  it('picks a page beside a mount, under a branch the group does not mount', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    document.querySelector(`.${classes.facePick} #typo3-pagetree`)
      ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
        bubbles: true,
        detail: { node: { identifier: '41', depth: 2, __parents: ['0', '40'] }, propagate: true },
      }))

    expect(classesOnPickSide(41)).toContain(classes.mountPicked)
  })

  // The second answer would land on a side the first one already cleared
  it('takes one change at a time, since the first is still on its way', async () => {
    await armed()
    pickInTree(9)
    const letGo = holdNextWrite()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    letGo()

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('')
    })
    expect(sent).toHaveLength(1)
  })

  it('keeps a branch picked while the change was on its way', async () => {
    await armed()
    pickInTree(9)
    const letGo = holdNextWrite()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    pickInTree(11)
    letGo()

    await vi.waitFor(() => {
      expect(inPick(`.${classes.faceWaiting}`)?.textContent).toBe('1 waiting to be added')
    })
  })

  it('turns back to the preview only once the addition is taken', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    const letGo = holdNextWrite()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent.length).toBe(1)
    })
    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)

    letGo()

    await vi.waitFor(() => {
      expect(card()?.classList.contains(classes.panelCardTurned)).toBe(true)
    })
  })

  it('flashes the branch that was just mounted once the card has turned', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    mounted(3, 5, 9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(classesOn(9)).toContain(classes.justAdded)
    }, { timeout: 2000 })
  })

  it('draws the tree again when the flash lights up', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    mounted(3, 5, 9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await vi.advanceTimersByTimeAsync(50)
    const painted = previewTree()?.repainted() ?? 0

    await vi.waitFor(() => {
      expect(previewTree()?.repainted()).toBeGreaterThan(painted)
    }, { timeout: 2000 })
  })

  it('keeps the flash when the card is drawn again before it shows', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    mounted(3, 5, 9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await vi.advanceTimersByTimeAsync(50)
    emit('permissions-written', {})

    await vi.waitFor(() => {
      expect(classesOn(9)).toContain(classes.justAdded)
    }, { timeout: 2000 })
  })

  it('flashes nothing when the group is read back with no page mounted', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    mounted()

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(inPreview(`.${classes.faceCounted}`)?.textContent).toBe('0 branches mounted')
    })
    await vi.advanceTimersByTimeAsync(1500)

    expect(document.querySelectorAll(`.${classes.justAdded}`)).toHaveLength(0)
  })

  it('lets the flash go once it has been seen', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    mounted(3, 5, 9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(classesOn(9)).toContain(classes.justAdded)
    }, { timeout: 2000 })

    await vi.waitFor(() => {
      expect(classesOn(9)).not.toContain(classes.justAdded)
    }, { timeout: 2000 })
  })

  it('leaves the card alone when a prompt takes the key', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)
    document.body.append(document.createElement('typo3-backend-modal'))

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)
  })

  // Return 422 on cancelled password prompt; treat as no change, not error
  it('stays on the picking side when no password was given', async () => {
    await armed()
    inPreview(`.${classes.faceBar} button`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    pickInTree(9)
    cancelNextPassword()

    const read = asked.filter(url => url.includes('visual_permissions_inspect')).length

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent.length).toBe(1)
    })
    await vi.advanceTimersByTimeAsync(50)
    expect(asked.filter(url => url.includes('visual_permissions_inspect')).length).toBe(read)
    expect(card()?.classList.contains(classes.panelCardTurned)).toBe(false)
    expect(classesOnPickSide(9)).toContain(classes.mountPicked)
  })

  it('keeps every mark when the backend refuses the change', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)
    refuseNextWrite()

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent.length).toBe(1)
    })
    expect(classesOn(3)).toContain(classes.faceMarked)
  })

  it('asks what the group mounts again once the change is taken', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)
    const read = asked.filter(url => url.includes('visual_permissions_inspect')).length

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(asked.filter(url => url.includes('visual_permissions_inspect')).length)
        .toBe(read + 1)
    })
  })

  it('builds the tree again once the mounts have changed', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const built = previewTree()

    mounted(3, 5, 9)
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(previewTree()).not.toBe(built)
    })
  })

  // Branch numbers are not concatenated; 1 with 23 is not 12 with 3
  it('builds the tree again for mounts whose numbers run into the same digits', async () => {
    mounted(1, 23)
    pickArea('pageMounts')
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const built = previewTree()

    mounted(12, 3)
    pickArea('pageMounts')

    await vi.waitFor(() => {
      expect(previewTree()).not.toBe(built)
    })
  })

  it('picks nothing when the backend picks a node on the page tree by itself', async () => {
    await armed()

    pickInTree(9, false)

    expect(classesOnPickSide(9)).not.toContain(classes.mountPicked)
  })

  it('lets go of a flash it started when the card it belongs to is gone', async () => {
    mounted(3, 5)
    await armed()
    pickInTree(9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })

    deactivate()
    activate()
    pickArea('pageMounts')
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const painted = previewTree()?.repainted() ?? 0

    await vi.advanceTimersByTimeAsync(900)

    expect(previewTree()?.repainted()).toBe(painted)
  })

  it('takes the light off a branch when a flash is cut short', async () => {
    mounted(3, 5)
    await armed()
    pickInTree(9)

    inPick(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })

    await vi.advanceTimersByTimeAsync(600)

    deactivate()
    activate()
    pickArea('pageMounts')
    await vi.advanceTimersByTimeAsync(400)
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })

    expect(previewTree()?.getNodeClasses({ identifier: '9', depth: 1 }) ?? [])
      .not.toContain(classes.justAdded)
  })

  it('leaves the tree alone when nothing has just arrived', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const painted = previewTree()?.repainted() ?? 0

    await vi.advanceTimersByTimeAsync(700)

    expect(previewTree()?.repainted()).toBe(painted)
  })

  it('flashes nothing once branches were taken away', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    pick(3)
    mounted(5)

    inPreview(`.${classes.faceApply}`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await vi.advanceTimersByTimeAsync(800)
    expect(classesOn(3)).not.toContain(classes.justAdded)
    expect(classesOn(5)).not.toContain(classes.justAdded)
  })
})
