import { openDocument, shellIn } from '../platform/shell.js'
import { documentUrl } from '../platform/transport.js'
import { dropNote, readNote, writeNote } from './tab-notes.js'

// A document's URL holds a token of the session that asked for it, and a token dies
// with its session: the URL is asked for again on the screen that lands. The note says
// which screen it is meant for, since the screen that writes it runs this too and would
// otherwise open the document on itself a moment before leaving.
const openingKey = 'vperm.opening'

export function rememberDocument(record: string, screen: string): void {
  if (record === '') {
    return
  }

  writeNote(openingKey, JSON.stringify({ record, screen }))
}

export function reopenDocument(doc: Document): void {
  const carried = remembered()
  // Stryker disable next-line StringLiteral: a shell naming no screen is turned away either way.
  const here = shellIn(doc)?.getAttribute('endpoint') ?? ''
  if (carried === null || here === '' || !sameScreen(carried.screen, here, doc.location.href)) {
    return
  }

  dropNote(openingKey)

  void restore(doc, here, carried.record)
}

// Routes are compared, not spellings, to detect duplicates
function sameScreen(saved: string, current: string, origin: string): boolean {
  const savedUrl = new URL(saved, origin)
  const currentUrl = new URL(current, origin)

  return savedUrl.pathname === currentUrl.pathname
    && (savedUrl.searchParams.get('id') ?? '') === (currentUrl.searchParams.get('id') ?? '')
}

function remembered(): { record: string, screen: string } | null {
  const held = readNote(openingKey)

  try {
    // Stryker disable next-line ConditionalExpression: JSON.parse(null) is null.
    return held === null ? null : JSON.parse(held) as { record: string, screen: string }
  } catch {
    return null
  }
}

async function restore(doc: Document, here: string, record: string): Promise<void> {
  const url = await documentUrl(record, here)
  if (url === '') {
    return
  }

  openDocument(doc, url)
}
