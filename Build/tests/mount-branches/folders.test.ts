import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { emit, on } from '#src/platform/bus.js'
import { attributes, classes, elements } from '#src/platform/contract.js'
import { activate, deactivate, pickArea, selectGroup } from '#src/platform/session.js'
import { initialise } from '#src/mount-branches/mount-branches.js'
import { folders } from '#src/mount-branches/folders.js'
import { answerNextWriteWith, forget, refuseNextRead, reply, replyTo, sent } from '../__mocks__/typo3-ajax-request.js'
import { dialog, press } from '../__mocks__/typo3-modal.js'
import { coreTree } from '../__mocks__/typo3-tree.js'
import { forgetNotices, notices } from '../__mocks__/typo3-notification.js'

const pick = (folder: string): void => {
  (document.querySelector(`.${classes.facePreview} ${elements.folderTree}`) as
    { selectNode?: (node: { identifier: string, depth: number }) => void } | null)
    ?.selectNode?.({ identifier: folder, depth: 0 })
}

const component = 'typo3-backend-navigation-component-filestoragetree'

const tree = (): void => {
  const host = document.createElement(component)
  host.append(coreTree('typo3-backend-navigation-component-filestorage-tree', [{ identifier: '1%3A%2F', depth: 0 }]))
  document.body.replaceChildren(host)
}

interface Node {
  readonly identifier: string
  readonly depth: number
  readonly __parents: string[]
  __expanded?: boolean
}

interface Asked {
  isNodeSelectable: (node: Node) => boolean
  getNodeClasses: (node: Node) => string[]
  prepareNodes: (nodes: Node[]) => Node[]
  hideChildren: (node: Node) => void
}

const folderTree = (): Asked | null =>
  document.querySelector(`.${classes.facePreview} ${elements.folderTree}`) as unknown as Asked | null

const previewTree = (): { repainted: () => number } | null =>
  document.querySelector(`.${classes.facePreview} ${elements.folderTree}`) as
    unknown as { repainted: () => number } | null

const ownTree = (): { getNodeClasses: (node: { identifier: string, depth: number }) => string[] } | null =>
  document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-filestorage-tree`) as
    unknown as { getNodeClasses: (node: { identifier: string, depth: number }) => string[] } | null

const carrier = (): void => {
  const hidden = document.createElement('span')
  hidden.setAttribute(attributes.groups, JSON.stringify({ 7: { title: 'Content Reviewers', inherits: [] } }))
  document.body.append(hidden)
  TYPO3.lang = {
    'mountBranches.folders.add': 'Add file mounts',
    'mountBranches.folders.chooseOperations': 'Choose file operations',
    'mountBranches.folders.marked.many': '%1$s of %2$s folders marked to remove',
    'mountBranches.folders.marked.one': '%1$s of %2$s folder marked to remove',
    'mountBranches.folders.name': 'Name',
    'mountBranches.folders.nameFor': 'Name them as backend users will see them.',
    'mountBranches.folders.nameWhy': 'Give this file mount a name.',
    'mountBranches.folders.pickFor': 'Pick what %s may work in',
    'mountBranches.folders.previewFor': 'What %s may work in',
    'mountBranches.folders.tally.many': '%s folders mounted',
    'mountBranches.folders.tally.one': '%s folder mounted',
    'mountBranches.pages.add': 'Add file mounts',
    'mountBranches.pages.pickFor': 'Pick what %s may work in',
    'mountBranches.pages.previewFor': 'What %s may work in',
    'platform.cancel': 'Cancel',
    'platform.doAdd': 'Add',
    'platform.doRemove': 'Remove',
    'platform.notRead': 'Not read',
    'platform.pick': 'Assign',
    'platform.preview': 'Preview',
    'platform.waiting': '%s waiting to be added',
  }
}

// A mount has one folder by definition; others may have one without the group holding them
const drawState = (mounts: readonly string[], named: readonly string[]): void => {
  reply({
    group: { id: 7, title: 'Content Reviewers' },
    chain: [],
    scopes: {
      fields: { targets: {} },
      modules: { targets: {} },
      pageMounts: { targets: {}, order: [], unseen: [] },
      fileMounts: {
        targets: Object.fromEntries(mounts.map(folder => [folder, 'allowed'])),
        named: Object.fromEntries(named.map(folder => [folder, `Mount of ${folder}`])),
      },
      fileOperations: { targets: { readFile: 'allowed' } },
    },
  })
}

const pickInTree = (folder: string): void => {
  document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-filestorage-tree`)
    ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
      bubbles: true,
      detail: { node: { identifier: folder, depth: 0 }, propagate: true },
    }))
}

const fileOperations = {
  title: 'What the group "%s" may do with files and folders',
  groups: [{
    label: 'Files',
    values: [
      { value: 'readFile', label: 'Files: Read', icon: '' },
      { value: 'deleteFile', label: 'Files: Delete', icon: '' },
    ],
  }],
}

const chooseOperations = (): void => {
  ;[...document.querySelectorAll('button')].find(offered => offered.textContent === 'Choose file operations')?.click()
}

const quiet = async (): Promise<void> => new Promise(resolve => { setTimeout(resolve, 0) })

const armed = async (): Promise<void> => {
  activate()
  pickArea('fileMounts')
  await vi.waitFor(() => {
    expect(document.querySelector(`.${classes.facePreview}`)).not.toBeNull()
  })
}

describe('the file mounts panel', () => {
  let listening: AbortController

  beforeEach(() => {
    localStorage.clear()
    deactivate()
    selectGroup(7)
    forget()
    forgetNotices()
    listening = new AbortController()
    document.body.replaceChildren()
    tree()
    carrier()
    drawState(['1:/campaign/'], ['1:/campaign/', '1:/user_upload/', '1:/archive/'])
    initialise(document, listening.signal)
  })

  afterEach(() => {
    listening.abort()
    deactivate()
  })

  it('offers to choose the file operations right above the foot', async () => {
    await armed()

    const foot = document.querySelector(`.${classes.facePreview} > .${classes.faceFoot}`)

    expect(foot?.previousElementSibling?.querySelector('button')?.textContent).toBe('Choose file operations')
  })

  it('offers the file operations once however often the panel is drawn', async () => {
    await armed()

    emit('permissions-written', {})
    await new Promise(settled => { setTimeout(settled, 50) })

    expect([...document.querySelectorAll('button')].filter(offered => offered.textContent === 'Choose file operations'))
      .toHaveLength(1)
  })

  it('lists the file operations the backend offers as boxes to tick', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()

    chooseOperations()

    await vi.waitFor(() => {
      expect([...dialog()?.querySelectorAll('label:has(input[type="checkbox"])') ?? []].map(box => box.textContent.trim()))
        .toStrictEqual(['Files: Read', 'Files: Delete'])
    })
  })

  it('says so when the file operations cannot be read', async () => {
    await armed()

    chooseOperations()
    refuseNextRead()

    await vi.waitFor(() => {
      expect(notices).toStrictEqual([{ kind: 'error', title: 'Not read', message: undefined }])
    })
  })

  it('ticks a file operation the group may do', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()

    chooseOperations()

    await vi.waitFor(() => {
      expect([...dialog()?.querySelectorAll('label:has(input:checked)') ?? []].map(box => box.textContent.trim()))
        .toStrictEqual(['Files: Read'])
    })
  })

  it('keeps a file operation the group gets from a subgroup ticked, and out of reach', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    reply({ group: { id: 7, title: 'Content Reviewers' }, chain: [], scopes: { fileOperations: { targets: { readFile: 'inherited' } } } })

    chooseOperations()

    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    const read = [...dialog()?.querySelectorAll('label') ?? []].find(box => box.textContent.trim() === 'Files: Read')
    expect([read?.querySelector('input')?.checked, read?.querySelector('input')?.disabled]).toStrictEqual([true, true])
  })

  it('sends the file operations that were ticked and unticked', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    chooseOperations()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelectorAll('input').forEach(box => { box.click() })

    await press('apply')

    await vi.waitFor(() => {
      expect(sent).toContainEqual({
        url: '/typo3/ajax/visual_permissions_allow_file_operations',
        body: { group: 7, operations: [{ value: 'readFile', grant: false }, { value: 'deleteFile', grant: true }] },
      })
    })
  })

  it('closes the dialog once the file operations are written', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    chooseOperations()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()

    await press('apply')

    await vi.waitFor(() => { expect(dialog()).toBeNull() })
  })

  it('keeps the dialog open when the file operations were not written', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    chooseOperations()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()
    answerNextWriteWith(409)

    await press('apply')

    await vi.waitFor(() => { expect(sent).toHaveLength(1) })
    await quiet()
    expect(dialog()).not.toBeNull()
  })

  it('tells everyone the file operations were written', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    chooseOperations()
    await vi.waitFor(() => { expect(dialog()).not.toBeNull() })
    dialog()?.querySelector('input')?.click()

    await press('apply')

    await vi.waitFor(() => { expect(told).toBe(1) })
  })

  it('opens no dialog when the permissions cannot be read', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()
    refuseNextRead()

    chooseOperations()

    await vi.waitFor(() => {
      expect(notices).toHaveLength(1)
    })
    expect(dialog()).toBeNull()
  })

  it('names the dialog after what the group may do with files and folders', async () => {
    replyTo('visual_permissions_file_operations', fileOperations)
    await armed()

    chooseOperations()

    await vi.waitFor(() => {
      expect(dialog()?.querySelector('.modal-title')?.textContent).toBe('What the group "Content Reviewers" may do with files and folders')
    })
  })

  it('builds its card on the folder tree', async () => {
    await armed()

    expect(document.querySelector(`${component} > .${classes.panelCard}`)).not.toBeNull()
  })

  it('shows what the group mounts on a folder tree of its own', async () => {
    await armed()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} ${elements.folderTree}`))
        .not.toBeNull()
    })
  })

  it('sets its folder tree up the way core sets up its own', async () => {
    await armed()

    await vi.waitFor(() => {
      expect((document.querySelector(`.${classes.facePreview} ${elements.folderTree}`) as
        { setup?: Record<string, unknown> } | null)?.setup)
        .toStrictEqual({
          dataUrl: '/typo3/ajax/visual_permissions_folder_tree?group=7',
          rootlineUrl: '/typo3/ajax/filestorage_tree_rootline',
          filterUrl: '/typo3/ajax/filestorage_tree_filter',
          showIcons: true,
        })
    })
  })

  // Folders above a mount are read-only; the group has no control over them
  it('acts on no folder that only shows where a mount stands', async () => {
    await armed()

    expect(folderTree()?.isNodeSelectable({ identifier: '1%3A%2F', depth: 0, __parents: [] })).toBe(false)
  })

  // Mount stands as deep as the path down to it, and is the group's wherever that is.
  it('acts on a mount wherever it stands in the tree', async () => {
    await armed()

    expect(folderTree()?.isNodeSelectable({
      identifier: '1%3A%2Fcampaign%2F',
      depth: 1,
      __parents: ['1%3A%2F'],
    })).toBe(true)
  })

  // Closed folders hide mounts; open all folders to see mounts
  it('opens every folder that shows the way down to a mount', async () => {
    await armed()

    const prepared = folderTree()?.prepareNodes([{ identifier: '1%3A%2F', depth: 0, __parents: [], __expanded: false }])

    expect(prepared?.[0]?.__expanded).toBe(true)
  })

  it('keeps a folder that leads to a mount open', async () => {
    await armed()
    const node = { identifier: '1%3A%2F', depth: 0, __parents: [], __expanded: true }

    folderTree()?.hideChildren(node)

    expect(node.__expanded).toBe(true)
  })

  it('marks a folder that only shows the way down to a mount', async () => {
    await armed()

    expect(folderTree()?.getNodeClasses({
      identifier: '1%3A%2Fpress%2F',
      depth: 1,
      __parents: ['1%3A%2F'],
    })).toStrictEqual(['node', classes.mountContext])
  })

  it('says on the folder tree which rows are inside a mount', async () => {
    await armed()

    expect(folderTree()?.getNodeClasses({
      identifier: '1%3A%2Fcampaign%2Fspring%2F',
      depth: 2,
      __parents: ['1%3A%2F', '1%3A%2Fcampaign%2F'],
    })).toContain(classes.mountInside)
  })

  it('has the folder tree paint again once a folder is marked', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(previewTree()).not.toBeNull()
    })
    const painted = previewTree()?.repainted() ?? 0

    pick('1%3A%2Fcampaign%2F')

    expect(previewTree()?.repainted()).toBe(painted + 1)

    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceCancel}`)?.click()
  })

  // The tree spells a folder the way a url does; the backend is given the folder's own name
  it('counts the folders the group mounts, not the pages', async () => {
    await armed()

    expect(document.querySelector(`.${classes.facePreview} .${classes.faceCounted}`)?.textContent)
      .toBe('1 folder mounted')
  })

  it('sends the marked folders to be taken away', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} ${elements.folderTree}`)).not.toBeNull()
    })
    pick('1%3A%2Fcampaign%2F')

    document.querySelector(`.${classes.facePreview} .${classes.faceApply}`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toStrictEqual([{
        url: '/typo3/ajax/visual_permissions_mount_folders',
        body: { group: 7, operations: [{ folder: '1:/campaign/', mount: false, title: '' }] },
      }])
    })
  })

  // Domain rule: a queue is not one folder; backend keeps one node selected at a time
  it('marks on the backend own folder tree what is waiting to be mounted', async () => {
    await armed()
    document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-filestorage-tree`)
      ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
        bubbles: true,
        detail: { node: { identifier: '1%3A%2Farchive%2F', depth: 0 }, propagate: true },
      }))

    expect(ownTree()?.getNodeClasses({ identifier: '1%3A%2Farchive%2F', depth: 0 }))
      .toContain(classes.mountPicked)
  })

  it('takes a change asked for on a folder as a mark', async () => {
    await armed()
    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePreview} ${elements.folderTree}`)).not.toBeNull()
    })

    pick('1%3A%2Fcampaign%2F')

    expect(document.querySelector(`.${classes.facePreview} .${classes.faceCounted}`)?.textContent)
      .toBe('1 of 1 folder marked to remove')
  })

  it('gives the folder tree back when permissions are hidden', async () => {
    await armed()

    deactivate()

    await vi.waitFor(() => {
      expect(document.querySelector(`${component} > .${classes.panelCard}`)).toBeNull()
    })
  })

  // A row that answers no click must say so before it is clicked
  it('marks a whole storage as no row to act on', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()

    expect(ownTree()?.getNodeClasses({ identifier: '1%3A%2F', depth: 0 }))
      .toContain(classes.mountWhole)
    expect(ownTree()?.getNodeClasses({ identifier: '1%3A%2Fpress%2F', depth: 1 }))
      .not.toContain(classes.mountWhole)
  })

  it('asks for a name before mounting a folder that has no file mount yet', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(sent).toHaveLength(0)
    expect(document.querySelector(`.${classes.facePick} .${classes.naming}`)).not.toBeNull()

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('names each folder in a field of its own, ready to accept', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const row = document.querySelector(`.${classes.naming} .${classes.namingRow}`)
    const path = row?.querySelector(`.${classes.namingPath}`)

    expect(path?.localName).toBe('label')
    expect(path?.textContent).toBe('1:/press/')
    expect(path?.getAttribute('for')).toBe(row?.querySelector('input')?.id)
    expect(row?.querySelector('input')?.value).toBe('press')
    expect(row?.querySelector('input')?.type).toBe('text')
    expect(row?.querySelector('input')?.className).toBe('form-control')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('takes the marks off a field once a name is written in it', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()
    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ''
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    if (field !== null) {
      field.value = 'Press kit'
    }

    field?.dispatchEvent(new Event('input', { bubbles: true }))

    expect(field?.hasAttribute('aria-invalid')).toBe(false)
    expect(field?.hasAttribute('aria-describedby')).toBe(false)
    expect(document.querySelector(`.${classes.namingWhy}`)).toBeNull()

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  // Each folder must have its own name; one name does not stand for the other
  it('holds the deed back while one of two folders has no name', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    pickInTree('1%3A%2Fpress%2Fkit%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const fields = [...document.querySelectorAll<HTMLInputElement>(`.${classes.naming} input`)]

    expect(fields).toHaveLength(2)

    const second = fields[1]
    if (second !== undefined) {
      second.value = ''
    }

    second?.dispatchEvent(new Event('input', { bubbles: true }))

    expect(document.querySelector<HTMLButtonElement>(`.${classes.facePick} .${classes.faceApply}`)?.disabled)
      .toBe(true)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('says what the picking is for again when the naming is called off', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
    await quiet()

    expect(document.querySelector(`.${classes.facePick} .${classes.faceEyebrow}`)?.textContent).toBe('Assign')
    expect(document.querySelector(`.${classes.facePick} .${classes.faceSentence}`)?.textContent)
      .toBe('Pick what Content Reviewers may work in')
  })

  it('asks for the names without a word where the backend published none', async () => {
    TYPO3.lang = {}
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(document.querySelector(`.${classes.facePick} .${classes.faceEyebrow}`)?.textContent).toBe('')
    expect(document.querySelector(`.${classes.facePick} .${classes.faceSentence}`)?.textContent).toBe('')

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ''
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(document.querySelector(`.${classes.namingWhy}`)?.textContent).toBe('')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
    await quiet()

    expect(document.querySelector(`.${classes.facePick} .${classes.faceEyebrow}`)?.textContent).toBe('')
  })

  it('sends the name the admin wrote with the folder it belongs to', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = 'Press kit'
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()

    await vi.waitFor(() => {
      expect(sent).toStrictEqual([{
        url: '/typo3/ajax/visual_permissions_mount_folders',
        body: {
          group: 7,
          operations: [{ folder: '1:/press/', mount: true, title: 'Press kit' }],
        },
      }])
    })
  })

  it('leaves the reader where they are typing', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    pickInTree('1%3A%2Fnews%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const fields = document.querySelectorAll<HTMLInputElement>(`.${classes.naming} input`)
    const second = fields[1]
    if (fields[0] !== undefined && second !== undefined) {
      fields[0].value = ''
      second.focus()
      second.dispatchEvent(new Event('input', { bubbles: true }))
    }

    expect(document.activeElement).toBe(second)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('holds the deed back while a name is missing', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ' '
      field.dispatchEvent(new Event('input', { bubbles: true }))
    }

    expect(document.querySelector(`.${classes.facePick} .${classes.faceApply}`)?.hasAttribute('disabled'))
      .toBe(true)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('refuses a folder whose name was cleared', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = '   '
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(sent).toHaveLength(0)
    expect(document.querySelector(`.${classes.namingRow} .${classes.namingWhy}`)?.textContent)
      .toBe('Give this file mount a name.')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('marks a nameless field as wrong and points at the reason', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ''
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const why = document.querySelector(`.${classes.namingWhy}`)

    expect(why?.id).not.toBe('')
    expect(field?.getAttribute('aria-invalid')).toBe('true')
    expect(field?.getAttribute('aria-describedby')).toBe(why?.id)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('puts the tree away while the names are asked for, and says why once', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceScroll}`)?.hidden)
      .toBe(true)

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ''
    }

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(document.querySelectorAll(`.${classes.namingWhy}`)).toHaveLength(1)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('gives the tree back on Escape and keeps what was picked', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(document.querySelector(`.${classes.facePick} .${classes.naming}`)).toBeNull()
    expect(document.querySelector(`.${classes.facePick} .${classes.faceWaiting}`)?.textContent)
      .toBe('1 waiting to be added')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('puts the reader in the first field as the naming step opens', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    expect(document.activeElement).toBe(document.querySelector(`.${classes.naming} input`))

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('puts the reader in the field that has no name', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const field = document.querySelector<HTMLInputElement>(`.${classes.naming} input`)
    if (field !== null) {
      field.value = ''
    }

    const apply = document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)
    apply?.focus()
    apply?.click()
    await quiet()

    expect(document.activeElement).toBe(field)

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('takes Enter in a name field as the change itself', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const asked = new Event('submit', { bubbles: true, cancelable: true })
    document.querySelector(`.${classes.naming}`)?.dispatchEvent(asked)

    expect(asked.defaultPrevented).toBe(true)
    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
  })

  it('says what the naming step is for', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    const bar = document.querySelector(`.${classes.facePick} .${classes.faceBar}`)

    expect(bar?.querySelector(`.${classes.faceEyebrow}`)?.textContent).toBe('Name')
    expect(bar?.querySelector(`.${classes.faceSentence}`)?.textContent)
      .toBe('Name them as backend users will see them.')

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()
  })

  it('gives the tree back when the naming step is left', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceCancel}`)?.click()

    expect(document.querySelector(`.${classes.facePick} .${classes.naming}`)).toBeNull()
    expect(document.querySelector<HTMLElement>(`.${classes.facePick} > .${classes.faceScroll}`)?.hidden)
      .toBe(false)
  })

  it('gives the tree back once the names were taken', async () => {
    await armed()
    document.querySelector<HTMLElement>(`.${classes.facePreview} .${classes.faceBar} button`)?.click()
    pickInTree('1%3A%2Fpress%2F')
    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()
    await quiet()

    document.querySelector<HTMLElement>(`.${classes.facePick} .${classes.faceApply}`)?.click()

    await vi.waitFor(() => {
      expect(document.querySelector(`.${classes.facePick} .${classes.naming}`)).toBeNull()
    })
  })

  it('refuses to pick a whole storage', async () => {
    await armed()

    document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-filestorage-tree`)
      ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
        bubbles: true,
        detail: { node: { identifier: '1%3A%2F', depth: 0 }, propagate: true },
      }))

    expect(document.querySelector(`.${classes.facePick} .${classes.faceWaiting}`)?.textContent).toBe('')
  })

  it('refuses to pick a whole storage whatever its number', async () => {
    await armed()

    pickInTree('12%3A%2F')

    expect(document.querySelector(`.${classes.facePick} .${classes.faceWaiting}`)?.textContent).toBe('')
  })

  it('sends the picked folders to be mounted', async () => {
    await armed()
    document.querySelector(`.${classes.facePick} typo3-backend-navigation-component-filestorage-tree`)
      ?.dispatchEvent(new CustomEvent('typo3:tree:node-selected', {
        bubbles: true,
        detail: { node: { identifier: '1%3A%2Fuser_upload%2F', depth: 0 }, propagate: true },
      }))

    document.querySelector(`.${classes.facePick} .${classes.faceApply}`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toStrictEqual([{
        url: '/typo3/ajax/visual_permissions_mount_folders',
        body: { group: 7, operations: [{ folder: '1:/user_upload/', mount: true, title: '' }] },
      }])
    })
  })

  it('says that the backend took the folders', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    await armed()
    pickInTree('1%3A%2Fuser_upload%2F')

    document.querySelector(`.${classes.facePick} .${classes.faceApply}`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(told).toBe(1)
    })
  })

  it('says nothing about folders the backend turned down', async () => {
    let told = 0
    on('permissions-written', () => { told += 1 }, listening.signal)
    await armed()
    pickInTree('1%3A%2Fuser_upload%2F')
    answerNextWriteWith(409)

    document.querySelector(`.${classes.facePick} .${classes.faceApply}`)
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await vi.waitFor(() => {
      expect(sent).toHaveLength(1)
    })
    await new Promise(settled => { setTimeout(settled, 50) })
    expect(told).toBe(0)
  })

  it('says nothing about pages the group cannot see', async () => {
    await armed()

    expect(document.querySelector(`.${classes.unseenPages}`)).toBeNull()
  })

  it.each([
    ['/typo3/ajax/visual_permissions_folder_tree', '/typo3/ajax/visual_permissions_folder_tree?group=7'],
    ['/typo3/ajax/folders?token=abc', '/typo3/ajax/folders?token=abc&group=7'],
  ])('names the group in the folder tree URL %s', async (published, asked) => {
    TYPO3.settings.ajaxUrls['visual_permissions_folder_tree'] = published

    expect((await folders.rootedAt(7)).dataUrl).toBe(asked)

    TYPO3.settings.ajaxUrls['visual_permissions_folder_tree'] = '/typo3/ajax/visual_permissions_folder_tree'
  })
})
