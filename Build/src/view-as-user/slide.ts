import { attributes } from '../platform/contract.js'
import { dropNote, readNote, writeNote } from './tab-notes.js'

export type Way = 'down' | 'up'

const slideTimeout = 600

const settledFor = 250

// Maximum time a backend can take to load before it is considered failed or wrapped
const idleTimeout = 2000

const lifting = 320

const wayKey = 'vperm.arriving'

function animated(): boolean {
  return TYPO3.settings.visualPermissions?.animation !== false
}

export function slideAway(doc: Document, way: Way, then: () => void): void {
  // An installation that wants no motion still wants the switch
  if (!animated()) {
    then()

    return
  }

  let gone = false
  const go = (): void => {
    if (gone) {
      return
    }

    gone = true
    then()
  }

  writeNote(wayKey, way)

  doc.body.setAttribute(attributes.leaving, way)
  // Stryker disable next-line ObjectLiteral,BooleanLiteral: go is guarded above, so hearing it twice still ends in one switch
  doc.body.addEventListener('animationend', go, { once: true })
  window.setTimeout(go, slideTimeout)
}

export function keepWrappers(doc: Document): void {
  // Stryker disable next-line StringLiteral: a mark is read by being there, never for what it says
  doc.body.setAttribute(attributes.settling, '')
}

export function slideIn(doc: Document): void {
  const way = direction()
  if (way === null) {
    return
  }

  dropNote(wayKey)

  // Stryker disable next-line StringLiteral: a mark is read by being there, never for what it says
  doc.body.setAttribute(attributes.settling, '')
  doc.body.setAttribute(attributes.arriving, way)

  let atRest = false
  let quiet = false
  let unwrapped = false
  const listening = new AbortController()

  const unwrap = (): void => {
    if (!atRest || !quiet || unwrapped) {
      return
    }

    unwrapped = true
    listening.abort()
    doc.body.removeAttribute(attributes.settling)
    doc.body.removeAttribute(attributes.arriving)
    // Stryker disable next-line StringLiteral: a mark is read by being there, never for what it says
    doc.body.setAttribute(attributes.unwrapping, '')
    window.setTimeout(() => { doc.body.removeAttribute(attributes.unwrapping) }, lifting)
  }

  const settled = (): void => {
    atRest = true
    unwrap()
  }

  const idle = (): void => {
    quiet = true
    unwrap()
  }

  // Stryker disable next-line ObjectLiteral,BooleanLiteral: unwrap is guarded above, so hearing it twice leaves the page as it stands
  doc.body.addEventListener('animationend', settled, { once: true })
  window.setTimeout(settled, slideTimeout)

  let loading = 0
  doc.addEventListener('typo3-module-loaded', () => {
    window.clearTimeout(loading)
    loading = window.setTimeout(idle, settledFor)
  }, { signal: listening.signal })

  window.setTimeout(idle, idleTimeout)
}

function direction(): Way | null {
  return readNote(wayKey) as Way | null
}
