import { attributes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { button, said, say } from '../platform/panel-card.js'
import { turnTo } from '../platform/session.js'
import { adminsOnly, dropped } from '../platform/vocabulary.js'
import { take, registerFields } from '../surfaces/record-form/preview.js'
import { rowOf } from '../surfaces/record-form/records.js'
import { flipForm } from '../surfaces/record-form/turn.js'

// The two verdicts core answers with a field the group never sees on its own form
const gone = `[${attributes.verdict}='${dropped}'], [${attributes.verdict}='${adminsOnly}']`

export function initialise(signal: AbortSignal): void {
  registerFields({
    hide: (doc, _judgement, face) => {
      if (face === 'preview') {
        doc.querySelectorAll(gone).forEach(field => { take(rowOf(field) ?? field) })
      }
    },
    explain: (doc, _table, _verdict, called) => {
      const note = doc.createElement('div')
      note.className = 'callout callout-notice'
      note.append(
        say(doc, 'callout-body', said(labelOf('grantFields.recordNoFields'), called)),
        button(doc, labelOf('recordForm.add'), 'btn btn-default btn-sm', () => {
          flipForm(doc, () => { turnTo('pick') })
        }),
      )

      return note
    },
  }, signal)
}
