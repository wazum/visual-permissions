import type { Locator } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
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

// The fields of such a record are nobody's to give, and the record itself has to say why
test('a record of a table the group was not given says so, and offers the table', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  // The record's own table stands over the form as well, so this names the one it holds
  const held = form.locator('.vperm-table-gate:has(.vperm-table-token:text-is("sys_file_reference"))')

  await expect(held.locator('.callout-body')).toHaveText('The group may not edit records of this kind')
  await expect(held.locator('.vperm-table-give')).toHaveText('Grant "File Reference"')
})

test('a record of a table the group was given offers to take the table back', async ({ page }) => {
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

  await expect(own.locator('.vperm-table-take')).toHaveText('Revoke "Page"')
})

test('revoking the table of the record turns the form to what the group gets', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)
  const band = (table: string): Locator => form.locator(`.vperm-table-gate:has(.vperm-table-token:text-is("${table}"))`)
  const press = async (deed: Locator): Promise<void> => {
    await verifyIfAsked(page, () => deed.click())
    await expect(deed).toBeHidden({ timeout: 8000 })
  }

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.locator('.nav-tabs').getByText('Media', { exact: true }).click()
  await press(band('sys_file_reference').locator('.vperm-table-give'))
  await expect(band('sys_file_reference').locator('.vperm-table-take')).toBeVisible()
  await press(band('tt_content').locator('.vperm-table-take'))

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

// Tables are given where the fields are, never on the form as the group gets it
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
  await expect(form.locator('.vperm-table-note .vperm-table-give')).toHaveCount(0)
})

test('the form the group gets offers the table of a record it cannot reach', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-nothing-theirs .vperm-table-give')).toHaveText('Grant "File Reference"')
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
  await expect(note.locator('.callout-body')).toHaveText('The group may not edit records of this kind')
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

test('the offer on the form the group gets stands at the far edge of its note', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const note = await form.locator('.vperm-nothing-theirs').boundingBox()
  const offer = await form.locator('.vperm-nothing-theirs .vperm-table-give').boundingBox()

  expect((note?.x ?? 0) + (note?.width ?? 0) - ((offer?.x ?? 0) + (offer?.width ?? 0))).toBeLessThan(40)
})
