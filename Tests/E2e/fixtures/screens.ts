import type { Page } from '@playwright/test'
import { expect, test } from './test.js'
import { groupMounts } from './mounts.js'
import { forgetSession } from './session.js'

// Every screen of every feature as the seeded database draws it. They hold the frontend
// still while its files move: a move that changes a pixel changed what the admin sees.
export const matchesBaselines = (): void => {
  // The shots were drawn by the ddev browser on 13.4; CI draws them in that same image, nowhere else
  test.skip(
    process.env['CI'] !== undefined && process.env['VPERM_SCREENS'] === undefined,
    'the snapshots hold the ddev browser on 13.4',
  )

  test.beforeEach(async ({ page, databaseNumber }) => {
    groupMounts(databaseNumber, 25)
    await page.setViewportSize({ width: 1600, height: 900 })
    await forgetSession(page)
  })
}

export const matchesSnapshot = async (page: Page, name: string): Promise<void> => {
  await page.waitForLoadState('networkidle')
  // The topbar shows TYPO3's patch release, which changes with every composer update
  await expect(page).toHaveScreenshot(['screens', `${name}.png`], {
    fullPage: true,
    mask: [page.locator('.topbar-site-version')],
  })
}
