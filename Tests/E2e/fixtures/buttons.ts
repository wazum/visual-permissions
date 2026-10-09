import type { Locator } from '@playwright/test'

// Core's disabled buttons take no pointer, and the pointer then shows whatever lies under them
export const cursorOver = async (button: Locator): Promise<string> => button.evaluate(element => {
  const box = element.getBoundingClientRect()
  const under = element.ownerDocument.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)

  return under === null ? 'nothing' : getComputedStyle(under).cursor
})
