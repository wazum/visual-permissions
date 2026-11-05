import type { Page } from '@playwright/test'
import { administrator } from './database.js'

export const verifyIfAsked = async (page: Page, write: () => Promise<void>): Promise<void> => {
  const password = page.locator('typo3-backend-modal input[type="password"]').first()
  const taken = page.waitForResponse(response => response.request().method() === 'POST'
    && response.url().includes('/visual-permissions/')
    && response.ok())

  await write()

  const asked = await Promise.race([
    password.waitFor({ state: 'visible' }).then(() => true, () => false),
    taken.then(() => false, () => false),
  ])
  if (!asked) {
    return
  }

  await password.fill(administrator().password)
  await page.locator('typo3-backend-modal button[name="verify"]').first().click()
  await password.waitFor({ state: 'hidden' })
}
