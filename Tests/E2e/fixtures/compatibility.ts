import type { Page } from '@playwright/test'

const olderPaths: Readonly<Record<string, string>> = {
  '/typo3/module/content/records': '/typo3/module/web/list',
}

const olderSelectors: Readonly<Record<string, string>> = {
  'typo3-breadcrumb': '.typo3-docheader-pagePath',
  '.module-docheader-buttons :is(button, a)': '.module-docheader-bar-buttons :is(button, a)',
  '#typo3-contentIframe, .sidebar-container, .tree-toolbar': '#typo3-contentIframe, #modulemenu, .tree-toolbar',
  'typo3-backend-content-navigation .panel--navigation': '.scaffold-content-navigation',
  'typo3-backend-content-navigation .divider-handle': '.scaffold-content-navigation-drag',
  'typo3-backend-content-navigation-toggle[action="collapse"]': '.scaffold-content-navigation-switcher-close',
  'typo3-backend-content-navigation-toggle[action="expand"]': '.scaffold-content-navigation-switcher-open',
  'typo3-backend-content-navigation-toggle': '.scaffold-content-navigation-switcher-btn',
  '.module-docheader-buttons .btn-group:has(.dropdown-item[href*="viewMode="])': '.module-docheader select[name="actionMenu"]',
  '.module-docheader-navigation > .module-docheader-column:last-child > *': '.module-docheader select[name="_langSelector"]',
  "[title='Delete']": "[title='Delete record (!)']",
  "[title='Copy'], [title='Cut']": '.dropdown-item:text-is("Copy"), .dropdown-item:text-is("Cut")',
  "[title='Re-position content element']": '.dropdown-item:has-text("Re-position content element")',
  '[data-modulemenu-identifier="records"]': '[data-modulemenu-identifier="web_list"]',
}

let olderCore: Promise<boolean> | undefined

export const onOlderCore = async (page: Page): Promise<boolean> => {
  olderCore ??= page.request.get('/typo3/')
    .then(async answer => (await answer.text()).includes('[TYPO3 CMS 13.'))

  return olderCore
}

/**
 * A spec names a backend path or element the way 14.3 does; 13.4 has some of them under an
 * older name, read here from the core the backend names in its title. Delete this file with
 * 13.4 support, and let each call keep the name it was given.
 */
export const pathFor = async (page: Page, path: string): Promise<string> =>
  (await onOlderCore(page)) ? (olderPaths[path] ?? path) : path

export const selectorFor = async (page: Page, selector: string): Promise<string> =>
  (await onOlderCore(page)) ? (olderSelectors[selector] ?? selector) : selector
