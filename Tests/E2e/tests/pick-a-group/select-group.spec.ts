import { expect, test } from '../../fixtures/test.js'
import { pathFor } from '../../fixtures/compatibility.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { pageTree, showTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { openControls, groupButton, toggleButton } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('there is nothing to switch on until a group is picked', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  await expect(page.locator(toggleButton)).toBeDisabled()

  await pickFirstGroup(page)

  await expect(page.locator(toggleButton)).toBeEnabled()
})

test('the group picker opens the form of a new group at the root level', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await page.locator(groupButton).click()

  await page.locator('vperm-picker:visible').getByRole('link', { name: 'New group' }).click()

  const form = moduleContent(page).locator('form[name="editform"]')

  await expect(form.locator('[data-formengine-input-name^="data[be_groups][NEW"][data-formengine-input-name$="[title]"]')).toBeVisible()
  await expect(form.locator('input[name^="data[be_groups][NEW"][name$="[pid]"]')).toHaveValue('0')
})

test('the page tree stands on the root level while a new group is made', async ({ page }) => {
  await page.goto(`${await pathFor(page, '/typo3/module/content/records')}?id=25`)
  await showTree(page)
  await expect(pageTree(page).locator('.node-selected')).toContainText('Studies')
  await openControls(page)
  await page.locator(groupButton).click()

  await page.locator('vperm-picker:visible').getByRole('link', { name: 'New group' }).click()

  await expect(pageTree(page).locator('.node-selected')).toContainText('Visual permissions')
})

test('the group an admin picks is still picked after a page load', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  const picked = await pickFirstGroup(page)

  await page.goto(await pathFor(page, '/typo3/module/content/records'))
  await openControls(page)

  await expect(page.locator(groupButton)).toHaveText(picked)
})
