import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**', 'eslint.config.js'] },

  {
    files: ['**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
