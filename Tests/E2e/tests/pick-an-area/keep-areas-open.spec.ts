import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { selectorFor } from '../../fixtures/compatibility.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { foldTree, foldsOffered, pageTree, showTree, unfoldTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../fixtures/visual-mode.js'
const open = '#modulemenu [aria-controls][aria-expanded="true"]'
const shut = '#modulemenu .modulemenu-group-container.collapse:not(.show)'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('no framed area can be folded away while permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  // The tree must be there before offering the control; it's a domain rule
  await showTree(page)
  await expect(pageTree(page)).toBeVisible()

  expect(await foldsOffered(page)).toBeGreaterThan(0)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  expect(await foldsOffered(page), 'an area can still be folded away').toBe(0)

  await switchOff(page)

  expect(await foldsOffered(page)).toBeGreaterThan(0)
})

test('the page tree column can still be dragged wider while permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'pageMounts')

  const column = page.locator(await selectorFor(page, 'typo3-backend-content-navigation .panel--navigation'))
  const handle = page.locator(await selectorFor(page, 'typo3-backend-content-navigation .divider-handle'))
  const widthOf = async (where: typeof column): Promise<number> =>
    (await where.evaluate(element => Math.round(element.getBoundingClientRect().width)))

  await expect(handle).toBeVisible()

  const before = await widthOf(column)
  const grip = await handle.boundingBox()

  if (grip === null) {
    throw new Error('the drag handle has no box to take hold of')
  }

  const tabOverlap = await handle.evaluate(element => {
    const bar = document.querySelector('.vperm-tab-bar')?.getBoundingClientRect()

    return Math.round((bar?.bottom ?? 0) - element.getBoundingClientRect().top)
  })

  expect(tabOverlap, 'the handle runs up across the tabs').toBeLessThanOrEqual(0)

  const met = await handle.evaluate(element => {
    const box = element.getBoundingClientRect()
    const [x, y] = [box.left + box.width / 2, box.top + box.height / 2]
    let found = document.elementFromPoint(x, y)

    while (found?.shadowRoot) {
      const inside = found.shadowRoot.elementFromPoint(x, y)

      if (inside === null || inside === found) {
        break
      }

      found = inside
    }

    return found === element
  })

  expect(met, 'something of ours lies over the drag handle').toBe(true)

  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2)
  await page.mouse.down()
  await page.mouse.move(grip.x + 120, grip.y + grip.height / 2, { steps: 10 })
  await page.mouse.up()

  await expect.poll(async () => widthOf(column)).toBeGreaterThan(before)

  await expect.poll(async () => {
    const card = await page.locator('.vperm-tab-card').evaluate(
      element => Math.round(Number.parseFloat(getComputedStyle(element).getPropertyValue('--vperm-host-width'))),
    )

    return card
  }).toBe(await widthOf(column))

  await page.mouse.move(grip.x + 120, grip.y + grip.height / 2)
  await page.mouse.down()
  await page.mouse.move(grip.x + grip.width / 2, grip.y + grip.height / 2, { steps: 10 })
  await page.mouse.up()

  await expect.poll(async () => widthOf(column)).toBe(before)
  await switchOff(page)
})

for (const area of ['pageMounts', 'fields']) {
  test(`the page tree's drag handle can be taken hold of across its whole width while ${area} is picked`, async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 })
    await page.goto('/typo3/module/web/layout')
    await showTree(page)

    await openControls(page)
    await pickFirstGroup(page)
    await switchOn(page)
    await pickArea(page, area)

    const handle = page.locator(await selectorFor(page, 'typo3-backend-content-navigation .divider-handle'))

    await expect(handle).toBeVisible()

    const missed = await handle.evaluate(element => {
      const box = element.getBoundingClientRect()
      const y = box.top + box.height / 2
      const hit = (x: number): Element | null => {
        let found = document.elementFromPoint(x, y)

        while (found?.shadowRoot) {
          const inside = found.shadowRoot.elementFromPoint(x, y)

          if (inside === null || inside === found) {
            break
          }

          found = inside
        }

        return found
      }

      return Array.from({ length: Math.round(box.width) }, (_, step) => box.left + step + 0.5)
        .filter(x => hit(x) !== element)
        .map(Math.floor)
    })

    expect(missed, 'something of ours lies over part of the drag handle').toStrictEqual([])
  })

  test(`the page tree's drag handle looks the way core draws it while ${area} is picked`, async ({ page }) => {
    await page.setViewportSize({ width: 1600, height: 900 })
    await page.goto('/typo3/module/web/layout')
    await showTree(page)

    const handle = page.locator(await selectorFor(page, 'typo3-backend-content-navigation .divider-handle'))
    const hovered = async (): Promise<Buffer> => {
      const grip = await handle.boundingBox()

      if (grip === null) {
        throw new Error('the drag handle has no box to take hold of')
      }

      await page.mouse.move(grip.x + grip.width / 2, 500)

      return page.screenshot({ clip: { x: grip.x, y: 450, width: grip.width, height: 100 }, animations: 'disabled' })
    }

    const drawnByCore = await hovered()

    await page.mouse.move(800, 500)
    await openControls(page)
    await pickFirstGroup(page)
    await switchOn(page)
    await pickArea(page, area)

    expect((await hovered()).equals(drawnByCore), 'the drag handle looks different while permissions are shown').toBe(true)
  })
}

test('switching the mode on brings back a page tree that was folded away', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')

  const shown = pageTree(page)
  await showTree(page)
  await expect(shown).toBeVisible()

  await foldTree(page)
  await expect(shown, 'the page tree did not fold away').toBeHidden()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await expect(shown, 'the tree stayed folded, so its badge is out of reach').toBeVisible()

  await switchOff(page)

  await expect(shown).toBeHidden()

  await unfoldTree(page)
  await expect(shown).toBeVisible()
})

test('picking the module panel opens every module group', async ({ page }) => {
  await page.goto('/typo3/')

  // Groups must be closed first; the backend remembers open groups
  const groups = page.locator(open)
  for (let left = await groups.count(); left > 0; left = await groups.count()) {
    await groups.first().click()
  }

  await expect(page.locator(shut).first(), 'no group is shut to begin with').toBeAttached()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await pickArea(page, 'modules')

  await expect(page.locator(shut)).toHaveCount(0)

  // An area is left by picking another one, never by switching it off
  await pickArea(page, 'fields')

  await expect(page.locator(shut).first()).toBeAttached()
})

test('a group that cannot be shut stops pointing at anything', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'modules')

  const chevron = page.locator('#modulemenu [aria-controls] .modulemenu-indicator').first()
  const lines = async (): Promise<string[]> => chevron.evaluate(mark =>
    ['::before', '::after'].map(part => getComputedStyle(mark, part).display))

  expect(await lines(), 'a group still points at something it cannot do').toEqual(['none', 'none'])

  await pickArea(page, 'fields')

  expect(await lines()).toEqual(['block', 'block'])
})
