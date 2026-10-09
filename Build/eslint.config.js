import { readFileSync } from 'node:fs'
import boundaries from 'eslint-plugin-boundaries'
import tseslint from 'typescript-eslint'

const { verdicts } = JSON.parse(
  readFileSync(new URL('../Contract/vocabulary.json', import.meta.url), 'utf8'),
)

const ownSlice = type => ({
  from: [{ type }],
  allow: [{ to: { type, captured: { name: '{{from.captured.name}}' } } }],
})

const noCssInTypeScript = [
  { object: 'document', property: 'styleSheets' },
  { property: 'insertRule' },
  { property: 'cssText' },
]

const noCrossDocumentReach = [
  { property: 'contentWindow' },
  { property: 'contentDocument' },
  { object: 'location', property: 'href' },
]

const noVocabularyLiterals = {
  selector: `Literal[value=/^(data-vperm-|vperm-|${verdicts.join('$|')}$)/]`,
  message: 'Verdict, attribute and class names come from platform/vocabulary.ts.',
}

const noRawCustomEvent = {
  selector: 'NewExpression[callee.name="CustomEvent"]',
  message: 'Emit through platform/bus.ts.',
}

const noIframeLiteral = {
  selector: 'Literal[value=/^(iframe|#typo3-contentIframe)$/]',
  message: 'Reaching another document belongs in surfaces/ or platform/.',
}

export default tseslint.config(
  { ignores: ['node_modules/**', '*.config.ts', 'src/platform/contract.ts'] },

  {
    files: ['scripts/**/*.mjs'],
    extends: [tseslint.configs.strict, tseslint.configs.stylistic],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  {
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'platform', pattern: 'src/platform', mode: 'folder' },
        { type: 'surface', pattern: 'src/surfaces/*', mode: 'folder', capture: ['name'] },
        { type: 'entry', pattern: 'src/main.ts', mode: 'file' },
        { type: 'slice', pattern: 'src/*', mode: 'folder', capture: ['name'] },
        { type: 'mock', pattern: 'tests/__mocks__/**', mode: 'full' },
        { type: 'fixture', pattern: 'tests/**/*-fixture.ts', mode: 'full' },
        { type: 'test', pattern: 'tests/**', mode: 'full' },
      ],
      'boundaries/dependency-nodes': ['import', 'dynamic-import'],
      // add a resolver; without one the rule matches nothing silently
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
    },
    rules: {
      'boundaries/dependencies': ['error', {
        default: 'disallow',
        rules: [
          { from: [{ type: 'platform' }], allow: [{ to: { type: 'platform' } }] },
          { from: [{ type: 'surface' }, { type: 'slice' }], allow: [{ to: { type: 'platform' } }] },
          { from: [{ type: 'slice' }], allow: [{ to: { type: 'surface' } }] },
          ownSlice('surface'),
          ownSlice('slice'),
          { from: [{ type: 'test' }], allow: [{ to: { type: 'mock' } }, { to: { type: 'fixture' } }] },
          { from: [{ type: 'fixture' }], allow: [{ to: { type: 'platform' } }, { to: { type: 'surface' } }] },
          {
            from: [{ type: 'entry' }, { type: 'test' }],
            allow: [{ to: { type: 'platform' } }, { to: { type: 'surface' } }, { to: { type: 'slice' } }, { to: { type: 'entry' } }],
          },
        ],
      }],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },

  {
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{ group: ['#src/*'], message: 'Use a relative import inside src/.' }],
      }],
    },
  },

  {
    files: ['src/platform/**/*.ts'],
    rules: {
      'no-restricted-properties': ['error', ...noCssInTypeScript],
    },
  },

  {
    files: ['src/surfaces/**/*.ts'],
    rules: {
      'no-restricted-properties': ['error', ...noCssInTypeScript],
      'no-restricted-syntax': ['error', noVocabularyLiterals, noRawCustomEvent],
    },
  },

  {
    files: ['src/**/*.ts'],
    ignores: ['src/platform/**', 'src/surfaces/**'],
    rules: {
      'no-restricted-properties': ['error', ...noCssInTypeScript, ...noCrossDocumentReach],
      'no-restricted-syntax': ['error', noVocabularyLiterals, noRawCustomEvent, noIframeLiteral],
    },
  },
)
