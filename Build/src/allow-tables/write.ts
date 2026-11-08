import { emit } from '../platform/bus.js'
import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export async function writeTable(groupId: number, table: string, select: boolean, modify: boolean): Promise<WriteOutcome> {
  const outcome = await write(routes.allow_tables, { group: groupId, operations: [{ table, select, modify }] })
  if (outcome === 'taken') {
    emit('permissions-written', {})
  }

  return outcome
}
