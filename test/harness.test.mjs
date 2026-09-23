import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import test from 'node:test'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import {
  digest,
  loadHarness,
  packageRoot,
  previewURL,
  readResource,
  resolveContext,
  searchDesign,
} from '../harness/core.mjs'
import { installSkills } from '../harness/install.mjs'

const json = (value) => `${JSON.stringify(value, null, 2)}\n`
function workspace(fn) {
  const root = mkdtempSync(resolve(tmpdir(), 'tezawari-harness-'))
  try {
    for (const path of [
      'design',
      'DESIGN.md',
      'README.md',
      'package.json',
      '.agents/skills/tezawari-install',
      '.agents/skills/tezawari-build',
      '.agents/skills/tezawari-review',
      '.agents/skills/tezawari-improve',
    ]) {
      mkdirSync(resolve(root, path, '..'), { recursive: true })
      cpSync(resolve(packageRoot, path), resolve(root, path), { recursive: true })
    }
    return fn(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}
function mutate(root, change) {
  const path = resolve(root, 'design/generated/catalog.json')
  const catalog = JSON.parse(readFileSync(path, 'utf8'))
  change(catalog)
  for (const resource of catalog.resources) {
    resource.digest = digest(readFileSync(resolve(root, resource.path)))
  }
  catalog.contractRevision = digest(
    json({ packageVersion: catalog.packageVersion, resources: catalog.resources }),
  )
  writeFileSync(path, json(catalog))
}

test('all resources resolve, reference closures are complete and unknown inputs fail', () => {
  const harness = loadHarness()
  const resolved = resolveContext(harness, 'scenario.profile-edit')
  assert(resolved.resources.some((r) => r.id === 'component.button'))
  assert(resolved.resources.some((r) => r.id === 'design.integration' && r.path === 'DESIGN.md'))
  assert(resolved.resources.some((r) => r.id === 'skill.tezawari-install'))
  assert(searchDesign(harness, 'install').matches.some((r) => r.id === 'skill.tezawari-install'))
  for (const resource of harness.resources) {
    assert.notEqual(resource.path, 'DESIGN.local.md')
    assert(readResource(harness, resource.uri).text)
  }
  assert(searchDesign(harness, 'form').matches.length)
  assert.throws(() => searchDesign(harness, ' '))
  assert.throws(() => resolveContext(harness, 'unknown'))
  assert.throws(() => readResource(harness, 'file:///etc/passwd'))
  assert(harness.entries.get('design.api').data.length > 400)
  assert(
    harness.entries
      .get('design.api')
      .data.some((a) => a.contract === null && a.coverage.includes('not-evaluated')),
  )
})

test('catalog rejects duplicate IDs, broken references, unsupported checks, and missing skill routing', () => {
  for (const kind of ['duplicate', 'reference', 'detector', 'skill'])
    workspace((root) => {
      mutate(root, (catalog) => {
        if (kind === 'duplicate') catalog.resources.push(catalog.resources[0])
        if (kind === 'reference') catalog.resources[0].refs.push('missing')
        if (kind === 'detector') {
          const path = resolve(root, 'design/rules.json')
          const rules = JSON.parse(readFileSync(path, 'utf8'))
          rules.rules[0].detector = 'not-implemented'
          writeFileSync(path, json(rules))
        }
        if (kind === 'skill')
          catalog.resources.find((r) => r.kind === 'scenario').refs = ['pattern.edit-form']
      })
      assert.throws(() => loadHarness(root))
    })
})

test('manual generated drift and missing packed resources are rejected', () =>
  workspace((root) => {
    const path = resolve(root, 'design/generated/tokens.json')
    const before = readFileSync(path, 'utf8')
    writeFileSync(path, `${before}\n`)
    assert.throws(() => loadHarness(root), /Stale or modified/)
    writeFileSync(path, before)
    loadHarness(root)
    rmSync(resolve(root, '.agents/skills/tezawari-review/SKILL.md'))
    assert.throws(() => loadHarness(root), /ENOENT/)
  }))

test('preview routes cannot escape startup configured loopback origin', () => {
  assert.equal(
    previewURL('http://127.0.0.1:4173', '/profile?mode=test'),
    'http://127.0.0.1:4173/profile?mode=test',
  )
  for (const origin of [
    'https://example.com',
    'file:///etc',
    'http://user@localhost',
    'http://localhost/path',
  ])
    assert.throws(() => previewURL(origin))
  for (const route of ['//example.com', '/\\example.com', 'https://example.com'])
    assert.throws(() => previewURL('http://localhost:4173', route))
})

test('skill installation, upgrade and removal preserve unrelated and edited files', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'tezawari-install-'))
  try {
    writeFileSync(resolve(root, 'AGENTS.md'), 'Unrelated instructions\n')
    installSkills(root)
    const addedSkill = resolve(root, '.agents/skills/tezawari-install/SKILL.md')
    assert.equal(
      readFileSync(addedSkill, 'utf8'),
      readFileSync(resolve(packageRoot, '.agents/skills/tezawari-install/SKILL.md'), 'utf8'),
    )
    installSkills(root)
    // Model an earlier three-skill installation, then upgrade it in place.
    const receiptPath = resolve(root, '.agents/tezawari-skills.json')
    const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'))
    delete receipt.files['.agents/skills/tezawari-install/SKILL.md']
    writeFileSync(receiptPath, json(receipt))
    rmSync(addedSkill)
    installSkills(root)
    assert(readFileSync(addedSkill, 'utf8').includes('name: tezawari-install'))
    const path = resolve(root, '.agents/skills/tezawari-review/SKILL.md')
    const original = readFileSync(path, 'utf8')
    writeFileSync(path, `${original}\nLocal edit\n`)
    assert.throws(() => installSkills(root), /conflict/)
    assert.throws(() => installSkills(root, { remove: true }), /conflict/)
    assert(readFileSync(path, 'utf8').includes('Local edit'))
    writeFileSync(path, original)
    installSkills(root, { remove: true })
    assert.throws(() => readFileSync(addedSkill), /ENOENT/)
    assert.equal(readFileSync(resolve(root, 'AGENTS.md'), 'utf8'), 'Unrelated instructions\n')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('learning stays outside retrieval until authority is adopted; old snapshots stay stable', () =>
  workspace((root) => {
    const original = loadHarness(root)
    mkdirSync(resolve(root, 'feedback'))
    for (const status of ['pending', 'rejected'])
      writeFileSync(
        resolve(root, `feedback/${status}.json`),
        json({ status, proposed: 'Test-only policy should not be retrieved' }),
      )
    assert.equal(loadHarness(root).contractRevision, original.contractRevision)
    assert.equal(searchDesign(loadHarness(root), 'Test-only policy').matches.length, 0)
    // Simulated acceptance in a disposable copy, not stakeholder approval.
    const path = resolve(root, 'design/components/button.json')
    const contract = JSON.parse(readFileSync(path, 'utf8'))
    contract.behavior.push('Test adoption: prevent duplicate requests at the form boundary.')
    writeFileSync(path, json(contract))
    assert.throws(() => loadHarness(root), /Stale/)
    mutate(root, () => {})
    const next = loadHarness(root)
    assert.notEqual(next.contractRevision, original.contractRevision)
    assert(!original.entries.get('component.button').text.includes('Test adoption'))
    assert(next.entries.get('component.button').text.includes('Test adoption'))
    assert.equal(
      next.entries.get('component.input').text,
      original.entries.get('component.input').text,
    )
    assert(
      resolveContext(next, 'scenario.profile-edit').resources.some(
        (r) => r.id === 'component.button',
      ),
    )
  }))

test('real stdio client retrieves the same context as CLI and reports errors', async () => {
  const client = new Client({ name: 'tezawari-contract-test', version: '1.0.0' })
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [resolve(packageRoot, 'harness/cli.mjs'), 'mcp'],
    cwd: tmpdir(),
  })
  try {
    await client.connect(transport)
    const listed = await client.listResources()
    assert.equal(listed.resources.length, loadHarness().resources.length)
    for (const resource of listed.resources)
      assert((await client.readResource({ uri: resource.uri })).contents[0].text)
    const mcp = await client.callTool({
      name: 'resolve_design_context',
      arguments: { scenarioId: 'scenario.profile-edit' },
    })
    const cli = JSON.parse(
      execFileSync(
        process.execPath,
        [resolve(packageRoot, 'harness/cli.mjs'), 'resolve', 'scenario.profile-edit'],
        { encoding: 'utf8', cwd: tmpdir() },
      ),
    )
    assert.deepEqual(mcp.structuredContent, cli)
    const bad = await client.callTool({
      name: 'resolve_design_context',
      arguments: { scenarioId: 'unknown' },
    })
    assert.equal(bad.isError, true)
    await assert.rejects(client.readResource({ uri: 'tezawari://design/unknown' }))
    const unconfigured = await client.callTool({
      name: 'check_design',
      arguments: { scenarioId: 'scenario.profile-edit' },
    })
    assert.equal(unconfigured.isError, true)
  } finally {
    await client.close()
  }
})

test('source changes fail non-mutating drift until regeneration, and real variant changes are rejected', () =>
  workspace((root) => {
    for (const path of ['src', 'tsconfig.json', 'scripts/design-generate.mjs']) {
      mkdirSync(resolve(root, path, '..'), { recursive: true })
      cpSync(resolve(packageRoot, path), resolve(root, path), { recursive: true })
    }
    symlinkSync(resolve(packageRoot, 'node_modules'), resolve(root, 'node_modules'), 'dir')
    const generator = resolve(root, 'scripts/design-generate.mjs')
    const tokenPath = resolve(root, 'design/generated/tokens.json')
    const oldTokens = readFileSync(tokenPath, 'utf8')
    const cssPath = resolve(root, 'src/styles/components.css')
    writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace('#f2efe9', '#f2efe8'))
    assert.throws(() => execFileSync(process.execPath, [generator, '--check'], { stdio: 'pipe' }))
    assert.equal(
      readFileSync(tokenPath, 'utf8'),
      oldTokens,
      'Freshness check rewrote generated data',
    )
    execFileSync(process.execPath, [generator], { stdio: 'pipe' })
    execFileSync(process.execPath, [generator, '--check'], { stdio: 'pipe' })
    assert(readFileSync(tokenPath, 'utf8').includes('#f2efe8'))
    loadHarness(root)
    const button = resolve(root, 'src/components/Button.tsx')
    writeFileSync(
      button,
      readFileSync(button, 'utf8').replace("ink: 'tz--ink'", "solid: 'tz--ink'"),
    )
    assert.throws(
      () => execFileSync(process.execPath, [generator, '--check'], { stdio: 'pipe' }),
      /variants differ/,
    )
  }))

test('skill installation refuses symlinked targets without writing outside the app', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'tezawari-symlink-'))
  const outside = mkdtempSync(resolve(tmpdir(), 'tezawari-outside-'))
  try {
    writeFileSync(resolve(outside, 'sentinel'), 'preserve')
    symlinkSync(outside, resolve(root, '.agents'), 'dir')
    assert.throws(() => installSkills(root), /symlink/)
    assert.equal(readFileSync(resolve(outside, 'sentinel'), 'utf8'), 'preserve')
    assert.equal(readdirSync(outside).length, 1)
  } finally {
    rmSync(root, { recursive: true, force: true })
    rmSync(outside, { recursive: true, force: true })
  }
})

test('package includes the consumer guide and excludes maintainer-only documents', () => {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: packageRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
  )
  const paths = pack.files.map((file) => file.path)
  assert(paths.includes('DESIGN.md'))
  assert(paths.includes('.agents/skills/tezawari-install/SKILL.md'))
  assert(!paths.includes('DESIGN.local.md'))
  assert(!paths.includes('DESIGN.external.md'))
  assert(!paths.includes('AGENTS.md'))
})
