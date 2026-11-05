import type { Page } from '@playwright/test'

export const forgetSession = async (page: Page): Promise<void> => {
  await page.goto('/typo3/')
  await page.evaluate(async () => {
    const Persistent = (await import('@typo3/backend/storage/persistent.js')).default

    await Persistent.set('vperm.session', { version: 1, active: false, groupId: null, area: null })
    await Persistent.set('vperm.returnTo', { place: '' })
  })
  await page.goto('/typo3/')
}
