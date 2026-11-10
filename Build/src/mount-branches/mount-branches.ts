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
  let asking = 0
  let refusedFor: number | null = null

  const show = async (): Promise<void> => {
    refusedFor = null
    const { active, groupId, area } = getState()
    const kind = kinds[area]
    // Stryker disable next-line ConditionalExpression: this only narrows the type; the mode is never on without a group
    const nobody = groupId === null
    if (!active || nobody || kind === undefined) {
      latest.drop()
      restoreTree(doc)

      return
    }

    const component = doc.querySelector(kind.component)
    if (component === null) {
      return
    }

    asking += 1
    const permissions = await latest.inspect(groupId)
    asking -= 1
    if (permissions === null) {
      if (doc.querySelector(`${kind.component} > .${classes.panelCard}`) === null) {
        refusedFor = groupId
      }

      return
    }

    paintMounts(doc, component, kind.mounted(permissions.scopes), { groupId, kind })
  }

  const watch = new MutationObserver(() => {
    if (asking > 0 || getState().groupId === refusedFor) {
      return
    }

    if ([pages, folders].every(({ component }) => doc.querySelector(`${component} > .${classes.panelCard}`) === null)) {
      void show()
    }
  })

  watch.observe(doc.body, { childList: true, subtree: true })
  signal.addEventListener('abort', () => { watch.disconnect() })

  void show()
  on('permissions-written', () => void show(), signal)
  subscribe(() => void show(), signal)
}
