import { type FrameLocator, type Page } from '@playwright/test'
import { expect, test } from '../../fixtures/test.js'
import { pickArea } from '../../fixtures/areas.js'
import { moduleContent } from '../../fixtures/module-content.js'
import { pageTree } from '../../fixtures/page-tree.js'
import { openFirstPage, turnToFields } from '../../fixtures/record-form.js'
import { pickFirstGroup } from '../../fixtures/groups.js'
import { forgetSession } from '../../fixtures/session.js'
import { openControls, switchOff, switchOn } from '../../fixtures/visual-mode.js'
const field = '.t3js-formengine-field-item'
const anchor = '[data-vperm-token]'
const verdict = '[data-vperm-verdict]'
const pageTitle = '[data-vperm-token="pages:title"]'

const failedRequestsOf = (page: Page): string[] => {
  const failed: string[] = []

  page.on('requestfailed', request => {
    if (!request.url().includes('/typo3/ajax/icons')) {
      failed.push(request.url())
    }
  })

  return failed
}

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('switching the mode on says what the group may do with every field in the form', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await expect(form.locator(field).first()).toBeVisible()
  await expect(form.locator(verdict)).toHaveCount(0)

  await openControls(page)
  await switchOn(page)

  await expect(form.locator(verdict)).toHaveCount(await form.locator(anchor).count())
  await expect(form.locator(pageTitle)).toHaveAttribute('data-vperm-verdict', 'notApplicable')

  await switchOff(page)

  await expect(form.locator(verdict)).toHaveCount(0)
})

test('a field says nothing while the work is in another area', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await expect(form.locator(verdict).first()).toBeAttached()

  const drawn = async (): Promise<number> => form.locator(`${verdict} .vperm-mark`).filter({ visible: true }).count()

  await pickArea(page, 'modules')

  expect(await drawn(), 'the marks were drawn while another area was being worked in').toBe(0)

  await pickArea(page, 'fields')
  await turnToFields(page)

  expect(await drawn()).toBeGreaterThan(0)
})

const markedForm = async (page: Page): Promise<FrameLocator> => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)

  const form = await openFirstPage(page)

  await openControls(page)
  await switchOn(page)
  await expect(form.locator(verdict).first()).toBeAttached()
  await pickArea(page, 'fields')
  await turnToFields(page)

  return form
}

// The mark stands at the end of the heading and the control runs the whole width, so the two
// end together and neither is ever drawn over the other
test('a control runs as far as the mark above it, and no further', async ({ page }) => {
  const form = await markedForm(page)

  const ends = await form.locator(verdict).evaluateAll(anchors => anchors
    .filter(each => each.checkVisibility())
    .map(each => {
      const heading = each.querySelector(':scope > .form-label, :scope > fieldset > legend')
      const control = each.querySelector('select, textarea, input:not([type="hidden"])')

      return heading === null || control === null
        ? null
        : Math.round(control.getBoundingClientRect().right - heading.getBoundingClientRect().right)
    })
    .filter(apart => apart !== null))

  expect(ends.length).toBeGreaterThan(0)

  ends.forEach(apart => {
    expect(apart, 'a control and the mark above it do not end together').toBeLessThanOrEqual(1)
  })
})

// The record holds records of its own, and opening one is a request core makes from the form
test('switching the mode on over a record opened on its own leaves it standing', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator(field).first()).toBeVisible()
  const failed = failedRequestsOf(page)
  await openControls(page)
  await switchOn(page)
  // The mode opens the record it holds, and that is the last thing it does to the form
  await expect(form.locator('[data-vperm-token^="sys_file_reference:"]').first()).toBeAttached()
  await page.waitForLoadState('networkidle')

  expect(failed).toStrictEqual([])
})

// The record is read where it stands, and the tree of the pages it belongs to stands beside it
test('switching the mode on over a record opened on its own opens the page tree beside it', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator(field).first()).toBeVisible()
  await openControls(page)
  await switchOn(page)

  await expect(pageTree(page)).toBeVisible()
  await expect(form.locator(verdict).first()).toBeAttached()
})

// The page tree comes with a module, so the record is left for one, and taken along
test('picking an area a record opened on its own cannot show takes the record along', async ({ page }) => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator(field).first()).toBeVisible()
  const failed = failedRequestsOf(page)
  await openControls(page)
  await switchOn(page)
  await expect(form.locator('[data-vperm-token^="sys_file_reference:"]').first()).toBeAttached()
  await pickArea(page, 'pageMounts')
  await expect(page.locator('.vperm-frame[data-vperm-area="pageMounts"] .node').first()).toBeAttached()
  await expect(form.locator(field).first()).toBeVisible()
  await page.waitForLoadState('networkidle')

  expect(failed).toStrictEqual([])
})

test('a mark sits on the line that names its field', async ({ page }) => {
  const form = await markedForm(page)

  const offsets = await form.locator(verdict).evaluateAll(anchors => anchors
    .filter(each => each.checkVisibility() && each.querySelector('.form-label') !== null)
    .map(each => {
      const label = each.querySelector('.form-label')?.getBoundingClientRect()
      const mark = getComputedStyle(each, '::after')

      return Math.round(parseFloat(mark.insetBlockStart) - ((label?.top ?? 0) - each.getBoundingClientRect().top))
    }))

  expect(offsets.length).toBeGreaterThan(0)

  offsets.forEach(offset => {
    expect(Math.abs(offset), 'a mark floats away from the line that names the field').toBeLessThan(12)
  })
})
