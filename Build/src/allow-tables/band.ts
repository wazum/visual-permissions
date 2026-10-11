import { classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { button, said, say } from '../platform/panel-card.js'
import { adminsOnly, alsoInherited, inherited, picked } from '../platform/vocabulary.js'
import { writeTable } from './write.js'

export interface BandState {
  readonly groupId: number
  readonly table: string
  readonly called: string
  readonly verdict: string | undefined
}

export function drawBand(doc: Document, { groupId, table, called, verdict }: BandState): HTMLElement {
  const theirs = verdict === picked
  const fromSubgroup = verdict === inherited || verdict === alsoInherited
  const nobodys = verdict === adminsOnly
  const band = doc.createElement('div')

  band.className = `callout callout-notice callout-sm ${classes.tableGate}`
  band.append(say(doc, classes.tableName, called))
  band.append(say(doc, classes.tableToken, table))
  const body = say(doc, 'callout-body', labelOf(verdictLabel(verdict)))
  band.append(body)

  // Only the subgroup changes what it passes on, and an administrator's table cannot be allowed
  if (!fromSubgroup && !nobodys) {
    const deed = button(
      doc,
      said(labelOf(theirs ? 'allowTables.disallow' : 'allowTables.allow'), called),
      `btn btn-default btn-sm ${theirs ? classes.tableDisallow : classes.tableAllow}`,
      () => {
        deed.toggleAttribute('disabled', true)
        void writeTable(groupId, table, !theirs).then(outcome => {
          deed.toggleAttribute('disabled', false)
          if (outcome !== 'taken' && outcome !== 'cancelled') {
            body.textContent = labelOf(`platform.${outcome}`)
          }
        })
      },
    )
    band.append(deed)
  }

  return band
}

function verdictLabel(verdict: string | undefined): string {
  if (verdict === picked) {
    return 'allowTables.theirs'
  }

  if (verdict === adminsOnly) {
    return 'allowTables.adminOnly'
  }

  if (verdict === alsoInherited) {
    return 'allowTables.alsoInherited'
  }

  return verdict === inherited ? 'allowTables.inherited' : 'allowTables.missing'
}
