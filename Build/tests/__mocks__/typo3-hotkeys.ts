interface Options {
  scope?: string
  allowOnEditables?: boolean
  allowRepeat?: boolean
  bindElement?: Element | undefined
}

type Handler = (event: KeyboardEvent) => void

interface Registration {
  readonly handler: Handler
  readonly options: Options
}

export const ModifierKeys = {
  META: 'meta',
  CTRL: 'control',
  SHIFT: 'shift',
  ALT: 'alt',
} as const

const editables = ['INPUT', 'TEXTAREA', 'SELECT']

const registrations = new Map<string, Registration>()

const signature = (parts: string[]): string => [...parts].sort().join('+')

export function forget(): void {
  registrations.clear()
}

export const registered = (): string[] => [...registrations.keys()]

const fromEvent = (event: KeyboardEvent): string => {
  const parts = []

  if (event.ctrlKey) parts.push(ModifierKeys.CTRL)
  if (event.metaKey) parts.push(ModifierKeys.META)
  if (event.altKey) parts.push(ModifierKeys.ALT)
  if (event.shiftKey) parts.push(ModifierKeys.SHIFT)

  parts.push(event.key.toLowerCase())

  return signature(parts)
}

const isEditable = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement && (target.isContentEditable || editables.includes(target.tagName))

document.addEventListener('keydown', event => {
  const registration = registrations.get(fromEvent(event))
  if (registration === undefined) {
    return
  }

  if (registration.options.allowOnEditables !== true && isEditable(event.target)) {
    return
  }

  registration.handler(event)
})

export default {
  normalizedCtrlModifierKey: ModifierKeys.META,

  register(hotkey: string[], handler: Handler, options: Options = {}): void {
    registrations.set(signature(hotkey.map(part => part.toLowerCase())), { handler, options })

    options.bindElement?.setAttribute('aria-keyshortcuts', hotkey.join('+'))
  },
}
