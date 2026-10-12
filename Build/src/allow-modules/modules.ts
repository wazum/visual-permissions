import { on } from '../platform/bus.js'
import { attributes } from '../platform/contract.js'
import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { routes } from '../platform/routes.js'
import { createLatestInspect, read } from '../platform/transport.js'
import { getState, subscribe } from '../platform/session.js'
import { render, restoreMenu } from './panel.js'

interface OutsideMenu {
  readonly groups: readonly {
    readonly values: readonly { readonly value: string, readonly label: string, readonly parent: string }[]
  }[]
}

const menu = '#modulemenu'
const moduleIdentifier = 'data-modulemenu-identifier'
const rows = `[${moduleIdentifier}]:not([aria-controls])`

export function initialise(doc: Document, signal: AbortSignal): void {
  const latest = createLatestInspect()
  let outsideMenu: Promise<OutsideMenu | null> | null = null

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

    outsideMenu ??= read<OutsideMenu>(new AjaxRequest(ajaxUrl(routes.modules_outside_menu)).get())
    const outside = await outsideMenu
    if (outside === null) {
      outsideMenu = null

      return
    }

    render(doc, panel, outside.groups.flatMap(({ values }) => values.map(({ value, label, parent }) => ({
      verdict: scopes.modules.targets[value],
      parent,
      label,
    }))))
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
