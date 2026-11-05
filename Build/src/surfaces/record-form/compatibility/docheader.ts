/**
 * FormEngine hangs its own button in the head of a module. 13.4 looks for that head by
 * another name, and without checking whether it found one. Delete this with 13.4 support.
 */
export function initialise(doc: Document, signal: AbortSignal): void {
  const addBothClassNames = (): void => {
    doc.querySelectorAll('.t3js-module-docheader-buttons')
      .forEach(head => { head.classList.add('t3js-module-docheader-bar-buttons') })
  }

  const watch = new MutationObserver(addBothClassNames)

  watch.observe(doc.body, { childList: true, subtree: true })
  signal.addEventListener('abort', () => { watch.disconnect() })

  addBothClassNames()
}
