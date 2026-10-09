import Persistent from '@typo3/backend/storage/persistent.js'
import { attributes, classes } from '../platform/contract.js'
import { type GroupEntry, groupsOn } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { counted } from '../platform/panel-card.js'
import { createPicker, type Picker, type PickerEntry } from '../platform/picker/picker.js'
import { type ViewableUser, viewableUsers } from './users.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { routes } from '../platform/routes.js'
import { keep } from '../platform/persistence.js'
import { selectGroup } from '../platform/session.js'
import { bindShortcut } from '../platform/shortcuts.js'
import {
  notedPlace, shellDocument, handOverSession, notedDocument, documentIn,
} from '../platform/shell.js'
import { type Shell, backendShell } from './module-shell.js'
import { rememberDocument } from './reopen-document.js'
import { slideAway } from './slide.js'
import { dropNote, readNote, writeNote } from './tab-notes.js'
import { noteRoomWidth, rememberUser, lastDocument, lastPlace } from './places.js'

const returnKey = 'vperm.returnTo'
// Stryker disable next-line StringLiteral: a note of ours, read back under whatever name it was kept.
const goneKey = 'vperm.returning'
const searchKey = 'vperm.userSearch'

export function initialise(
  doc: Document,
  signal: AbortSignal,
  shell: Shell = backendShell,
): boolean {
  const noted = Persistent.get(returnKey)
  const whence = notedPlace(noted)

  // Core sends the admin back to the module it remembers, not to the screen they left. The
  // note is crossed out first, since a write nobody waited for is lost to the navigation
  // that follows. Saying that this page is leaving leaves the arriving to the page that
  // stays.
  if (whence !== '' && notVisited(whence)) {
    rememberDocument(notedDocument(noted), whence)

    void keep(returnKey, { place: '' }).then(() => { shell.go(whence) })

    return true
  }

  setUpUserPicker(doc, signal, shell)

  return false
}

// The page that lands writes its own settings back from a copy taken before the note was
// crossed out, and puts the place back with it. The tab remembers where it was sent.
function notVisited(whence: string): boolean {
  if (readNote(goneKey) === whence) {
    return false
  }

  writeNote(goneKey, whence)

  return true
}

function setUpUserPicker(
  doc: Document,
  signal: AbortSignal,
  shell: Shell,
): void {
  const trigger = doc.querySelector<HTMLButtonElement>(`[${attributes.viewAs}]`)

  // Stryker disable next-line ConditionalExpression: the button ships in the toolbar item's own template.
  if (trigger === null) {
    return
  }

  const picker = createPicker(doc, {
    totalOne: labelOf('viewAsUser.total.one'),
    totalMany: labelOf('viewAsUser.total.many'),
    take: labelOf('viewAsUser.key.take'),
    detail: labelOf('viewAsUser.key.detail'),
    loading: labelOf('viewAsUser.loading'),
    failed: labelOf('viewAsUser.failed'),
  })
  picker.remembers = searchKey
  picker.placeholder = labelOf('viewAsUser.search')
  doc.body.append(picker)

  picker.addEventListener('vperm:picked', event => {
    void handOver(doc, Number((event as CustomEvent<{ id: string }>).detail.id), shell)
  }, { signal })

  picker.addEventListener('vperm:retry', () => { void fill(doc, picker) }, { signal })

  picker.addEventListener('vperm:detail-picked', event => {
    selectGroup(Number((event as CustomEvent<{ id: string }>).detail.id))
  }, { signal })

  // Backend user is a long list; never travel in the page; use current name
  trigger.addEventListener('click', () => {
    void fill(doc, picker)
    picker.openedBy(trigger)
  }, { signal })

  bindShortcut(TYPO3.settings.visualPermissions?.switchUserKey ?? '', trigger, () => {
    void lastViewedUser(doc, shell, trigger, picker)
  })

  signal.addEventListener('abort', () => { picker.remove() })
}

async function lastViewedUser(
  doc: Document,
  shell: Shell,
  trigger: HTMLElement,
  picker: Picker,
): Promise<void> {
  // Stryker disable next-line ArrowFunction: a list nobody could fetch is no list, by any name.
  const answer = await viewableUsers().catch(() => null)
  const lately = answer?.recent.find(id => answer.users.some(user => user.id === id))
  if (lately === undefined) {
    void fill(doc, picker)
    picker.openedBy(trigger)

    return
  }

  await handOver(doc, lately, shell)
}

async function fill(doc: Document, picker: Picker): Promise<void> {
  picker.state = 'loading'

  const answer = await viewableUsers().catch(() => null)
  if (answer === null) {
    picker.state = 'failed'

    return
  }

  const { recent, users } = answer

  picker.state = 'ready'
  const catalogue = groupsOn(doc)
  const byId = new Map(users.map(user => [user.id, user]))

  // Dropped if user is gone or no longer viewable; remember the id but not the user
  const lately = recent.map(id => byId.get(id)).filter(user => user !== undefined)
  const rest = users.filter(user => !recent.includes(user.id))

  picker.entries = [
    ...lately.map(user => entryFor(user, labelOf('viewAsUser.recent'), catalogue)),
    ...rest.map(user => entryFor(user, labelOf('viewAsUser.all'), catalogue)),
  ]
}

function entryFor(
  user: ViewableUser,
  heading: string,
  catalogue: Record<string, GroupEntry>,
): PickerEntry {
  const groups = user.groups
    .map(id => ({ id: String(id), title: catalogue[String(id)]?.title ?? '', depth: 0 }))
    .filter(group => group.title !== '')
    .sort((one, other) => one.title.localeCompare(other.title))

  return {
    id: String(user.id),
    title: user.realName === '' ? user.username : user.realName,
    subtitle: user.realName === '' ? '' : user.username,
    note: said(groups.length),
    detail: groups,
    detailHeading: headed(groups.length),
    heading,
  }
}

// User in no group says nothing beside their name: pane already states it
function said(count: number): string {
  if (count === 0) {
    return ''
  }

  return counted('viewAsUser.groups', count, count)
}

function headed(count: number): string {
  if (count === 0) {
    return labelOf('viewAsUser.detail.none')
  }

  return counted('viewAsUser.detail', count, count)
}

// Answer write before switch; unanswered writes go with navigation
async function handOver(doc: Document, userId: number, shell: Shell): Promise<void> {
  dropNote(goneKey)
  rememberUser(String(userId))
  // Stryker disable next-line OptionalChaining: the View button stands in the room it measures
  noteRoomWidth(doc.querySelector(`.${classes.viewAsControls}`)?.getBoundingClientRect().width ?? 0)
  await keep(returnKey, { place: shellDocument(doc), document: documentIn(doc) })

  const theirScreen = lastPlace(String(userId))

  rememberDocument(lastDocument(String(userId)), theirScreen)
  switchTo(userId, shell, theirScreen)
}

// The backend hands over and sends the browser on, so the page is left rather than answered:
// a page that stays behind asks the backend questions that take the new session with them.
function switchTo(userId: number, shell: Shell, theirScreen: string): void {
  handOverSession(document)

  slideAway(document, 'down', () => {
    shell.handOver(ajaxUrl(routes.view_as_user), {
      targetUser: String(userId),
      screen: theirScreen,
    })
  })
}

