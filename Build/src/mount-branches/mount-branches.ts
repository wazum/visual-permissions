import { on } from '../platform/bus.js'
import { classes } from '../platform/contract.js'
import { createLatestInspect } from '../platform/transport.js'
import { getState, subscribe } from '../platform/session.js'
import { folders } from './folders.js'
import { pages } from './pages.js'
import { restoreTree, paintMounts, type Kind } from './panel.js'

const kinds: Readonly<Partial<Record<string, Kind>>> = { pageMounts: pages, fileMounts: folders }

export function initialise(doc: Document, signal: AbortSignal): void {
  const latest = createLatestInspect()
  let asking = false

  const show = async (): Promise<void> => {
    const { active, groupId, area } = getState()
    const kind = kinds[area]
    if (!active || groupId === null || kind === undefined) {
      latest.drop()
      restoreTree(doc)

      return
    }

    const component = doc.querySelector(kind.component)
    if (component === null) {
      return
    }

    asking = true
    const permissions = await latest.inspect(groupId)
    asking = false
    if (permissions === null) {
      return
    }

    paintMounts(doc, component, kind.mounted(permissions.scopes), { groupId, kind })
  }

  const watch = new MutationObserver(() => {
    if (!asking && [pages, folders].every(({ component }) => doc.querySelector(`${component} > .${classes.panelCard}`) === null)) {
      void show()
    }
  })

  watch.observe(doc.body, { childList: true, subtree: true })
  signal.addEventListener('abort', () => { watch.disconnect() })

  void show()
  // Whatever wrote it, what the panel holds about the group is old
  on('permissions-written', () => void show(), signal)

  subscribe(() => void show(), signal)
}
