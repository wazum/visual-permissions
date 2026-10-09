import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { JavaScriptItemProcessor } from '@typo3/core/java-script-item-processor.js'
import Notification from '@typo3/backend/notification.js'
import { attributes, classes } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { routes } from '../platform/routes.js'
import { getState, subscribe, type SessionState } from '../platform/session.js'
import { read, write } from '../platform/transport.js'

interface Form {
  readonly html: string
  readonly scriptItems: readonly unknown[]
}

export function initialise(doc: Document, signal: AbortSignal): void {
  const sheet = doc.createElement('div')
  sheet.className = classes.face

  const form = doc.createElement('form')
  form.setAttribute('name', 'editform')
  form.className = 'module-body'

  const head = doc.createElement('div')
  head.className = 'module-docheader module-docheader-buttons t3js-module-docheader-buttons'

  const column = doc.createElement('div')
  column.className = classes.head
  const name = doc.createElement('strong')
  const toolbar = doc.createElement('div')
  toolbar.className = 'btn-toolbar'
  toolbar.setAttribute('role', 'toolbar')

  const save = doc.createElement('button')
  // Stryker disable next-line StringLiteral: a form button submits by default and would take the backend along; jsdom submits nothing, only a browser can tell
  save.type = 'button'
  save.className = 'btn btn-sm btn-default'

  const mark = doc.createElement('typo3-backend-icon')
  mark.setAttribute('identifier', 'actions-document-save')
  mark.setAttribute('size', 'small')
  save.append(mark, ` ${labelOf('rm.saveDoc')}`)

  save.addEventListener('click', () => {
    save.disabled = true
    mark.setAttribute('identifier', 'spinner-circle')
    // Send plain values; the form body can only be read once after submission
    const values: Record<string, string> = { group: String(renderedFor) }

    for (const [named, held] of new FormData(form)) {
      if (typeof held === 'string') {
        values[named] = held
      }
    }

    void write(routes.write_other_permissions, values).then(outcome => {
      mark.setAttribute('identifier', 'actions-document-save')
      save.disabled = renderedFor !== shownFor

      if (outcome === 'taken') {
        Notification.success(labelOf('notification.record_saved.title.singular'))

        return
      }

      if (outcome === 'cancelled') {
        return
      }

      Notification.error(labelOf('editOtherPermissions.notSaved'))
    })
  })

  toolbar.append(save)
  column.append(name, toolbar)
  head.append(column)
  sheet.append(head, form)

  let shownFor: number | null = null
  let renderedFor: number | null = null

  const show = (state: SessionState): void => {
    const elsewhere = !state.active || state.area !== 'other'
    // Stryker disable next-line ConditionalExpression: this only narrows the type; the check below turns a missing group away just the same
    const nobody = state.groupId === null
    if (elsewhere || nobody) {
      sheet.remove()
      shownFor = null
      delete TYPO3.settings.FormEngine?.formName

      return
    }

    const asked = state.groupId
    if (asked === shownFor) {
      return
    }

    shownFor = asked
    save.disabled = true
    name.textContent = titleOf(doc, asked) ?? ''

    void fetchForm(asked).then(rendered => {
      // The reader is owed the group they are looking at, not the one they left
      if (rendered === null || asked !== shownFor) {
        return
      }

      form.replaceChildren(doc.createRange().createContextualFragment(rendered.html))
      renderedFor = asked
      save.disabled = false
      // Stryker disable next-line OptionalChaining: without a column to stand in, the panel stays off the page either way
      doc.querySelector(`.${classes.frame}[${attributes.area}="fields"]`)?.append(sheet)
      new JavaScriptItemProcessor().processItems([...rendered.scriptItems])
    })
  }

  show(getState())
  subscribe(show, signal)
}

async function fetchForm(groupId: number): Promise<Form | null> {
  return read<Form>(new AjaxRequest(ajaxUrl(routes.other_permissions))
    .withQueryArguments({ group: groupId })
    .get())
}
