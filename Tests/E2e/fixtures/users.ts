import { expect, type Page } from '@playwright/test'

export const viewAsButton = '[data-vperm-view-as]'

export const anyWayBack = 'typo3-backend-switch-user[mode="exit"]'

export const exitButton = `.topbar-site-container ${anyWayBack}`

const visiblePicker = 'vperm-picker:visible'

/**
 * Handing the session over is a request first and a page load after it, so the press is not
 * over when it returns.
 *
 * The backend must be quiet before it: a request still on its way carries the session about
 * to be replaced, so the backend answers it with the login screen, and that answer clears
 * the cookie the handover just set.
 *
 * And it lands twice: the backend brings the admin to its own start, and the screen they
 * were reading is gone to from there.
 */
const backendReturns = async (page: Page, press: () => Promise<void>): Promise<void> => {
  await page.waitForLoadState('networkidle')

  const arrived = page.waitForEvent('framenavigated', frame => frame === page.mainFrame())

  await press()
  await arrived
  await page.waitForLoadState('networkidle')
}

/**
 * Opens the picker and takes the first user it offers, which hands the session over. The
 * list is asked for when the picker opens, so the rows arrive a moment later.
 */
export const viewAsFirstUser = async (page: Page): Promise<string> => {
  await page.locator(viewAsButton).click()

  const first = page.locator(`${visiblePicker} .vperm-picker-list [role="option"]`).first()

  await expect(first, 'the backend has nobody to view as').toBeVisible()

  const name = ((await first.locator('span').first().textContent()) ?? '').trim()

  await backendReturns(page, async () => { await first.click() })

  return name
}

export const comeBackFromUser = async (page: Page): Promise<void> => {
  await backendReturns(page, async () => { await page.locator(exitButton).click() })
}

export const comeBackByPressingItDirectly = async (page: Page): Promise<void> => {
  await backendReturns(page, async () => {
    await page.locator(exitButton).evaluate(button => { (button as HTMLElement).click() })
  })
}
