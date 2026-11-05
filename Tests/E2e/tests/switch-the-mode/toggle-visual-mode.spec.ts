import { expect, test } from '../../fixtures/test.js'
import { cursorOver } from '../../fixtures/buttons.js'
import { pathFor } from '../../fixtures/compatibility.js'
import { forgetSession } from '../../fixtures/session.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import {
  openControls,
  switchOff,
  switchOn,
  groupButton,
  toggleButton,
} from '../../fixtures/visual-mode.js'

const activeBody = 'body[data-vperm-active]'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the switch shows the permissions and hides them again', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await switchOn(page)
  await expect(page.locator(activeBody)).toBeAttached()

  await switchOff(page)
  await expect(page.locator(activeBody)).not.toBeAttached()
})

// With no group there is nothing to show, and the switch says so under the pointer
test('the switch shows it cannot be pressed before a group is picked', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  await expect(page.locator(toggleButton)).toBeDisabled()
  expect(await cursorOver(page.locator(toggleButton))).toBe('not-allowed')
})

test('a keyboard shortcut switches the mode without reaching for the controls', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await page.keyboard.press('ControlOrMeta+Shift+u')
  await expect(page.locator(activeBody)).toBeAttached()

  await page.keyboard.press('ControlOrMeta+Shift+u')
  await expect(page.locator(activeBody)).not.toBeAttached()
})

test('the keyboard shortcut works right after picking a group', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.locator(groupButton).focus()

  await page.keyboard.press('ControlOrMeta+Shift+u')

  await expect(page.locator(activeBody)).toBeAttached()
})

test('the module document carries the mark too, so the same styles reach into it', async ({ page }) => {
  await page.goto('/typo3/module/web/layout')
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const inner = page.frameLocator('#typo3-contentIframe').locator(activeBody)
  await expect(inner).toBeAttached()

  await page.goto(await pathFor(page, '/typo3/module/content/records'))
  await expect(inner, 'the module that came with the page load carries no mark').toBeAttached()

  await openControls(page)
  await switchOff(page)
  await expect(inner).not.toBeAttached()
})

test('the mode is still on after a page load', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await page.goto(await pathFor(page, '/typo3/module/content/records'))

  await expect(page.locator(activeBody)).toBeAttached()
  await expect(page.locator(toggleButton)).toHaveAttribute('aria-pressed', 'true')
})
