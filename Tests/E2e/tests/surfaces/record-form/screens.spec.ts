import type { Page } from '@playwright/test'
import { expect, test } from '../../../fixtures/test.js'
import { pickArea } from '../../../fixtures/areas.js'
import { pickFirstGroup } from '../../../fixtures/groups.js'
import { moduleContent } from '../../../fixtures/module-content.js'
import { turnToFields } from '../../../fixtures/record-form.js'
import { matchesBaselines, matchesSnapshot } from '../../../fixtures/screens.js'
import { openControls, switchOn } from '../../../fixtures/visual-mode.js'

const contentRecord = '/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit'
const pageRecord = '/typo3/record/edit?edit%5Bpages%5D%5B25%5D=edit'

const openRecordForGroup = async (page: Page, record: string): Promise<void> => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto(record)
  // Switched on before the form stands, the mode takes the reader to a module instead
  await expect(moduleContent(page).locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await expect(moduleContent(page).locator('[data-vperm-verdict]').first()).toBeAttached()
}

matchesBaselines()

test.describe('the records and fields', () => {
  test('a record as the group gets it', async ({ page }) => {
    await openRecordForGroup(page, contentRecord)

    await matchesSnapshot(page, 'record-preview')
  })

  test('a record with its fields to give', async ({ page }) => {
    await openRecordForGroup(page, contentRecord)
    await turnToFields(page)
    await expect(moduleContent(page).locator('.vperm-table-gate').first()).toBeVisible()

    await matchesSnapshot(page, 'record-pick')
  })

  test('a record with a field marked to be given', async ({ page }) => {
    await openRecordForGroup(page, contentRecord)
    await turnToFields(page)
    await moduleContent(page).locator('[data-vperm-verdict="denied"]:not([data-vperm-out-of-reach])').first().click()
    await expect(moduleContent(page).locator('.vperm-face-apply')).toBeEnabled()

    await matchesSnapshot(page, 'record-marked')
  })

  test('a record with the ways to read it offered', async ({ page }) => {
    await openRecordForGroup(page, contentRecord)
    await moduleContent(page).locator('.vperm-show-menu .dropdown-toggle').click()
    await expect(moduleContent(page).locator('.vperm-show-menu .dropdown-menu')).toBeVisible()

    await matchesSnapshot(page, 'record-show-menu')
  })

  test('a record read as a list', async ({ page }) => {
    await openRecordForGroup(page, contentRecord)
    await moduleContent(page).locator('.vperm-show-menu .dropdown-toggle').click()
    await moduleContent(page).locator('.vperm-show-menu .dropdown-item').first().click()
    await expect(moduleContent(page).locator('body')).toHaveAttribute('data-vperm-show', /.*/)

    await matchesSnapshot(page, 'record-as-list')
  })

  test('a page as the group gets it', async ({ page }) => {
    await openRecordForGroup(page, pageRecord)

    await matchesSnapshot(page, 'page-preview')
  })
})
