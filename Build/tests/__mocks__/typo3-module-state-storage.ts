const held = globalThis as { moduleStatesForTests?: Record<string, string> }
held.moduleStatesForTests ??= {}

export function chosen(module: string): string | undefined {
  return held.moduleStatesForTests?.[module]
}

export function forget(): void {
  held.moduleStatesForTests = {}
}

export const ModuleStateStorage = {
  // As core does: only a chosen page is the one the tree selects
  update: (module: string, identifier: string | number, select: boolean): void => {
    if (select) {
      held.moduleStatesForTests = { ...held.moduleStatesForTests, [module]: String(identifier) }
    }
  },
}
