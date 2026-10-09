import { defineConfig, devices } from '@playwright/test'

/**
 * The suite is given a webserver, it does not bring one. Here that is one of ddev's own
 * hostnames, served from the extension's document root; elsewhere, name one.
 */
const baseURL = process.env['TYPO3_BASE_URL'] ??'https://e2e-typo3-demo-13-solr.ddev.site'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: process.env['CI'] !== undefined,
  retries: process.env['CI'] === undefined ? 0 : 2,
  reporter: 'list',

  snapshotPathTemplate: '{testDir}/snapshots/{arg}{ext}',
  expect: {
    toHaveScreenshot: { animations: 'disabled', scale: 'css' },
  },

  use: {
    baseURL,
    // DDEV signs its hostnames itself
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: 3,
        // Text placed between pixels lands on one or the other from run to run
        launchOptions: { args: ['--disable-font-subpixel-positioning', '--font-render-hinting=none'] },
      },
    },
  ],

  outputDir: 'test-results/',
})
