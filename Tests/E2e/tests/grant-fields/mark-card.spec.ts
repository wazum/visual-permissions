import type { FrameLocator, Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { giveMarkedFieldsAway, openFirstPage, turnToFields } from '../../fixtures/record-form.js'
import { pickFirstGroup, pickGroup, shownGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOn } from '../../fixtures/visual-mode.js'

const pageTitle = '[data-vperm-token="pages:title"]'

const unexplainedMarks = async (page: Page, form: FrameLocator): Promise<string[]> => {
  const marks = form.locator('[data-vperm-verdict] .vperm-mark').filter({ visible: true })
  await expect(marks.first()).toBeVisible()

  const unexplained: string[] = []
  for (const mark of await marks.all()) {
    await mark.press('Enter')
    const card = form.getByRole('dialog')
    const name = await mark.getAttribute('aria-label') ?? ''
    const title = await card.getByRole('heading').textContent() ?? ''
    const meaning = await card.locator('p').textContent() ?? ''

    if (name === '' || meaning === '' || title !== name) {
      const verdict = await mark.evaluate(element => element.closest('[data-vperm-verdict]')?.getAttribute('data-vperm-verdict'))
      unexplained.push(`${verdict ?? ''}: "${name}" opened "${title}", "${meaning}"`)
    }

    await page.keyboard.press('Escape')
  }

  return unexplained
}

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('a field\'s mark opens what it means from the keyboard', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const mark = form.locator(pageTitle).getByRole('button', { name: 'Open to all editors' })

  await expect(mark).toBeVisible()
  await mark.press('Enter')

  await expect(form.getByRole('dialog', { name: 'Open to all editors' }))
    .toContainText('TYPO3 has no permission for this field. Every user who may edit this table may edit it.')
})

test('pressing a field\'s mark leaves the field as it was', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const field = form.locator('[data-vperm-verdict="allowed"][role="switch"]').filter({ visible: true }).first()
  await expect(field).toHaveAttribute('aria-checked', 'true')

  await field.locator('.vperm-mark').press('Enter')

  await expect(field).toHaveAttribute('aria-checked', 'true')
})

test('a field\'s mark says what the field became once it is given', async ({ page }) => {
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
  await giveMarkedFieldsAway(page, form)

  await expect(field.locator('.vperm-mark')).toHaveAccessibleName('Allowed')
})

test('a field\'s mark stands at the end of its heading on the side the fields are given on', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const away = await form.locator('[data-vperm-verdict] .vperm-mark').filter({ visible: true }).evaluateAll(marks =>
    marks.filter(mark => {
      const heading = mark.closest('.form-label, legend')?.getBoundingClientRect()

      return heading === undefined || Math.abs(heading.right - mark.getBoundingClientRect().right) > 8
    }).map(mark => mark.closest('[data-vperm-token]')?.getAttribute('data-vperm-token')))

  expect(away).toEqual([])
})

test('a field\'s heading shows the same cursor as the rest of the field', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const field = form.locator('[data-vperm-verdict="denied"][role="switch"]').filter({ visible: true }).first()
  const cursors = await field.evaluate(anchor => [...anchor.querySelectorAll(':scope > .form-label, :scope > .form-label *:not(.vperm-mark)')]
    .map(element => getComputedStyle(element).cursor))

  expect([...new Set(cursors)]).toEqual([await field.evaluate(anchor => getComputedStyle(anchor).cursor)])
})

test('a field is pressed as ever while its mark says what it means', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const field = form.locator('[data-vperm-verdict="denied"][role="switch"]').filter({ visible: true }).first()
  const mark = field.locator('.vperm-mark')
  const card = form.getByRole('dialog')
  await mark.hover()
  await expect(card).toBeVisible()

  const markBox = await mark.boundingBox()
  if (markBox === null) {
    throw new Error('the mark has no box')
  }

  const squareTop = markBox.y + await mark.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))
  await page.mouse.click(markBox.x + markBox.width / 2, squareTop - 2)

  await expect(field).toHaveAttribute('aria-checked', 'true')
})

test('a marked field\'s mark stands right after the word that says what waits', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const field = form.locator('[data-vperm-verdict="denied"][role="switch"]').filter({ visible: true }).first()
  await field.click({ position: { x: 16, y: 16 } })
  await expect(field).toHaveAttribute('aria-checked', 'true')

  expect(await field.locator('.vperm-mark').evaluate(mark => parseFloat(getComputedStyle(mark).marginInlineStart))).toBeLessThan(8)
})

test('an inherited field names the groups that give it, and shows one of them', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickGroup(page, 'Elit')

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  await form.locator('[data-vperm-token="pages:nav_title"]').getByRole('button', { name: 'Inherited' }).press('Enter')
  const card = form.getByRole('dialog', { name: 'Inherited' })

  await expect(card.getByRole('heading', { name: 'Given by' })).toBeVisible()
  await expect(card.getByRole('listitem')).toContainText(['Consectetur', 'Aliquam'])
  await expect(card.getByRole('button', { name: 'Show group "Aliquam"' })).toHaveText('Show group')
  await expect(card.getByRole('button', { name: 'Show group "Consectetur"' })).toBeFocused()

  await page.keyboard.press('Enter')

  await expect(shownGroup(page)).toHaveText('Consectetur')
  await expect(card).toBeHidden()
})

test('escape closes the card and hands the keyboard back to the mark', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickGroup(page, 'Elit')

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const mark = form.locator('[data-vperm-token="pages:nav_title"]').getByRole('button', { name: 'Inherited' })
  await mark.press('Enter')
  const card = form.getByRole('dialog', { name: 'Inherited' })
  await expect(card.getByRole('button').first()).toBeFocused()

  await page.keyboard.press('Escape')

  await expect(card).toBeHidden()
  await expect(mark).toBeFocused()
  await expect(mark).toHaveAttribute('aria-expanded', 'false')
})

test('the pointer carries an open card from one mark to the next', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const first = form.locator(`${pageTitle} .vperm-mark`)
  const next = form.locator('[data-vperm-token="pages:nav_title"] .vperm-mark')
  const card = form.getByRole('dialog')
  await expect(next).not.toHaveAccessibleName(await first.getAttribute('aria-label') ?? '')
  await first.hover()
  await expect(card).toBeVisible()
  await card.evaluate(element => {
    element.dataset['closings'] = '0'
    element.addEventListener('toggle', event => {
      if ((event as ToggleEvent).newState === 'closed') {
        element.dataset['closings'] = String(Number(element.dataset['closings']) + 1)
      }
    })
  })

  await next.hover()

  await expect(card).toHaveAccessibleName(await next.getAttribute('aria-label') ?? '', { timeout: 200 })
  await expect(card).toHaveAttribute('data-closings', '0')
})

test('the card of a field the group holds says what pressing the field does', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const card = form.getByRole('dialog')
  await form.locator(`${pageTitle} .vperm-mark`).press('Enter')
  await expect(card).not.toContainText('Press')
  await page.keyboard.press('Escape')

  const field = form.locator('[data-vperm-verdict="allowed"][role="switch"]').filter({ visible: true }).first()
  await field.locator('.vperm-mark').press('Enter')
  await expect(card).toContainText('Press the field to take it away')
  await page.keyboard.press('Escape')

  await field.click({ position: { x: 16, y: 16 } })
  await field.locator('.vperm-mark').press('Enter')
  await expect(card).toContainText('Press again to keep it')
})

test('the card of a field the group can be given says what pressing the field does', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await turnToFields(page)

  const card = form.getByRole('dialog')
  const field = form.locator('[data-vperm-verdict="denied"][role="switch"]').filter({ visible: true }).first()
  await field.locator('.vperm-mark').press('Enter')
  await expect(card).toContainText('Press the field to give it')
  await page.keyboard.press('Escape')

  await field.click({ position: { x: 16, y: 16 } })
  await field.locator('.vperm-mark').press('Enter')
  await expect(card).toContainText('Press again to leave it out')
})

test('every mark in the form says what it means', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const preview = await unexplainedMarks(page, form)
  await turnToFields(page)

  expect([...new Set([...preview, ...await unexplainedMarks(page, form)])]).toEqual([])
})

test('a field\'s mark opens what it means under the pointer, on either side of the form', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)

  const mark = form.locator(pageTitle).getByRole('button', { name: 'Open to all editors' })
  const card = form.getByRole('dialog', { name: 'Open to all editors' })

  await mark.hover()
  await expect(card).toBeVisible()

  await page.mouse.move(0, 0)
  await expect(card).toBeHidden()
  await turnToFields(page)

  await mark.hover()
  await expect(card).toBeVisible()
})
