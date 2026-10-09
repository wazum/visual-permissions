import { attributes } from '../platform/contract.js'
import { groupsOn, titleOf } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { counted } from '../platform/panel-card.js'
import { getState, selectGroup, subscribe } from '../platform/session.js'
import { createPicker, type PickerEntry } from '../platform/picker/picker.js'

const searchKey = 'vperm.groupSearch'

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
  picker.entries = entriesFrom(doc)
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

  // A group in the detail pane is one the shown group inherits from; taking it walks one step up the chain.
  const show = (event: Event): void => {
    selectGroup(Number((event as CustomEvent<{ id: string }>).detail.id))
  }

  picker.addEventListener('vperm:picked', show, { signal })
  picker.addEventListener('vperm:detail-picked', show, { signal })

  signal.addEventListener('abort', () => { picker.remove() })
}

function entriesFrom(doc: Document): PickerEntry[] {
  return Object.entries(groupsOn(doc))
    .sort(([, one], [, other]) => one.title.localeCompare(other.title))
    .map(([id, group]) => ({
      id,
      title: group.title,
      subtitle: group.disabled ? labelOf('pickAGroup.disabled') : '',
      note: said(group.inherits.length),
      detail: group.inherits.map(inherited => ({
        id: String(inherited.groupId),
        title: inherited.title,
        depth: inherited.depth - 1,
      })),
      detailHeading: labelOf(group.inherits.length === 0 ? 'pickAGroup.detail.none' : 'pickAGroup.detail'),
    }))
}

// XLIFF groups count to zero with no key; return nothing for zero count
function said(count: number): string {
  if (count === 0) {
    return ''
  }

  return counted('pickAGroup.inherits', count, count)
}
