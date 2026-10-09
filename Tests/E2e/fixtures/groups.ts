import { expect, type Locator, type Page } from '@playwright/test'
import { settingsWrittenBy } from './settings.js'

export const shownGroup = (page: Page): Locator => page.locator('[data-vperm-group]')

export const pickGroup = async (page: Page, title: string): Promise<void> => {
  const button = page.locator('[data-vperm-group]')

  await button.click()
  await settingsWrittenBy(page, async () => page.locator('vperm-picker:visible .vperm-picker-list [role="option"]')
    .filter({ has: page.getByText(title, { exact: true }) }).click())

  await expect(button).toHaveText(title)
}

export const pickFirstGroup = async (page: Page): Promise<string> => {
  const button = page.locator('[data-vperm-group]')

  await button.click()

  const first = page.locator('vperm-picker:visible .vperm-picker-list [role="option"]').first()

  await expect(first, 'the backend has no group to inspect').toBeVisible()

  const title = ((await first.locator('span').first().textContent()) ?? '').trim()

  if (((await button.textContent()) ?? '').trim() === title) {
    await first.click()
  } else {
    await settingsWrittenBy(page, async () => first.click())
  }

  await expect(button).toHaveText(title)

  return title
}
