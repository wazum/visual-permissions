import AjaxRequest from '@typo3/core/ajax/ajax-request.js'
import { PageTree } from '@typo3/backend/tree/page-tree.js'
import { ajaxUrl } from '../platform/ajax-url.js'
import { elements } from '../platform/contract.js'
import { routes } from '../platform/routes.js'
import { write } from '../platform/transport.js'
import type { Kind, TreeConfiguration } from './panel.js'

export const pages: Kind = {
  word: 'pages',
  component: 'typo3-backend-navigation-component-pagetree',
  tree: elements.pageTree,
  base: PageTree,
  namesFirst: false,
  mounted: ({ pageMounts }) => ({
    targets: pageMounts.targets,
    order: pageMounts.order.map(String),
    named: {},
    unseen: pageMounts.unseen,
  }),
  rootedAt: async () => {
    const response = await new AjaxRequest(ajaxUrl('page_tree_browser_configuration')).get()

    return response.resolve<TreeConfiguration>()
  },
  write: async (groupId, branches, mount) => write(routes.mount_pages, {
    group: groupId,
    operations: branches.map(page => ({ page: Number(page), mount })),
  }),
}
