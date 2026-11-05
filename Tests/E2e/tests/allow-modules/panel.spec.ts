import { type Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { forgetSession } from '../../fixtures/session.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

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

  const granted = page.locator(`${preview} ${rows}`).first()

  await expect(granted).toBeAttached()
  await expect(granted).toHaveAttribute('data-vperm-verdict', 'allowed')
  await expect(page.locator(menu)).toHaveAttribute('inert', '')
})

test('the backend gets its own module menu back when the area is left', async ({ page }) => {
  await showModules(page)

  await expect(page.locator(preview)).toBeAttached()

  await pickArea(page, 'fields')

  await expect(page.locator('.vperm-granted')).toHaveCount(0)
  await expect(page.locator(menu)).not.toHaveAttribute('inert', '')
})

test('asking to add modules turns the panel to every module there is', async ({ page }) => {
  await showModules(page)
  const granted = await page.locator(`${preview} ${rows}`).count()

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const offered = page.locator(`${pick} ${rows}`)

  await expect(offered.first()).toBeAttached()
  expect(await offered.count()).toBeGreaterThan(granted)
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

test('a module marked to be added waits for the deed to be asked for', async ({ page }) => {
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
