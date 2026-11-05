import { FileStorageTree } from '@typo3/backend/tree/file-storage-tree.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { elements } from '../platform/contract.js'
import { titleOf } from '../platform/group-catalogue.js'
import { labelOf } from '../platform/labels.js'
import { button } from '../platform/panel-card.js'
import { routes } from '../platform/routes.js'
import { write } from '../platform/transport.js'
import { chooseOperations } from './file-operations.js'
import type { Kind } from './panel.js'

// Folders are rooted by a route of ours; core's file tree stands on every storage the reader may see
export const folders: Kind = {
  word: 'folders',
  component: 'typo3-backend-navigation-component-filestoragetree',
  tree: elements.folderTree,
  base: FileStorageTree,
  namesFirst: true,
  mounted: ({ fileMounts }) => {
    const spelled = (named: Readonly<Record<string, string>>): Record<string, string> => Object.fromEntries(
      Object.entries(named).map(([folder, value]) => [encodeURIComponent(folder), value]),
    )
    const targets = spelled(fileMounts.targets)

    return { targets, order: Object.keys(targets), named: spelled(fileMounts.named), unseen: [] }
  },
  rootedAt: groupId => {
    const route = ajaxUrl(routes.folder_tree)

    return {
      dataUrl: `${route}${route.includes('?') ? '&' : '?'}group=${String(groupId)}`,
      rootlineUrl: ajaxUrl('filestorage_tree_rootline'),
      filterUrl: ajaxUrl('filestorage_tree_filter'),
      showIcons: true,
    }
  },
  write: async (groupId, branches, mount, titles) => write(routes.mount_folders, {
    group: groupId,
    operations: branches.map(folder => ({
      folder: decodeURIComponent(folder),
      mount,
      // A folder with an existing record needs no new title; the backend keeps the one it has
      title: titles.get(folder) ?? '',
    })),
  }),
  choice: (doc, groupId) => button(
    doc,
    labelOf('mountBranches.folders.chooseOperations'),
    // Stryker disable next-line StringLiteral: only core draws the class, and only a browser shows it
    'btn btn-default',
    () => {
      // Stryker disable next-line StringLiteral: the group is one of those the backend lists, so it has a title
      void chooseOperations(groupId, titleOf(doc, groupId) ?? '')
    },
  ),
}
