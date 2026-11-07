import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { emit } from '../platform/bus.js'
import { openChoices, type Choices } from '../platform/choices-dialog.js'
import { routes } from '../platform/routes.js'
import { inspect, read } from '../platform/transport.js'
import { inherited, isReachable } from '../platform/vocabulary.js'
import { writeModules } from './write.js'

export async function chooseOutside(groupId: number, group: string): Promise<void> {
  const permissions = await inspect(groupId)
  if (permissions === null) {
    return
  }

  const choices = await read<Choices>(new AjaxRequest(ajaxUrl(routes.modules_outside_menu)).get())
  if (choices === null) {
    return
  }

  const held = new Set(Object.entries(permissions.scopes.modules.targets)
    .filter(([, verdict]) => isReachable(verdict))
    .map(([module]) => module))
  openChoices(choices, group, held, async marked => {
    const outcome = await writeModules(groupId, marked.map(({ value, allow }) => ({ module: value, allow })))

    if (outcome !== 'taken') {
      return false
    }

    emit('permissions-written', {})

    return true
  }, new Set(Object.entries(permissions.scopes.modules.targets)
    .filter(([, verdict]) => verdict === inherited)
    .map(([module]) => module)))
}
