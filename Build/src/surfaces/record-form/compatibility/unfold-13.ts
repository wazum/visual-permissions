import { keepRecordsOpen } from '../folds.js'

/**
 * 13.4 folds the record itself and hangs the press on a cell of its header; 14.3 hangs it on
 * a button of the panel. Delete this with 13.4 support.
 */
export function initialise(signal: AbortSignal): void {
  keepRecordsOpen({
    shut: '[data-object-id].panel-collapsed',
    opener: '[data-bs-toggle] .form-irre-header-icon',
  }, signal)
}
