import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { emit } from '../platform/bus.js'
import { openChoices, type Choices } from '../platform/choices-dialog.js'
import { routes } from '../platform/routes.js'
import { inspect, read, write } from '../platform/transport.js'
import { picked } from '../platform/vocabulary.js'

export async function chooseOperations(groupId: number, group: string): Promise<void> {
  const permissions = await inspect(groupId)
  if (permissions === null) {
    return
  }

  const choices = await read<Choices>(new AjaxRequest(ajaxUrl(routes.file_operations)).get())
  if (choices === null) {
    return
  }

  const held = new Set(Object.keys(permissions.scopes.fileOperations.targets))
  openChoices(choices, group, held, async marked => {
    const outcome = await write(routes.allow_file_operations, { group: groupId, operations: marked })
    if (outcome !== 'taken') {
      return false
    }

    emit('permissions-written', {})

    return true
  }, new Set(Object.entries(permissions.scopes.fileOperations.targets)
    .filter(([, verdict]) => verdict !== picked)
    .map(([operation]) => operation)))
}
