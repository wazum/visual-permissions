import { expect, test } from '../../fixtures/test.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { openFirstPage, turnToFields } from '../../fixtures/record-form.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a change asked for once is written once the password is given', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const denied = form.locator('[data-vperm-verdict="denied"][role="switch"]').filter({ visible: true }).first()
  const field = form.locator(`[data-vperm-token="${await denied.getAttribute('data-vperm-token') ?? ''}"]`)
  await denied.click()

  await verifyIfAsked(page, () => form.locator('.vperm-face-apply').click())

  await expect(field).toHaveAttribute('data-vperm-verdict', 'allowed')
})
