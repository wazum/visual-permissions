import type { FrameLocator, Page } from '@playwright/test'
import { expect, test } from '../../../fixtures/test.js'
import { pickArea } from '../../../fixtures/areas.js'
import { selectorFor } from '../../../fixtures/compatibility.js'
import { opened } from '../../../fixtures/database.js'
import { pickFirstGroup } from '../../../fixtures/groups.js'
import { moduleContent } from '../../../fixtures/module-content.js'
import { forgetSession } from '../../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../../fixtures/visual-mode.js'

const headerSwitch = '.vperm-type-switch select'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

const openRecord = async (page: Page, edit: string): Promise<FrameLocator> => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto(`/typo3/record/edit?${edit}`)

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeAttached()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  return form
}

const stored = (databaseNumber: number, query: string): unknown => {
  const database = opened(databaseNumber)

  try {
    return Object.values(database.prepare(query).get() ?? {})[0]
  } finally {
    database.close()
  }
}

test('switching the Type in the header shows the fields of the new type and saves nothing', async ({ page, databaseNumber }) => {
  const form = await openRecord(page, 'edit%5Btt_content%5D%5B1%5D=edit')

  await form.locator(headerSwitch).selectOption('textmedia')

  await expect(form.locator('[data-vperm-token="tt_content:assets"]')).toBeAttached()
  await expect(form.locator(headerSwitch)).toHaveValue('textmedia')
  expect(stored(databaseNumber, 'SELECT CType FROM tt_content WHERE uid = 1')).toBe('text')
})

test('switching the Type of a page the group may not change shows the fields of the new page type', async ({ page, databaseNumber }) => {
  const form = await openRecord(page, 'edit%5Bpages%5D%5B25%5D=edit')

  await form.locator(headerSwitch).selectOption('3')

  await expect(form.locator(await selectorFor(page, '[data-vperm-token="pages:link"]'))).toBeAttached()
  await expect(form.locator(headerSwitch)).toHaveValue('3')
  expect(stored(databaseNumber, 'SELECT doktype FROM pages WHERE uid = 25')).toBe(1)
})

test('switching the mode off shows the stored Type again', async ({ page }) => {
  const form = await openRecord(page, 'edit%5Btt_content%5D%5B1%5D=edit')
  await form.locator(headerSwitch).selectOption('textmedia')
  await expect(form.locator(headerSwitch)).toHaveValue('textmedia')

  await openControls(page)
  await switchOff(page)

  await expect(form.locator('select[name="data[tt_content][1][CType]"]')).toHaveValue('text')
})
