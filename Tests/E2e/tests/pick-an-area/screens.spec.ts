import { expect, test } from '../../fixtures/test.js'
import { showTree } from '../../fixtures/page-tree.js'
import { matchesBaselines, matchesSnapshot } from '../../fixtures/screens.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

matchesBaselines()

test.describe('the areas', () => {
  test('with a tab over each', async ({ page }) => {
    await page.goto('/typo3/module/web/layout')
    await showTree(page)
    await showPermissions(page)
    await expect(page.locator('.vperm-tab')).toHaveCount(5)

    await matchesSnapshot(page, 'area-tabs')
  })
})
