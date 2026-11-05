import { expect, test } from '../../fixtures/test.js'
import { groupFileMounts } from '../../fixtures/mounts.js'
import { showTree } from '../../fixtures/page-tree.js'
import { matchesBaselines, matchesSnapshot } from '../../fixtures/screens.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

const mounts = '.vperm-frame[data-vperm-area="pageMounts"]'
const folders = '.vperm-frame[data-vperm-area="fileMounts"]'

matchesBaselines()

test.describe('the page mounts', () => {
  test('as the group has them', async ({ page }) => {
    await page.goto('/typo3/module/web/layout')
    await showTree(page)
    await showPermissions(page, 'pageMounts')
    await expect(page.locator(`${mounts} .vperm-face-preview .node`).first()).toBeAttached()

    await matchesSnapshot(page, 'mounts-preview')
  })

  test('as they are given', async ({ page }) => {
    await page.goto('/typo3/module/web/layout')
    await showTree(page)
    await showPermissions(page, 'pageMounts')
    await page.locator(`${mounts} .vperm-face-preview .vperm-face-bar button`).click()
    await expect(page.locator(`${mounts} .vperm-face-pick .node`).first()).toBeAttached()

    await matchesSnapshot(page, 'mounts-pick')
  })
})

test.describe('the folder mounts', () => {
  test('as the group has them', async ({ page, databaseNumber }) => {
    groupFileMounts(databaseNumber, 1)
    await page.goto('/typo3/module/file/list')
    await showPermissions(page, 'fileMounts')
    await expect(page.locator(`${folders} .vperm-face-preview .node`).first()).toBeAttached()

    await matchesSnapshot(page, 'folders-preview')
  })

  test('as they are given', async ({ page, databaseNumber }) => {
    groupFileMounts(databaseNumber, 1)
    await page.goto('/typo3/module/file/list')
    await showPermissions(page, 'fileMounts')
    await page.locator(`${folders} .vperm-face-preview .vperm-face-bar button`).click()
    await expect(page.locator(`${folders} .vperm-face-pick .node`).first()).toBeAttached()

    await matchesSnapshot(page, 'folders-pick')
  })

  test('with a folder being named', async ({ page, databaseNumber }) => {
    groupFileMounts(databaseNumber, 1)
    await page.goto('/typo3/module/file/list')
    await showPermissions(page, 'fileMounts')
    await page.locator(`${folders} .vperm-face-preview .vperm-face-bar button`).click()
    await page.locator(`${folders} .vperm-face-pick .node`, { hasText: 'press' }).click()
    await page.locator(`${folders} .vperm-face-pick .vperm-face-apply`).click()
    await expect(page.locator(`${folders} .vperm-naming`)).toBeVisible()

    await matchesSnapshot(page, 'folders-naming')
  })
})
