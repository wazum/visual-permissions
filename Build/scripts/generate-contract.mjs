import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function fixture(name) {
  const { comment, ...rest } = JSON.parse(
    readFileSync(resolve(root, `../Contract/${name}.json`), 'utf8'),
  )

  return rest
}

const banner = '// Generated from Contract/*.json by scripts/generate-contract.mjs. Do not edit.'

const { scopes, verdicts, kinds } = fixture('vocabulary')
const { attributes, classes, elements } = fixture('dom-attributes')
const { events } = fixture('events')

const kebab = name => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
const list = values => values.map(value => `  '${value}',`).join('\n')
const record = entries =>
  Object.entries(entries).map(([key, value]) => `  ${key}: '${value}',`).join('\n')

writeFileSync(
  resolve(root, 'src/platform/contract.ts'),
  [
    banner,
    '',
    `export const scopes = [\n${list(scopes)}\n] as const`,
    '',
    `export const verdicts = [\n${list(verdicts)}\n] as const`,
    '',
    `export const kinds = [\n${list(kinds)}\n] as const`,
    '',
    `export const attributes = {\n${record(attributes)}\n} as const`,
    '',
    `export const classes = {\n${record(classes)}\n} as const`,
    '',
    `export const elements = {\n${record(elements)}\n} as const`,
    '',
    `export const eventNames = [\n${list(Object.keys(events))}\n] as const`,
    '',
  ].join('\n'),
)

const routes = Object.fromEntries(
  [...readFileSync(resolve(root, '../Configuration/Backend/AjaxRoutes.php'), 'utf8')
    .matchAll(/'visual_permissions_(\w+)' => \[/g)]
    .map(([, name]) => [name, `visual_permissions_${name}`]),
)

if (Object.keys(routes).length === 0) {
  throw new Error('No route found in Configuration/Backend/AjaxRoutes.php.')
}

writeFileSync(
  resolve(root, 'src/platform/routes.ts'),
  [banner, '', `export const routes = {\n${record(routes)}\n} as const`, ''].join('\n'),
)

writeFileSync(
  resolve(root, 'src/platform/_contract.scss'),
  [
    banner,
    ...Object.entries(attributes).map(([name, value]) => `$attribute-${kebab(name)}: '${value}';`),
    ...Object.entries(classes).map(([name, value]) => `$class-${kebab(name)}: '${value}';`),
    ...Object.entries(elements).map(([name, value]) => `$element-${kebab(name)}: '${value}';`),
    ...verdicts.map(verdict => `$verdict-${kebab(verdict)}: '${verdict}';`),
    '',
  ].join('\n'),
)
