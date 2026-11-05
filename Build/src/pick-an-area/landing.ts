import ModuleMenu from '@typo3/backend/module-menu.js'
import Persistent from '@typo3/backend/storage/persistent.js'
import { withOlderNames } from '../platform/compatibility/module-names.js'
import { openModule, showScreen } from './modules.js'
import { keep } from '../platform/persistence.js'
import { getState, subscribe, type SessionState } from '../platform/session.js'
import { documentIn, newRecordIn, shellIn } from '../platform/shell.js'
import { documentUrl } from '../platform/transport.js'

const useful = withOlderNames(['web_layout', 'records', 'media_management', 'permissions_pages'])

const storageKey = 'vperm.module'

export function initialise(doc: Document, signal: AbortSignal): void {
  let landedFor: string | null = null

  const show = (state: SessionState): void => {
    // Folded row in modules scope is a grant nobody could give; do not narrow there
    narrowMenu(doc, state.active && state.area !== 'modules')

    // Only switching the mode on or picking an area moves the admin; a screen they open stays
    const asked = `${String(state.active)} ${state.picked}`
    if (asked === landedFor) {
      return
    }
    landedFor = asked

    if (!state.active || useful.includes(currentModule(doc))) {
      return
    }

    // Stryker disable next-line StringLiteral: useful is written out above and is never empty
    const landing = lastModule() ?? useful[0] ?? ''
    const record = documentIn(doc)
    // The fields are read on the record itself, so it stays where it is and stands in the
    // module, as a record opened from one does. Only an area the record cannot show leaves it.
    if ((record !== '' || newRecordIn(doc)) && state.area === 'fields') {
      showScreen(landing)

      return
    }

    if (record !== '') {
      doc.addEventListener(
        'typo3-module-loaded',
        () => { void reopenRecord(doc, record) },
        { once: true, signal },
      )
    }

    openModule(landing)
  }

  const note = (event: Event): void => {
    // Stryker disable next-line StringLiteral: no spelling of the stand-in is one of ours
    const module = (event as CustomEvent<{ module?: string }>).detail.module ?? ''
    if (getState().active && useful.includes(module)) {
      void keep(storageKey, module)
    }
  }

  doc.addEventListener('typo3-module-loaded', note, { signal })
  subscribe(show, signal)
}

async function reopenRecord(doc: Document, record: string): Promise<void> {
  const shell = shellIn(doc)
  const url = await documentUrl(record, shell?.getAttribute('endpoint') ?? '')
  if (url !== '') {
    shell?.setAttribute('endpoint', url)
  }
}

function currentModule(doc: Document): string {
  // Stryker disable next-line StringLiteral: no spelling of the stand-in is one of ours
  return ModuleMenu.App.getCurrentModule() ?? shellIn(doc)?.getAttribute('module') ?? ''
}

// A row that opens a group is not a module itself
const rows = '[data-modulemenu-identifier]:not([aria-controls])'
const menuRows = `#modulemenu ${rows}`

function narrowMenu(doc: Document, narrowed: boolean): void {
  doc.querySelectorAll(menuRows).forEach(row => {
    const item = row.parentElement

    // Stryker disable next-line ConditionalExpression: a row matched inside the menu has a parent
    if (item !== null) {
      // Stryker disable next-line StringLiteral: the row was matched on that very attribute
      item.hidden = narrowed && !useful.includes(row.getAttribute('data-modulemenu-identifier') ?? '')
    }
  })

  doc.querySelectorAll<HTMLElement>('#modulemenu .modulemenu-group').forEach(group => {
    // Stryker disable next-line OptionalChaining: a row matched inside the group has a parent
    group.hidden = [...group.querySelectorAll(rows)].every(row => row.parentElement?.hidden === true)
  })
}

function lastModule(): string | undefined {
  const held = Persistent.get(storageKey)

  // Stryker disable next-line ConditionalExpression: includes() turns anything else away; the typeof is for the compiler
  return typeof held === 'string' && useful.includes(held) ? held : undefined
}
