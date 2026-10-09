import { emit, on } from '../platform/bus.js'
import { onFormReady } from '../surfaces/record-form/form.js'
import { attributes } from '../platform/contract.js'
import { labelOf } from '../platform/labels.js'
import { createLatestInspect, type Permissions } from '../platform/transport.js'
import { getState, subscribe } from '../platform/session.js'
import { isReachable, tableOf } from '../platform/vocabulary.js'
import type { Judgement } from './judgement.js'
import { drawPreview } from '../surfaces/record-form/preview.js'

type Field = readonly [element: Element, token: string]

interface FormState {
  readonly doc: Document
  readonly fields: readonly Field[]
}

export function initialise(judgement: Judgement, signal: AbortSignal): void {
  let form: FormState | null = null
  const latest = createLatestInspect()
  signal.addEventListener('abort', () => { latest.drop() })
  // The tables the form was last judged by; the form is drawn from them on either side
  let tablesFrom: Permissions['scopes']['tablesModify'] | null = null

  const draw = (): void => {
    if (form === null) {
      return
    }

    drawPreview(form.doc, { tables: tablesFrom?.targets ?? {}, named: tablesFrom?.named ?? {} })
  }

  const show = async (): Promise<void> => {
    if (form === null) {
      return
    }

    const { fields } = form

    const { active, groupId } = getState()
    if (!active || groupId === null) {
      latest.drop()
      fields.forEach(([element]) => {
        element.removeAttribute(attributes.verdict)
        element.removeAttribute(attributes.outOfReach)
      })
      tablesFrom = null
      draw()

      return
    }

    const tables = [...new Set(fields.map(([, token]) => tableOf(token)))]
    const permissions = await latest.inspect(groupId, tables)
    if (permissions === null) {
      return
    }

    const { scopes } = permissions
    judgement.take(permissions)

    fields.forEach(([element, token]) => {
      const verdict = scopes.fields.targets[token]
      if (verdict !== undefined) {
        element.setAttribute(attributes.verdict, verdict)
      }

      // Whatever the field itself says, a grant on a table the group does not write does
      // nothing: refused, nobody's to give, or a table the backend says nothing about
      element.toggleAttribute(attributes.outOfReach, !isReachable(scopes.tablesModify.targets[tableOf(token)]))
    })

    tablesFrom = scopes.tablesModify
    draw()
    emit('fields-judged', {})
  }

  onFormReady(({ doc, fields: anchors }) => {
    latest.drop()
    doc.body.style.setProperty('--vperm-inherited-note', `"${labelOf('platform.from')}"`)
    const fields = anchors.flatMap(element => {
      const token = element.getAttribute(attributes.token)

      return token === null ? [] : [[element, token] as const]
    })

    form = fields.length === 0 ? null : { doc, fields }
    tablesFrom = null
    void show()
  }, signal)

  // Whatever wrote it, the verdicts the form was drawn from are old
  on('permissions-written', () => void show(), signal)

  // The answer is about a group, so only a change of group or of the mode asks again; any
  // other change is a side or an area, and the form is drawn again from what it was told
  let shownFor: string | null = null
  subscribe(({ active, groupId }) => {
    const asking = `${String(active)}:${String(groupId)}`
    if (asking === shownFor) {
      draw()

      return
    }

    shownFor = asking
    void show()
  }, signal)
}
