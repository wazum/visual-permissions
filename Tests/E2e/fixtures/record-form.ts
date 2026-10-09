import type { FrameLocator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { pathFor } from './compatibility.js'
import { moduleContent } from './module-content.js'
import { verifyIfAsked } from './sudo-mode.js'

const pageRecord = 'a[href*="edit%5Bpages%5D"]'

/**
 * An area opens showing what the group has. The fields are given away on the other side of
 * the form, which the header's own button turns to.
 */
export const turnToFields = async (page: Page): Promise<void> => {
  const turn = moduleContent(page).locator('.vperm-head-button')

  await expect(turn).toBeVisible()
  await turn.click()
  // The form shows the other side only once the turn has it edge-on
  await expect(moduleContent(page).locator('body')).toHaveAttribute('data-vperm-face', 'pick')
  // A field pressed mid-turn scrolls under the sticky header; core's header shadow follows
  // the scroll position and never ends
  await expect.poll(async () => moduleContent(page).locator('body')
    .evaluate(body => body.ownerDocument.getAnimations()
      .filter(animation => animation.timeline === body.ownerDocument.timeline).length)).toBe(0)
}

export const giveMarkedFieldsAway = async (page: Page, form: FrameLocator): Promise<void> => {
  await expect(form.locator('.vperm-face-apply')).toBeEnabled()
  await verifyIfAsked(page, () => form.locator('.vperm-face-apply').click())

  await expect(form.locator('body'), 'the backend never took the change')
    .toHaveAttribute('data-vperm-face', 'preview', { timeout: 8000 })
}

export const openFirstPage = async (page: Page): Promise<FrameLocator> => {
  // Without a token, core opens the module inside the backend rather than on its own
  await page.goto(`${await pathFor(page, '/typo3/module/content/records')}?id=0`)

  const record = moduleContent(page).locator(pageRecord).first()

  await expect(record, 'the backend has no page to edit').toBeAttached()
  await record.click()
  await expect(moduleContent(page).locator('form[name="editform"]')).toBeAttached()

  return moduleContent(page)
}
