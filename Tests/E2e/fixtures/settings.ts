import type { Page, Request } from '@playwright/test'

/**
 * What an admin picks lives in the user's settings, and a page load before that write lands
 * loses it. Only a write that starts from here counts, never one already on its way.
 */
export const settingsWrittenBy = async (page: Page, act: () => Promise<void>): Promise<void> => {
  const started = new Set<Request>()

  page.on('request', request => { started.add(request) })

  const written = page.waitForResponse(answer =>
    answer.url().includes('usersettings/process') && started.has(answer.request()))

  await act()
  await written
}
