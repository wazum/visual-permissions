import type { Tree } from '@typo3/backend/tree/tree.js'
import { emit } from '../platform/bus.js'
import { classes } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import {
  button,
  counted,
  createFace,
  crossing,
  disableOnGroupChange,
  escapeLeavesPicking,
  footIn,
  said,
  say,
  showOutcome,
  type Face,
} from '../platform/panel-card.js'
import { labelOf } from '../platform/labels.js'
import { isWriting, type Permissions, type UnseenPage, type WriteOutcome } from '../platform/transport.js'
import { createNamingForm, validateFolderNames, namesIn } from './naming.js'
import { flash, inheritedIds, markedIds, mountedIds, pickedIds, unseenIds } from './marks.js'
import { restorePainting, takeOverPicking } from './pick-tree.js'
import { repaintBranches, showBranches } from './preview-tree.js'
import { showUnseen } from './unseen.js'
import { getState } from '../platform/session.js'
import { isOwn } from '../platform/vocabulary.js'

// Which side is up outlives a repaint; the card does not turn behind the user's back.
let picking = false

let markedFor: number | null = null

let listening: AbortController | null = null

export interface TreeConfiguration {
  readonly dataUrl: string
  readonly rootlineUrl?: string
  readonly filterUrl?: string
  readonly showIcons?: boolean
}

export interface Mounts {
  readonly targets: Readonly<Record<string, string>>
  readonly order: readonly string[]
  readonly named: Readonly<Record<string, string>>
  readonly unseen: readonly UnseenPage[]
}

export interface Kind {
  readonly word: string
  readonly component: string
  readonly tree: string
  readonly base: typeof Tree
  readonly namesFirst: boolean
  readonly mounted: (scopes: Permissions['scopes']) => Mounts
  readonly rootedAt: (groupId: number) => TreeConfiguration | Promise<TreeConfiguration>
  readonly write: (
    groupId: number,
    branches: readonly string[],
    mount: boolean,
    titles: ReadonlyMap<string, string>,
  ) => Promise<WriteOutcome>
  readonly choice?: (doc: Document, groupId: number) => HTMLElement
}

export function paintMounts(
  doc: Document,
  component: Element,
  mounts: Mounts,
  { groupId, kind }: { readonly groupId: number, readonly kind: Kind },
): void {
  const words = `mountBranches.${kind.word}`
  const own = (name: string): string => labelOf(`${words}.${name}`)
  const group = titleOf(doc, groupId) ?? ''
  const card = cardAround(doc, component)

  if (markedFor !== groupId) {
    markedIds.clear()
    pickedIds.clear()
    markedFor = groupId
  }

  listening?.abort()
  listening = new AbortController()
  const { signal } = listening

  const pick = faceIn(doc, card, classes.facePick)
  const preview = faceIn(doc, card, classes.facePreview)

  preview.eyebrow.textContent = labelOf('platform.preview')
  preview.sentence.textContent = said(own('previewFor'), group)
  pick.eyebrow.textContent = labelOf('platform.pick')
  pick.sentence.textContent = said(own('pickFor'), group)

  const pages = mounts.order

  mountedIds.clear()
  inheritedIds.clear()
  Object.entries(mounts.targets).forEach(([page, verdict]) => {
    mountedIds.add(page)

    if (!isOwn(verdict)) {
      inheritedIds.add(page)
      markedIds.delete(page)
    }
  })

  const oneSideOnly = (treeSide: boolean): void => {
    preview.sheet.toggleAttribute('inert', treeSide)
    pick.sheet.toggleAttribute('inert', !treeSide)
  }

  const turnTo = (treeSide: boolean): void => {
    picking = treeSide
    card.classList.toggle(classes.panelCardTurned, !treeSide)
    oneSideOnly(treeSide)
  }

  oneSideOnly(picking)

  // A count that takes an unsaved pick for a mount is a lie, and a nought is noise.
  const showCount = (): void => {
    const has = counted(`${words}.tally`, pages.length, pages.length)

    removals.state.textContent = markedIds.size === 0
      ? has
      : counted(`${words}.marked`, pages.length, markedIds.size, pages.length)
    removals.ready(markedIds.size > 0, markedIds.size > 0)

    additions.state.textContent = has
    additions.waiting.textContent = pickedIds.size === 0
      ? ''
      : said(labelOf('platform.waiting'), pickedIds.size)
    additions.ready(pickedIds.size > 0, true)
  }

  const write = (queued: Set<string>, mount: boolean): void => {
    // This panel belongs to the current group; marks are for the visible group only
    if (getState().groupId !== groupId) {
      return
    }

    const branches = [...queued]

    // No branches means no change; the panel treats it as done
    if (branches.length === 0) {
      return
    }

    // Side already cleared by first press; do not ask again
    if (isWriting()) {
      return
    }

    const sending = kind.write(groupId, branches, mount, namesIn(pick.sheet))

    // What was asked for flashes whenever the card is drawn again, and it is drawn again as
    // soon as the backend has taken it
    if (mount) {
      branches.forEach(branch => { flash.add(branch) })
    }

    void sending
      .then(outcome => {
        if (outcome !== 'taken') {
          branches.forEach(branch => { flash.delete(branch) })
          showOutcome(mount ? additions : removals, outcome)

          return
        }

        // They are the group's now, not something waiting here
        branches.forEach(branch => queued.delete(branch))
        closeNaming()
        turnTo(false)
        emit('permissions-written', {})
      })
  }

  const removals = footIn(preview.foot, {
    label: labelOf('platform.doRemove'),
    cancel: () => {
      markedIds.clear()
      repaintBranches(doc)
      showCount()
    },
    apply: () => { write(markedIds, false) },
  })

  // Only the admin can title a non-default record; others must pick a named one
  const namedIds = new Set(Object.keys(mounts.named))

  const closeNaming = (): void => {
    pick.sheet.querySelector(`.${classes.naming}`)?.remove()
    pick.scroll.hidden = false
    pick.eyebrow.textContent = labelOf('platform.pick')
    pick.sentence.textContent = said(own('pickFor'), group)
  }

  const addPicked = (): void => {
    const unnamed = [...pickedIds].filter(folder => !namedIds.has(folder))
    const asked = pick.sheet.querySelector(`.${classes.naming}`) !== null
    if (kind.namesFirst && unnamed.length > 0 && !asked) {
      const form = createNamingForm(doc, unnamed)
      form.addEventListener('submit', event => {
        event.preventDefault()
        addPicked()
      })
      form.addEventListener('input', () => { additions.ready(validateNames(), true) })

      pick.eyebrow.textContent = own('name')
      pick.sentence.textContent = own('nameFor')
      pick.scroll.hidden = true
      pick.sheet.insertBefore(form, pick.foot)
      // Stryker disable next-line OptionalChaining: the form was just built with a field per folder
      form.querySelector('input')?.focus()

      return
    }

    if (asked && !validateNames()) {
      // Stryker disable next-line OptionalChaining: validateNames marked the empty fields just now
      pick.sheet.querySelector<HTMLInputElement>(`.${classes.naming} input[aria-invalid]`)?.focus()

      return
    }

    write(pickedIds, true)
  }

  const validateNames = (): boolean => validateFolderNames(pick.sheet, own('nameWhy'))

  const additions = footIn(pick.foot, {
    label: labelOf('platform.doAdd'),
    cancel: () => {
      pickedIds.clear()
      closeNaming()
      turnTo(false)
      showCount()
    },
    apply: addPicked,
  })

  pick.scroll.style.setProperty('--vperm-queued-note', `"${labelOf('platform.toAdd')}"`)
  preview.scroll.style.setProperty('--vperm-inherited-note', `"${labelOf('platform.from')}"`)

  unseenIds.clear()
  mounts.unseen.forEach(({ page }) => { unseenIds.add(String(page)) })
  showUnseen(doc, preview, mounts.unseen, words)
  preview.sheet.querySelector(`.${classes.faceChoice}`)?.remove()
  if (kind.choice !== undefined) {
    const row = doc.createElement('div')
    row.className = classes.faceChoice
    row.append(kind.choice(doc, groupId))
    preview.sheet.insertBefore(row, preview.foot)
  }

  void showBranches(doc, preview.scroll, pages, { groupId, kind, showCount })
  takeOverPicking(pick.sheet, showCount, signal)
  showCount()
  flash.start(() => { repaintBranches(doc) })

  escapeLeavesPicking(doc, signal, () => picking, () => {
    if (pick.sheet.querySelector(`.${classes.naming}`) !== null) {
      closeNaming()

      return
    }

    turnTo(false)
  })

  disableOnGroupChange(groupId, [removals, additions], signal)

  preview.bar.replaceChildren(
    preview.eyebrow,
    preview.sentence,
    button(doc, own('add'), 'btn btn-default', () => { turnTo(true) }),
    say(doc, classes.faceHint, own('hint')),
  )

  window.requestAnimationFrame(() => { turnTo(picking) })
}

export function restoreTree(doc: Document): void {
  const card = doc.querySelector(
    `typo3-backend-navigation-component-pagetree > .${classes.panelCard},`
    + `typo3-backend-navigation-component-filestoragetree > .${classes.panelCard}`,
  )

  if (card === null) {
    return
  }

  picking = false
  markedIds.clear()
  markedFor = null
  flash.stop()

  listening?.abort()
  listening = null

  const holder = card.querySelector(`.${classes.facePick} > .${classes.faceScroll}`)
  const component = card.parentElement

  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement: the picking face is built with a scroll, and the card wraps the component
  if (holder === null || component === null) {
    return
  }

  card.classList.remove(classes.panelCardTurned)
  card.toggleAttribute('inert', true)
  restorePainting(holder)

  window.setTimeout(() => {
    // Shown again while waiting; keep it
    if (!card.hasAttribute('inert')) {
      return
    }

    component.append(...holder.childNodes)
    card.remove()
  }, crossing)
}

function cardAround(doc: Document, component: Element): Element {
  const existing = component.querySelector(`:scope > .${classes.panelCard}`)
  if (existing !== null) {
    existing.removeAttribute('inert')

    return existing
  }

  const card = doc.createElement('div')
  card.className = classes.panelCard
  component.append(card)

  return card
}

// A side is built once and filled again; tree, keyboard, and turn stay the same
function faceIn(doc: Document, card: Element, kind: string): Face {
  const existing = card.querySelector<HTMLElement>(`:scope > .${kind}`)
  if (existing !== null) {
    return parted(existing)
  }

  const face = createFace(doc, kind)

  // The backend's own tree is the side pages are picked on; it moves in whole, once. D1
  // Stryker disable next-line ConditionalExpression: the picking face is built first and takes the tree, so the other finds nothing
  if (kind === classes.facePick) {
    // Stryker disable next-line OptionalChaining,ArrayDeclaration: the card wraps the component it replaces
    face.scroll.append(...[...card.parentElement?.childNodes ?? []].filter(node => node !== card))
  }

  card.append(face.sheet)

  return face
}

function parted(sheet: HTMLElement): Face {
  const part = (className: string): HTMLElement =>
    sheet.querySelector<HTMLElement>(`.${className}`) ?? sheet

  return {
    sheet,
    bar: part(classes.faceBar),
    eyebrow: part(classes.faceEyebrow),
    sentence: part(classes.faceSentence),
    scroll: part(classes.faceScroll),
    foot: part(classes.faceFoot),
  }
}

