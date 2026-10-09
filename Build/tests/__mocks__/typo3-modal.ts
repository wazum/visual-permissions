import type { ModalButton, ModalElement } from '@typo3/backend/modal.js'

export function dialog(): HTMLElement | null {
  return document.querySelector('.modal')
}

// A reader presses what core has drawn, so a press waits for core to finish drawing
export async function press(name: string): Promise<void> {
  const modal = dialog() as ModalElement | null
  const button = modal?.buttons.find(candidate => candidate.name === name)
  if (modal === null || button === undefined) {
    throw new Error(`no button ${name} on an open dialog`)
  }

  await modal.updateComplete
  if (modal.querySelector<HTMLButtonElement>(`.modal-footer button[name="${name}"]`)?.disabled === true) {
    return
  }

  button.trigger?.(new Event('click'), modal)
}

const drawFoot = (foot: HTMLElement, buttons: readonly ModalButton[]): void => {
  foot.replaceChildren(...buttons.map(button => {
    const drawn = foot.querySelector<HTMLButtonElement>(`button[name="${button.name ?? ''}"]`)
      ?? document.createElement('button')
    drawn.textContent = button.text
    drawn.name = button.name ?? ''

    return drawn
  }))
}

const Modal = {
  sizes: { small: 'small', default: 'default', medium: 'medium', large: 'large', full: 'full' },
  advanced: (configuration: { title: string, content: Element, buttons?: ModalButton[] }): ModalElement => {
    const modal = document.createElement('div') as unknown as ModalElement
    modal.className = 'modal'
    modal.hideModal = () => { modal.remove() }
    const title = document.createElement('h1')
    title.className = 'modal-title'
    title.textContent = configuration.title
    const foot = document.createElement('div')
    foot.className = 'modal-footer'
    let buttons = configuration.buttons ?? []
    Object.defineProperty(modal, 'buttons', {
      get: () => buttons,
      set: (given: ModalButton[]) => {
        buttons = given
        drawFoot(foot, given)
      },
    })
    Object.defineProperty(modal, 'updateComplete', { get: () => Promise.resolve(true) })
    drawFoot(foot, buttons)
    modal.append(title, configuration.content, foot)
    document.body.append(modal)

    return modal
  },
}

export default Modal
