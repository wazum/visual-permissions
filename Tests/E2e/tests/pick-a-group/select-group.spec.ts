import { expect, test } from '../../fixtures/test.js'
import { pathFor } from '../../fixtures/compatibility.js'
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

test('the group an admin picks is still picked after a page load', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  const picked = await pickFirstGroup(page)

  await page.goto(await pathFor(page, '/typo3/module/content/records'))
  await openControls(page)

  await expect(page.locator(groupButton)).toHaveText(picked)
})
