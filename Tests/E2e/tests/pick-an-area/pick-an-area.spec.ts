import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { cursorOver } from '../../fixtures/buttons.js'
import { selectorFor } from '../../fixtures/compatibility.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { showTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, showPermissions, switchOff, switchOn } from '../../fixtures/visual-mode.js'
const tab = '.vperm-tab'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a reload keeps the area that was picked', async ({ page }) => {
  await page.goto('/typo3/module/file/list')
  await showPermissions(page, 'fileMounts')

  await page.reload()

  await expect(page.getByRole('tab', { name: 'File mounts' })).toHaveAttribute('aria-selected', 'true')
})

test('every framed area carries a tab that names what it grants', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await expect(page.locator(tab))
    .toHaveText(['Modules', 'Page mounts', 'File mounts', 'Records and fields', 'Other permissions'])

  await switchOff(page)

  await expect(page.locator(tab)).toHaveCount(0)
})

// A tab starts where its column starts; it is the top edge of its column. A tab whose area
// has no column on screen shares one, and follows the tab before it.
test('every tab stands at the left edge of the area it belongs to', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const placed = await page.locator(tab).evaluateAll(tabs => tabs.map(each => {
    const area = each.getAttribute('data-vperm-area') ?? ''
    const host = document.querySelector(`.vperm-frame[data-vperm-area="${area}"]`)
    // Columns are divided by a line; tab stands on that pixel; use CSS pixel value
    const divider = Number.parseFloat(getComputedStyle(document.body).getPropertyValue('--vperm-divider')) || 0

    return {
      area,
      start: Math.round(each.getBoundingClientRect().left + divider),
      column: host === null ? -1 : Math.round(host.getBoundingClientRect().left),
      elsewhere: each.hasAttribute('data-vperm-elsewhere'),
    }
  }))

  expect(placed).toHaveLength(5)

  placed.forEach((each, place) => {
    if (each.elsewhere) {
      expect(each.start, `the ${each.area} tab shares a column and stands on top of its neighbour`)
        .toBeGreaterThan(placed[place - 1]?.start ?? 0)

      return
    }

    expect(each.start, `the ${each.area} tab stands away from its own column`).toBe(each.column)
  })
})

test('a module opened from the toolbar stays open while permissions are shown', async ({ page }) => {
  await page.goto('/typo3/module/web/layout?id=25')
  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await page.locator('.toolbar-item [data-moduleroute-identifier="about"]').evaluate(link => { (link as HTMLElement).click() })
  await expect(page).toHaveURL(/\/module\/help\/about/)
  await page.waitForTimeout(1000)

  await expect(page).toHaveURL(/\/module\/help\/about/)
})

test('the page module offers no other way to view the page while permissions are shown', async ({ page }) => {
  await page.goto('/typo3/module/web/layout?id=25')

  const views = moduleContent(page).locator(await selectorFor(page, '.module-docheader-buttons .btn-group:has(.dropdown-item[href*="viewMode="])'))

  await expect(views).toBeVisible()

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  await expect(views).toBeHidden()

  await switchOff(page)

  await expect(views).toBeVisible()
})

// Permissions are being set, not pages made: the pages the tree offers to drag in wait until the mode is off
test('the page tree offers no page to drag in while permissions are shown', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  expect(await cursorOver(page.locator('typo3-backend-navigation-component-pagetree .tree-toolbar__drag-node').first()))
    .toBe('not-allowed')
})

// The header's controls and the tabs below them start on one line, at the end of the module panel
test('the group to show starts where the page tree tab starts', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const startOf = async (selector: string): Promise<number> =>
    page.locator(selector).evaluate(element => Math.round(element.getBoundingClientRect().left))

  expect(await startOf('[data-vperm-group]')).toBe(await startOf(`${tab}[data-vperm-area="pageMounts"]`))
})

// Core cuts a long name short in its own header, and it does not push what follows away
test('the group to show starts where the page tree tab starts, however long the site is named', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await page.locator('.topbar-site-name').evaluate(name => { name.textContent = 'A site with a name far longer than its room' })

  const startOf = async (selector: string): Promise<number> =>
    page.locator(selector).evaluate(element => Math.round(element.getBoundingClientRect().left))

  expect(await startOf('[data-vperm-group]')).toBe(await startOf(`${tab}[data-vperm-area="pageMounts"]`))
})

// Tab must stand clear of the header to show its own edge; the backend paints over it
test('every tab stands clear of the header and shows an edge of its own', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const drawn = await page.locator(tab).evaluateAll(tabs => {
    const paper = document.createElement('canvas')
    const ink = paper.getContext('2d')

    const seen = (over: string, under: string): number[] => {
      if (ink === null) { return [] }

      ink.clearRect(0, 0, 1, 1)
      ink.fillStyle = under
      ink.fillRect(0, 0, 1, 1)
      ink.fillStyle = over
      ink.fillRect(0, 0, 1, 1)

      return [...ink.getImageData(0, 0, 1, 1).data]
    }

    const header = document.querySelector('.scaffold-header')?.getBoundingClientRect()

    return tabs.map(each => {
      const box = each.getBoundingClientRect()
      const its = getComputedStyle(each)
      const face = seen(its.backgroundColor, 'white')
      const edge = seen(its.borderTopColor, its.backgroundColor)

      return {
        area: each.getAttribute('data-vperm-area'),
        apart: Math.max(...[0, 1, 2].map(part => Math.abs((face[part] ?? 0) - (edge[part] ?? 0)))),
        overlapsHeader: header === undefined ? false : box.top < header.bottom,
        ownTopEdge: each.contains(document.elementFromPoint(box.left + box.width / 2, box.top + 1)),
      }
    })
  })

  expect(drawn).toHaveLength(5)

  drawn.forEach(each => {
    expect(each.overlapsHeader, `the ${each.area ?? '?'} tab reaches up under the header`).toBe(false)
    expect(each.ownTopEdge, `the ${each.area ?? '?'} tab has something painted over its top edge`).toBe(true)
    expect(each.apart, `the ${each.area ?? '?'} tab draws an edge nobody can see`).toBeGreaterThan(12)
  })
})

test('every tab keeps its width, armed or not', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const widths = async (): Promise<Record<string, number>> =>
    page.locator(tab).evaluateAll(tabs => Object.fromEntries(tabs.map(each =>
      [each.getAttribute('data-vperm-area') ?? '?', Math.round(each.getBoundingClientRect().width)])))

  await pickArea(page, 'pageMounts')
  const withMounts = await widths()

  await pickArea(page, 'fields')

  await expect.poll(widths, { message: 'a tab changed width when another was armed' })
    .toEqual(withMounts)

  await pickArea(page, 'modules')

  await expect.poll(widths, { message: 'a tab changed width when another was armed' })
    .toEqual(withMounts)
})

test('no tab scrolls anything of its own', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await expect(page.locator(tab)).toHaveCount(5)

  const scrollers = await page.locator(tab).evaluateAll(tabs => tabs.flatMap(each =>
    [each, ...each.querySelectorAll('*')]
      .filter(part => /auto|scroll/.test(getComputedStyle(part).overflowY))
      .map(part => `${each.getAttribute('data-vperm-area') ?? '?'}: ${part.localName}.${part.getAttribute('class') ?? ''}`)))

  expect(scrollers, 'a tab was handed the scrolling of an area').toStrictEqual([])
})

test('every tab wears what the area below it wears', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'fields')

  // A tab with no column of its own wears the column it shares
  const sharedWith: Record<string, string> = { fileMounts: 'pageMounts', other: 'fields' }

  const worn = async (): Promise<{ area: string, tab: string, column: string }[]> =>
    page.locator(tab).evaluateAll((tabs, shared) => tabs.map(each => {
      const area = each.getAttribute('data-vperm-area') ?? ''
      const host = document.querySelector(`.vperm-frame[data-vperm-area="${shared[area] ?? area}"]`)
      const box = host?.getBoundingClientRect()
      const band = host === null ? 0 : Number.parseFloat(getComputedStyle(host).paddingBlockStart) || 0

      const stack = box === undefined ? [] : document.elementsFromPoint(box.left + 60, box.top + band + 6)
      const frame = stack.find(element => element instanceof HTMLIFrameElement)
      const inside = frame instanceof HTMLIFrameElement ? frame.contentDocument : null
      const painted = (inside === null || frame === undefined
        ? stack
        : inside.elementsFromPoint(60, 6))
        .map(element => (element.ownerDocument.defaultView ?? window).getComputedStyle(element).backgroundColor)
        .find(colour => colour !== 'rgba(0, 0, 0, 0)')

      return { area, tab: getComputedStyle(each).backgroundColor, column: painted ?? 'nothing' }
    }), sharedWith)

  await expect.poll(worn).toHaveLength(5)

  for (const each of await worn()) {
    expect(each.tab, `the ${each.area} tab does not wear its own area's surface`).toBe(each.column)
  }
})

test('a tab follows its area when the backend rearranges itself', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const distances = async (): Promise<number[]> => page.locator(tab).evaluateAll(tabs => tabs.map(each => {
    const host = document.querySelector(`.vperm-frame[data-vperm-area="${each.getAttribute('data-vperm-area') ?? ''}"]`)
    const mine = each.getBoundingClientRect()

    return host === null ? -1 : Math.round(mine.left - host.getBoundingClientRect().left)
  }))

  const before = await distances()

  await page.locator('.vperm-frame[data-vperm-area="pageMounts"]').evaluate(host => {
    host.style.width = `${String(host.getBoundingClientRect().width + 120)}px`
  })

  await expect.poll(distances, { message: 'a tab lost track of its own area' }).toEqual(before)
})

test('every tab is the thing you touch where it sits', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const reachable = await page.locator(tab).evaluateAll(tabs => tabs.map(each => {
    const box = each.getBoundingClientRect()
    const found = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)

    return {
      area: each.getAttribute('data-vperm-area'),
      shown: each.checkVisibility(),
      onTop: found === each || each.contains(found),
      covering: found === each ? null : `${found?.localName ?? '?'}.${found?.getAttribute('class')?.split(' ')[0] ?? ''}`,
    }
  }))

  expect(reachable).toHaveLength(5)

  reachable.forEach(each => {
    expect(each.shown, `${each.area ?? '?'} is not on screen`).toBe(true)
    expect(each.onTop, `${each.area ?? '?'} is hidden behind ${each.covering ?? 'something'}`).toBe(true)
  })
})

test('says nothing is clickable anywhere inside an area out of play', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  // Armed modules disable the page tree and content area; pick 'modules' area instead
  await pickArea(page, 'modules')
  await openControls(page)
  await expect(page.locator('.vperm-toolbar-item .dropdown-menu.show')).toHaveCount(0)
  await expect(page.locator('.vperm-frame[data-vperm-area="pageMounts"][inert] .node').first())
    .toBeAttached()

  const under = async (): Promise<string[]> =>
    page.locator('.vperm-frame[inert]').evaluateAll(hosts => hosts.flatMap(host => {
      const box = host.getBoundingClientRect()

      return [0.25, 0.5, 0.75].map(part => {
        const element = document.elementFromPoint(box.left + box.width / 2, box.top + box.height * part)

        return element === null ? 'nothing' : getComputedStyle(element).cursor
      })
    }))

  await expect.poll(under).toStrictEqual(['not-allowed', 'not-allowed', 'not-allowed', 'not-allowed', 'not-allowed', 'not-allowed'])
  await expect(page.locator(`${tab}[data-vperm-area="pageMounts"]`)).toHaveCSS('cursor', 'pointer')
})

test('leaves the header its controls over an area out of play', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)
  await pickArea(page, 'modules')

  const controls = page.locator('[data-vperm-controls]')

  await expect(controls).toBeVisible()

  const clear = await controls.evaluate(bar => {
    const box = bar.getBoundingClientRect()
    const found = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)

    return {
      onTop: bar.contains(found),
      covering: found === null ? 'nothing' : `${found.localName}.${found.getAttribute('class')?.split(' ')[0] ?? ''}`,
    }
  })

  expect(clear.onTop, `the controls are behind ${clear.covering}`).toBe(true)
  await switchOff(page)

  await expect(page.locator(tab)).toHaveCount(0)
})

test('picking a side area puts the others out of play, picking the main frame leaves them alone', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)

  await openControls(page)
  await pickFirstGroup(page)
  await switchOn(page)

  const areas = async (): Promise<{ area: string | null, veiled: boolean, inert: boolean }[]> =>
    page.locator('.vperm-frame').evaluateAll(hosts => hosts.filter(host => host.checkVisibility()).map(host => {
      const veil = getComputedStyle(host, '::after')
      const band = Number.parseFloat(getComputedStyle(host).paddingBlockStart) || 0

      return {
        area: host.getAttribute('data-vperm-area'),
        veiled: veil.backgroundColor !== 'rgba(0, 0, 0, 0)'
          && Math.round(Number.parseFloat(veil.insetBlockStart)) === Math.round(band),
        inert: host.hasAttribute('inert'),
      }
    }))

  await pickArea(page, 'fields')

  for (const each of await areas()) {
    expect(each.veiled, 'the main frame put an area out of play').toBe(false)
    expect(each.inert).toBe(false)
  }

  await pickArea(page, 'modules')
  await expect
    .poll(async () => (await areas()).every(each => each.veiled === (each.area !== 'modules')))
    .toBe(true)

  for (const each of await areas()) {
    const own = each.area === 'modules'

    expect(each.veiled, `${each.area ?? '?'} is veiled wrongly`).toBe(!own)
    expect(each.inert, `${each.area ?? '?'} is still in the keyboard's way`).toBe(!own)
  }
})
