import { expect, test } from '../../fixtures/test.js'
import { matchesBaselines, matchesSnapshot } from '../../fixtures/screens.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

matchesBaselines()

test.describe('the other permissions', () => {
  test('as the group has them', async ({ page }) => {
    await page.goto('/typo3/module/web/layout')
    await showPermissions(page, 'other')
    await expect(page.locator('input[name^="data[be_groups]"]').first()).toBeAttached()

    await matchesSnapshot(page, 'other-permissions')
  })
})
