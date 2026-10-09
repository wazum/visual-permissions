const olderHosts = {
  '.scaffold-sidebar': '.t3js-scaffold-modulemenu',
  'typo3-backend-navigation-component-pagetree': '.t3js-scaffold-content-navigation',
  'typo3-backend-navigation-component-filestoragetree': '.t3js-scaffold-content-navigation',
  '[slot="content"]': '.t3js-scaffold-content-module',
} as const

/**
 * 13.4 frames an area on the column it stands in, under another name, and keeps both trees
 * in one column. Delete this with 13.4 support, and let each call keep the name it was given.
 */
export const withOlderHost = (host: keyof typeof olderHosts): string => `${host}, ${olderHosts[host]}`
