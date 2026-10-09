import type { FrameLocator, Page } from '@playwright/test'
import { expect, test } from '../../../fixtures/test.js'
import { pickArea } from '../../../fixtures/areas.js'
import { pickFirstGroup } from '../../../fixtures/groups.js'
import { moduleContent } from '../../../fixtures/module-content.js'
import { forgetSession } from '../../../fixtures/session.js'
import { openControls, switchOn } from '../../../fixtures/visual-mode.js'

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

const readAsList = async (page: Page): Promise<FrameLocator> => {
  await page.goto('/typo3/')
  await openControls(page)
  await pickFirstGroup(page)
  await page.goto('/typo3/record/edit?edit%5Btt_content%5D%5B3%5D=edit')

  const form = moduleContent(page)

  await expect(form.locator('.t3js-formengine-field-item').first()).toBeVisible()
  await openControls(page)
  await switchOn(page)
  await pickArea(page, 'fields')
  await form.locator('.vperm-show-menu .dropdown-toggle').click()
  await form.locator('.vperm-show-menu .dropdown-item').first().click()
  await expect(form.locator('body')).toHaveAttribute('data-vperm-show', 'list')

  return form
}

test('a record read as a list keeps its fields close together', async ({ page }) => {
  const form = await readAsList(page)

  const gaps = await form.locator('[data-vperm-verdict]').evaluateAll(anchors => anchors
    .filter(each => each.checkVisibility())
    .flatMap((each, at, listed) => {
      const next = listed[at + 1]
      if (next === undefined || next.parentElement?.parentElement !== each.parentElement?.parentElement) {
        return []
      }

      return [Math.round(next.getBoundingClientRect().top - each.getBoundingClientRect().bottom)]
    }))

  expect(gaps.length).toBeGreaterThan(0)
  expect(new Set(gaps), 'one field stands further from the next than a list needs').toStrictEqual(new Set([20]))
})

test('a record read as a list ends every section before the next as far below its last field', async ({ page }) => {
  const form = await readAsList(page)

  const below = await form.locator('[data-vperm-verdict]').evaluateAll(anchors => {
    const lastIn = new Map<Element, number>()

    anchors.filter(each => each.checkVisibility()).forEach(each => {
      const section = each.parentElement?.closest('.form-section')

      if (section) {
        lastIn.set(section, each.getBoundingClientRect().bottom)
      }
    })

    return [...lastIn].slice(0, -1).map(([section, bottom]) => Math.round(section.getBoundingClientRect().bottom - bottom))
  })

  expect(below.length).toBeGreaterThan(1)
  expect(new Set(below).size, `sections end ${below.join(', ')}px below their last field`).toBe(1)
})
