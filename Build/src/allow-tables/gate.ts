import { on } from '../platform/bus.js'
import { attributes, classes } from '../platform/contract.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import { createLatestInspect } from '../platform/transport.js'
import { drawBand } from './band.js'
import { getState, subscribe } from '../platform/session.js'
import { alsoInherited, dropped, inherited, picked, tableOf } from '../platform/vocabulary.js'

// Core draws every record it is editing in one of these, tabs and all
const wholeForm = '.typo3-TCEforms'

export function initialise(signal: AbortSignal): void {
  let doc: Document | null = null
  const latest = createLatestInspect()

  const show = async (): Promise<void> => {
    if (doc === null) {
      return
    }

    const page = doc

    page.querySelectorAll(`.${classes.tableGate}:not(.${classes.nothingTheirs})`).forEach(gone => { gone.remove() })

    const { active, area, face, groupId } = getState()

    // Stryker disable next-line ConditionalExpression,LogicalOperator: an area is armed only for a group; the last check only narrows the type for inspect
    if (!active || area !== 'fields' || face !== 'pick' || groupId === null) {
      latest.drop()

      return
    }

    // The server names the field each record of another table is drawn in, so the field that
    // holds a table is read off the form, never guessed from the shape of core's markup
    const holders = new Map<Element, string>()
    page.querySelectorAll(`[${attributes.inside}]`).forEach(field => {
      // Stryker disable next-line StringLiteral: the field was found by that very attribute
      const held = field.getAttribute(attributes.inside) ?? ''
      // A field the server says nothing holds is the record's own, and so is its table
      const holder = held === ''
        ? field.closest(wholeForm)
        : page.querySelector(`[${attributes.field}='${held}']`)
      // Stryker disable next-line StringLiteral: every field the server draws carries its token
      const token = field.getAttribute(attributes.token) ?? ''
      if (holder !== null) {
        holders.set(holder, tableOf(token))
      }
    })

    const permissions = await latest.inspect(groupId, [...new Set(holders.values())])
    if (permissions === null) {
      return
    }

    const { named, targets } = permissions.scopes.tablesModify
    holders.forEach((table, record) => {
      const verdict = targets[table]
      if (![picked, inherited, alsoInherited, dropped].some(one => one === verdict)) {
        return
      }

      const gate = drawBand(page, { groupId, table, called: named[table] ?? table, verdict })

      // The record's own table holds however the form is folded into tabs, so its band stands
      // over all of them; a table held in a field stands against the records themselves
      const first = record.matches(wholeForm) ? null : record.querySelector('.form-irre-object')
      if (first === null) {
        record.prepend(gate)

        return
      }

      first.before(gate)
    })
  }

  onFormReady(form => {
    doc = form.doc
    void show()
  }, signal)

  // Whatever wrote it, the tables the group may write are old
  on('permissions-written', () => void show(), signal)

  subscribe(() => void show(), signal)
}
