import { test as playwright } from '@playwright/test'
import { freshDatabase, forgetDatabase, administrator } from './database.js'

// Each test gets its own page; a test's page can arrive after it ends
let taken = 0

/**
 * Every test is given a backend of its own: a copy of the seeded database, made before the
 * test starts and thrown away after it ends, with the administrator already logged in.
 * Nothing a test writes can reach another one, a second run of the suite is the first one
 * again, and workers can run side by side.
 *
 * The backend is told which database to read by a header on every request the test makes.
 */
export const test = playwright.extend<{ databaseNumber: number }>({
  databaseNumber: [async ({}, use, info) => {
    const named = info.parallelIndex * 10000 + (taken += 1)

    freshDatabase(named)

    await use(named)

    forgetDatabase(named)
  }, { auto: true }],

  contextOptions: async ({ contextOptions, databaseNumber, baseURL }, use) => {
    const session = administrator()
    const site = new URL(baseURL ?? '')

    await use({
      ...contextOptions,
      extraHTTPHeaders: {
        ...contextOptions.extraHTTPHeaders,
        'x-vperm-database': String(databaseNumber),
      },
      storageState: {
        cookies: [{
          name: session.name,
          value: session.value,
          domain: site.hostname,
          path: '/',
          expires: -1,
          httpOnly: true,
          secure: site.protocol === 'https:',
          sameSite: 'Lax',
        }],
        origins: [],
      },
    })
  },
})

export { expect } from '@playwright/test'
