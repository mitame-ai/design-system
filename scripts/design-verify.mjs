import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:net'
import { resolve } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { chromium } from 'playwright'
import { digest, packageRoot } from '../harness/core.mjs'

const root = packageRoot
const runDir = resolve(root, 'test-results/design', new Date().toISOString().replaceAll(':', '-'))
mkdirSync(runDir, { recursive: true })
const steps = []
const summary = { status: 'running', node: process.version, runDir, steps }
const save = () =>
  writeFileSync(resolve(runDir, 'verification.json'), `${JSON.stringify(summary, null, 2)}\n`)
save()
async function command(label, cmd, args, { cwd = root, env = {}, expected = 0 } = {}) {
  console.log(label)
  const child = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (data) => {
    output += data
  })
  child.stderr.on('data', (data) => {
    output += data
  })
  const code = await new Promise((done, reject) => {
    child.once('error', reject)
    child.once('close', done)
  })
  const log = `${steps.length}-${label.replaceAll(/[^a-zA-Z0-9-]/g, '-')}.log`
  writeFileSync(resolve(runDir, log), output)
  steps.push({
    label,
    command: [cmd, ...args],
    cwd,
    code,
    expected,
    status: code === expected ? 'pass' : 'fail',
    log,
  })
  save()
  assert.equal(
    code,
    expected,
    `${label} exited ${code}; see ${resolve(runDir, log)}\n${output.slice(-3000)}`,
  )
  return output
}
async function freePort() {
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const port = server.address().port
  await new Promise((done) => server.close(done))
  return port
}
let preview
try {
  for (const script of [
    'design:drift',
    'typecheck',
    'build',
    'build-storybook',
    'check',
    'test:harness',
  ]) {
    await command(script, 'pnpm', [script])
  }
  const packs = resolve(runDir, 'pack')
  mkdirSync(packs)
  await command('pack', 'pnpm', ['pack', '--pack-destination', packs])
  const tarball = resolve(
    packs,
    readdirSync(packs).find((p) => p.endsWith('.tgz')),
  )
  summary.tarballDigest = digest(readFileSync(tarball))
  const consumer = resolve(runDir, 'consumer')
  cpSync(resolve(root, 'examples/consumer'), consumer, { recursive: true })
  await command('consumer-install', 'npm', ['install', '--no-audit', '--no-fund', tarball], {
    cwd: consumer,
  })
  const installed = resolve(consumer, 'node_modules/@mitame-ai/design-system')
  const cli = resolve(installed, 'harness/cli.mjs')
  await command('consumer-skills', process.execPath, [cli, 'install-skills', consumer], {
    cwd: consumer,
  })
  // Discovery and routing are exercised as an operator walkthrough below.
  const skills = ['install', 'build', 'review', 'improve'].map((task) => ({
    task,
    text: readFileSync(resolve(consumer, `.agents/skills/tezawari-${task}/SKILL.md`), 'utf8'),
  }))
  const context = JSON.parse(
    await command('consumer-resolve', process.execPath, [cli, 'resolve', 'scenario.profile-edit'], {
      cwd: consumer,
    }),
  )
  for (const resource of context.resources)
    assert(
      existsSync(resolve(installed, resource.path)),
      `Missing packed resource ${resource.path}`,
    )
  assert(skills.every((skill) => skill.text.includes('resolve scenario.profile-edit')))
  await command('consumer-build', 'npm', ['run', 'build'], { cwd: consumer })
  const port = await freePort()
  const origin = `http://127.0.0.1:${port}`
  preview = spawn(
    process.execPath,
    [
      resolve(consumer, 'node_modules/vite/bin/vite.js'),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    { cwd: consumer, stdio: 'ignore' },
  )
  let ready = false
  for (let i = 0; i < 100; i++) {
    try {
      ready = (await fetch(origin)).ok
    } catch {
      /* Preview may still be starting. */
    }
    if (ready) break
    await new Promise((done) => setTimeout(done, 100))
  }
  assert(ready, 'Consumer preview did not start')
  const env = { TEZAWARI_PREVIEW_ORIGIN: origin }
  async function check(name, expected = 0) {
    await command(
      name,
      process.execPath,
      [cli, 'check', 'scenario.profile-edit', '/', resolve(runDir, name)],
      { cwd: consumer, env, expected },
    )
    return JSON.parse(readFileSync(resolve(runDir, name, 'report.json'), 'utf8'))
  }
  const baseline = await check('baseline')
  async function verifyMCP(reference, name) {
    const client = new Client({ name: 'tezawari-packed-consumer', version: '1.0.0' })
    try {
      await client.connect(
        new StdioClientTransport({
          command: 'npx',
          args: ['mitame-design'],
          cwd: consumer,
          env: { ...process.env, ...env },
        }),
      )
      const listed = await client.listResources()
      for (const resource of listed.resources) await client.readResource({ uri: resource.uri })
      const mcpContext = await client.callTool({
        name: 'resolve_design_context',
        arguments: { scenarioId: 'scenario.profile-edit' },
      })
      assert.deepEqual(mcpContext.structuredContent, context)
      console.log(`MCP browser agreement: ${name}`)
      const mcp = await client.callTool(
        { name: 'check_design', arguments: { scenarioId: 'scenario.profile-edit', route: '/' } },
        undefined,
        { timeout: 900000 },
      )
      assert(!mcp.isError)
      const report = mcp.structuredContent
      writeFileSync(
        resolve(runDir, `${name}-mcp-report.json`),
        `${JSON.stringify(report, null, 2)}\n`,
      )
      const compare = (value) => ({
        ...value,
        checks: value.checks.map(({ evidence, ...check }) => check),
      })
      assert.deepEqual(compare(report), compare(reference), 'CLI/MCP check results differ')
      steps.push({
        label: `MCP transport and browser agreement: ${name}`,
        status: 'pass',
        resources: listed.resources.length,
      })
      save()
    } finally {
      await client.close()
    }
  }
  await verifyMCP(baseline, 'baseline')
  const appPath = resolve(consumer, 'src/App.tsx')
  const correct = readFileSync(appPath, 'utf8')
  assert(correct.includes("setStatus('error')"))
  writeFileSync(appPath, correct.replace("setStatus('error')", "setName(''); setStatus('error')"))
  await command('defect-build', 'npm', ['run', 'build'], { cwd: consumer })
  const defect = await check('deliberate-defect', 1)
  assert(
    defect.checks.some(
      (c) =>
        c.rule === 'FORM-RECOVERY' &&
        c.status === 'fail' &&
        c.observation.includes('lost entered value'),
    ),
  )
  assert.notEqual(defect.artifactRevision, baseline.artifactRevision)
  await verifyMCP(defect, 'deliberate-defect')
  writeFileSync(appPath, correct)
  await command('correction-build', 'npm', ['run', 'build'], { cwd: consumer })
  const corrected = await check('corrected')
  assert.equal(corrected.artifactRevision, baseline.artifactRevision)
  // A fresh task retrieves the adopted loading/disabled lesson, then consumes it.
  const freshContext = JSON.parse(
    await command(
      'fresh-task-resolve',
      process.execPath,
      [cli, 'resolve', 'scenario.profile-edit'],
      { cwd: consumer },
    ),
  )
  assert.equal(freshContext.contractRevision, context.contractRevision)
  const pattern = JSON.parse(
    readFileSync(resolve(installed, 'design/patterns/edit-form.json'), 'utf8'),
  )
  assert(pattern.requirements.some((line) => line.includes('animated contour')))
  assert(
    corrected.checks.filter((c) => c.rule === 'LAYOUT-OVERFLOW').every((c) => c.status === 'pass'),
  )
  const field = JSON.parse(readFileSync(resolve(installed, 'design/components/field.json'), 'utf8'))
  assert(field.behavior.some((line) => line.includes('role and accessible name')))
  assert(corrected.checks.filter((c) => c.rule === 'FORM-LABEL').every((c) => c.status === 'pass'))
  summary.adoptedLesson = {
    ids: ['field-accessible-name', 'material-gutter'],
    contractRevision: freshContext.contractRevision,
    evidence: 'corrected/report.json',
    destination: 'design/components/field.json',
  }
  const button = JSON.parse(
    readFileSync(resolve(installed, 'design/components/button.json'), 'utf8'),
  )
  assert(button.behavior.some((line) => line.includes('duplicate-submit')))
  assert(corrected.checks.some((c) => c.rule === 'FORM-PENDING' && c.status === 'pass'))
  // Build the optional Tailwind integration using the package's public CSS exports.
  writeFileSync(
    resolve(consumer, 'src/tailwind.css'),
    "@import 'tailwindcss';\n@import '@mitame-ai/design-system/theme.css';\n@import '@mitame-ai/design-system/styles.css';\n@source inline(\"bg-tz-paper text-tz-ink font-tz\");\n",
  )
  const mainPath = resolve(consumer, 'src/main.tsx')
  const main = readFileSync(mainPath, 'utf8')
  writeFileSync(
    mainPath,
    main.replace("import '@mitame-ai/design-system/styles.css'", "import './tailwind.css'"),
  )
  writeFileSync(
    resolve(consumer, 'vite.config.mjs'),
    "import tailwindcss from '@tailwindcss/vite'\nexport default { plugins: [tailwindcss()] }\n",
  )
  await command('tailwind-build', 'npm', ['run', 'build'], { cwd: consumer })
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.goto(origin)
    await page.evaluate(() => {
      const sample = document.createElement('div')
      sample.id = 'tailwind-proof'
      sample.className = 'bg-tz-paper text-tz-ink font-tz'
      sample.textContent = '手触り'
      document.body.append(sample)
    })
    // These literal classes also occur in source for Tailwind's scanner.
    await page
      .locator('main')
      .evaluate((el) => el.classList.add('bg-tz-paper', 'text-tz-ink', 'font-tz'))
    const styles = await page.locator('#tailwind-proof').evaluate((el) => {
      const actual = getComputedStyle(el)
      const expected = document.createElement('div')
      expected.style.cssText =
        'background:var(--tz-paper);color:var(--tz-ink);font-family:var(--tz-font)'
      document.body.append(expected)
      const reference = getComputedStyle(expected)
      const result = {
        actual: [actual.backgroundColor, actual.color, actual.fontFamily],
        expected: [reference.backgroundColor, reference.color, reference.fontFamily],
      }
      expected.remove()
      return result
    })
    assert.deepEqual(styles.actual, styles.expected)
    steps.push({ label: 'Tailwind public theme export', status: 'pass', styles })
  } finally {
    await browser.close()
  }
  // Leave the evidence consumer in the normal plain-CSS configuration.
  writeFileSync(mainPath, main)
  await command('plain-css-restore-build', 'npm', ['run', 'build'], { cwd: consumer })
  summary.walkthrough = {
    kind: 'operator walkthrough by implementing agent; no independent agent run',
    skills: skills.map((s) => s.task),
    contractRevision: context.contractRevision,
    artifactRevision: corrected.artifactRevision,
    note: 'Installed skills discovered, resolved, followed through checks and correction; contextual screenshots still require recorded review.',
  }
  summary.status = 'pass'
} catch (error) {
  summary.status = 'fail'
  summary.error = error.stack
  console.error(error.message)
  process.exitCode = 1
} finally {
  preview?.kill()
  save()
  console.log(`Evidence: ${runDir}`)
}
