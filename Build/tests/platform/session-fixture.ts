import { activate, pickArea, turnTo } from '#src/platform/session.js'

export const pickFieldsToGive = (): void => {
  activate()
  pickArea('fields')
  turnTo('pick')
}
