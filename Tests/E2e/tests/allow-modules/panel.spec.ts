import { type Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { selectorFor } from '../../fixtures/compatibility.js'
import { pickGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { openControls, showPermissions, switchOn } from '../../fixtures/visual-mode.js'

const menu = '#modulemenu'
const preview = '.vperm-face-preview'
const pick = '.vperm-face-pick'
const rows = '[data-modulemenu-identifier]:not([aria-controls])'

const showModules = async (page: Page): Promise<void> => {
  await page.goto('/typo3/')
  await showPermissions(page, 'modules')
}

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('picking the modules area turns the panel to what the group may open', async ({ page }) => {
  await showModules(page)

  const allowed = page.locator(`${preview} ${rows}`).first()

  await expect(allowed).toBeAttached()
  await expect(allowed).toHaveAttribute('data-vperm-verdict', 'allowed')
  await expect(page.locator(menu)).toHaveAttribute('inert', '')
})

test('a group allowed the record list sees it among what it may open', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickGroup(page, 'News Office')
  await switchOn(page)
  await pickArea(page, 'modules')

  await expect(page.locator(`${preview} ${await selectorFor(page, '[data-modulemenu-identifier="records"]')}`))
    .toHaveAttribute('data-vperm-verdict', 'allowed')
})

test('the backend gets its own module menu back when the area is left', async ({ page }) => {
  await showModules(page)

  await expect(page.locator(preview)).toBeAttached()

  await pickArea(page, 'fields')

  await expect(page.locator('.vperm-allowed')).toHaveCount(0)
  await expect(page.locator(menu)).not.toHaveAttribute('inert', '')
})

test('asking to allow modules turns the panel to every module there is', async ({ page }) => {
  await showModules(page)
  const allowed = await page.locator(`${preview} ${rows}`).count()

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const offered = page.locator(`${pick} ${rows}`)

  await expect(offered.first()).toBeAttached()
  expect(await offered.count()).toBeGreaterThan(allowed)
})

test('a module outside the menu ticked and allowed is one the group may open', async ({ page }) => {
  await showModules(page)
  await page.locator(`${preview} .vperm-face-bar button`).click()

  const choose = page.locator(pick).getByRole('button', { name: 'Choose modules outside the menu' })
  const dialog = page.getByRole('dialog')
  const about = dialog.getByRole('checkbox', { name: /About TYPO3/ })

  await choose.click()
  await expect(about).not.toBeChecked()
  await about.check()
  const apply = dialog.getByRole('button', { name: 'Apply' })
  await verifyIfAsked(page, () => apply.click())
  await expect(apply).toBeHidden({ timeout: 8000 })

  await choose.click()

  await expect(about).toBeChecked()
})

test('the list of every module scrolls inside its face', async ({ page }) => {
  await showModules(page)
  await page.locator(`${preview} .vperm-face-bar button`).click()
  await expect(page.locator(`${pick} ${rows}`).first()).toBeAttached()

  const list = page.locator(`${pick} .vperm-face-scroll`)

  await expect(list).toHaveCSS('overflow-y', 'auto')
  expect(await list.evaluate(scroll => scroll.scrollHeight - scroll.clientHeight))
    .toBeGreaterThan(0)
})

test('a module marked to be allowed waits for the deed to be asked for', async ({ page }) => {
  await showModules(page)
  await page.locator(`${preview} .vperm-face-bar button`).click()

  const add = page.locator(`${pick} .vperm-face-apply`)

  await expect(add).toBeDisabled()

  await page.locator(`${pick} ${rows}[data-vperm-verdict="denied"]`).first().click()

  await expect(add).toBeEnabled()
})

test('the keyboard leaves the picking face for the one it came from', async ({ page }) => {
  await showModules(page)
  await page.locator(`${preview} .vperm-face-bar button`).click()

  await expect(page.locator('.vperm-coin-turned')).toBeAttached()

  await page.keyboard.press('Escape')

  await expect(page.locator('.vperm-coin-turned')).toHaveCount(0)
})

test('the panel turns without moving where the browser asks for less motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await showModules(page)

  await expect(page.locator('.vperm-panel-card')).toHaveCSS('transition-duration', '0s')
})

test('the panel shows its bar at once where the browser asks for less motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await showModules(page)

  await expect(page.locator(`${preview} .vperm-face-bar`)).toHaveCSS('transition-delay', '0s')
})
