import { routes } from '../platform/routes.js'
import { remembered } from '../platform/transport.js'

export interface ViewableUser {
  readonly id: number
  readonly username: string
  readonly realName: string
  readonly groups: readonly number[]
}

export interface ViewableUsers {
  // Users switched to most recently, newest first
  readonly recent: readonly number[]
  readonly users: readonly ViewableUser[]
}

export const viewableUsers = remembered<ViewableUsers>(routes.viewable_users)
