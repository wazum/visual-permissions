import type { Locator, Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { turnToFields } from '../../fixtures/record-form.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

const level = (where: Locator, name: string): Locator =>
  where.locator('.vperm-table-levels').getByRole('radio', { name, exact: true })

const choose = async (page: Page, where: Locator, name: string): Promise<void> => {
  await verifyIfAsked(page, () => level(where, name).click())
}

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

// The fields of such a record cannot be allowed, and the record itself has to say why
test('a record of a table the group is not allowed says so, and offers the levels', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.locator('.nav-tabs').getByText('Media', { exact: true }).click()

  // The record's own table stands over the form as well, so this names the one it holds
  const held = form.locator('.vperm-table-gate:has(.vperm-table-token:text-is("sys_file_reference"))')

  await expect(level(held, 'No Access')).toHaveAttribute('aria-checked', 'true')
})

test('a record of a table the group may write has reading and writing chosen', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bpages%5D%5B25%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const own = form.locator('.vperm-table-gate:has(.vperm-table-token:text-is("pages"))')

  await expect(level(own, 'Read & Write')).toHaveAttribute('aria-checked', 'true')
})

test('leaving the group only reading the table of the record turns the form to what the group gets', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)
  const band = (table: string): Locator => form.locator(`.vperm-table-gate:has(.vperm-table-token:text-is("${table}"))`)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.locator('.nav-tabs').getByText('Media', { exact: true }).click()
  await choose(page, band('sys_file_reference'), 'Read & Write')
  await expect(level(band('sys_file_reference'), 'Read & Write')).toHaveAttribute('aria-checked', 'true', { timeout: 8000 })
  await choose(page, band('tt_content'), 'Read')

  await expect(form.locator('body')).toHaveAttribute('data-vperm-face', 'preview')
})

// The group's own form carries no such record at all, and a gap explains nothing
test('the form the group gets says why a record of that table is missing', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-table-note'))
    .toHaveText('This is empty for the group: it may not edit "File Reference"')
})

// Tables are allowed where the fields are, never on the form as the group gets it
test('the form the group gets offers no table a missing record belongs to', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-table-note')).toBeAttached()
  await expect(form.locator('.vperm-table-note .vperm-table-levels')).toHaveCount(0)
})

test('the form the group gets offers the levels of a record it cannot reach', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(level(form.locator('.vperm-nothing-theirs'), 'No Access')).toHaveAttribute('aria-checked', 'true')
})

test('the form the group gets names the table of a record it cannot reach as the band does', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const note = moduleContent(page).locator('.vperm-nothing-theirs')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(note.locator('.vperm-table-name')).toHaveText('File Reference')
  await expect(note.locator('.vperm-table-token')).toHaveText('sys_file_reference')
})

test('the note on the form the group gets stands the name over the table, as the band does', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const note = moduleContent(page).locator('.vperm-nothing-theirs')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const name = await note.locator('.vperm-table-name').boundingBox()
  const token = await note.locator('.vperm-table-token').boundingBox()

  expect(token?.x).toBe(name?.x)
  expect((token?.y ?? 0) - (name?.y ?? 0) - (name?.height ?? 0)).toBeGreaterThanOrEqual(0)
  expect((token?.y ?? 0) - (name?.y ?? 0) - (name?.height ?? 0)).toBeLessThan(4)
})

test('the levels on the form the group gets stand at the far edge of its note', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const note = await form.locator('.vperm-nothing-theirs').boundingBox()
  const levels = await form.locator('.vperm-nothing-theirs .vperm-table-levels').boundingBox()

  expect((note?.x ?? 0) + (note?.width ?? 0) - ((levels?.x ?? 0) + (levels?.width ?? 0))).toBeLessThan(40)
})
