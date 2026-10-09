import Modal, { type ModalButton } from '@typo3/backend/modal.js'
import { classes } from './contract.js'
import { labelOf } from './labels.js'
import { said, say } from './panel-card.js'

export interface Choices {
  readonly title: string
  readonly groups: readonly {
    readonly label: string
    readonly values: readonly { readonly value: string, readonly label: string, readonly icon: string }[]
  }[]
}

export function openChoices(
  choices: Choices,
  group: string,
  held: ReadonlySet<string>,
  apply: (marked: readonly { value: string, grant: boolean }[]) => Promise<boolean>,
  handedDown: ReadonlySet<string> = new Set(),
): void {
  const content = document.createElement('div')
  content.className = classes.allowChoices
  content.style.setProperty('--vperm-inherited-note', `"${labelOf('platform.from')}"`)
  choices.groups.forEach(({ label, values }) => {
    const section = document.createElement('section')
    const heading = document.createElement('h2')
    heading.textContent = label
    const tiles = document.createElement('div')
    tiles.append(...values.map(value => boxFor(value, held.has(value.value), handedDown.has(value.value))))
    section.append(heading, tiles)
    content.append(section)
  })
  const waiting = say(document, classes.faceWaiting, '')

  const marked = (): { value: string, grant: boolean }[] => [...content.querySelectorAll<HTMLInputElement>('input')]
    .filter(tick => tick.checked !== held.has(tick.value))
    .map(tick => ({ value: tick.value, grant: tick.checked }))

  const cancelling: ModalButton = {
    text: labelOf('platform.cancel'),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: 'btn-default',
    name: 'cancel',
    trigger: (_event, shown) => { shown.hideModal() },
  }
  const applying: ModalButton = {
    text: labelOf('platform.doApply'),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    btnClass: 'btn-primary',
    name: 'apply',
    trigger: (_event, shown) => {
      // Stryker disable next-line OptionalChaining: the button just pressed is the one core drew
      shown.querySelector('button[name="apply"]')?.toggleAttribute('disabled', true)
      void apply(marked()).then(taken => {
        if (taken) {
          shown.hideModal()

          return
        }

        offer()
      })
    },
  }

  const modal = Modal.advanced({
    title: said(choices.title, group),
    content,
    size: Modal.sizes.large,
    buttons: [cancelling, applying],
  })

  // Core draws the button and leaves an attribute of its own alone once it has
  const offer = (): void => {
    void modal.updateComplete.then(() => {
      // Stryker disable next-line OptionalChaining: core has drawn both buttons once its update is complete
      modal.querySelector('button[name="apply"]')?.toggleAttribute('disabled', marked().length === 0)
    })
  }
  offer()

  // Core draws its buttons into the footer and leaves anything in front of them alone
  void modal.updateComplete.then(() => {
    // Stryker disable next-line OptionalChaining: core has drawn its footer once its update is complete
    modal.querySelector('.modal-footer')?.prepend(waiting)
  })

  content.addEventListener('change', () => {
    const marks = marked()
    const adding = marks.filter(({ grant }) => grant).length
    waiting.textContent = waitingFor(adding, marks.length - adding)
    offer()
  })
}

function waitingFor(adding: number, taking: number): string {
  return [
    ...adding > 0 ? [said(labelOf('platform.waiting'), adding)] : [],
    ...taking > 0 ? [said(labelOf('platform.going'), taking)] : [],
  ].join('\n')
}

function boxFor(
  { value, label, icon }: Choices['groups'][number]['values'][number],
  held: boolean,
  handedDown: boolean,
): HTMLLabelElement {
  const box = document.createElement('label')
  box.className = classes.allowValue
  const drawn = document.createElement('typo3-backend-icon')
  drawn.setAttribute('identifier', icon)
  // Stryker disable next-line StringLiteral: only core's icon element reads the size, and only a browser shows it
  drawn.setAttribute('size', 'small')
  const name = document.createElement('span')
  name.textContent = label
  const tick = document.createElement('input')
  tick.type = 'checkbox'
  tick.value = value
  tick.checked = held
  tick.disabled = handedDown
  box.append(drawn, name, tick)

  return box
}
