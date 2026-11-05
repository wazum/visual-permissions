import { emit } from '../platform/bus.js'
import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export async function writeTable(groupId: number, table: string, grant: boolean): Promise<WriteOutcome> {
  const outcome = await write(routes.grant_tables, { group: groupId, operations: [{ table, grant }] })
  if (outcome === 'taken') {
    emit('permissions-written', {})
  }

  return outcome
}
