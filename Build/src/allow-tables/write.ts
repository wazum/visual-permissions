import { emit } from '../platform/bus.js'
import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export async function writeTable(groupId: number, table: string, allow: boolean): Promise<WriteOutcome> {
  const outcome = await write(routes.allow_tables, { group: groupId, operations: [{ table, allow }] })
  if (outcome === 'taken') {
    emit('permissions-written', {})
  }

  return outcome
}
