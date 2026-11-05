import type { Locator, Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { pathFor, selectorFor } from '../../fixtures/compatibility.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { pageTree, showTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a page in the tree cannot be moved while records and fields are picked', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  await expect(nodes.nth(2)).toBeVisible()
  await nodes.nth(2).dragTo(nodes.nth(1))

  await expect(page.locator('typo3-backend-modal')).toHaveCount(0)
})

test('a page in the tree offers no deletion by dragging while records and fields are picked', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  await nodes.nth(2).dragTo(nodes.nth(1))

  await expect(pageTree(page).locator('.node-dropzone-delete')).toHaveCount(0)
})

test('the menu of a page in the tree offers no deletion while records and fields are picked', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  await nodes.nth(1).click({ button: 'right' })

  await expect(page.getByRole('menuitem', { name: 'Info' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toHaveCount(0)
})

test('the page module offers to preview new content, not to create it, while permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  await nodes.nth(1).click()

  await expect(moduleContent(page).locator('typo3-backend-new-content-element-wizard-button').first())
    .toHaveText('Preview new content')
})

test('the form of new content closes without asking while permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  const pageId = await nodes.nth(1).getAttribute('data-id')
  await page.goto(`/typo3/record/edit?edit%5Btt_content%5D%5B${pageId ?? ''}%5D=new`)
  await expect(moduleContent(page).locator('body')).toHaveAttribute('data-vperm-face', 'preview')
  await moduleContent(page).locator('.t3js-editform-close').click()

  await expect(page.locator('typo3-backend-modal')).toHaveCount(0)
  await expect(moduleContent(page).locator('form[name="editform"]')).toHaveCount(0)
})

const showRecords = async (page: Page, shown: boolean): Promise<Locator> => {
  const records = `${await pathFor(page, '/typo3/module/content/records')}?id=25`

  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto(records)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  if (!shown) {
    await switchOff(page)
  }

  await page.goto(records)

  const rows = moduleContent(page).locator('tr[data-uid]')

  await expect(rows.locator("[title='Edit record']").first()).toBeVisible()

  return rows
}

const control = async (rows: Locator, selector: string): Promise<Locator> =>
  rows.locator(await selectorFor(rows.page(), selector))

test('the list of records offers no deletion while permissions are shown', async ({ page }) => {
  const rows = await showRecords(page, true)

  await expect(await control(rows, "[title='Delete']")).toHaveCount(0)
})

test('the list of records offers no hiding while permissions are shown', async ({ page }) => {
  const rows = await showRecords(page, true)

  await expect(await control(rows, "[title='Hide record']")).toHaveCount(0)
})

test('the list of records offers no new order while permissions are shown', async ({ page }) => {
  const rows = await showRecords(page, true)

  await expect(await control(rows, "[title='Move up in list'], [title='Move down in list']")).toHaveCount(0)
})

test('the list of records offers no copy while permissions are shown', async ({ page }) => {
  const rows = await showRecords(page, true)

  await expect(await control(rows, "[title='Copy'], [title='Cut']")).toHaveCount(0)
})

test('the list of records offers no new place while permissions are shown', async ({ page }) => {
  const rows = await showRecords(page, true)

  await expect(await control(rows, "[title='Re-position content element']")).toHaveCount(0)
})

test('the list of records that stands open offers no deletion once permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto(`${await pathFor(page, '/typo3/module/content/records')}?id=25`)
  const rows = moduleContent(page).locator('tr[data-uid]')
  await expect((await control(rows, "[title='Delete']")).first()).toBeAttached()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await expect(await control(rows, "[title='Delete']")).toHaveCount(0)
})

test('the menu of a record in the list offers no deletion while permissions are shown', async ({ page }) => {
  await showRecords(page, true)
  await moduleContent(page).locator("tr[data-table='tt_content']").first()
    .getByRole('button', { name: 'Open context menu' }).click()

  await expect(page.getByRole('menuitem', { name: 'Info' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toHaveCount(0)
})

test('the list of records offers every change again once permissions are hidden', async ({ page }) => {
  const rows = await showRecords(page, false)

  for (const selector of [
    "[title='Delete']",
    "[title='Hide record']",
    "[title='Move up in list'], [title='Move down in list']",
    "[title='Copy'], [title='Cut']",
    "[title='Re-position content element']",
  ]) {
    await expect((await control(rows, selector)).first()).toBeAttached()
  }
})

test('the page module offers to create new content again once permissions are hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const nodes = pageTree(page).locator(".node[data-id]:not([data-id='0'])")

  await nodes.first().locator('.node-toggle').click()
  await nodes.nth(1).click()

  const button = moduleContent(page).locator('typo3-backend-new-content-element-wizard-button').first()

  await expect(button).toHaveText('Preview new content')
  await switchOff(page)

  await expect(button).toHaveText('Create new content')
})
