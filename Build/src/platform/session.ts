import Persistent from '@typo3/backend/storage/persistent.js'
import { keep } from './persistence.js'

export interface SessionState {
  readonly open: boolean
  readonly active: boolean
  readonly groupId: number | null
  // Never none: with no area picked every area on screen would stand out of play
  readonly area: string
  // What the admin picked, not what a module may have no column for; only this is written down
  readonly picked: string
  // An area opens showing what the group has; the other side is where it is given
  readonly face: 'preview' | 'pick'
}

type Listener = (state: SessionState) => void

interface StoredSession {
  version?: unknown
  open?: unknown
  active?: unknown
  groupId?: unknown
  area?: unknown
}

// Domain rule: settings are per-backend-user, not per-client-session
const storageKey = 'vperm.session'
const storageVersion = 1

// Areas are a choice of one, never none, and an admin starts at the leftmost.
const firstArea = 'modules'

const fieldsArea = 'fields'

const listeners = new Set<Listener>()
let state: SessionState = restore()

document.addEventListener('typo3-module-loaded', () => { stand({ ...state, face: 'preview' }) })

export function getState(): SessionState {
  return state
}

export function subscribe(listener: Listener, signal?: AbortSignal): void {
  listeners.add(listener)
  signal?.addEventListener('abort', () => listeners.delete(listener))
}

export function activate(): void {
  const active = state.groupId !== null
  const area = active ? fieldsArea : state.area

  change({ ...state, active, open: state.open || active, area, picked: area })
}

export function showControls(): void {
  change({ ...state, open: true })
}

// The controls are the only way to switch the mode off; they take it with them
export function hideControls(): void {
  change({ ...state, open: false, active: false })
}

export function deactivate(): void {
  change({ ...state, active: false })
}

export function pickArea(area: string): void {
  change({ ...state, area, picked: area, face: 'preview' })
}

export function standIn(area: string): void {
  stand({ ...state, area })
}

// Which side is up belongs to the screen it is on; the next screen opens on the preview again
export function turnTo(face: SessionState['face']): void {
  stand({ ...state, face })
}

// Requires a group to show permissions for; groupId must be set
export function selectGroup(groupId: number | null): void {
  change({ ...state, groupId, active: state.active && groupId !== null })
}

// The write is queued before anyone hears of the change, so whoever waits for the settings to
// settle waits for this one too
function change(next: SessionState): void {
  void keep(storageKey, {
    version: storageVersion,
    open: next.open,
    active: next.active,
    groupId: next.groupId,
    area: next.picked,
  })

  stand(next)
}

function stand(next: SessionState): void {
  state = next

  for (const listener of listeners) {
    listener(state)
  }
}

function restore(): SessionState {
  const held = Persistent.get(storageKey)
  if (held === null || typeof held !== 'object') {
    return { open: false, active: false, groupId: null, area: firstArea, picked: firstArea, face: 'preview' }
  }

  const session = held as StoredSession

  // session.version is text from query string; compare as strings
  if (String(session.version) !== String(storageVersion)) {
    return { open: false, active: false, groupId: null, area: firstArea, picked: firstArea, face: 'preview' }
  }

  const groupId = Number(session.groupId)
  const area = typeof session.area === 'string' && session.area !== 'null' ? session.area : firstArea

  return {
    open: String(session.open) === 'true',
    active: String(session.active) === 'true',
    groupId: Number.isInteger(groupId) && groupId > 0 ? groupId : null,
    area,
    picked: area,
    face: 'preview',
  }
}
