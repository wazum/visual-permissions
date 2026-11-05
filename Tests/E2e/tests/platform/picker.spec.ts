import { expect, test } from '../../fixtures/test.js'
import { forgetSession } from '../../fixtures/session.js'
import { viewAsButton } from '../../fixtures/users.js'
import { openControls, groupButton } from '../../fixtures/visual-mode.js'

const moduleFrame = '#typo3-contentIframe'

const open = async (page: import('@playwright/test').Page): Promise<void> => {
  await page.locator(groupButton).click()
  await expect(page.locator(groupButton)).toHaveAttribute('aria-expanded', 'true')
}

const closed = async (page: import('@playwright/test').Page): Promise<void> => {
  await expect(page.locator(groupButton)).toHaveAttribute('aria-expanded', 'false')
}

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
  await page.goto('/typo3/module/web/layout')
  await openControls(page)
})

test('the button that opened the panel closes it again', async ({ page }) => {
  await open(page)

  await page.locator(groupButton).click()

  await closed(page)
})

test('a press in the module closes the panel', async ({ page }) => {
  await open(page)

  const box = await page.locator(moduleFrame).boundingBox()

  await page.mouse.click((box?.x ?? 0) + 40, (box?.y ?? 0) + (box?.height ?? 0) - 40)

  await closed(page)
})

test('escape closes the panel', async ({ page }) => {
  await open(page)

  await page.keyboard.press('Escape')

  await closed(page)
})

// First press empties the field, then the panel closes
test('escape clears what was typed before it closes the panel', async ({ page }) => {
  await open(page)
  await page.locator('vperm-picker:visible input').fill('edit')

  await page.keyboard.press('Escape')

  await expect(page.locator('vperm-picker:visible input')).toHaveValue('')
  await expect(page.locator(groupButton)).toHaveAttribute('aria-expanded', 'true')

  await page.keyboard.press('Escape')

  await closed(page)
})

test('a group taken out of a user pane is the one on screen', async ({ page }) => {
  await page.locator(viewAsButton).click()

  const group = page
    .locator('vperm-picker:visible .vperm-picker-detail [role="option"]').first()

  await expect(group, 'the first user is in no group').toBeVisible()
  const title = ((await group.textContent()) ?? '').trim()

  await group.click()

  await expect(page.locator(groupButton)).toHaveText(title)
})
