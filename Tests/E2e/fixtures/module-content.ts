import type { FrameLocator, Locator, Page } from '@playwright/test'

const frame = '#typo3-contentIframe'

export const moduleContent = (page: Page): FrameLocator =>
  page.frameLocator(frame)

export const moduleFrame = (page: Page): Locator =>
  page.locator(frame)
