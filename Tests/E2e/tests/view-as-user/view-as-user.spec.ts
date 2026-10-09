import { expect, test } from '../../fixtures/test.js'
import { pathFor } from '../../fixtures/compatibility.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { forgetSession } from '../../fixtures/session.js'
import { showTree } from '../../fixtures/page-tree.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import {
  anyWayBack,
  comeBackByPressingItDirectly,
  comeBackFromUser,
  viewAsButton,
  exitButton as ourWayBack,
  viewAsFirstUser,
} from '../../fixtures/users.js'
import { openControls, switchOn, groupButton, toggleButton } from '../../fixtures/visual-mode.js'

const marked = '[data-modulemenu-identifier][aria-current="location"]'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

// The group and mode must persist through user switches for admin workflow
test('the group and the mode survive switching to a user and back', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  const group = await pickFirstGroup(page)

  await switchOn(page)

  for (const turn of [1, 2]) {
    await viewAsFirstUser(page)
    await expect(page.locator(ourWayBack), `turn ${String(turn)}`).toBeVisible()
    await comeBackFromUser(page)

    await openControls(page)
    await expect(page.locator(groupButton), `the group was lost on turn ${String(turn)}`)
      .toHaveText(group)
    await expect(page.locator(toggleButton), `the mode was lost on turn ${String(turn)}`)
      .toHaveAttribute('aria-pressed', 'true')
  }

  expect(group).not.toBe('')
})

// Session writes as current user; ours are lost if handed over
test('writes nothing of ours while the session is handed over', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await viewAsFirstUser(page)

  await expect(page.locator(ourWayBack)).toBeAttached()

  const held = await page.evaluate(async () => {
    const Persistent = (await import('@typo3/backend/storage/persistent.js')).default
    const onArrival = JSON.stringify(Persistent.get('vperm') ?? null)

    await new Promise(settled => { setTimeout(settled, 1500) })

    return { onArrival, later: JSON.stringify(Persistent.get('vperm') ?? null) }
  })

  expect(held.later, 'our settings were written into the switched user own').toBe(held.onArrival)

  await comeBackFromUser(page)
  await expect(page.locator(anyWayBack)).toHaveCount(0)
})

test('the way back ends where the View as button ended', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)

  const rightEdgeOf = async (what: string): Promise<number> =>
    page.locator(what).evaluate(element => Math.round(element.getBoundingClientRect().right))

  const view = await rightEdgeOf(viewAsButton)

  await viewAsFirstUser(page)
  await expect(page.locator(ourWayBack)).toBeVisible()

  expect(await rightEdgeOf(ourWayBack)).toBe(view)

  await comeBackFromUser(page)
  await expect(page.locator(anyWayBack)).toHaveCount(0)
})

test('the switched user finds the way back in the header', async ({ page }) => {
  await page.goto('/typo3/')

  // The way back is measured against the screen they were on, not a module name
  const cameFrom = await page.locator(marked).getAttribute('data-modulemenu-identifier')

  await openControls(page)
  await viewAsFirstUser(page)

  await expect(page.locator(ourWayBack)).toBeVisible()
  await expect(page.locator(`#typo3-cms-backend-backend-toolbaritems-usertoolbaritem ${anyWayBack}`))
    .toHaveCount(1)

  await comeBackFromUser(page)

  await expect(page.locator(anyWayBack)).toHaveCount(0)
  await expect(page.locator(marked)).toHaveAttribute('data-modulemenu-identifier', cameFrom ?? '')
})

test('brings the user being read back to the screen they were read on', async ({ page }) => {
  const records = await pathFor(page, '/typo3/module/content/records')
  await page.goto(records)

  await openControls(page)
  await viewAsFirstUser(page)
  await expect(page.locator(ourWayBack)).toBeVisible()

  await page.locator('[data-modulemenu-identifier="web_layout"]').click()
  await expect(page).toHaveURL(/module\/web\/layout/)
  await comeBackFromUser(page)

  await expect(page).toHaveURL(new RegExp(records), { timeout: 20000 })
  await openControls(page)

  await viewAsFirstUser(page)
  await expect(page.locator(ourWayBack)).toBeVisible()

  await expect(page, 'the user was landed on their own start page')
    .toHaveURL(/module\/web\/layout/, { timeout: 20000 })
  await expect(page.locator(marked).last())
    .toHaveAttribute('data-modulemenu-identifier', 'web_layout')

  await comeBackFromUser(page)
  await expect(page.locator(anyWayBack)).toHaveCount(0)
})

// The user has no mount, so no page is theirs to see; the last place they were read on can be
// such a page once a mount is taken from them
test('opens a module without a page the user may not see', async ({ page }) => {
  await page.goto('/typo3/')

  await openControls(page)
  await viewAsFirstUser(page)
  await expect(page.locator(ourWayBack)).toBeVisible()

  await page.goto('/typo3/module/web/layout?id=25')

  await expect(page.locator(ourWayBack)).toBeVisible()
  await expect(moduleContent(page).locator('body')).not.toContainText('You don\'t have access to this page')
  await expect(page.locator(marked).last()).toHaveAttribute('data-modulemenu-identifier', 'web_layout')

  await comeBackFromUser(page)
  await expect(page.locator(anyWayBack)).toHaveCount(0)
})

test('comes back to the screen the admin left, backend and all', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await viewAsFirstUser(page)

  await expect(page.locator(ourWayBack)).toBeAttached()
  await comeBackByPressingItDirectly(page)

  await expect(page).toHaveURL(/module\/web\/layout/, { timeout: 20000 })
  await expect(page.locator('typo3-backend-navigation-component-pagetree')).toBeVisible()
  await expect(page.locator('[data-vperm-view-as]')).toBeAttached()
})
