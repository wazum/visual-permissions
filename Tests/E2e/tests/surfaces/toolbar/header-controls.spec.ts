import { expect, test } from '../../../fixtures/test.js'
import { pathFor } from '../../../fixtures/compatibility.js'
import { forgetSession } from '../../../fixtures/session.js'
import {
  openControls,
  closeControls,
  showPermissions,
  groupButton,
  toolbarButton,
} from '../../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the toolbar keeps the icon, and the header nothing, until it is pressed', async ({ page }) => {
  await page.goto('/typo3/')

  await expect(page.locator(toolbarButton)).toBeVisible()
  await expect(page.locator(groupButton)).toBeHidden()

  await openControls(page)

  await expect(page.locator(groupButton)).toBeVisible()
})

test('the controls go away again on a second press', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  await closeControls(page)

  await expect(page.locator(toolbarButton)).toHaveAttribute('aria-pressed', 'false')
})

test('the controls are still up after a page load', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  await page.goto(await pathFor(page, '/typo3/module/content/records'))

  await expect(page.locator(groupButton)).toBeVisible()
})

test('the controls stand clear of the name of the site', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/')
  await openControls(page)

  const site = await page.locator('.topbar-site').boundingBox()
  const controls = await page.locator(groupButton).boundingBox()

  expect(controls?.x ?? 0).toBeGreaterThanOrEqual((site?.x ?? 0) + (site?.width ?? 0))
})

// The bar is the only way to switch the mode off; removing it disables the mode
test('folding the controls away switches the permissions off', async ({ page }) => {
  await page.goto('/typo3/')
  await showPermissions(page)

  await closeControls(page)

  await expect(page.locator('body[data-vperm-active]')).not.toBeAttached()
})
