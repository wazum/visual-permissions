import { classes } from '../platform/contract.js'
import { say } from '../platform/panel-card.js'

export function createNamingForm(doc: Document, unnamed: readonly string[]): HTMLFormElement {
  const form = doc.createElement('form')
  form.className = classes.naming

  form.append(...unnamed.map((folder, index) => {
    const named = decodeURIComponent(folder)
    const row = doc.createElement('div')
    row.className = classes.namingRow

    const field = doc.createElement('input')
    // Stryker disable next-line StringLiteral: an input of any other type still reads as text
    field.type = 'text'
    field.className = 'form-control'
    // Stryker disable next-line StringLiteral: the label and the note read this id back off the field
    field.id = `${classes.naming}-${String(index)}`
    // The folder's name is the likeliest answer; often the whole of it
    // Stryker disable next-line StringLiteral: split always hands back at least one part
    field.value = named.replace(/\/$/, '').split('/').pop() ?? ''
    field.dataset['folder'] = folder

    const path = doc.createElement('label')
    path.className = classes.namingPath
    path.htmlFor = field.id
    path.textContent = named

    row.append(path, field)

    return row
  }))

  return form
}

export function namesIn(sheet: Element): Map<string, string> {
  const titles = new Map<string, string>()

  // Stryker disable next-line StringLiteral: the field was found by that very attribute
  fieldsIn(sheet).forEach(field => { titles.set(field.dataset['folder'] ?? '', field.value) })

  return titles
}

// A file mount with no title is indistinguishable from the next in the list
export function validateFolderNames(sheet: Element, why: string): boolean {
  const fields = fieldsIn(sheet)

  fields.forEach((field, index) => {
    const row = field.parentElement
    // Stryker disable next-line OptionalChaining: every field was appended to a row of its own above
    const told = row?.querySelector(`.${classes.namingWhy}`) ?? null

    if (field.value.trim() === '') {
      const said = told ?? say(sheet.ownerDocument, classes.namingWhy, why)
      said.id = `${classes.namingWhy}-${String(index)}`
      // Stryker disable next-line OptionalChaining: every field was appended to a row of its own above
      row?.append(said)
      field.setAttribute('aria-invalid', 'true')
      field.setAttribute('aria-describedby', said.id)

      return
    }

    told?.remove()
    field.removeAttribute('aria-invalid')
    field.removeAttribute('aria-describedby')
  })

  return fields.every(field => field.value.trim() !== '')
}

const fieldsIn = (sheet: Element): HTMLInputElement[] =>
  [...sheet.querySelectorAll<HTMLInputElement>(`.${classes.naming} input[data-folder]`)]
