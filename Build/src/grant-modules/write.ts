import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export interface ModuleOperation {
  readonly module: string
  readonly grant: boolean
}

export async function writeModules(
  groupId: number,
  operations: readonly ModuleOperation[],
): Promise<WriteOutcome> {
  return write(routes.grant_modules, { group: groupId, operations: [...operations] })
}
