import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: false,
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
    },
  },
  resolve: {
    alias: {
      '#src': resolve(import.meta.dirname, 'src'),
      '@typo3/backend/hotkeys.js': resolve(import.meta.dirname, 'tests/__mocks__/typo3-hotkeys.ts'),
      '@typo3/core/ajax/ajax-request.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-ajax-request.ts',
      ),
      '@typo3/core/java-script-item-processor.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-java-script-item-processor.ts',
      ),
      '@typo3/backend/notification.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-notification.ts',
      ),
      '@typo3/backend/login-refresh.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-login-refresh.ts',
      ),
      '@typo3/backend/module-menu.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-module-menu.ts',
      ),
      '@typo3/backend/storage/module-state-storage.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-module-state-storage.ts',
      ),
      '@typo3/backend/viewport.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-viewport.ts',
      ),
      '@typo3/backend/modal.js': resolve(import.meta.dirname, 'tests/__mocks__/typo3-modal.ts'),
      '@typo3/backend/storage/client.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-client-storage.ts',
      ),
      '@typo3/backend/storage/persistent.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-persistent-storage.ts',
      ),
      '@typo3/backend/security/sudo-mode-interceptor.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-sudo-mode-interceptor.ts',
      ),
      '@typo3/backend/tree/tree.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-tree.ts',
      ),
      '@typo3/backend/tree/page-tree.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-page-tree.ts',
      ),
      '@typo3/backend/tree/file-storage-tree.js': resolve(
        import.meta.dirname,
        'tests/__mocks__/typo3-file-storage-tree.ts',
      ),
    },
  },
})
