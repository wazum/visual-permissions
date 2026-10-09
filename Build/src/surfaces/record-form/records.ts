// The server draws an anchor around every field, so what a field is and what holds it are read
// off the form. Core's own markup is asked only where the form is drawn: the row a field takes
// up on the page.
const row = '.form-group'

export function rowOf(field: Element): Element | null {
  return field.closest(row)
}
