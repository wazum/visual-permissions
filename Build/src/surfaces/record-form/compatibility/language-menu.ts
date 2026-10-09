// 14.3 shows the record's language menu at the right of its header; 13.4 puts it above the
// buttons, and it stands beside them while the form is ours. Delete this with 13.4 support.
const olderLanguageMenu = '.form-group:has(> select[name="_langSelector"])'

const homes = new WeakMap<Element, Element | null>()

export function besideOlderLanguageMenu(doc: Document, menu: Element): void {
  const languages = doc.querySelector(`.module-docheader ${olderLanguageMenu}`)
  if (languages === null) {
    return
  }

  if (!homes.has(languages)) {
    homes.set(languages, languages.parentElement)
  }

  menu.after(languages)
}

export function backToOlderLanguageMenu(doc: Document): void {
  const languages = doc.querySelector(`.module-docheader ${olderLanguageMenu}`)
  // Stryker disable next-line ConditionalExpression: without a menu nothing comes back either way
  if (languages !== null) {
    homes.get(languages)?.append(languages)
  }
}

export const withOlderLanguageMenu = (own: string): string => `${own}, ${olderLanguageMenu}`
