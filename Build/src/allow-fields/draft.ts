import { getState } from '../platform/session.js'

// The fields marked on the form: a change asked for on one group, and gone with the form it
// was marked on
export interface Draft {
  has(field: Element): boolean
  toggle(field: Element): void
  drop(): void
}

export function createDraft(): Draft {
  let heldFor: number | null = null
  let marked = new WeakSet<Element>()

  const current = (): WeakSet<Element> => {
    const { groupId } = getState()
    if (groupId !== heldFor) {
      marked = new WeakSet()
      heldFor = groupId
    }

    return marked
  }

  return {
    has: field => current().has(field),
    toggle: field => {
      const fields = current()
      if (fields.has(field)) {
        fields.delete(field)

        return
      }

      fields.add(field)
    },
    drop: () => { marked = new WeakSet() },
  }
}
