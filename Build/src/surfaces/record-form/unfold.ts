import { keepRecordsOpen } from './folds.js'

export function initialise(signal: AbortSignal): void {
  // The button that opens a record is also what fetches the fields in it. Records nest, so
  // only the record's own heading says whether it is shut.
  keepRecordsOpen({
    shut: '[data-object-id]:has(> .panel-heading .panel-button.collapsed)',
    opener: ':scope > .panel-heading .panel-button',
  }, signal)
}
