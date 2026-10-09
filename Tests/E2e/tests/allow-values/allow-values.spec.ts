import { expect, test } from '../../fixtures/test.js'
import { groupAllows, groupCreates } from '../../fixtures/allowed-values.js'
import { pickArea } from '../../fixtures/areas.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { turnToFields } from '../../fixtures/record-form.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the type of a content element offers to choose the page content types', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const beside = form.locator("[data-vperm-token='tt_content:CType'] + button")

  await expect(beside).toHaveText('Choose page content types')
})

test('the page content types are chosen in a dialog that lists every one of them', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.getByRole('button', { name: 'Choose page content types' }).click()

  const dialog = page.getByRole('dialog')

  await expect(dialog.locator('.t3js-modal-title')).toHaveText('The page content types the group "Aliquam" may use')
  await expect(dialog.getByRole('checkbox', { name: 'Text & Media' })).toBeVisible()
})

test('a page content type the group may use is ticked', async ({ page, databaseNumber }) => {
  groupAllows(databaseNumber, 'tt_content:CType:textmedia')

  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.getByRole('button', { name: 'Choose page content types' }).click()

  const dialog = page.getByRole('dialog')

  await expect(dialog.getByRole('checkbox', { name: 'Text & Media' })).toBeChecked()
  await expect(dialog.getByRole('checkbox', { name: 'Header Only' })).not.toBeChecked()
})

test('a page content type ticked and added is one the group may use', async ({ page, databaseNumber }) => {
  groupAllows(databaseNumber)

  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B1%5D=edit')

  const form = moduleContent(page)
  const choose = form.getByRole('button', { name: 'Choose page content types' })
  const dialog = page.getByRole('dialog')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await choose.click()
  await dialog.getByRole('checkbox', { name: 'Text & Media' }).check()
  const apply = dialog.getByRole('button', { name: 'Apply' })
  await verifyIfAsked(page, () => apply.click())
  await expect(apply).toBeHidden({ timeout: 8000 })

  await choose.click()

  await expect(dialog.getByRole('checkbox', { name: 'Text & Media' })).toBeChecked()
})

test('a page type ticked and added is one the group may create', async ({ page, databaseNumber }) => {
  groupCreates(databaseNumber)

  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bpages%5D%5B25%5D=edit')

  const form = moduleContent(page)
  const choose = form.getByRole('button', { name: 'Choose page types' })
  const dialog = page.getByRole('dialog')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await choose.click()
  await dialog.getByRole('checkbox', { name: 'Folder' }).check()
  const apply = dialog.getByRole('button', { name: 'Apply' })
  await verifyIfAsked(page, () => apply.click())
  await expect(apply).toBeHidden({ timeout: 8000 })

  await choose.click()

  await expect(dialog.getByRole('checkbox', { name: 'Folder' })).toBeChecked()
})
