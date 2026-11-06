import { expect, test } from '../../fixtures/test.js'
import { groupOperates } from '../../fixtures/allowed-values.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the file operations dialog is as tall as its choices', async ({ page }) => {
  await page.goto('/typo3/module/web/layout')
  await showPermissions(page, 'fileMounts')

  await page.getByRole('button', { name: 'Choose file operations' }).click()
  const dialog = page.getByRole('dialog')
  const choices = dialog.locator('.vperm-allow-choices')
  await expect(choices).toBeVisible()

  const choicesEnd = (await choices.boundingBox())?.y ?? 0
  const choicesHeight = (await choices.boundingBox())?.height ?? 0
  const footerTop = (await dialog.locator('.modal-footer').boundingBox())?.y ?? 0

  expect(footerTop - (choicesEnd + choicesHeight)).toBeLessThan(60)
})

test('a file operation ticked and allowed is one the group may do', async ({ page, databaseNumber }) => {
  groupOperates(databaseNumber, 'readFile')

  await page.goto('/typo3/module/web/layout')
  await showPermissions(page, 'fileMounts')

  const choose = page.getByRole('button', { name: 'Choose file operations' })
  const dialog = page.getByRole('dialog')

  await choose.click()
  await expect(dialog.getByRole('checkbox', { name: 'Files: Read' })).toBeChecked()
  await dialog.getByRole('checkbox', { name: 'Files: Delete' }).check()
  const apply = dialog.getByRole('button', { name: 'Apply' })
  await verifyIfAsked(page, () => apply.click())
  await expect(apply).toBeHidden({ timeout: 8000 })

  await choose.click()

  await expect(dialog.getByRole('checkbox', { name: 'Files: Delete' })).toBeChecked()
})
