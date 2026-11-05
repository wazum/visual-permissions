import Persistent from '@typo3/backend/storage/persistent.js'
import { attributes } from '../platform/contract.js'
import { groupsOn, titleOf, type GroupEntry } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { counted } from '../platform/panel-card.js'
import { keep } from '../platform/persistence.js'
import { getState, selectGroup, subscribe } from '../platform/session.js'
import { createPicker, type PickerEntry } from '../platform/picker/picker.js'

const searchKey = 'vperm.groupSearch'
const recentKey = 'vperm.recentGroups'
const recentLimit = 3

export function initialise(doc: Document, signal: AbortSignal): void {
  const trigger = doc.querySelector<HTMLButtonElement>(`[${attributes.group}]`)
  if (trigger === null) {
    return
  }

  const picker = createPicker(doc, {
    totalOne: labelOf('pickAGroup.total.one'),
    totalMany: labelOf('pickAGroup.total.many'),
    take: labelOf('pickAGroup.key.take'),
    detail: labelOf('pickAGroup.key.detail'),
    loading: '',
    failed: '',
  })
  let recent = storedRecent(doc)
  picker.entries = entriesFrom(doc, recent)
  picker.remembers = searchKey
  picker.placeholder = labelOf('pickAGroup.search')
  doc.body.append(picker)

  trigger.addEventListener('click', () => { picker.openedBy(trigger) }, { signal })

  // The header is the only place that names the group on screen
  const chooseOne = trigger.textContent
  const say = (): void => {
    trigger.textContent = titleOf(doc, getState().groupId) ?? chooseOne
  }

  say()
  subscribe(say, signal)

  const remember = (): void => {
    const { groupId } = getState()
    if (groupId !== null && recent[0] !== groupId) {
      recent = [groupId, ...recent.filter(id => id !== groupId)]
      void keep(recentKey, recent)
    }

    picker.entries = entriesFrom(doc, recent)
  }

  subscribe(remember, signal)

  // A group in the detail pane is one the shown group inherits from; taking it walks one step up the chain.
  const show = (event: Event): void => {
    selectGroup(Number((event as CustomEvent<{ id: string }>).detail.id))
  }

  picker.addEventListener('vperm:picked', show, { signal })
  picker.addEventListener('vperm:detail-picked', show, { signal })

  signal.addEventListener('abort', () => { picker.remove() })
}

function storedRecent(doc: Document): number[] {
  const groups = groupsOn(doc)

  return [Persistent.get(recentKey)].flat().map(String).filter(id => id in groups).map(Number)
}

function entriesFrom(doc: Document, recent: readonly number[]): PickerEntry[] {
  const groups = Object.entries(groupsOn(doc))
  const shown = recent.filter(id => id !== getState().groupId).slice(0, recentLimit)
  const lately = shown.flatMap(id => groups.filter(([groupId]) => groupId === String(id)))
  const rest = groups
    .filter(([groupId]) => !shown.includes(Number(groupId)))
    .sort(([, one], [, other]) => one.title.localeCompare(other.title))

  return [
    ...lately.map(([id, group]) => entryFor(id, group, labelOf('pickAGroup.recent'))),
    ...rest.map(([id, group]) => entryFor(id, group, labelOf('pickAGroup.all'))),
  ]
}

function entryFor(id: string, group: GroupEntry, heading: string): PickerEntry {
  return {
    id,
    heading,
    title: group.title,
    subtitle: group.disabled ? labelOf('pickAGroup.disabled') : '',
    note: said(group.inherits.length),
    detail: group.inherits.map(inherited => ({
      id: String(inherited.groupId),
      title: inherited.title,
      depth: inherited.depth - 1,
    })),
    detailHeading: labelOf(group.inherits.length === 0 ? 'pickAGroup.detail.none' : 'pickAGroup.detail'),
  }
}

// XLIFF groups count to zero with no key; return nothing for zero count
function said(count: number): string {
  if (count === 0) {
    return ''
  }

  return counted('pickAGroup.inherits', count, count)
}
