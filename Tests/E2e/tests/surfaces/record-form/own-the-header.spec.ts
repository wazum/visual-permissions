import { expect, test } from '../../../fixtures/test.js'
import { pickArea } from '../../../fixtures/areas.js'
import { onOlderCore, selectorFor } from '../../../fixtures/compatibility.js'
import { moduleContent } from '../../../fixtures/module-content.js'
import { openFirstPage, turnToFields } from '../../../fixtures/record-form.js'
import { pickFirstGroup } from '../../../fixtures/groups.js'
import { forgetSession } from '../../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../../fixtures/visual-mode.js'

const ourLine = '.vperm-head-bar'
const close = '.t3js-editform-close'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the language menu stands in the row of the buttons', async ({ page }) => {
  test.skip(!(await onOlderCore(page)), '14.3 keeps the language menu at the right of its header')

  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-show-menu ~ * select[name="_langSelector"]')).toBeVisible()

  await switchOff(page)

  await expect(form.locator('.module-docheader-bar-navigation select[name="_langSelector"]')).toBeVisible()
})

test('the assign side offers no language menu', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)
  const languages = form.locator(await selectorFor(page, '.module-docheader-navigation > .module-docheader-column:last-child > *'))

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(languages).toBeVisible()

  await turnToFields(page)

  await expect(languages).toBeHidden()
})

// A record of a table the group may not write has no field to give, and no other side
test('a record the group cannot reach offers no way to the fields', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-head-bar')).toBeVisible()
  await expect(form.locator('.vperm-head-button')).toHaveCount(0)
})

test('a record the group cannot reach opens as the group gets it', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await openFirstPage(page)
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await turnToFields(page)

  const form = moduleContent(page)

  await form.locator('body').evaluate(body => {
    const url = new URL(body.ownerDocument.location.href)
    url.search = `token=${url.searchParams.get('token') ?? ''}&edit%5Bsys_file_reference%5D%5B1%5D=edit`
    body.ownerDocument.location.href = url.href
  })

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await expect(form.locator('body')).toHaveAttribute('data-vperm-face', 'preview')
})

// Such a record shows the same however it is read
test('a record the group cannot reach offers no ways to read it', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Bsys_file_reference%5D%5B1%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator('.vperm-head-bar')).toBeVisible()
  await expect(form.locator('.vperm-show-menu')).toHaveCount(0)
})

test('the header of a form we have taken over names the group and keeps the way out', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  const group = await pickFirstGroup(page)
  const form = await openFirstPage(page)
  const path = await selectorFor(page, 'typo3-breadcrumb')
  const controls = await selectorFor(page, '.module-docheader-buttons :is(button, a)')

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(form.locator(ourLine)).toContainText(group)
  await expect(form.locator(path), 'the path says where the record stands').toBeVisible()
  await expect(form.locator(close)).toBeVisible()
  // The way out, and the two of ours beside it: nothing of the record's own is left
  await expect(form.locator(controls).filter({ visible: true })).toHaveCount(3)

  await pickArea(page, 'modules')

  await expect(form.locator(ourLine)).toBeHidden()
  await expect(form.locator(controls).filter({ visible: true }).nth(1)).toBeVisible()
})

// The area opens showing what the group has, and the fields are given on the other side
test('the form shows what the group gets, and every field on the other side', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)
  // What only other kinds of record show is listed apart, and is no field of this record
  const fields = form.locator('[data-vperm-token]:not(.vperm-other-kinds *)')

  await expect(fields.first()).toBeAttached()

  const all = await fields.count()

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  const shown = async (): Promise<number> =>
    fields.evaluateAll(each => each.filter(field => field.closest('[hidden]') === null).length)

  await expect.poll(shown, { message: 'the preview shows the whole form' }).toBeLessThan(all)

  await turnToFields(page)

  await expect.poll(shown, { message: 'the other side keeps something back' }).toBe(all)
})

test('a module that shows no form keeps its own header', async ({ page }) => {
  await page.goto('/typo3/module/web/layout')

  const layout = moduleContent(page)
  const hidden = layout.locator('.module-docheader [hidden]')

  await expect(layout.locator('.module-docheader').first()).toBeVisible()
  const hiddenByCore = await hidden.count()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  await expect(layout.locator(ourLine)).toBeHidden()
  await expect(hidden, 'we took something off a header of core\'s').toHaveCount(hiddenByCore)
})
