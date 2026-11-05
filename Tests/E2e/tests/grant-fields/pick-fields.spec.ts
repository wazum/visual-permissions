import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { cursorOver } from '../../fixtures/buttons.js'
import { selectorFor } from '../../fixtures/compatibility.js'
import { giveMarkedFieldsAway, openFirstPage, turnToFields } from '../../fixtures/record-form.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

const givable = ".vperm-anchor[data-vperm-verdict='denied']"
const nobodys = ".vperm-anchor[data-vperm-verdict='notApplicable']"
const marked = '.vperm-face-marked'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

// The field itself is the switch, and a second press takes the mark back off it
test('a field is pressed to give it away, and pressed again to take it back', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const row = form.locator(givable).first()

  await expect(row).toBeVisible()
  await expect(row).toHaveCSS('cursor', 'pointer')

  await row.click()

  await expect(row).toHaveClass(/vperm-face-marked/)

  await row.click()

  await expect(form.locator(marked)).toHaveCount(0)
})

// Nothing is marked yet, so there is nothing to give, and the button says so under the pointer
test('the deed that cannot be done yet shows it under the pointer', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  await expect(form.locator('.vperm-face-apply')).toBeDisabled()
  expect(await cursorOver(form.locator('.vperm-face-apply'))).toBe('not-allowed')
})

// Escape means cancel on every area, and the form is no different
test('escape turns the form back to what the group has', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  await page.keyboard.press('Escape')

  await expect(form.locator('body')).toHaveAttribute('data-vperm-face', 'preview')
})

test('the next record opens on what the group has', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  await page.locator(await selectorFor(page, '[data-modulemenu-identifier="records"]')).click()
  await form.locator('a[href*="edit%5Bpages%5D"]').nth(1).click()
  await expect(form.locator('form[name="editform"]')).toBeAttached()

  await expect(form.locator('body')).toHaveAttribute('data-vperm-face', 'preview')
})

// Giving a field away shows up where it counts: the group's own form grows by that row
test('a field given away turns up on the form the group gets', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const row = form.locator(givable).first()
  const token = await row.getAttribute('data-vperm-token')

  await row.click()
  await giveMarkedFieldsAway(page, form)

  await expect(
    form.locator(`[data-vperm-token='${token ?? ''}']`),
    'the field given away is still kept from the group',
  ).toBeVisible()
})

test('every field of its own the tab holds is marked to be given at once', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const tab = form.locator('.tab-pane.active')
  const own = tab.locator(`${givable}[data-vperm-inside='']`)

  await expect(own.first()).toBeVisible()
  const givableCount = await own.count()

  await tab.getByRole('button', { name: 'Grant all on this tab' }).click()

  await expect(tab.locator(`.vperm-anchor[data-vperm-inside='']${marked}`)).toHaveCount(givableCount)
})

test('a row nobody can be given says nothing and takes no mark', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const row = form.locator(nobodys).first()

  await expect(row).toBeVisible()
  await expect(row).not.toHaveCSS('cursor', 'pointer')

  await row.click()

  await expect(form.locator(marked)).toHaveCount(0)
})
