import { expect, test } from '../../../fixtures/test.js'
import { matchesBaselines, matchesSnapshot } from '../../../fixtures/screens.js'
import { openControls, showPermissions } from '../../../fixtures/visual-mode.js'

matchesBaselines()

test.describe('the toolbar', () => {
  test('before anything is pressed', async ({ page }) => {
    await page.goto('/typo3/')

    await matchesSnapshot(page, 'toolbar-closed')
  })

  test('with the controls open', async ({ page }) => {
    await page.goto('/typo3/')
    await openControls(page)

    await matchesSnapshot(page, 'toolbar-open')
  })

  test('with the groups offered', async ({ page }) => {
    await page.goto('/typo3/')
    await openControls(page)
    await page.locator('[data-vperm-group]').click()
    await expect(page.locator('vperm-picker:visible [role="option"]').first()).toBeVisible()

    await matchesSnapshot(page, 'group-picker')
  })

  test('with the mode on for a group', async ({ page }) => {
    await page.goto('/typo3/')
    await showPermissions(page)

    await matchesSnapshot(page, 'mode-on')
  })
})
