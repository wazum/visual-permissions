import Client from '@typo3/backend/storage/client.js'
import { onFormReady } from './form.js'
import { getState, subscribe } from '../../platform/session.js'

const records = '[data-object-id]'

export interface Fold {
  // A record whose own fields are not on the form
  readonly shut: string
  // What is pressed to open such a record, and to fold it back again
  readonly opener: string
}

export function keepRecordsOpen(fold: Fold, signal: AbortSignal): void {
  let doc: Document | null = null
  let asked = new WeakSet<Element>()

  const apply = (): void => {
    if (doc === null) {
      return
    }

    const { active, area } = getState()
    if (!active || area !== 'fields') {
      asked = new WeakSet()
      foldBack(doc, fold)

      return
    }

    doc.querySelectorAll(fold.shut).forEach(record => {
      if (asked.has(record)) {
        return
      }

      asked.add(record)
      note(record)
      press(record, fold)
    })
  }

  onFormReady(form => {
    doc = form.doc
    apply()
  }, signal)

  subscribe(apply, signal)
}

// Core writes down that a record was unfolded and the next page draws it open, so only the
// note is left to say how the admin had it. A record off screen keeps its note until the
// form it belongs to comes back.
function foldBack(doc: Document, fold: Fold): void {
  doc.querySelectorAll(records).forEach(record => {
    if (!noted(record)) {
      return
    }

    forget(record)

    if (!record.matches(fold.shut)) {
      press(record, fold)
    }
  })
}

function press(record: Element, fold: Fold): void {
  // Stryker disable next-line OptionalChaining: core draws no shut record without the press that opens it
  record.querySelector<HTMLElement>(fold.opener)?.click()
}

const noteFor = (record: Element): string =>
  // Stryker disable next-line StringLiteral,LogicalOperator: the note is read nowhere else, and the selector guarantees the attribute.
  `vperm.unfolded.${record.getAttribute('data-object-id') ?? ''}`

function note(record: Element): void {
  // Stryker disable next-line StringLiteral: noted() asks only whether the note is there.
  Client.set(noteFor(record), 'folded')
}

function noted(record: Element): boolean {
  return Client.isset(noteFor(record))
}

function forget(record: Element): void {
  Client.unset(noteFor(record))
}
