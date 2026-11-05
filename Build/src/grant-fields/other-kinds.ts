import { on } from '../platform/bus.js'
import { attributes, classes } from '../platform/contract.js'
import { onFormReady } from '../surfaces/record-form/form.js'

export function initialise(signal: AbortSignal): void {
  // Until a form arrives there is no list on the page to look at
  let doc: Document = document

  const list = (): void => {
    doc.querySelectorAll(`.${classes.otherKinds}`).forEach(section => { place(section) })
  }

  onFormReady(form => {
    doc = form.doc
    list()
  }, signal)

  // Whether the group may write the table is known once the form is judged
  on('fields-judged', list, signal)
}

function place(section: Element): void {
  // Stryker disable next-line OptionalChaining: the server draws the list inside the anchor of the field it is about
  const records = section.parentElement?.closest(`.${classes.anchor}`)?.querySelector('.panel-group')

  // Moved only when it is not last already: every move is a change the form is watched for
  // Stryker disable next-line ConditionalExpression,OptionalChaining: appending the last child again leaves the page as it was
  if (records?.lastElementChild !== section) {
    // Stryker disable next-line OptionalChaining: core draws the list of records for every field that holds them
    records?.append(section)
  }

  // Every field listed belongs to the one table, and the group may write all of it or none
  section.toggleAttribute('hidden', section.querySelector(`[${attributes.token}]:not([${attributes.outOfReach}])`) === null)
}
