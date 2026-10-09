import { classes } from './contract.js'
import { labelOf } from './labels.js'
import { getState, subscribe } from './session.js'

export const crossing = 220
export const burst = 1300

export interface Foot {
  readonly state: HTMLElement
  readonly waiting: HTMLElement
  ready: (deed: boolean, leave: boolean) => void
}

// Domain rule for side commit structure: group state, pending deed, then Cancel or deed itself
export function footIn(
  foot: HTMLElement,
  asked: { label: string, cancel: () => void, apply: () => void },
): Foot {
  const doc = foot.ownerDocument
  const tally = doc.createElement('span')
  tally.className = classes.faceTally

  // Stryker disable next-line StringLiteral: both counts are said as soon as the panel is painted.
  const state = say(doc, classes.faceCounted, '')
  const waiting = say(doc, classes.faceWaiting, '')
  tally.append(state, waiting)

  const cancel = button(doc, labelOf('platform.cancel'), `btn btn-default ${classes.faceCancel}`, asked.cancel)
  const apply = button(doc, asked.label, `btn btn-primary ${classes.faceApply}`, asked.apply)

  foot.replaceChildren(tally, cancel, apply)

  return {
    state,
    waiting,
    ready: (deed, leave) => {
      apply.toggleAttribute('disabled', !deed)
      cancel.toggleAttribute('disabled', !leave)
    },
  }
}

export function showOutcome(foot: Foot, outcome: 'cancelled' | 'refused' | 'failed' | 'loggedOut'): void {
  if (outcome === 'cancelled') {
    return
  }

  foot.state.textContent = labelOf(`platform.${outcome}`)
}

export interface Face {
  readonly sheet: HTMLElement
  readonly bar: HTMLElement
  readonly eyebrow: HTMLElement
  readonly sentence: HTMLElement
  readonly scroll: HTMLElement
  readonly foot: HTMLElement
}

export function createFace(doc: Document, kind: string): Face {
  const sheet = doc.createElement('div')
  sheet.className = `${classes.face} ${kind}`

  // Stryker disable next-line StringLiteral: both are filled in as soon as the face is painted
  const eyebrow = say(doc, classes.faceEyebrow, '')
  // Stryker disable next-line StringLiteral: both are filled in as soon as the face is painted
  const sentence = say(doc, classes.faceSentence, '')
  const bar = doc.createElement('div')
  bar.className = classes.faceBar
  bar.append(eyebrow, sentence)

  const scroll = doc.createElement('div')
  scroll.className = classes.faceScroll

  const foot = doc.createElement('div')
  foot.className = classes.faceFoot

  sheet.append(bar, scroll, foot)

  return { sheet, bar, eyebrow, sentence, scroll, foot }
}

export interface Flash {
  readonly add: (key: string) => void
  readonly delete: (key: string) => void
  readonly isLit: (key: string) => boolean
  readonly start: (repaint: () => void) => void
  readonly stop: () => void
}

export function createFlash(turning: number): Flash {
  const added = new Set<string>()
  const lit = new Set<string>()
  // Stryker disable next-line ArrayDeclaration: a made-up timer handle clears nothing
  let waiting: number[] = []

  const stopTimers = (): void => {
    waiting.forEach(timer => { window.clearTimeout(timer) })
    // Stryker disable next-line ArrayDeclaration: a made-up timer handle clears nothing
    waiting = []
    lit.clear()
  }

  return {
    add: key => { added.add(key) },
    delete: key => { added.delete(key) },
    isLit: key => lit.has(key),
    start: repaint => {
      if (added.size === 0) {
        return
      }

      stopTimers()
      const keys = [...added]
      added.clear()

      waiting.push(window.setTimeout(() => {
        keys.forEach(key => { lit.add(key) })
        repaint()

        waiting.push(window.setTimeout(() => {
          keys.forEach(key => { lit.delete(key) })
          repaint()
        }, burst))
      }, turning))
    },
    stop: () => {
      added.clear()
      stopTimers()
    },
  }
}

export function disableOnGroupChange(groupId: number | null, feet: readonly Foot[], signal: AbortSignal): void {
  subscribe(() => {
    if (getState().groupId !== groupId) {
      feet.forEach(foot => { foot.ready(false, false) })
    }
  }, signal)
}

export function escapeLeavesPicking(
  doc: Document,
  signal: AbortSignal,
  picking: () => boolean,
  leave: () => void,
): void {
  doc.addEventListener('keydown', event => {
    if (event.key === 'Escape' && picking() && !promptOpen(doc)) {
      leave()
    }
  }, { signal })
}

// Whatever lies open over the page takes the key for itself
const promptOpen = (doc: Document): boolean =>
  doc.querySelector('typo3-backend-modal, :popover-open') !== null

export function button(
  doc: Document,
  label: string,
  className: string,
  onClick: () => void,
  icon?: string,
): HTMLElement {
  const control = doc.createElement('button')
  control.type = 'button'
  control.className = className
  control.textContent = label
  control.addEventListener('click', onClick)

  if (icon !== undefined) {
    const mark = doc.createElement('typo3-backend-icon')
    mark.setAttribute('identifier', icon)
    mark.setAttribute('size', 'small')
    control.prepend(mark, ' ')
  }

  return control
}

export function say(doc: Document, className: string, text: string): HTMLElement {
  const line = doc.createElement('span')
  line.className = className
  line.textContent = text

  return line
}

export function counted(key: string, count: number, ...values: (string | number)[]): string {
  return said(labelOf(`${key}.${count === 1 ? 'one' : 'many'}`), ...values)
}

// Backend's words carry gaps numbered where there is more than one, plain where there is only one.
export function said(pattern: string, ...values: (string | number)[]): string {
  return values.reduce<string>(
    (words, value, place) => words
      .replace(`%${String(place + 1)}$s`, String(value))
      .replace('%s', String(value)),
    pattern,
  )
}
