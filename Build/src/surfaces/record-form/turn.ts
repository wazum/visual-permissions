import { classes } from '../../platform/contract.js'

// The form stands edge-on half way, so the side is swapped where there is nothing to see
const halfWay = 280

export function flipForm(doc: Document, half: () => void): void {
  const form = doc.querySelector<HTMLElement>('form[name="editform"]')
  if (form === null) {
    half()

    return
  }

  form.classList.add(classes.turning)
  window.setTimeout(half, halfWay)
  window.setTimeout(() => { form.classList.remove(classes.turning) }, halfWay * 2)
}
