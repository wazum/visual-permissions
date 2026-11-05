const held = globalThis as { ucForTests?: Record<string, unknown> }
held.ucForTests ??= {}

const uc = (): Record<string, unknown> => held.ucForTests ?? {}

export function prime(settings: Record<string, unknown>): void {
  held.ucForTests = settings
}

export function stored(): Record<string, unknown> {
  return uc()
}

let inFlight = 0

let refuse = false

export function refuseNextSet(): void {
  refuse = true
}

export async function quiet(): Promise<void> {
  do {
    await new Promise(resolve => { setTimeout(resolve) })
  } while (inFlight > 0)
}

function flattened(value: unknown): unknown {
  if (value === null || typeof value !== 'object') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.map(flattened)
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([name, held]) => [name, flattened(held)]),
  )
}

export default {
  get(key: string): unknown {
    return key.split('.').reduce<unknown>(
      (held, step) => (held === null || typeof held !== 'object' ? undefined : (held as Record<string, unknown>)[step]),
      uc(),
    )
  },

  // Only one write may be in flight at a time; race loses one write
  set(key: string, value: unknown): Promise<unknown> {
    const asItWasFound = structuredClone(uc())

    inFlight += 1

    const refused = refuse
    refuse = false

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        inFlight -= 1

        if (refused) {
          reject(new Error('The backend did not take the setting'))

          return
        }

        const steps = key.split('.')
        const last = steps.pop() ?? ''
        const held = steps.reduce<Record<string, unknown>>((into, step) => {
          into[step] ??= {}

          return into[step] as Record<string, unknown>
        }, asItWasFound)
        held[last] = flattened(value)
        prime(asItWasFound)

        resolve(value)
      })
    })
  },

  isset(key: string): boolean {
    return this.get(key) !== undefined && this.get(key) !== null
  },
}
