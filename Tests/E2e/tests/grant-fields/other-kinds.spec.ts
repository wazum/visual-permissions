import type { FrameLocator, Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { giveMarkedFieldsAway, turnToFields } from '../../fixtures/record-form.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

const section = '.vperm-other-kinds'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

const recordWithAFile = async (page: Page, filesGranted = true): Promise<FrameLocator> => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)
  await form.locator('[role="tab"]:has-text("Media")').click()

  const files = form.locator('.vperm-table-gate:has(.vperm-table-token:text-is("sys_file_reference"))')

  if (!filesGranted) {
    await expect(files.locator('.vperm-table-give')).toBeVisible()

    return form
  }

  // The first press asks for the password and writes nothing; the second one writes
  await expect(async () => {
    await verifyIfAsked(page, () => files.locator('.vperm-table-give').click({ timeout: 2000 }))
    await expect(files.locator('.vperm-table-take')).toBeVisible({ timeout: 3000 })
  }).toPass({ timeout: 20000 })

  return form
}

const shownIn = async (form: FrameLocator): Promise<string[]> => form.locator(`${section} [data-vperm-token]`)
  .evaluateAll(rows => rows.filter(row => row.checkVisibility()).map(row => row.getAttribute('data-vperm-token') ?? ''))

// The file on the record is a text file; an image or a video asks for more
test('a field holding records lists the fields only other kinds of record show', async ({ page }) => {
  const form = await recordWithAFile(page)

  await expect(form.locator(section)).toBeVisible()

  const tokens = await shownIn(form)

  expect(tokens).toContain('sys_file_reference:autoplay')
  expect(tokens).not.toContain('sys_file_reference:title')
})

test('a field only other kinds of record show is given away like any other', async ({ page }) => {
  const form = await recordWithAFile(page)
  const autoplay = form.locator(`${section} [data-vperm-token="sys_file_reference:autoplay"]`)

  await expect(autoplay).toHaveAttribute('data-vperm-verdict', 'denied')
  await autoplay.click()
  await expect(autoplay).toHaveClass(/vperm-face-marked/)
  await giveMarkedFieldsAway(page, form)
  await turnToFields(page)

  await expect(autoplay).toHaveAttribute('data-vperm-verdict', 'allowed')
})

// A record of a table the group may not write holds nothing to give, and neither does its kind
test('a field holding records of a table the group may not write lists nothing', async ({ page }) => {
  const form = await recordWithAFile(page, false)

  await expect(form.locator(section)).toBeHidden()
})

// The form as the group gets it shows records the way core draws them
test('the form the group gets lists no fields of other kinds', async ({ page }) => {
  const form = await recordWithAFile(page)

  await expect(form.locator(section)).toBeVisible()
  await form.locator('.vperm-face-cancel').click()
  await expect(form.locator('body')).toHaveAttribute('data-vperm-face', 'preview')

  await expect(form.locator(section)).toBeHidden()
})
