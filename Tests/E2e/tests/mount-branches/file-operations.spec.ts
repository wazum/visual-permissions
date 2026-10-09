import { expect, test } from '../../fixtures/test.js'
import { groupOperates } from '../../fixtures/allowed-values.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a file operation ticked and added is one the group may do', async ({ page, databaseNumber }) => {
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
