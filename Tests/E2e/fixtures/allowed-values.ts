import { opened } from './database.js'

const groupId = 5

export const groupCreates = (databaseNumber: number, ...pageTypes: number[]): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE be_groups SET pagetypes_select = ? WHERE uid = ?')
      .run(pageTypes.join(','), groupId)
  } finally {
    database.close()
  }
}

export const groupOperates = (databaseNumber: number, ...operations: string[]): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE be_groups SET file_permissions = ? WHERE uid = ?')
      .run(operations.join(','), groupId)
  } finally {
    database.close()
  }
}

export const groupAllows = (databaseNumber: number, ...values: string[]): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE be_groups SET explicit_allowdeny = ? WHERE uid = ?')
      .run(values.join(','), groupId)
  } finally {
    database.close()
  }
}
