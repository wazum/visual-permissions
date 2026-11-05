import { LitElement, html, type TemplateResult } from 'lit'
import Persistent from '@typo3/backend/storage/persistent.js'
import { attributes, classes, elements } from '../contract.js'
import { labelOf } from '../labels.js'
import { keep } from '../persistence.js'
import { match } from './match.js'

export interface PickerDetailRow {
  readonly id: string
  readonly title: string
  readonly depth: number
}

export interface PickerEntry {
  readonly id: string
  readonly title: string
  readonly subtitle: string
  // Searching "group" cannot match everyone; it is never matched
  readonly note: string
  readonly detail: readonly PickerDetailRow[]
  readonly detailHeading: string
  readonly heading?: string
}

export interface PickerWords {
  readonly countMany: string
  // XLIFF has no plural rules; totalOne is for count=1 only
  readonly totalOne: string
  readonly totalMany: string
  readonly move: string
  readonly take: string
  readonly close: string
  readonly clear: string
  readonly detail: string
  readonly loading: string
  readonly failed: string
  readonly retry: string
  readonly empty: string
}

// Stryker disable ConditionalExpression,StringLiteral: an empty subtitle adds only a trailing space, which no query matches
const wholeOf = (entry: PickerEntry): string =>
  entry.subtitle === '' ? entry.title : `${entry.title} ${entry.subtitle}`
// Stryker restore ConditionalExpression,StringLiteral

// restingFor must be long enough to avoid pointer resting on row during traversal
const restingFor = 70

const atMost = 50

export class Picker extends LitElement {
  // Stryker disable ObjectLiteral,BooleanLiteral: callers set these as properties, never as attributes
  static override properties = {
    entries: { attribute: false },
    words: { attribute: false },
    placeholder: { type: String },
    remembers: { type: String },
    query: { state: true },
    active: { state: true },
    onDetail: { state: true },
    inPane: { state: true },
    state: { attribute: false },
  }
  // Stryker restore ObjectLiteral,BooleanLiteral

  // entries is readonly; plain fields shadow prototype accessors and break repaints
  declare entries: readonly PickerEntry[]
  declare words: PickerWords
  declare placeholder: string
  declare remembers: string
  declare query: string
  declare active: number
  declare onDetail: number
  declare state: 'loading' | 'ready' | 'failed'
  declare inPane: boolean

  private settling = 0
  private trigger: HTMLElement | null = null
  // Stryker disable next-line ArrayDeclaration: read only once the picker has opened, which fills it
  private watched: Document[] = []

  constructor() {
    super()
    this.entries = []
    this.placeholder = ''
    this.remembers = ''
    this.query = ''
    this.active = 0
    this.onDetail = 0
    this.inPane = false
    this.state = 'ready'
    this.words = {
      countMany: '', totalOne: '', totalMany: '', move: '', take: '', close: '', clear: '',
      detail: '',
      loading: '', failed: '', retry: '', empty: '',
    }
  }

  get isOpen(): boolean {
    return this.hasAttribute('data-open') || this.matches(':popover-open')
  }

  // Matched on what names an entry, never on the note, so a word standing in every note
  // cannot match everyone.
  get matching(): readonly PickerEntry[] {
    if (this.query === '') {
      return this.entries
    }

    const bands = [...new Set(this.entries.map(entry => entry.heading ?? ''))]

    return this.entries
      .map(entry => ({
        entry,
        band: bands.indexOf(entry.heading ?? ''),
        score: match(this.query, wholeOf(entry))?.score ?? -1,
      }))
      .filter(scored => scored.score >= 0)
      .sort((one, other) => one.band - other.band || other.score - one.score)
      .map(scored => scored.entry)
  }

  get found(): readonly PickerEntry[] {
    return this.matching.slice(0, atMost)
  }

  override connectedCallback(): void {
    super.connectedCallback()
    this.setAttribute('popover', 'manual')
    this.addEventListener('keydown', event => { this.steer(event) })
    this.addEventListener('pointermove', () => {
      this.toggleAttribute(attributes.byKey, false)
    })
    this.addEventListener('toggle', () => {
      // Stryker disable next-line OptionalChaining: a picker toggles only after opening, which names its trigger first
      this.trigger?.setAttribute('aria-expanded', String(this.isOpen))

      if (!this.isOpen) {
        this.stopWatching()
        this.remember()
      }
    })
  }

  override createRenderRoot(): HTMLElement {
    return this
  }

  openedBy(trigger: HTMLElement): void {
    if (this.isOpen) {
      this.close()

      return
    }

    this.trigger = trigger

    // A write is still on the wire; only a blank page asks the settings
    if (this.query === '') {
      this.query = this.kept()
    }

    this.active = 0
    this.onDetail = 0
    this.inPane = false
    const anchor = trigger.getBoundingClientRect()

    // Call showPopover() after the width is set by the stylesheet; a duplicate here would drift
    this.showPopover()
    this.watchForDismissal()

    this.style.top = `${String(anchor.bottom + 6)}px`
    this.style.left = `${String(Math.max(16, anchor.right - this.offsetWidth))}px`
    this.querySelector('input')?.focus()
  }

  override render(): TemplateResult {
    const found = this.found

    return html`
      <div class="input-group input-group-sm">
        <span class="input-group-text" aria-hidden="true">
          <typo3-backend-icon identifier="actions-search" size="small"></typo3-backend-icon>
        </span>
        <input type="search" class="form-control" autocomplete="off" .value=${this.query}
               placeholder=${this.placeholder} aria-label=${this.placeholder}
               aria-activedescendant=${this.activeId()}
               @input=${(event: Event) => {
                 this.query = (event.target as HTMLInputElement).value
                 this.inPane = false
                 this.active = 0
               }}>
      </div>
      <div class=${classes.pickerPanes}>
      <div class=${classes.pickerList} role="listbox" tabindex="-1">
        ${this.nothingToShow(found)}
        ${this.state !== 'ready' ? '' : found.map((entry, index) => {
          // Stryker disable next-line OptionalChaining,ArrayDeclaration: only a row that matched is drawn, so the match stands
          const at = match(this.query, wholeOf(entry))?.at ?? []

          return html`
          ${this.headingBefore(entry, found[index - 1])}
          <div role="option" id=${this.rowId(index)} data-id=${entry.id}
               aria-selected=${index === this.active}
               @mouseenter=${() => { this.settleOn(index) }}
               @mouseleave=${() => { this.stopSettling() }}
               @click=${() => { this.take(entry.id) }}>
            <span>${this.marked(at, entry.title, 0)}</span>
            <span>${this.marked(at, entry.subtitle, entry.title.length + 1)} ${entry.note}</span>
          </div>
        `
        })}
      </div>
      ${this.detailPane()}
      </div>
      <p class=${classes.pickerCount}>
        <span class=${classes.pickerHints}>
          <span><kbd>↑</kbd><kbd>↓</kbd> ${this.words.move}</span>
          <span><kbd>⇥</kbd> ${this.words.detail}</span>
          <span><kbd>↵</kbd> ${this.words.take}</span>
          <span><kbd>esc</kbd> ${this.query === '' ? this.words.close : this.words.clear}</span>
        </span>
        <span class=${classes.pickerTally}>${this.counted()}</span>
      </p>
    `
  }

  private kept(): string {
    const held = Persistent.get(this.remembers)

    return typeof held === 'string' ? held : ''
  }

  private remember(): void {
    if (this.remembers !== '') {
      void keep(this.remembers, this.query)
    }
  }

  private nothingToShow(found: readonly PickerEntry[]): TemplateResult | string {
    if (this.state === 'loading') {
      return html`<p>${this.words.loading}</p>`
    }

    if (this.state === 'failed') {
      return html`
        <p>${this.words.failed}</p>
        <button type="button" class="btn btn-default btn-sm"
                @click=${() => { this.dispatchEvent(new CustomEvent('vperm:retry')) }}>
          ${this.words.retry}
        </button>
      `
    }

    return found.length === 0 ? html`<p>${this.words.empty}</p>` : ''
  }

  private activeId(): string {
    return this.inPane ? this.detailId(this.onDetail) : this.rowId(this.active)
  }

  private counted(): string {
    if (this.state !== 'ready') {
      return ''
    }

    const found = this.matching.length
    if (found <= atMost) {
      const sentence = found === 1 ? this.words.totalOne : this.words.totalMany

      return sentence.replace('%d', String(found))
    }

    return this.words.countMany
      .replace('%d', String(atMost))
      .replace('%d', String(found))
  }

  private detailPane(): TemplateResult {
    const shown = this.found[this.active]
    if (shown === undefined) {
      return html``
    }

    return html`
      <div class=${classes.pickerDetail}>
        <div class=${classes.pickerHead}>
          <strong>${shown.title}</strong>
          <p>${shown.detailHeading}</p>
        </div>
        <div role="listbox" tabindex="-1">
          ${shown.detail.map((row, index) => html`
            <div role="option" id=${this.detailId(index)} class=${classes.pickerRow}
                 data-id=${row.id} aria-selected=${this.inPane && index === this.onDetail}
                 style="--vperm-picker-depth: ${String(row.depth)}"
                 @click=${() => { this.takeDetail(row.id) }}>
              ${row.title}
            </div>
          `)}
        </div>
      </div>
    `
  }

  // Stryker disable next-line BlockStatement: the row and the field read this name back off the same call
  private detailId(index: number): string {
    return `vperm-picker-detail-${String(index)}`
  }

  private settleOn(index: number): void {
    if (this.hasAttribute(attributes.byKey)) {
      return
    }

    this.stopSettling()
    this.settling = window.setTimeout(() => {
      this.active = index
      this.inPane = false
    }, restingFor)
  }

  private stopSettling(): void {
    window.clearTimeout(this.settling)
  }

  private steer(event: KeyboardEvent): void {
    const pane = this.found[this.active]?.detail ?? []

    // Reaching the pane must not take the field's focus; next letter would go nowhere
    if (event.key === 'Tab' && !event.shiftKey && !this.inPane && pane.length > 0) {
      event.preventDefault()
      this.inPane = true
      this.onDetail = 0

      return
    }

    if (event.key === 'Tab' && event.shiftKey && this.inPane) {
      event.preventDefault()
      this.inPane = false

      return
    }

    if (event.key === 'Enter') {
      // Stryker disable next-line OptionalChaining: onDetail is held inside the pane by the arrows that move it
      const taken = this.inPane ? pane[this.onDetail]?.id : this.found[this.active]?.id
      if (taken !== undefined) {
        event.preventDefault()

        if (this.inPane) {
          this.takeDetail(taken)
        } else {
          this.take(taken)
        }
      }

      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return
    }

    event.preventDefault()
    // Looks dead but is required; the list is about to move under a pointer that has not.
    this.toggleAttribute(attributes.byKey, true)
    const step = event.key === 'ArrowDown' ? 1 : -1

    if (this.inPane) {
      this.onDetail = Math.min(Math.max(this.onDetail + step, 0), pane.length - 1)
    } else {
      this.active = Math.min(Math.max(this.active + step, 0), this.found.length - 1)
    }

    void this.updateComplete.then(() => {
      // Stryker disable next-line OptionalChaining: the row being stood on was drawn by the update just awaited
      this.querySelector(`#${this.activeId()}`)?.scrollIntoView({ block: 'nearest' })
    })
  }

  private takeDetail(id: string): void {
    this.close()
    this.dispatchEvent(new CustomEvent('vperm:detail-picked', { detail: { id } }))
  }

  // The component holds the field; the slice never hears a keystroke: an entry carries its heading at all times
  private headingBefore(entry: PickerEntry, previous: PickerEntry | undefined): TemplateResult {
    const heading = entry.heading ?? ''
    if (heading === '' || heading === previous?.heading) {
      return html``
    }

    return html`<p class="dropdown-header">${heading}</p>`
  }

  private rowId(index: number): string {
    return `vperm-picker-row-${String(index)}`
  }

  private readonly dismiss = (event: Event): void => {
    const pressed = event.target as Node | null

    // Stryker disable next-line ConditionalExpression,OptionalChaining: a dispatched press always names a target, and nothing listens until a trigger has opened the picker
    if (pressed === null || this.contains(pressed) || this.trigger?.contains(pressed) === true) {
      return
    }

    this.hidePopover()
  }

  private readonly escape = (event: Event): void => {
    if ((event as KeyboardEvent).key !== 'Escape') {
      return
    }

    event.preventDefault()

    if (this.query === '') {
      this.close()

      return
    }

    this.query = ''
    this.active = 0
    this.inPane = false
  }

  private watchForDismissal(): void {
    this.watched = this.everyDocument()

    for (const where of this.watched) {
      where.addEventListener('pointerdown', this.dismiss)
      where.addEventListener('keydown', this.escape)
    }
  }

  private everyDocument(): Document[] {
    const frames = [...this.ownerDocument.querySelectorAll('iframe')]
      .map(frame => frame.contentDocument)
      .filter(where => where !== null)

    return [this.ownerDocument, ...frames]
  }

  // Stryker disable BlockStatement,StringLiteral,ArrayDeclaration: the picker is already closed; letting go of the listeners only frees the page
  private stopWatching(): void {
    for (const where of this.watched) {
      where.removeEventListener('pointerdown', this.dismiss)
      where.removeEventListener('keydown', this.escape)
    }

    this.watched = []
  }
  // Stryker restore BlockStatement,StringLiteral,ArrayDeclaration

  private close(): void {
    this.hidePopover()
    this.trigger?.focus()
  }

  private take(id: string): void {
    this.close()
    this.dispatchEvent(new CustomEvent('vperm:picked', { detail: { id } }))
  }

  private marked(matched: readonly number[], text: string, from: number): TemplateResult {
    const at = matched
      .filter(place => place >= from && place < from + text.length)
      .map(place => place - from)

    // Stryker disable next-line ConditionalExpression,BlockStatement: with nothing to mark the walk below hands back the whole text too
    if (at.length === 0) {
      return html`${text}`
    }

    // Letters that touch belong under one mark to prevent splitting words like "Hub" into separate characters.
    const parts: TemplateResult[] = []
    let plain = 0

    for (let start = 0; start < at.length;) {
      let end = start
      // Stryker disable next-line EqualityOperator,ConditionalExpression,ArithmeticOperator: with no next place the test beside this one ends the walk anyway
      while (end + 1 < at.length && at[end + 1] === (at[end] ?? 0) + 1) {
        end += 1
      }

      const from = at[start] ?? 0
      const to = (at[end] ?? 0) + 1

      parts.push(html`${text.slice(plain, from)}<mark>${text.slice(from, to)}</mark>`)
      plain = to
      start = end + 1
    }

    return html`${parts}${text.slice(plain)}`
  }
}

// A name can be registered once; a second eval would throw
if (customElements.get(elements.picker) === undefined) {
  customElements.define(elements.picker, Picker)
}

export function createPicker(
  doc: Document,
  words: Pick<PickerWords, 'totalOne' | 'totalMany' | 'take' | 'detail' | 'loading' | 'failed'>,
): Picker {
  const picker = doc.createElement(elements.picker) as Picker
  picker.words = {
    ...words,
    countMany: labelOf('platform.picker.count'),
    move: labelOf('platform.picker.key.move'),
    close: labelOf('platform.picker.key.close'),
    clear: labelOf('platform.picker.key.clear'),
    retry: labelOf('platform.picker.retry'),
    empty: labelOf('platform.picker.empty'),
  }

  return picker
}
