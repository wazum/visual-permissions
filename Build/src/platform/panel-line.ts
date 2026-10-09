import { withOlderPanel } from './compatibility/module-panel.js'

// The site reaches to the end of the module panel, so what follows it starts where the areas below start
export function lineUpWithPanel(doc: Document, follower: HTMLElement, signal: AbortSignal): void {
  // Stryker disable next-line OptionalChaining: what follows the site is stood in the header before it is lined up
  const site = follower.parentElement?.querySelector<HTMLElement>('.topbar-site')
  const panel = doc.querySelector(withOlderPanel('.scaffold-sidebar'))
  // Stryker disable next-line ConditionalExpression,LogicalOperator,BlockStatement,OptionalChaining: the backend draws its header with a site and a module panel on every page our controls stand on
  if (site == null || panel === null) {
    return
  }

  const measure = (): void => {
    site.style.flexBasis = ''

    // 13.4 stands the tabs on the line between its columns
    const divider = dividerIn(doc)
    const gap = Number.parseFloat(getComputedStyle(follower).marginInlineStart)
    const room = panel.getBoundingClientRect().right - divider - site.getBoundingClientRect().left - gap

    // A folded panel ends inside the logo
    // Stryker disable next-line ConditionalExpression: a negative width is not a width, and the browser drops it the same way
    if (room > 0) {
      site.style.flexBasis = `${String(room)}px`
    }
  }

  measure()

  const watch = new ResizeObserver(measure)
  watch.observe(panel)
  signal.addEventListener('abort', () => { watch.disconnect() })
}

export const dividerIn = (doc: Document): number =>
  Number.parseFloat(getComputedStyle(doc.body).getPropertyValue('--vperm-divider')) || 0
