import ModuleMenu from '@typo3/backend/module-menu.js'

let asked: string | null = null

export function openModule(module: string): void {
  asked = module
  void ModuleMenu.App.showModule(module)
}

// What core's own router says when a screen comes up in a module: the menu marks the module
// and brings its tree, and the screen itself is not loaded again
export function showScreen(module: string): void {
  // eslint-disable-next-line no-restricted-syntax -- core's own event, not one of ours
  document.dispatchEvent(new CustomEvent('typo3-module-load', { detail: { module } }))
}

export function openedByUs(module: string): boolean {
  const ours = asked === module
  asked = null

  return ours
}
