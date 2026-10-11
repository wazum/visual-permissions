import type { FrameLocator } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { turnToFields } from '../../fixtures/record-form.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
  await page.setViewportSize({ width: 1280, height: 600 })
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B1%5D=edit')
  await expect(moduleContent(page).locator('.t3js-formengine-field-item').first()).toBeAttached()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
})

const lastFieldClearsTheFoot = async (form: FrameLocator): Promise<void> => {
  const foot = form.locator('form[name="editform"] > .vperm-face-foot')
  await expect(foot).toBeVisible()

  const [fieldBottom, footTop] = await form.locator('body').evaluate(body => {
    const page = body.ownerDocument
    const view = page.defaultView
    ;[page.scrollingElement, ...page.querySelectorAll('*')]
      .filter(element => element !== null && view !== null && /auto|scroll/.test(view.getComputedStyle(element).overflowY))
      .concat(page.scrollingElement)
      .forEach(element => { element?.scrollTo({ top: element.scrollHeight, behavior: 'instant' }) })
    const fields = [...page.querySelectorAll('.tab-pane.active [data-vperm-token]')].filter(field => field.checkVisibility())
    const last = fields[fields.length - 1]?.getBoundingClientRect().bottom ?? 0
    const footing = page.querySelector('form[name="editform"] > .vperm-face-foot')?.getBoundingClientRect().top ?? 0

    return [last, footing]
  })

  expect(fieldBottom).toBeLessThanOrEqual(footTop)
}

test('the last field scrolls clear of the foot on the side that shows what the group has', async ({ page }) => {
  await lastFieldClearsTheFoot(moduleContent(page))
})

test('the last field scrolls clear of the foot on the assign side', async ({ page }) => {
  await turnToFields(page)

  await lastFieldClearsTheFoot(moduleContent(page))
})
