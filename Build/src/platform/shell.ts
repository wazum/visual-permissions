import { attributes } from './contract.js'

// Core offers the way back out of a switched session, and offers it to nobody else. The mark
// answers for the moment in between, before the page that carries that way back is here.
export function sessionHandedOver(doc: Document): boolean {
  return doc.body.hasAttribute(attributes.handingOver)
    || doc.querySelector('typo3-backend-switch-user[mode="exit"]') !== null
}

export function handOverSession(doc: Document): void {
  // Stryker disable next-line StringLiteral: a mark is read by being there, never for what it says
  doc.body.setAttribute(attributes.handingOver, '')
}

export function notedPlace(held: unknown): string {
  const note = (held ?? {}) as { place?: unknown }

  return typeof note.place === 'string' ? note.place : ''
}

export function notedDocument(held: unknown): string {
  const note = (held ?? {}) as { document?: unknown }

  return typeof note.document === 'string' ? note.document : ''
}

// Put the module before the document; the backend repaints the frame later
export function openDocument(doc: Document, url: string): void {
  const shell = shellIn(doc)
  if (shell === null) {
    return
  }

  doc.addEventListener(
    'typo3-module-loaded',
    () => { shell.setAttribute('endpoint', url) },
    { once: true },
  )
}

// On the backend's own route the address bar follows the shell only once the screen has
// loaded, so the shell says what stands there; anywhere else the URL does. The backend
// entry point can be renamed, the route cannot.
function urlIn(doc: Document): string {
  return new URL(doc.location.href).pathname.endsWith('/main')
    ? shellIn(doc)?.getAttribute('endpoint') ?? ''
    : doc.location.href
}

export function shellIn(doc: Document): Element | null {
  return doc.querySelector('typo3-backend-module-router')
}

export function documentIn(doc: Document): string {
  const found = /edit\[([a-z0-9_]+)\]\[([\d,]+)\]=edit/.exec(decodeURIComponent(urlIn(doc)))

  return found === null ? '' : found.slice(1).join(':')
}

// The form of a record not saved yet names the page it will be made on, not a record
export function newRecordIn(doc: Document): boolean {
  return /edit\[[a-z0-9_]+\]\[-?\d+\]=new/.test(decodeURIComponent(urlIn(doc)))
}

export function shellDocument(doc: Document): string {
  const held = urlIn(doc)

  if (held === '') {
    return ''
  }

  const url = new URL(held, doc.location.origin)
  const returnUrl = url.searchParams.get('returnUrl')

  // Document is tied to the session that requested it; switch sessions loses access
  if (returnUrl !== null) {
    const itsModule = new URL(returnUrl, url.origin)

    // Whoever sent the reader here wrote the way back, and a note is a place to go back to.
    if (itsModule.origin !== url.origin) {
      return ''
    }

    itsModule.searchParams.delete('token')

    return itsModule.href
  }

  // Token belongs to one URL in one session; elsewhere it's ignored
  url.searchParams.delete('token')

  return url.href
}
