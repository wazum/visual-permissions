export function ajaxUrl(route: string): string {
  return TYPO3.settings.ajaxUrls[route] ?? ''
}
