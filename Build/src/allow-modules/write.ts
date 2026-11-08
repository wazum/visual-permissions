import Notification from '@typo3/backend/notification.js'
import { labelOf } from '../platform/labels.js'
import { said } from '../platform/panel-card.js'
import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export interface ModuleOperation {
  readonly module: string
  readonly allow: boolean
}

export async function writeModules(
  groupId: number,
  operations: readonly ModuleOperation[],
): Promise<WriteOutcome> {
  return write(routes.allow_modules, { group: groupId, operations: [...operations] }, answer => {
    (answer as { alsoAllowed: string[] }).alsoAllowed
      .forEach(parent => { Notification.info(said(labelOf('allowModules.alsoAllowed'), parent)) })
  })
}
