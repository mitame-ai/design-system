import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, realpathSync } from 'node:fs'
import { resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { detectors, runBrowserChecks } from './browser.mjs'

export const packageRoot = fileURLToPath(new URL('../', import.meta.url))
export const digest = (value) => createHash('sha256').update(value).digest('hex')
const json = (value) => `${JSON.stringify(value, null, 2)}\n`

/** Load one validated immutable process snapshot. Restart after package updates. */
export function loadHarness(root = packageRoot) {
  const base = realpathSync(root)
  const catalog = JSON.parse(readFileSync(resolve(base, 'design/generated/catalog.json'), 'utf8'))
  assert.equal(catalog.schemaVersion, 1, 'Unsupported catalog version')
  const { packageVersion, resources, contractRevision } = catalog
  assert.equal(
    contractRevision,
    digest(json({ packageVersion, resources })),
    'Catalog revision mismatch',
  )
  assert.equal(
    packageVersion,
    JSON.parse(readFileSync(resolve(base, 'package.json'), 'utf8')).version,
    'Package version mismatch',
  )
  const entries = new Map()
  for (const resource of resources) {
    assert(!entries.has(resource.id), `Duplicate resource ${resource.id}`)
    assert.equal(resource.uri, `tezawari://design/${resource.id}`, 'Invalid resource URI')
    const path = realpathSync(resolve(base, resource.path))
    assert(path.startsWith(base + sep), 'Resource outside package')
    assert(!resource.path.split('/').includes('feedback'), 'Feedback is not production knowledge')
    const text = readFileSync(path, 'utf8')
    assert.equal(digest(text), resource.digest, `Stale or modified resource: ${resource.id}`)
    entries.set(resource.id, {
      ...resource,
      text,
      data: resource.path.endsWith('.json') ? JSON.parse(text) : null,
    })
  }
  for (const entry of entries.values()) {
    for (const ref of entry.refs) assert(entries.has(ref), `${entry.id}: unresolved ${ref}`)
  }
  const rules = entries.get('design.rules')?.data.rules
  assert(Array.isArray(rules), 'Missing rule catalog')
  assert.equal(new Set(rules.map((r) => r.id)).size, rules.length, 'Duplicate rule IDs')
  for (const rule of rules) {
    assert(
      rule.detector === 'review' || detectors.includes(rule.detector),
      `Unsupported detector: ${rule.detector}`,
    )
    assert(entries.get(rule.scope)?.kind === 'scenario', `Invalid scope ${rule.scope}`)
    assert(entries.get(rule.scope).data.rules.includes(rule.id), `Unreachable rule ${rule.id}`)
  }
  for (const detector of detectors)
    assert(
      rules.some((r) => r.detector === detector),
      `Unmapped detector ${detector}`,
    )
  for (const entry of entries.values()) {
    if (entry.kind !== 'scenario') continue
    assert(
      entry.data.pattern && entries.get(entry.data.pattern)?.kind === 'pattern',
      'Missing pattern',
    )
    for (const id of entry.data.rules)
      assert(
        rules.some((r) => r.id === id && r.scope === entry.id),
        `Unknown or wrong-scope rule ${id}`,
      )
    for (const task of ['build', 'review', 'improve'])
      assert(entry.refs.includes(`skill.tezawari-${task}`), `Missing ${task} skill routing`)
  }
  return { packageVersion, contractRevision, resources, entries, rules }
}

export function readResource(harness, uri) {
  const resource = [...harness.entries.values()].find((r) => r.uri === uri)
  assert(resource, `Unknown resource: ${uri}`)
  return {
    uri,
    mimeType: resource.path.endsWith('.json') ? 'application/json' : 'text/markdown',
    text: resource.text,
  }
}

export function searchDesign(harness, query) {
  assert(
    typeof query === 'string' && query.trim() && query.length <= 200,
    'Query must contain 1–200 characters',
  )
  const matches = harness.resources.filter((r) =>
    `${r.id} ${r.title} ${r.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return {
    packageVersion: harness.packageVersion,
    contractRevision: harness.contractRevision,
    matches: matches.slice(0, 20),
    truncated: matches.length > 20,
  }
}

export function resolveContext(harness, scenarioId) {
  assert(harness.entries.get(scenarioId)?.kind === 'scenario', `Unknown scenario: ${scenarioId}`)
  const selected = new Set()
  const visit = (id) => {
    if (selected.has(id)) return
    selected.add(id)
    for (const ref of harness.entries.get(id).refs) visit(ref)
  }
  visit(scenarioId)
  visit('design.api')
  return {
    packageVersion: harness.packageVersion,
    contractRevision: harness.contractRevision,
    scenarioId,
    resources: [...selected].map((id) => {
      const { text, data, ...entry } = harness.entries.get(id)
      return entry
    }),
  }
}

export function previewURL(origin, route = '/') {
  assert(
    typeof origin === 'string' && origin,
    'Set TEZAWARI_PREVIEW_ORIGIN to a local preview origin at startup',
  )
  const base = new URL(origin)
  assert(
    ['http:', 'https:'].includes(base.protocol) &&
      ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname),
    'Only loopback preview origins are supported',
  )
  assert(
    !base.username && !base.password && base.pathname === '/' && !base.search && !base.hash,
    'Expected an origin without credentials, route, or query',
  )
  assert(
    typeof route === 'string' &&
      route.startsWith('/') &&
      !route.startsWith('//') &&
      !route.includes('\\'),
    'Expected a relative preview route',
  )
  const url = new URL(route, base)
  assert.equal(url.origin, base.origin, 'Route leaves configured preview origin')
  return url.href
}

export async function checkDesign(
  harness,
  { scenarioId, route = '/' },
  { origin, outputDir } = {},
) {
  resolveContext(harness, scenarioId)
  const url = previewURL(origin, route)
  const scenario = harness.entries.get(scenarioId).data
  return runBrowserChecks(harness, scenario, { url, outputDir })
}
