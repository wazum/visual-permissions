import { type Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { groupMounts, shownToNobody } from '../../fixtures/mounts.js'
import { showTree } from '../../fixtures/page-tree.js'
import { forgetSession } from '../../fixtures/session.js'
import { verifyIfAsked } from '../../fixtures/sudo-mode.js'
import { showPermissions } from '../../fixtures/visual-mode.js'

const mounts = '.vperm-frame[data-vperm-area="pageMounts"]'
const preview = `${mounts} .vperm-face-preview`
const pick = `${mounts} .vperm-face-pick`

// The preview shows the way down to a mount too, so the branch is the row neither above nor
// below one
const mounted = '.node:not(.vperm-mount-context):not(.vperm-mount-inside):not(.vperm-mount-inherited)'

const showMounts = async (page: Page): Promise<void> => {
  await page.setViewportSize({ width: 1600, height: 900 })
  await page.goto('/typo3/module/web/layout')
  await showTree(page)
  await showPermissions(page, 'pageMounts')
  await mountBranchIfNone(page)
}

const mountBranchIfNone = async (page: Page): Promise<void> => {
  // The panel itself says how many branches the group has; count rows separately
  const foot = page.locator(`${preview} .vperm-face-tally`)

  await expect(foot).toHaveText(/\d+ branch/)

  if (Number(/\d+/.exec(await foot.textContent() ?? '')?.[0] ?? 0) > 0) {
    return
  }

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const add = page.locator(`${pick} .vperm-face-apply`)
  const markablePage = page
    .locator(`${pick} .node[data-id]:not([data-id='0']):not(.vperm-mount-already):not(.vperm-mount-inside)`)
    .first()

  await expect(markablePage).toBeAttached()
  await markablePage.click({ force: true })
  await expect(add, 'no branch could be marked to mount').toBeEnabled()
  await verifyIfAsked(page, () => add.click())

  await expect(page.locator(`${preview} .node`).first()).toBeAttached()
}

test.beforeEach(async ({ page, databaseNumber }) => {
  groupMounts(databaseNumber, 25)
  await forgetSession(page)
})

test('marking a mounted branch offers the deed to take it away', async ({ page }) => {
  await showMounts(page)

  const marked = page.locator(`${preview} .vperm-face-marked`)
  const remove = page.locator(`${preview} .vperm-face-apply`)
  const tally = page.locator(`${preview} .vperm-face-tally`)

  await expect(page.locator(`${preview} ${mounted}`).first()).toBeAttached()
  await expect(remove).toBeDisabled()

  const said = await tally.textContent()

  await page.locator(`${preview} ${mounted}`).first().click()

  await expect(marked).toHaveCount(1)
  await expect(remove, 'a marked branch cannot be taken away').toBeEnabled()
  await expect(tally, 'the foot says nothing about what is marked').not.toHaveText(said ?? '')
})

test('asking for the deed takes the marked branch away', async ({ page }) => {
  const sent: string[] = []
  const posted: string[] = []

  await showMounts(page)

  page.on('request', request => {
    if (request.url().includes('visual-permissions/mount-pages')) {
      sent.push(request.method())
    }

    if (request.method() === 'POST') {
      posted.push(request.url().replace(/\?.*$/, ''))
    }
  })

  page.on('console', message => {
    if (message.type() === 'error') {
      posted.push(`console: ${message.text().slice(0, 120)}`)
    }
  })

  const tally = page.locator(`${preview} .vperm-face-tally`)

  await expect(page.locator(`${preview} ${mounted}`).first()).toBeAttached()

  const before = await tally.textContent()

  await page.locator(`${preview} ${mounted}`).first().click()
  await page.locator(`${preview} .vperm-face-apply`).click()

  const asking = page.locator('typo3-backend-modal input[type="password"]').first()

  await asking.waitFor({ state: 'visible' })

  const blocker = await asking.evaluate(field => {
    const box = field.getBoundingClientRect()
    const met = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)

    return field === met || field.contains(met)
      ? null
      : `${met?.localName ?? 'nothing'}.${met?.getAttribute('class')?.split(' ')[0] ?? ''}`
  })

  expect(blocker, 'something of ours stands in front of the password').toBeNull()

  await verifyIfAsked(page, () => Promise.resolve())

  await expect.poll(() => sent.length, { message: `the deed never reached the backend; seen: ${posted.join(' | ')}` })
    .toBeGreaterThan(0)
  await expect(tally, 'the panel came back with the same branches').not.toHaveText(before ?? '')
})

test('a mounted page the group cannot see links to its page permissions', async ({ page, databaseNumber }) => {
  shownToNobody(databaseNumber, 25)

  await showMounts(page)

  await expect(page.locator(preview).getByRole('link', { name: 'Page permissions of "Ipsum"' })).toBeVisible()
})

test('the page permissions open with the page chosen in the tree', async ({ page, databaseNumber }) => {
  shownToNobody(databaseNumber, 25)
  await showMounts(page)

  await page.locator(preview).getByRole('link', { name: 'Page permissions of "Ipsum"' }).click()

  await expect(page.locator('typo3-backend-navigation-component-pagetree .node-selected[data-id="25"]')).toBeAttached()
})

test('a page below a mount is left as it was when clicked', async ({ page }) => {
  await showMounts(page)

  // The mount must be open before any of its children can be visible on screen
  const root = page.locator(`${preview} ${mounted}`).first()

  await expect(root).toBeAttached()

  if (await root.getAttribute('aria-expanded') === 'false') {
    await root.locator('.node-toggle').click()
  }

  const inside = page.locator(`${preview} .node.vperm-mount-inside`).first()

  await expect(inside).toBeAttached()

  const before = await inside.evaluate(row => getComputedStyle(row).backgroundColor)

  await inside.click({ force: true })
  await page.mouse.move(0, 0)

  const after = await inside.evaluate(row => ({
    background: getComputedStyle(row).backgroundColor,
    hasFocus: document.activeElement === row || row.contains(document.activeElement),
  }))

  expect(after.background, 'a page below a mount was filled in by a click').toBe(before)
  expect(after.hasFocus, 'a page below a mount took the keyboard').toBe(false)
  await expect(page.locator(`${preview} .vperm-face-marked`)).toHaveCount(0)

  await expect(inside.locator('.node-toggle')).toHaveCSS('pointer-events', 'auto')
})

test('the tree the reader picks branches in holds no row for the installation', async ({ page }) => {
  await showMounts(page)

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const side = page.locator(`${pick} > .vperm-face-scroll`)

  await expect(side.locator('.node').first()).toBeAttached()
  await expect(side.locator(".node[data-id='0']")).toHaveCount(0)
})

// The tree is the backend's; what we keep out of sight goes back with it
test('the backend gets its own root row back when the areas are let go of', async ({ page }) => {
  await showMounts(page)

  await page.locator(`${preview} .vperm-face-bar button`).click()
  await expect(page.locator(`${pick} > .vperm-face-scroll .node`).first()).toBeAttached()

  await page.locator('[data-vperm-toggle]').click()

  await expect(page.locator(".node[data-id='0']")).toHaveCount(1)
})

test('the tree keeps its own menu while branches are picked', async ({ page }) => {
  await showMounts(page)

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const menu = page.locator(`${pick} .tree-toolbar .dropdown-toggle`)

  await expect(menu).toBeVisible()

  await menu.click()

  const items = page.locator(`${pick} .tree-toolbar .dropdown-menu .dropdown-item`)

  await expect(items.first()).toBeVisible()
  await expect(page.locator(`${pick} .tree-toolbar__drag-node`).first())
    .toHaveCSS('pointer-events', 'none')
})

test('the pages the tree offers to drag in say they cannot be used', async ({ page }) => {
  await showMounts(page)

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const icon = page.locator(`${pick} .tree-toolbar__drag-node`).first()

  await expect(icon).toBeVisible()

  const pointerCursor = await icon.evaluate(element => {
    const box = element.getBoundingClientRect()
    const met = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)

    return met === null ? 'nothing' : getComputedStyle(met).cursor
  })

  expect(pointerCursor).toBe('not-allowed')
})

test('the tree the reader picks branches in fills the side it stands in', async ({ page }) => {
  await showMounts(page)

  await page.locator(`${preview} .vperm-face-bar button`).click()

  const side = page.locator(`${pick} > .vperm-face-scroll`)

  await expect(side.locator('.node').first()).toBeAttached()

  const measure = async (): Promise<{ side: number, rows: number, touched: string }> => side.evaluate(standing => {
    const box = standing.getBoundingClientRect()
    const first = standing.querySelector('.node')
    const row = first?.getBoundingClientRect()

    const met = row === undefined ? null : document.elementFromPoint(row.left + 20, row.top + row.height / 2)
    const reached = first !== null && (met === first || first.contains(met))

    return {
      side: Math.round(box.height),
      rows: standing.querySelectorAll('.node').length,
      touched: reached ? 'the first row' : met === null ? 'nothing' : `${met.localName}.${met.getAttribute('class')?.split(' ')[0] ?? ''}`,
    }
  })

  await expect.poll(async () => (await measure()).touched, { message: 'the first row of the tree is not there to touch' })
    .toBe('the first row')

  const drawn = await measure()

  expect(drawn.side, 'the side itself has no height').toBeGreaterThan(100)
  expect(drawn.rows, 'the tree offers no branch to pick').toBeGreaterThan(0)
})
