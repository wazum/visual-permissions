import { type Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { selectorFor } from '../../fixtures/compatibility.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { pageTree, showTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../fixtures/visual-mode.js'
const frame = '.vperm-frame'
const tab = '.vperm-tab'

const framed = async (page: Page): Promise<number> =>
  page.locator(frame).evaluateAll(hosts => hosts.filter(host => host.checkVisibility()).length)

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('every framed area makes the same room for the bar and draws its own top edge', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await expect(pageTree(page)).toBeVisible()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  // The bar has a tab per area, and an area whose column is off screen has one too
  await expect(page.locator(tab)).toHaveCount(5)

  const surfaces = await selectorFor(page, '#typo3-contentIframe, .sidebar-container, .tree-toolbar')
  const drawn = await page.locator(frame).evaluateAll((hosts, surfaceOf) => hosts.filter(host => host.checkVisibility()).map(host => {
    const box = host.getBoundingClientRect()
    const band = Number.parseFloat(getComputedStyle(host).paddingBlockStart) || 0
    const rule = getComputedStyle(host, '::before')
    const armed = host.hasAttribute('data-vperm-armed')
    const surface = host.querySelector(surfaceOf)?.getBoundingClientRect()

    return {
      area: host.getAttribute('data-vperm-area'),
      line: Math.round(box.top + band),
      // Armed area leaves the drawn line to the card that owns it
      drawn: armed ? 'card' : rule.backgroundColor,
      content: surface === undefined ? null : Math.round(surface.top - box.top - band),
    }
  }), surfaces)

  expect(drawn, 'the module panel, the page tree and the module area are framed').toHaveLength(3)

  const first = drawn[0]

  drawn.forEach(area => {
    expect(area.line, `the ${area.area ?? '?'} area keeps room of its own for the bar`).toBe(first?.line)
    expect(area.content, `the ${area.area ?? '?'} area starts its content elsewhere`).toBe(first?.content)
    expect(area.drawn, `the ${area.area ?? '?'} area draws no edge of its own`).not.toBe('rgba(0, 0, 0, 0)')
  })

  // One area is armed; its line under the tab belongs to its card
  expect(drawn.filter(area => area.drawn === 'card'), 'more than one area is armed').toHaveLength(1)
})

test('every area is framed again after a page load', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await page.goto('/typo3/module/web/layout')

  await expect.poll(async () => framed(page), { message: 'an area lost its brackets on the way' }).toBe(3)
})

test('the area under inspection is framed, and left alone again afterwards', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  await expect(page.locator(frame)).toHaveCount(0)

  await switchOn(page)

  await expect(page.locator(`${frame} #typo3-contentIframe`)).toBeAttached()
  await expect(page.locator(`${frame}[data-vperm-area="fields"]`)).toHaveAttribute('data-vperm-ground', 'module')

  await switchOff(page)

  await expect(page.locator(frame)).toHaveCount(0)
})
