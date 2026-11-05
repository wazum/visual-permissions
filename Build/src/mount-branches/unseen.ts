import ModuleMenu from '@typo3/backend/module-menu.js'
import { ModuleStateStorage } from '@typo3/backend/storage/module-state-storage.js'
import { classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { counted, said, type Face } from '../platform/panel-card.js'
import type { UnseenPage } from '../platform/transport.js'

export function showUnseen(
  doc: Document,
  preview: Face,
  unseen: readonly UnseenPage[],
  words: string,
): void {
  const own = (name: string): string => labelOf(`${words}.${name}`)
  preview.sheet.querySelector(`.${classes.unseenPages}`)?.remove()

  if (unseen.length === 0) {
    return
  }

  const note = doc.createElement('div')
  note.className = classes.unseenPages
  const lead = doc.createElement('b')
  lead.textContent = counted(`${words}.unseen`, unseen.length, unseen.length)
  const head = doc.createElement('p')
  head.append(lead, ` ${own('unseenWhy')}`)
  const list = doc.createElement('ul')
  unseen.forEach(({ page, title, link }) => {
    const line = doc.createElement('a')
    line.href = link
    // Core's own way in: the tree follows the page, and the module opens on the page the tree holds
    line.addEventListener('click', event => {
      event.preventDefault()
      ModuleStateStorage.update('web', page, true)
      void ModuleMenu.App.showModule('permissions_pages')
    })
    line.setAttribute('aria-label', said(own('unseenLink'), title))
    line.textContent = said(own('unseenPage'), title)
    const item = doc.createElement('li')
    item.append(line)
    list.append(item)
  })
  note.append(head, list)
  preview.sheet.insertBefore(note, preview.foot)
}
