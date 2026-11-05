import { afterEach, describe, expect, it } from 'vitest'
import { ajaxUrl } from '#src/platform/ajax-url.js'
import { routes } from '#src/platform/routes.js'

describe('the URLs the backend answers on', () => {
  const published = { ...TYPO3.settings.ajaxUrls }

  afterEach(() => {
    TYPO3.settings.ajaxUrls = { ...published }
  })

  it('reads the URL the backend published for a route', () => {
    expect(ajaxUrl(routes.inspect)).toBe('/typo3/ajax/visual_permissions_inspect')
  })

  it('asks nowhere at all for a route the backend never published', () => {
    TYPO3.settings.ajaxUrls = {}

    expect(ajaxUrl(routes.inspect)).toBe('')
  })
})
