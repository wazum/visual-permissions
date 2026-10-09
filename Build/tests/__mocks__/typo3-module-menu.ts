const held = globalThis as { modulesShownForTests?: string[], moduleOpenForTests?: string | undefined }
held.modulesShownForTests ??= []

export function shown(): string[] {
  return held.modulesShownForTests ?? []
}

export function forget(): void {
  held.modulesShownForTests = []
  held.moduleOpenForTests = undefined
}

export function setCurrentModule(module: string): void {
  held.moduleOpenForTests = module
}

export function current(): string | undefined {
  return held.moduleOpenForTests
}

// As core does: a module the screen says it stands in is the one the menu has open
document.addEventListener('typo3-module-load', event => {
  held.moduleOpenForTests = (event as CustomEvent<{ module?: string }>).detail.module
})

export default {
  App: {
    getCurrentModule: (): string | null => held.moduleOpenForTests ?? null,
    showModule: (module: string, params?: string): Promise<void> => {
      shown().push(params === undefined ? module : `${module}?${params}`)

      return Promise.resolve()
    },
  },
}
