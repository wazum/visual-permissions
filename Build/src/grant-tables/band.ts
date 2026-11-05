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
  const handedDown = verdict === inherited || verdict === alsoInherited
  const nobodys = verdict === adminsOnly
  const band = doc.createElement('div')

  band.className = `callout callout-notice callout-sm ${classes.tableGate}`
  band.append(say(doc, classes.tableName, called))
  band.append(say(doc, classes.tableToken, table))
  const body = say(doc, 'callout-body', labelOf(verdictLabel(verdict)))
  band.append(body)

  // Only the subgroup changes what it handed down, and nobody can give an administrator's table
  if (!handedDown && !nobodys) {
    const deed = button(
      doc,
      said(labelOf(theirs ? 'grantTables.take' : 'grantTables.give'), called),
      `btn btn-default btn-sm ${theirs ? classes.tableTake : classes.tableGive}`,
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
    return 'grantTables.theirs'
  }

  if (verdict === adminsOnly) {
    return 'grantTables.adminOnly'
  }

  if (verdict === alsoInherited) {
    return 'grantTables.alsoHandedDown'
  }

  return verdict === inherited ? 'grantTables.handedDown' : 'grantTables.missing'
}
