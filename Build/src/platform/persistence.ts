import Persistent from '@typo3/backend/storage/persistent.js'
import { sessionHandedOver } from './shell.js'

// One write at a time: two on the wire at once would each write back what they found, and lose one
let inFlight: Promise<unknown> = Promise.resolve()

export function keep(key: string, value: unknown): Promise<unknown> {
  // Writes leave one at a time, so the settings can be somebody else's by the time this one
  // does, and the answer to a late write takes their session cookie with it. The page is
  // held rather than looked up again, so the wait cannot outlive the name.
  const page = document

  const write = inFlight.then(async () => {
    if (sessionHandedOver(page)) {
      return
    }

    await Persistent.set(key, value)
  })
  inFlight = write.catch(() => undefined)

  return write
}

// Once every setting written so far has reached the server
export function settled(): Promise<unknown> {
  return inFlight
}
