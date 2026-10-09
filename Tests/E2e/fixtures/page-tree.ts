import { expect, type Locator, type Page } from '@playwright/test'
import { selectorFor } from './compatibility.js'
import { moduleContent } from './module-content.js'

const foldAway = 'typo3-backend-content-navigation-toggle[action="collapse"]'
const unfold = 'typo3-backend-content-navigation-toggle[action="expand"]'
const anyFold = 'typo3-backend-content-navigation-toggle'

const whereverItIs = (page: Page, selector: string): Locator[] =>
  [page.locator(selector), moduleContent(page).locator(selector)]

const countVisible = async (candidates: Locator[]): Promise<number> => {
  const counts = await Promise.all(candidates.map(async where =>
    where.evaluateAll(controls => controls.filter(control => control.checkVisibility()).length)))

  return counts.reduce((sum, count) => sum + count, 0)
}

const press = async (page: Page, selector: string): Promise<void> => {
  const candidates = whereverItIs(page, await selectorFor(page, selector))

  // Wait for module to arrive before checking count; control can be late
  await expect.poll(async () => countVisible(candidates)).toBeGreaterThan(0)

  for (const where of candidates) {
    if (await where.first().isVisible()) {
      await where.first().click()

      return
    }
  }
}

export const pageTree = (page: Page): Locator =>
  page.locator('typo3-backend-navigation-component-pagetree').first()

export const foldTree = async (page: Page): Promise<void> => press(page, foldAway)

export const unfoldTree = async (page: Page): Promise<void> => press(page, unfold)

export const showTree = async (page: Page): Promise<void> => {
  // A tree still on its way needs no unfolding; whichever arrives first decides.
  await expect.poll(async () => await pageTree(page).isVisible()
    || await countVisible(whereverItIs(page, await selectorFor(page, unfold))) > 0).toBe(true)

  if (!await pageTree(page).isVisible()) {
    await unfoldTree(page)
  }

  // Only a tree with branches is a valid work tree; branches must exist
  await expect(pageTree(page)).toBeVisible()
  await expect.poll(async () => pageTree(page).locator('.node').count()).toBeGreaterThan(0)
}

export const foldsOffered = async (page: Page): Promise<number> =>
  countVisible(whereverItIs(page, await selectorFor(page, anyFold)))
