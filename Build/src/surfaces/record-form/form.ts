export interface RecordForm {
  readonly doc: Document
  readonly fields: readonly Element[]
}

type Listener<Told> = (told: Told) => void

interface Audience<Told> {
  readonly listen: (listener: Listener<Told>, signal: AbortSignal) => void
  readonly tell: (told: Told) => void
}

function createAudience<Told>(): Audience<Told> {
  const listeners = new Set<Listener<Told>>()

  return {
    listen: (listener, signal) => {
      if (signal.aborted) {
        return
      }

      listeners.add(listener)
      signal.addEventListener('abort', () => { listeners.delete(listener) })
    },
    tell: told => { listeners.forEach(listener => { listener(told) }) },
  }
}

const readyForms = createAudience<RecordForm>()

export function onFormReady(listener: Listener<RecordForm>, signal: AbortSignal): void {
  readyForms.listen(listener, signal)
}

export function formReady(form: RecordForm): void {
  readyForms.tell(form)
}
