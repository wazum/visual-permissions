import { expect, test } from '../../fixtures/test.js'
import { matchesBaselines, matchesSnapshot } from '../../fixtures/screens.js'
import { viewAsButton, viewAsFirstUser } from '../../fixtures/users.js'
import { openControls } from '../../fixtures/visual-mode.js'

matchesBaselines()

test.describe('viewing as a user', () => {
  test('with the users offered', async ({ page }) => {
    await page.goto('/typo3/')
    await openControls(page)
    await page.locator(viewAsButton).click()
    await expect(page.locator('vperm-picker:visible [role="option"]').first()).toBeVisible()

    await matchesSnapshot(page, 'user-picker')
  })

  test('as the user sees the backend', async ({ page }) => {
    await page.goto('/typo3/')
    await openControls(page)
    await viewAsFirstUser(page)

    await matchesSnapshot(page, 'as-the-user')
  })
})
