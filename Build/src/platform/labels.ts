export function labelOf(name: string): string {
  return TYPO3.lang[name] ?? ''
}
