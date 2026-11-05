import { opened } from './database.js'

const groupId = 5

/**
 * What a spec starts from, written straight into the database that spec was handed. A
 * backend that mounts and unmounts for real leaves the group different from how it found
 * it, so each spec says what it needs rather than inheriting the one before it.
 */
export const groupMounts = (databaseNumber: number, ...pages: number[]): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE be_groups SET db_mountpoints = ? WHERE uid = ?')
      .run(pages.join(','), groupId)
  } finally {
    database.close()
  }
}

export const shownToNobody = (databaseNumber: number, page: number): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE pages SET perms_groupid = 0, perms_everybody = 0 WHERE uid = ?')
      .run(page)
  } finally {
    database.close()
  }
}

export const groupFileMounts =(databaseNumber: number, ...mounts: number[]): void => {
  const database = opened(databaseNumber)

  try {
    database.prepare('UPDATE be_groups SET file_mountpoints = ? WHERE uid = ?')
      .run(mounts.join(','), groupId)
  } finally {
    database.close()
  }
}
