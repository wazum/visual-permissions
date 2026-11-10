import { attributes, classes } from '../../platform/contract.js'
import { getState, subscribe } from '../../platform/session.js'
import { onFormReady } from './form.js'

export type Load = (doc: Document, url: string) => void

const toolbar = '.module-docheader-buttons .btn-toolbar'

// Stryker disable next-line BlockStatement: jsdom loads no document; the browser suite does
const loadInPlace: Load = (doc, url) => { doc.location.assign(url) }

export function initialise(signal: AbortSignal, load: Load = loadInPlace): void {
  let shown: Document | null = null

  const loadStored = (): void => {
    if (shown?.defaultView == null || getState().active) {
      return
    }

    const url = new URL(shown.URL)
    const switched = [...url.searchParams.keys()].filter(key => key.startsWith('vperm[value]'))
    if (switched.length === 0) {
      return
    }

    switched.forEach(key => { url.searchParams.delete(key) })
    load(shown, url.toString())
  }

  const draw = (): void => {
    if (shown === null) {
      return
    }

    const doc = shown
    doc.querySelectorAll(`.${classes.typeSwitch}`).forEach(gone => { gone.remove() })
    const { active, area } = getState()
    if (!active || area !== 'fields') {
      return
    }

    doc.querySelectorAll(`[${attributes.switch}][${attributes.inside}='']`).forEach(anchor => {
      const field = anchor.querySelector('select')
      if (field === null) {
        return
      }

      const control = doc.createElement('div')
      control.className = `input-group input-group-sm ${classes.typeSwitch}`
      // Stryker disable next-line StringLiteral: the anchor was found by this attribute, so it is never missing
      const name = anchor.getAttribute(attributes.switch) ?? ''
      const named = doc.createElement('span')
      // Stryker disable next-line StringLiteral: core's look, which the screen shots hold
      named.className = 'input-group-text'
      named.textContent = name
      const picker = doc.createElement('select')
      // Stryker disable next-line StringLiteral: core's look, which the screen shots hold
      picker.className = 'form-select form-select-sm'
      picker.setAttribute('aria-label', name)
      picker.append(...[...field.children].map(choice => choice.cloneNode(true)))
      picker.value = field.value
      picker.addEventListener('change', () => {
        const [table, uid, column] = field.name.slice('data['.length, -1).split('][')
        const url = new URL(doc.URL)
        const key = String(uid).startsWith('NEW')
          ? `defVals[${String(table)}][${String(column)}]`
          : `vperm[value][${String(table)}][${String(uid)}][${String(column)}]`
        url.searchParams.set(key, picker.value)
        load(doc, url.toString())
      })
      control.append(named, picker)
      // Stryker disable next-line OptionalChaining: a record form always draws its docheader
      doc.querySelector(toolbar)?.append(control)
    })
  }

  subscribe(() => {
    loadStored()
    draw()
  }, signal)

  onFormReady(({ doc }) => {
    shown = doc
    loadStored()
    draw()
  }, signal)
}
