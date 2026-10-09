import { onFormReady } from '../form.js'

/**
 * 13.4 names the rows of a form's header, and the column its page path stands in, another
 * way. They take the 14.3 names as the form arrives, before anything reads them. Delete this
 * with 13.4 support.
 */
export function initialise(signal: AbortSignal): void {
  onFormReady(({ doc }) => {
    doc.querySelectorAll('.module-docheader-bar-navigation').forEach(row => {
      row.classList.add('module-docheader-navigation')
    })
    doc.querySelectorAll('.module-docheader-bar-navigation > .module-docheader-bar-column-left').forEach(column => {
      column.classList.add('module-docheader-column-breadcrumb')
    })
    doc.querySelectorAll('.module-docheader-bar-buttons').forEach(row => {
      row.classList.add('module-docheader-buttons')
    })
  }, signal)
}
