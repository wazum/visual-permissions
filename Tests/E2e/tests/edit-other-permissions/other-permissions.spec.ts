import { expect, test } from '../../fixtures/test.js'
import { forgetSession } from '../../fixtures/session.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a save the backend does not take says that nothing was saved', async ({ page }) => {
  await page.goto('/typo3/module/web/layout')
  await showPermissions(page, 'other')
  await expect(page.locator('input[name^="data[be_groups]"]').first()).toBeAttached()
  await page.route('**/visual-permissions/write-other-permissions**', route => route.fulfill({ status: 500 }))

  await page.locator('.vperm-face .module-docheader').getByRole('button', { name: 'Save' }).click()

  await expect(page.locator('typo3-notification-message .alert-title'))
    .toHaveText('The permissions were not saved')
})
