import { expect, test } from '../../../fixtures/test.js'
import { pickArea } from '../../../fixtures/areas.js'
import { openFirstPage } from '../../../fixtures/record-form.js'
import { pickFirstGroup } from '../../../fixtures/groups.js'
import { forgetSession } from '../../../fixtures/session.js'
import { openControls, switchOn } from '../../../fixtures/visual-mode.js'
const save = 'button[name="_savedok"]'
const close = '.t3js-editform-close'
const textField = 'input[data-formengine-input-name]'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the permission view takes saving away and leaves the way out', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)
  await expect(form.locator(save)).toBeVisible()

  await openControls(page)
  await switchOn(page)

  // The mode lands on the screen the admin stands on, so this form is already the area
  await pickArea(page, 'fields')

  await expect(form.locator(save)).toBeHidden()
  await expect(form.locator(close)).toBeVisible()

  // An area is left by picking another one, never by switching it off
  await pickArea(page, 'modules')

  await expect(form.locator(save)).toBeVisible()
})

test('a field cannot be typed into while the form is picked to work in', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)
  const field = form.locator(textField).first()

  await expect(field).toBeEditable()

  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  // Out of the way rather than switched off: it takes neither pointer nor keyboard, and
  // keeps what it held
  const held = await field.inputValue()

  await field.click({ force: true })
  await page.keyboard.type('nonsense')

  expect(await field.inputValue(), 'a field out of play was typed into').toBe(held)
  expect(await field.evaluate(each => each === each.ownerDocument.activeElement)).toBe(false)

  await pickArea(page, 'modules')

  await expect(field).toBeEditable()
})
