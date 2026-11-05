import { expect, type Page } from '@playwright/test'
import { pickArea } from './areas.js'
import { pickFirstGroup } from './groups.js'
import { settingsWrittenBy } from './settings.js'

// Domain rule: controls' positions and reach are defined here, not in specs
export const groupButton = '[data-vperm-group]'
export const toggleButton = '[data-vperm-toggle]'
export const toolbarButton = '[data-vperm-toolbar]'

export const openControls = async (page: Page): Promise<void> => {
  if (await page.locator(groupButton).isHidden()) {
    await page.locator(toolbarButton).click()
  }

  await expect(page.locator(groupButton)).toBeVisible()
}

export const closeControls = async (page: Page): Promise<void> => {
  await page.locator(toolbarButton).click()
  await expect(page.locator(groupButton)).toBeHidden()
}

// Switch only pressed if not already in desired state; state persists across page loads
const switchTo = async (page: Page, on: boolean): Promise<void> => {
  const toggle = page.locator(toggleButton)
  const wanted = String(on)

  if (await toggle.getAttribute('aria-pressed') !== wanted) {
    await settingsWrittenBy(page, async () => toggle.click())
  }

  await expect(toggle).toHaveAttribute('aria-pressed', wanted)
}

export const switchOn = async (page: Page): Promise<void> => switchTo(page, true)

export const switchOff = async (page: Page): Promise<void> => switchTo(page, false)

/**
 * The whole way in: the controls open, a group to show, the mode on, and the area to work
 * in. Returns the group's title, since a spec often asserts what is said about it.
 */
export const showPermissions = async (page: Page, area?: string): Promise<string> => {
  await openControls(page)

  const title = await pickFirstGroup(page)

  await switchOn(page)

  if (area !== undefined) {
    await pickArea(page, area)
  }

  return title
}
