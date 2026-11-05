const held = globalThis as { contentRefreshedForTests?: number }
held.contentRefreshedForTests ??= 0

export function refreshed(): number {
  return held.contentRefreshedForTests ?? 0
}

export function forget(): void {
  held.contentRefreshedForTests = 0
}

export default {
  ContentContainer: {
    refresh: (): void => {
      held.contentRefreshedForTests = refreshed() + 1
    },
  },
}
