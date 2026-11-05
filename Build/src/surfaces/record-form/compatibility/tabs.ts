import { onFormReady } from '../form.js'

/**
 * 13.4 names the control that opens a tab the way Bootstrap does. It takes the 14.3 name as
 * the form arrives, before anything reads it. Delete this with 13.4 support.
 */
export function initialise(signal: AbortSignal): void {
  onFormReady(({ doc }) => {
    doc.querySelectorAll('[data-bs-toggle="tab"][data-bs-target]:not([data-typo3-tab])')
      .forEach(tab => {
        // Stryker disable next-line StringLiteral: the tab was found by that very attribute
        tab.setAttribute('data-typo3-tab', tab.getAttribute('data-bs-target') ?? '')
      })
  }, signal)
}
