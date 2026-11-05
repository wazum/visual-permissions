import { expect, test } from '../../fixtures/test.js'
import { matchesBaselines, matchesSnapshot } from '../../fixtures/screens.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

const modules = '.vperm-frame[data-vperm-area="modules"]'
const moduleRows = '[data-modulemenu-identifier]:not([aria-controls])'

matchesBaselines()

test.describe('the modules', () => {
  test('as the group has them', async ({ page }) => {
    await page.goto('/typo3/')
    await showPermissions(page, 'modules')
    await expect(page.locator(`${modules} .vperm-face-preview ${moduleRows}`).first()).toBeAttached()

    await matchesSnapshot(page, 'modules-preview')
  })

  test('as they are given', async ({ page }) => {
    await page.goto('/typo3/')
    await showPermissions(page, 'modules')
    await page.locator('.vperm-face-preview .vperm-face-bar button').click()
    await expect(page.locator(`.vperm-face-pick ${moduleRows}`).first()).toBeAttached()

    await matchesSnapshot(page, 'modules-pick')
  })

  test('with a module marked to be taken away', async ({ page }) => {
    await page.goto('/typo3/')
    await showPermissions(page, 'modules')
    await page.locator(`.vperm-face-preview ${moduleRows}`).first().click()
    await expect(page.locator('.vperm-face-preview .vperm-face-marked')).toHaveCount(1)

    await matchesSnapshot(page, 'modules-marked')
  })
})
