import { attributes, classes } from '../../platform/contract.js'
import { getState } from '../../platform/session.js'
import { isReachable, tableOf } from '../../platform/vocabulary.js'

export interface Judgement {
  readonly tables: Readonly<Record<string, string>>
  readonly named: Readonly<Record<string, string>>
}

export interface PreviewPart {
  readonly hide: (doc: Document, judgement: Judgement, face: 'preview' | 'pick') => void
  readonly explain: (doc: Document, table: string, verdict: string | undefined, called: string) => Element
}

const parts: { tables?: PreviewPart, fields?: PreviewPart } = {}

export function registerTables(part: PreviewPart, signal: AbortSignal): void {
  parts.tables = part
  signal.addEventListener('abort', () => { delete parts.tables })
}

export function registerFields(part: PreviewPart, signal: AbortSignal): void {
  parts.fields = part
  signal.addEventListener('abort', () => { delete parts.fields })
}

// Draws the form as the group gets it: what they were not given is off the screen, and so is
// a section or a tab with nothing of theirs left in it. Every other state gives it all back.
export function drawPreview(doc: Document, judgement: Judgement): void {
  doc.querySelectorAll(`.${classes.nothingTheirs}, .${classes.tableNote}`)
    .forEach(word => { word.remove() })
  doc.querySelectorAll(`[${attributes.unseen}]`).forEach(back => {
    back.removeAttribute('hidden')
    back.removeAttribute(attributes.unseen)
  })

  const { active, area, face } = getState()
  if (!active || area !== 'fields') {
    return
  }

  parts.tables?.hide(doc, judgement, face)
  parts.fields?.hide(doc, judgement, face)

  // Core puts rows on a form that hold no field of their own, and those hold nothing open
  partsOfRecord(doc, '.form-section').forEach(section => {
    const holdsField = [...section.querySelectorAll(`[${attributes.verdict}]`)]
      .some(field => field.closest(`[${attributes.unseen}]`) === null)

    if (!holdsField) {
      take(section)
    }
  })

  partsOfRecord(doc, '.tab-pane').forEach(pane => {
    if (pane.querySelector(`.form-section:not([${attributes.unseen}])`) !== null) {
      return
    }

    take(pane)
    take(doc.querySelector(`[data-typo3-tab='#${pane.id}']`)?.closest('.nav-item') ?? null)
  })

  openFirstVisibleTab(doc)

  // The side that gives fields away says why a record is bare on the record itself, not here
  if (face === 'preview') {
    sayWhenEmpty(doc, judgement)
  }
}

export function take(part: Element | null): void {
  part?.toggleAttribute('hidden', true)
  // Stryker disable next-line StringLiteral: a mark is read by being there, never for what it says
  part?.setAttribute(attributes.unseen, '')
}

// A flexform draws sections and tabs inside its field with no field of the server's in them;
// they stand with that field. A child record's sections hold fields of their own, and are judged.
function partsOfRecord(doc: Document, part: string): Element[] {
  return [...doc.querySelectorAll(part)]
    .filter(found => found.closest(`[${attributes.verdict}]`)?.querySelector(`[${attributes.verdict}]`) !== null)
}

function openFirstVisibleTab(doc: Document): void {
  if (doc.querySelector('.tab-pane.active')?.hasAttribute(attributes.unseen) !== true) {
    return
  }

  doc.querySelector<HTMLElement>(`.nav-item:not([${attributes.unseen}]) [data-typo3-tab]`)?.click()
}

// A blank screen explains nothing, and a sentence about it is a dead end: the reader is told
// what the group is missing and given the one deed that clears it
function sayWhenEmpty(doc: Document, { tables, named }: Judgement): void {
  if (doc.querySelector(`.form-section:not([${attributes.unseen}])`) !== null) {
    return
  }

  const table = recordTable(doc)
  const verdict = tables[table]
  const answering = isReachable(verdict) ? parts.fields : parts.tables
  const note = answering?.explain(doc, table, verdict, named[table] ?? table)
  if (note === undefined) {
    return
  }

  note.classList.add(classes.nothingTheirs)
  doc.querySelector('.typo3-TCEforms')?.append(note)
}

// The server says what holds each field it draws, and says nothing holds the record's own
function recordTable(doc: Document): string {
  const field = doc.querySelector(`[${attributes.token}][${attributes.inside}='']`)
  // Stryker disable next-line StringLiteral,OptionalChaining: the field was found by that very attribute, and the form always holds a field of its record
  const token = field?.getAttribute(attributes.token) ?? ''

  return tableOf(token)
}
