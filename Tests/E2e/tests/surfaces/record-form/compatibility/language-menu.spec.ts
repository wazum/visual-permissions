import { expect, test } from '../../../../fixtures/test.js'
import { pickArea } from '../../../../fixtures/areas.js'
import { onOlderCore } from '../../../../fixtures/compatibility.js'
import { moduleContent } from '../../../../fixtures/module-content.js'
import { pickFirstGroup } from '../../../../fixtures/groups.js'
import { openFirstPage } from '../../../../fixtures/record-form.js'
import { forgetSession } from '../../../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../../../fixtures/visual-mode.js'

// 13.4 gives the language menu a row of its own, which the form gives up while it is picked.
// Delete this file with 13.4 support.

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
  test.skip(!(await onOlderCore(page)), '14.3 keeps the language menu at the right of its header')
})

test('the language menu stands in the row of the buttons', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-show-menu ~ * select[name="_langSelector"]')).toBeVisible()

  await switchOff(page)

  await expect(form.locator('.module-docheader-bar-navigation select[name="_langSelector"]')).toBeVisible()
})

test('the language menu offers no new translation while permissions are edited', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)
  const newTranslation = form.locator('select[name="_langSelector"] option[value*="localize"]')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(newTranslation).toHaveCSS('display', 'none')
})
