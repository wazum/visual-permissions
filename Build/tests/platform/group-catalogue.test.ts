import { describe, expect, it } from 'vitest'
import { attributes } from '#src/platform/contract.js'
import { titleOf } from '#src/platform/group-catalogue.js'

const publish = (groups: Record<string, unknown>): void => {
  const carrier = document.createElement('span')
  carrier.setAttribute(attributes.groups, JSON.stringify(groups))
  document.body.replaceChildren(carrier)
}

describe('the group catalogue', () => {
  it('names a group the backend published', () => {
    publish({ 2: { title: 'Institute Editors', inherits: [] }, 13: { title: 'Editors', inherits: [] } })

    expect(titleOf(document, 13)).toBe('Editors')
  })

  it('says nothing about a group the backend did not publish', () => {
    publish({ 13: { title: 'Editors', inherits: [] } })

    expect(titleOf(document, 7)).toBeNull()
  })
})
