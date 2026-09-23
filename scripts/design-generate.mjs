import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (path) => readFileSync(resolve(root, path), 'utf8')
const hash = (text) => createHash('sha256').update(text).digest('hex')
const json = (value) => `${JSON.stringify(value, null, 2)}\n`
const checking = process.argv.includes('--check')
const outputs = new Map()
const emit = (path, value) => outputs.set(path, typeof value === 'string' ? value : json(value))
function files(dir) {
  return readdirSync(resolve(root, dir), { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? files(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`],
    )
    .sort()
}

const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile)
assert(!config.error, 'Cannot read tsconfig')
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
const program = ts.createProgram(parsed.fileNames, parsed.options)
const checker = program.getTypeChecker()
const source = program.getSourceFile(resolve(root, 'src/index.ts'))
const symbols = checker.getExportsOfModule(checker.getSymbolAtLocation(source))
const contracts = files('design/components').map((path) => ({ path, ...JSON.parse(read(path)) }))
const api = symbols
  .map((symbol) => {
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
    const declaration = target.declarations?.[0]
    return {
      name: symbol.name,
      typeOnly: !(target.flags & ts.SymbolFlags.Value),
      source: declaration ? relative(root, declaration.getSourceFile().fileName) : null,
      contract: contracts.find((c) => c.exports.includes(symbol.name))?.id ?? null,
      coverage: contracts.some((c) => c.exports.includes(symbol.name))
        ? 'pilot; see contract limits'
        : 'indexed; not-evaluated',
    }
  })
  .sort((a, b) => a.name.localeCompare(b.name))
for (const contract of contracts) {
  for (const name of contract.exports)
    assert(
      api.some((x) => x.name === name),
      `Unknown export ${name}`,
    )
  if (!Object.keys(contract.variants).length) continue
  const props = symbols.find((s) => s.name === `${contract.exports[0]}Props`)
  const target = props.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(props) : props
  const type = checker.getDeclaredTypeOfSymbol(target)
  for (const [property, allowed] of Object.entries(contract.variants)) {
    const member = type.getProperty(property)
    assert(member, `${contract.id}: missing property ${property}`)
    const actual = checker.getTypeOfSymbolAtLocation(member, source)
    const literals = (actual.isUnion() ? actual.types : [actual])
      .filter((t) => t.flags & ts.TypeFlags.StringLiteral)
      .map((t) => t.value)
      .sort()
    assert.deepEqual(
      [...allowed].sort(),
      literals,
      `${contract.id}.${property}: variants differ from TypeScript`,
    )
  }
}
emit('design/generated/api.json', api)

const tokens = []
for (const path of files('src/styles').filter((p) => p.endsWith('.css'))) {
  postcss.parse(read(path), { from: path }).walkDecls(/^--tz-/, (decl) => {
    const context = []
    for (let parent = decl.parent; parent && parent.type !== 'root'; parent = parent.parent) {
      context.unshift(
        parent.type === 'atrule' ? `@${parent.name} ${parent.params}` : parent.selector,
      )
    }
    tokens.push({ source: path, context, name: decl.prop, value: decl.value })
  })
}
emit('design/generated/tokens.json', tokens)
emit(
  'design/generated/reference.md',
  `# Generated Tezawari reference\n\nProducer: pnpm design:generate. Freshness: pnpm design:drift. CSS and TypeScript remain authoritative.\n\n## Public API\n\n| Export | Coverage | Contract |\n|---|---|---|\n${api.map((a) => `| ${a.name} | ${a.coverage} | ${a.contract ?? '—'} |`).join('\n')}\n\n## CSS token declarations\n\nContexts include overrides, media conditions, and motion states. Values are not independent policy.\n\n| Token | Value | Context | Source |\n|---|---|---|---|\n${tokens.map((t) => `| ${t.name} | ${t.value.replaceAll('|', '\\|')} | ${t.context.join(' → ')} | ${t.source} |`).join('\n')}\n`,
)

const descriptors = [
  {
    id: 'design.language',
    kind: 'reference',
    title: 'Tezawari consumer design principles',
    description: 'Public material principles and component usage guidance for consuming apps.',
    path: 'DESIGN.md',
    refs: [],
  },
  {
    id: 'design.integration',
    kind: 'reference',
    title: 'Portable design harness',
    description: 'Installation, consumer setup, verification, updates and MCP instructions.',
    path: 'DESIGN.md',
    refs: ['design.language', 'design.installation'],
  },
  {
    id: 'design.installation',
    kind: 'reference',
    title: 'Library installation and usage',
    description:
      'Build and pack Tezawari, install it in a React app, and import styles and components.',
    path: 'README.md',
    refs: [],
  },
  {
    id: 'design.tokens',
    kind: 'tokens',
    title: 'CSS token reference',
    description: 'CSS-derived declarations with selector and media context.',
    path: 'design/generated/tokens.json',
    refs: [],
  },
  {
    id: 'design.api',
    kind: 'api',
    title: 'Public API index',
    description: 'Every public TypeScript export and its verification coverage.',
    path: 'design/generated/api.json',
    refs: [],
  },
  {
    id: 'design.reference',
    kind: 'reference',
    title: 'Human reference',
    description: 'Generated API and token tables.',
    path: 'design/generated/reference.md',
    refs: ['design.api', 'design.tokens'],
  },
  ...[
    ...contracts.map((c) => c.path),
    ...files('design/patterns'),
    ...files('design/scenarios'),
    'design/rules.json',
  ].map((path) => {
    const { id, kind, title, description, refs } = JSON.parse(read(path))
    return { id, kind, title, description, refs, path }
  }),
  ...['install', 'build', 'review', 'improve'].map((task) => ({
    id: `skill.tezawari-${task}`,
    kind: 'skill',
    title: `Tezawari ${task}`,
    description: `Installed task workflow: ${task}.`,
    path: `.agents/skills/tezawari-${task}/SKILL.md`,
    refs: ['design.language', 'design.integration'],
  })),
]
const resources = descriptors.map((entry) => ({
  ...entry,
  uri: `tezawari://design/${entry.id}`,
  digest: hash(outputs.get(entry.path) ?? read(entry.path)),
}))
const packageVersion = JSON.parse(read('package.json')).version
const contractRevision = hash(json({ packageVersion, resources }))
emit('design/generated/catalog.json', {
  schemaVersion: 1,
  packageVersion,
  contractRevision,
  resources,
})
let stale = false
for (const [path, content] of outputs) {
  if (checking) {
    let actual
    try {
      actual = read(path)
    } catch {
      /* Missing generated output is stale. */
    }
    if (actual !== content) {
      console.error(`DESIGN-DRIFT: ${path}`)
      stale = true
    }
  } else {
    mkdirSync(dirname(resolve(root, path)), { recursive: true })
    writeFileSync(resolve(root, path), content)
  }
}
if (stale) process.exitCode = 1
else
  console.log(
    `${checking ? 'Verified' : 'Generated'} ${outputs.size} views; ${api.length} exports, ${tokens.length} CSS declarations`,
  )
