import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export interface FieldOperation {
  readonly field: string
  readonly grant: boolean
}

export async function writeFields(
  groupId: number,
  operations: readonly FieldOperation[],
): Promise<WriteOutcome> {
  return write(routes.grant_fields, { group: groupId, operations: [...operations] })
}
