declare module 'bootstrap' {
  export class Dropdown {
    static getInstance(element: Element): Dropdown | null
    hide(): void
  }
}

declare module '@typo3/core/ajax/ajax-request.js' {
  export type RequestMiddleware = (
    request: Request,
    next: (request: Request) => Promise<Response>,
  ) => Promise<Response>

  export default class AjaxRequest {
    constructor(url: string)
    withQueryArguments(queryArguments: Record<string, string | number | string[]>): AjaxRequest
    addMiddleware(middleware: RequestMiddleware): AjaxRequest
    get(init?: RequestInit): Promise<{ resolve: <T>() => Promise<T>, raw: () => Response }>
    post(body: unknown): Promise<{ resolve: <T>() => Promise<T>, raw: () => Response }>
  }
}

declare module '@typo3/backend/notification.js' {
  const Notification: {
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
  }

  export default Notification
}

declare module '@typo3/backend/modal.js' {
  export interface ModalButton {
    text: string
    btnClass?: string
    name?: string
    trigger?: (event: Event, modal: ModalElement) => void
  }

  export interface ModalElement extends HTMLElement {
    buttons: ModalButton[]
    readonly updateComplete: Promise<boolean>
    hideModal: () => void
  }

  const Modal: {
    sizes: { small: string, default: string, medium: string, large: string, full: string }
    advanced: (configuration: {
      title: string
      content: Element
      size?: string
      buttons?: ModalButton[]
    }) => ModalElement
  }

  export default Modal
}

declare module '@typo3/backend/login-refresh.js' {
  const LoginRefresh: {
    // Shows the backend's own password dialog when the login is gone
    checkActiveSession: () => Promise<void>
  }

  export default LoginRefresh
}

declare module '@typo3/core/java-script-item-processor.js' {
  export class JavaScriptItemProcessor {
    processItems(items: unknown[]): void
  }
}

declare module '@typo3/backend/security/sudo-mode-interceptor.js' {
  import type { RequestMiddleware } from '@typo3/core/ajax/ajax-request.js'

  export const sudoModeInterceptor: RequestMiddleware
}

declare module '@typo3/backend/module-menu.js' {
  const ModuleMenu: {
    App: {
      getCurrentModule(): string | null
      showModule(module: string, params?: string): Promise<void>
    }
  }

  export default ModuleMenu
}

declare module '@typo3/backend/storage/module-state-storage.js' {
  export const ModuleStateStorage: {
    update(module: string, identifier: string | number, select: boolean): void
  }
}

declare module '@typo3/backend/viewport.js' {
  const Viewport: {
    ContentContainer: {
      refresh(): void
    }
  }

  export default Viewport
}

declare module '@typo3/backend/storage/persistent.js' {
  const Persistent: {
    get(key: string): unknown
    set(key: string, value: unknown): Promise<unknown>
    isset(key: string): boolean
  }

  export default Persistent
}

declare const TYPO3: {
  lang: Partial<Record<string, string>>
  settings: {
    ajaxUrls: Record<string, string>
    visualPermissions?: {
      animation?: boolean
      toggleKey?: string
      switchUserKey?: string
      keysOnButtons?: boolean
      modifiers?: string
      // Published only where our toolbar item is not: the page of a user being read.
      leave?: string
    }
    FormEngine?: { formName?: string }
  }
}

declare module '@typo3/backend/hotkeys.js' {
  export const ModifierKeys: {
    readonly META: 'meta'
    readonly CTRL: 'control'
    readonly SHIFT: 'shift'
    readonly ALT: 'alt'
  }

  const hotkeys: {
    readonly normalizedCtrlModifierKey: string
    register(
      hotkey: string[],
      handler: (event: KeyboardEvent) => void,
      options?: {
        scope?: string
        allowOnEditables?: boolean
        allowRepeat?: boolean
        bindElement?: Element | undefined
      },
    ): void
  }

  export default hotkeys
}

declare module '@typo3/backend/tree/tree.js' {
  export interface TreeNode {
    readonly identifier: string
    readonly depth: number
    readonly checked?: boolean
    readonly __parents?: string[]
  }

  export interface PreparedNode {
    readonly identifier: string
    readonly depth: number
    readonly __parents?: string[]
    __hidden?: boolean
    __expanded?: boolean
  }

  export class Tree extends HTMLElement {
    setup: unknown
    allowNodeEdit: boolean
    allowNodeDrag: boolean
    allowNodeSorting: boolean
    getNodeClasses(node: TreeNode): string[]
    // Core shows every row that is not marked hidden
    readonly nodes: PreparedNode[]
    prepareNodes(nodes: PreparedNode[]): PreparedNode[]
    hideChildren(node: PreparedNode): void
    // A node refused here is never selected, focused or spoken of again
    isNodeSelectable(node: TreeNode): boolean
    selectNode(node: TreeNode, propagate?: boolean): void
    requestUpdate(): void
  }
}

declare module '@typo3/backend/tree/page-tree.js' {
  import { Tree } from '@typo3/backend/tree/tree.js'

  export type { PreparedNode, TreeNode } from '@typo3/backend/tree/tree.js'

  export class PageTree extends Tree {}
}

declare module '@typo3/backend/tree/file-storage-tree.js' {
  import { Tree } from '@typo3/backend/tree/tree.js'

  export class FileStorageTree extends Tree {}
}

declare module '@typo3/backend/storage/client.js' {
  const client: {
    get(key: string): string | null
    set(key: string, value: string): void
    unset(key: string): void
    isset(key: string): boolean
  }

  export default client
}
