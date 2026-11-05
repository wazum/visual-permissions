import { classes } from '../platform/contract.js'
import { lineUpWithPanel } from '../platform/panel-line.js'
import { bindShortcut } from '../platform/shortcuts.js'
import { slideAway } from './slide.js'
import { notePlace, lastRoomWidth } from './places.js'

export function initialise(doc: Document, signal: AbortSignal): void {
  const host = doc.querySelector('.topbar-site-container')
  const theirs = doc.querySelector('typo3-backend-switch-user[mode="exit"]')
  if (host === null || theirs === null) {
    return
  }

  const wayOut = theirs.cloneNode(true) as Element

  wayOut.classList.remove('btn-sm')
  wayOut.classList.add(classes.leaveUser)

  const {
    leave: word = '',
    switchUserKey: key = '',
  } = TYPO3.settings.visualPermissions ?? {}

  if (word !== '') {
    wayOut.textContent = word
  }

  const room = doc.createElement('div')
  room.className = classes.leaveRoom
  room.append(wayOut)

  // The way back ends where View ended, so its room is as wide as the one the admin left
  const width = lastRoomWidth()
  if (width !== null) {
    room.style.setProperty('--vperm-room-width', `${width}px`)
  }
  host.append(room)

  lineUpWithPanel(doc, room, signal)

  wayOut.addEventListener('click', () => {
    notePlace(doc)
    slideAway(doc, 'up', () => undefined)
  }, { signal })

  bindShortcut(key, wayOut, () => { (wayOut as HTMLElement).click() })

  signal.addEventListener('abort', () => { room.remove() })
}
