import { emit } from '../platform/bus.js'
import { attributes, classes } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { getState, subscribe } from '../platform/session.js'
import { inspect } from '../platform/transport.js'
import { fieldOf, isReachable, picked } from '../platform/vocabulary.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import { openChoices, type Choices } from '../platform/choices-dialog.js'
import { writeValues } from './write.js'

export function initialise(signal: AbortSignal): void {
  let doc: Document | null = null

  const offer = (): void => {
    if (doc === null) {
      return
    }

    const { active, face } = getState()
    if (!active || face !== 'pick') {
      doc.querySelectorAll(`.${classes.allowChoose}`).forEach(offered => { offered.remove() })

      return
    }

    doc.querySelectorAll(`[${attributes.allows}]`).forEach(field => {
      if (field.nextElementSibling?.classList.contains(classes.allowChoose) === true) {
        return
      }

      // Stryker disable next-line StringLiteral: the server writes the token on every field it marks
      const token = field.getAttribute(attributes.token) ?? ''
      const button = field.ownerDocument.createElement('button')
      // Stryker disable next-line StringLiteral: a form button submits by default and would take the backend along; jsdom submits nothing, only a browser can tell
      button.type = 'button'
      button.className = `btn btn-default btn-sm ${classes.allowChoose}`
      button.textContent = labelOf(`allowedValues.choose.${fieldOf(token)}`)
      button.addEventListener('click', () => {
        const choices = JSON.parse(field.getAttribute(attributes.choices) ?? '{}') as Choices
        // Stryker disable next-line LogicalOperator,NumericLiteral: the button stands only while the mode is on, and the mode is on only for a group
        const groupId = getState().groupId ?? 0
        void inspect(groupId).then(permissions => {
          if (permissions === null) {
            return
          }

          // Core keeps page types as they are, and the values of a field behind the field's name
          const list = field.getAttribute(attributes.allows) === 'pageTypes' ? 'pageTypes' : 'fieldValues'
          const prefix = list === 'pageTypes' ? '' : `${token}:`
          // Stryker disable next-line MethodExpression: the field values scope lists only values the group has, own or inherited, so the filter keeps every one
          const held = new Set(Object.entries(permissions.scopes[list].targets)
            .filter(([, verdict]) => isReachable(verdict))
            .map(([target]) => target.substring(prefix.length)))
          // Stryker disable next-line StringLiteral: the group is one of those the backend lists, so it has a title
          openChoices(choices, titleOf(document, groupId) ?? '', held, async marked => {
            const outcome = await writeValues(list, groupId, marked.map(({ value, grant }) => ({ value: `${prefix}${value}`, grant })))
            if (outcome !== 'taken') {
              return false
            }

            emit('permissions-written', {})

            return true
          }, new Set(Object.entries(permissions.scopes[list].targets)
            .filter(([, verdict]) => isReachable(verdict) && verdict !== picked)
            .map(([target]) => target.substring(prefix.length))))
        })
      })
      // Beside the field, not in it: a press in the field picks the field
      field.after(button)
    })
  }

  onFormReady(form => {
    doc = form.doc
    offer()
  }, signal)

  subscribe(offer, signal)
}
