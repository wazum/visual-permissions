import { getState, subscribe } from '../../platform/session.js'

const folded = '.t3js-scaffold.scaffold-content-navigation-available:not(.scaffold-content-navigation-expanded)'
const open = 'scaffold-content-navigation-expanded'

/**
 * 13.4 folds the page tree away with a class on its scaffold, where 14.3 sets an attribute on
 * the column. Delete this with 13.4 support.
 */
export function initialise(doc: Document, signal: AbortSignal): void {
  let unfolded: Element[] = []

  const apply = (): void => {
    unfolded.forEach(scaffold => { scaffold.classList.remove(open) })
    unfolded = getState().active ? [...doc.querySelectorAll(folded)] : []
    unfolded.forEach(scaffold => { scaffold.classList.add(open) })
  }

  apply()
  subscribe(apply, signal)
}
