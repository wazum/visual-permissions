import { on } from '../platform/bus.js'
import { attributes } from '../platform/contract.js'
import { createLatestInspect } from '../platform/transport.js'
import { getState, subscribe } from '../platform/session.js'
import { render, restoreMenu } from './panel.js'

const menu = '#modulemenu'
const moduleIdentifier = 'data-modulemenu-identifier'
const rows = `[${moduleIdentifier}]:not([aria-controls])`

export function initialise(doc: Document, signal: AbortSignal): void {
  const latest = createLatestInspect()

  const show = async (): Promise<void> => {
    const { active, groupId, area } = getState()
    if (!active || groupId === null || area !== 'modules') {
      latest.drop()
      doc.querySelectorAll(`${menu} [${attributes.verdict}]`)
        .forEach(row => { row.removeAttribute(attributes.verdict) })
      restoreMenuIn(doc)

      return
    }

    const panel = doc.querySelector(menu)
    if (panel === null) {
      return
    }

    const marked = [...panel.querySelectorAll(rows)]
    if (marked.length === 0) {
      return
    }

    const permissions = await latest.inspect(groupId)
    if (permissions === null) {
      return
    }

    const { scopes } = permissions

    Object.entries(scopes.modules.targets).forEach(([identifier, verdict]) => {
      marked
        .filter(row => row.getAttribute(moduleIdentifier) === identifier)
        .forEach(row => { row.setAttribute(attributes.verdict, verdict) })
    })

    render(doc, panel)
  }

  const restoreMenuIn = (where: Document): void => {
    const panel = where.querySelector(menu)
    if (panel !== null) {
      restoreMenu(where, panel)
    }
  }

  void show()
  // Whatever wrote it, what the panel holds about the group is old
  on('permissions-written', () => void show(), signal)

  subscribe(() => void show(), signal)
}
