import { attributes, classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { said, say } from '../platform/panel-card.js'
import { isReachable } from '../platform/vocabulary.js'
import { getState } from '../platform/session.js'
import { take, registerTables } from '../surfaces/record-form/preview.js'
import { drawBand } from './band.js'
import { rowOf } from '../surfaces/record-form/records.js'

export function initialise(signal: AbortSignal): void {
  registerTables({
    hide: (doc, { tables, named }, face) => {
      // The group is given no record of a table they may not write, but the side that gives
      // tables away has still to name the record the decision is about
      const home = face === 'preview' ? '.form-irre-object' : '.form-group'

      Object.entries(tables)
        .filter(([, verdict]) => !isReachable(verdict))
        .forEach(([table]) => {
          doc.querySelectorAll(`[${attributes.token}^='${table}:']`)
            .forEach(field => { take(field.closest(home) ?? rowOf(field) ?? field) })

          if (face === 'preview') {
            explainMissing(doc, table, named[table] ?? table)
          }
        })
    },
    explain: (doc, table, verdict, called) => drawBand(doc, { groupId: getState().groupId ?? 0, table, called, verdict }),
  }, signal)
}

// A field that is simply empty explains nothing, so it says once why it is
function explainMissing(doc: Document, table: string, called: string): void {
  const fields = new Set<Element>()

  // The server says which field each record it drew is held in, so the word lands on that field
  doc.querySelectorAll(`[${attributes.token}^='${table}:']:not([${attributes.inside}=''])`)
    .forEach(gone => {
      // Stryker disable next-line StringLiteral: the field was found by that very attribute
      const held = gone.getAttribute(attributes.inside) ?? ''
      const field = doc.querySelector(`[${attributes.field}='${held}']`)?.closest('.form-group')

      // Stryker disable next-line ConditionalExpression: core draws every field it says it drew
      if (field !== null && field !== undefined) {
        fields.add(field)
      }
    })

  fields.forEach(field => {
    field.append(say(
      doc,
      `callout callout-notice callout-sm ${classes.tableNote}`,
      said(labelOf('grantTables.gone'), called),
    ))
  })
}
