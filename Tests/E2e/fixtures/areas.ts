import { expect, type Page } from '@playwright/test'

const tab = '.vperm-tab'

export const pickArea = async (page: Page, area: string): Promise<void> => {
  const picked = page.locator(`${tab}[data-vperm-area="${area}"]`)

  if (await picked.getAttribute('aria-selected') !== 'true') {
    await picked.click()
  }

  await expect(picked).toHaveAttribute('aria-selected', 'true')
}
