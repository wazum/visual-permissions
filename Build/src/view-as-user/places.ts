import { notedPlace, shellDocument, notedDocument, documentIn } from '../platform/shell.js'
import { readNote, writeNote } from './tab-notes.js'

const readingKey = 'vperm.viewing'
const seenKey = 'vperm.seen'
const roomKey = 'vperm.room'

export function rememberUser(userId: string): void {
  writeNote(readingKey, userId)
}

export function noteRoomWidth(width: number): void {
  writeNote(roomKey, String(width))
}

export function lastRoomWidth(): string | null {
  return readNote(roomKey)
}

export function notePlace(doc: Document): void {
  const userId = readNote(readingKey)
  if (userId === null) {
    return
  }

  writeNote(seenKey, JSON.stringify({
    ...seen(),
    [userId]: { place: shellDocument(doc), document: documentIn(doc) },
  }))
}

export function lastPlace(userId: string): string {
  return notedPlace(seen()[userId])
}

export function lastDocument(userId: string): string {
  return notedDocument(seen()[userId])
}

function seen(): Record<string, unknown> {
  const held = readNote(seenKey)
  if (held === null) {
    return {}
  }

  return JSON.parse(held) as Record<string, unknown>
}
