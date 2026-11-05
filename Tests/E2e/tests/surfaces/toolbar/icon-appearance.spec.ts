import { expect, test } from '../../../fixtures/test.js'
import { forgetSession } from '../../../fixtures/session.js'
import { toolbarButton } from '../../../fixtures/visual-mode.js'

const colourOf = (selector: string, property: string, page: import('@playwright/test').Page) =>
  page.locator(selector).first().evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name),
    property,
  )

test.beforeEach(async ({ page }) => {
  await forgetSession(page)
})

test('the icon takes the colour of the header it stands in', async ({ page }) => {
  await page.goto('/typo3/')

  expect(await colourOf(`${toolbarButton} svg path`, 'fill', page))
    .toBe(await colourOf(`${toolbarButton} svg path`, 'color', page))
})

