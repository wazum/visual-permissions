// The styles decide whether anything moves, from the extension setting and from the browser's
export function isStill(doc: Document): boolean {
  return getComputedStyle(doc.body).getPropertyValue('--vperm-motion') === '0'
}
