import { classes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { say } from '../platform/panel-card.js'
import { adminsOnly, alsoInherited, inherited, picked } from '../platform/vocabulary.js'
import { writeTable } from './write.js'

export interface BandState {
  readonly groupId: number
  readonly table: string
  readonly called: string
  readonly verdict: string | undefined
  readonly reads?: string | undefined
}

const levels = ['none', 'select', 'modify']

export function drawBand(doc: Document, { groupId, table, called, verdict, reads }: BandState): HTMLElement {
  const passedOn = (one: string | undefined): boolean => one === inherited || one === alsoInherited
  const floor = passedOn(verdict) ? 2 : passedOn(reads) ? 1 : 0
  const chosen = Math.max(verdict === picked ? 2 : reads === picked ? 1 : 0, floor)
  const band = doc.createElement('div')

  band.className = `callout callout-notice callout-sm ${classes.tableGate}`
  band.append(say(doc, classes.tableName, called))
  band.append(say(doc, classes.tableToken, table))
  // The switch says where the group stands; only a table nobody can be given says it in words
  const body = say(doc, 'callout-body', verdict === adminsOnly ? labelOf('allowTables.adminOnly') : '')
  band.append(body)

  if (verdict === adminsOnly) {
    return band
  }

  const switched = doc.createElement('div')
  switched.className = `btn-group btn-group-sm ${classes.tableLevels}`
  switched.setAttribute('role', 'radiogroup')
  switched.setAttribute('aria-label', called)
  switched.append(...levels.map((level, at) => {
    const option = doc.createElement('button')
    // Stryker disable next-line StringLiteral: only a browser sends the record form from a button without a type; the browser specs press it
    option.type = 'button'
    // Stryker disable next-line StringLiteral: only core's styles read these classes
    option.className = 'btn btn-default'
    option.setAttribute('role', 'radio')
    option.setAttribute('aria-checked', String(at === chosen))
    option.textContent = (at === floor && floor > 0 ? '↳ ' : '') + labelOf(`be_groups.tables_modify.permissions.${level}`)
    option.disabled = at < floor
    option.title = at < floor ? labelOf('allowTables.inherited') : ''
    option.addEventListener('click', () => {
      if (at === chosen) {
        return
      }

      const options = [...switched.querySelectorAll('button')]
      options.forEach(one => { one.disabled = true })
      void writeTable(groupId, table, at >= 1, at >= 2).then(outcome => {
        options.forEach((one, place) => { one.disabled = place < floor })
        // Stryker disable next-line ConditionalExpression,LogicalOperator,StringLiteral: there is no word for a taken or a cancelled write, so saying one would say nothing
        if (outcome !== 'taken' && outcome !== 'cancelled') {
          body.textContent = labelOf(`platform.${outcome}`)
        }
      })
    })

    return option
  }))
  band.append(switched)

  return band
}
