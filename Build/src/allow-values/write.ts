import { routes } from '../platform/routes.js'
import { write, type WriteOutcome } from '../platform/transport.js'

export interface ValueOperation {
  readonly value: string
  readonly grant: boolean
}

export async function writeValues(
  list: 'fieldValues' | 'pageTypes',
  groupId: number,
  operations: readonly ValueOperation[],
): Promise<WriteOutcome> {
  return write(list === 'pageTypes' ? routes.allow_page_types : routes.allow_values, {
    group: groupId,
    operations: [...operations],
  })
}
