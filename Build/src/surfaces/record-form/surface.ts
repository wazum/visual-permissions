import { formReady } from './form.js'
import { attributes } from '../../platform/contract.js'

const anchors = `[${attributes.token}]`

export function initialise(doc: Document, signal: AbortSignal): void {
  let watch: MutationObserver | null = null

  const report = (): void => {
    const inner = doc.querySelector<HTMLIFrameElement>('#typo3-contentIframe')?.contentDocument ?? null
    if (inner?.body == null) {
      return
    }

    let fields = [...inner.querySelectorAll(anchors)]

    // Every module document is reported, fields or none; the layout opens a form all the same
    formReady({ doc: inner, fields })

    watch?.disconnect()
    watch = new MutationObserver(() => {
      const now = [...inner.querySelectorAll(anchors)]
      if (sameFields(now, fields)) {
        return
      }

      fields = now
      formReady({ doc: inner, fields: now })
    })
    watch.observe(inner.body, { childList: true, subtree: true })
  }

  doc.addEventListener('typo3-module-loaded', report, { signal })
  signal.addEventListener('abort', () => { watch?.disconnect() })
  report()
}

const sameFields = (one: readonly Element[], other: readonly Element[]): boolean =>
  one.length === other.length && one.every((field, place) => field === other[place])
