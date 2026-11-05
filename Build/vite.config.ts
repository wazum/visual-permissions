import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: false,
  build: {
    lib: {
      entry: { main: resolve(import.meta.dirname, 'src/main.ts') },
      formats: ['es'],
    },
    outDir: '../Resources/Public/JavaScript/dist',
    emptyOutDir: true,
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      external: [/^@typo3\//, /^@lit\//, /^lit($|\/)/, 'bootstrap'],
    },
  },
  resolve: {
    alias: { '#src': resolve(import.meta.dirname, 'src') },
  },
})
