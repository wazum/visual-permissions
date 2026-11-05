import { keepRecordsOpen } from './folds.js'

export function initialise(signal: AbortSignal): void {
  // The button that opens a record is also what fetches the fields in it
  keepRecordsOpen({
    shut: '[data-object-id]:has(.panel-button.collapsed)',
    opener: '.panel-button',
  }, signal)
}
