import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

export const detectors = [
  'labels',
  'invalid',
  'pending',
  'recovery',
  'keyboard',
  'layout',
  'theme',
  'motion',
  'examples',
]
const hash = (value) => createHash('sha256').update(value).digest('hex')
const waitFor = async (fn, message) => {
  const deadline = Date.now() + 4000
  while (Date.now() < deadline) {
    if (await fn()) return
    await new Promise((done) => setTimeout(done, 40))
  }
  throw new Error(message)
}

export async function runBrowserChecks(harness, scenario, { url, outputDir }) {
  const checks = []
  const assets = new Map()
  const bodies = []
  const origin = new URL(url).origin
  let browser
  let browserVersion = null
  if (outputDir) mkdirSync(outputDir, { recursive: true })
  try {
    browser = await chromium.launch()
    browserVersion = browser.version()
    for (const viewport of scenario.viewports) {
      for (const colorScheme of scenario.themes) {
        for (const reducedMotion of scenario.motion) {
          const context = await browser.newContext({
            viewport,
            colorScheme,
            reducedMotion,
            locale: 'ja-JP',
          })
          const page = await context.newPage()
          page.setDefaultTimeout(5000)
          const key = `${viewport.width}-${colorScheme}-${reducedMotion}`
          const errors = []
          page.on('pageerror', (error) => errors.push(error.message))
          const fixture = scenario.fixture
          let responses = []
          let requests = 0
          let releasePending
          await context.route('**/*', async (route) => {
            const requestURL = new URL(route.request().url())
            if (requestURL.origin !== origin) return route.abort()
            if (requestURL.pathname === fixture.endpoint) {
              requests++
              const response = responses.shift() ?? { status: 200 }
              if (response.hold)
                await new Promise((done) => {
                  releasePending = done
                })
              return route.fulfill({
                status: response.status,
                contentType: 'application/json',
                body: JSON.stringify({ ok: response.status === 200 }),
              })
            }
            // This verifier is for local previews. Unmocked writes never reach a backend.
            if (!['GET', 'HEAD'].includes(route.request().method())) return route.abort()
            return route.continue()
          })
          page.on('response', (response) => {
            const parsed = new URL(response.url())
            if (parsed.origin !== origin || parsed.pathname === fixture.endpoint) return
            bodies.push(
              response
                .body()
                .then((body) => assets.set(parsed.pathname + parsed.search, hash(body)))
                .catch((error) => errors.push(`Artifact capture: ${error.message}`)),
            )
          })
          async function open() {
            releasePending?.()
            releasePending = undefined
            responses = []
            requests = 0
            await page.goto(url, { waitUntil: 'networkidle' })
            await page.evaluate(() => document.fonts.ready)
            await page.getByRole('textbox', { name: fixture.label, exact: true }).waitFor()
          }
          const input = () => page.getByRole('textbox', { name: fixture.label, exact: true })
          const submit = () => page.getByRole('button', { name: fixture.save, exact: true })
          async function capture(state) {
            if (!outputDir) return []
            const file = `${key}-${state}.png`
            await page
              .locator(state === 'component-examples' ? 'aside' : 'main')
              .screenshot({ path: resolve(outputDir, file), animations: 'disabled' })
            return [file]
          }
          async function run(detector, state, test) {
            const rule = harness.rules.find(
              (r) => r.scope === scenario.id && r.detector === detector,
            )
            if (!rule) return
            try {
              const observation = await test()
              checks.push({
                rule: rule.id,
                status: 'pass',
                state,
                viewport,
                colorScheme,
                reducedMotion,
                observation,
                evidence: await capture(state),
              })
            } catch (error) {
              checks.push({
                rule: rule.id,
                status: 'fail',
                state,
                viewport,
                colorScheme,
                reducedMotion,
                observation: error.message,
                evidence: await capture(`${state}-failed`).catch(() => []),
              })
            } finally {
              releasePending?.()
              releasePending = undefined
            }
          }
          await run('labels', 'default', async () => {
            await open()
            assert.equal(await input().getAttribute('required'), '')
            assert(
              await input().evaluate((el) => el.labels.length > 0),
              'Input lacks a native label association',
            )
            assert.equal(await input().inputValue(), fixture.initial)
            assert.equal(await submit().getAttribute('type'), 'submit')
            return 'Display name is labeled and required; save is an explicit submit button.'
          })
          await run('invalid', 'invalid', async () => {
            await open()
            await input().fill('')
            await submit().click()
            await waitFor(
              async () => (await input().getAttribute('aria-invalid')) === 'true',
              'Missing aria-invalid',
            )
            const id = await input().getAttribute('aria-describedby')
            assert(id, 'Missing error association')
            const associated = await page.evaluate(
              (ids) =>
                ids.split(/\s+/).some((value) => {
                  const error = document.getElementById(value)
                  return (
                    error?.getAttribute('role') === 'alert' && error.textContent.trim().length > 0
                  )
                }),
              id,
            )
            assert(associated, 'Error text is not associated with input')
            assert.equal(requests, 0, 'Invalid input sent a request')
            return 'Validation announces an associated error without submitting.'
          })
          await run('pending', 'pending', async () => {
            await open()
            responses = [{ status: 500, hold: true }]
            await input().fill(fixture.edited)
            await submit().click()
            await waitFor(() => requests === 1, 'Save did not reach pending')
            assert(await submit().isDisabled(), 'Pending submit must be disabled')
            assert(await input().isDisabled(), 'Pending save must keep the submitted draft stable')
            assert.equal(await submit().getAttribute('aria-busy'), 'true')
            await page.keyboard.press('Enter')
            await submit().evaluate((button) => button.click())
            assert.equal(requests, 1, 'Duplicate save request')
            return 'One intercepted request; pending draft is disabled and save is disabled/aria-busy.'
          })
          await run('recovery', 'recovered', async () => {
            // The second edit is the neighboring long-content case.
            for (const name of [fixture.edited, fixture.long]) {
              await open()
              responses = [{ status: 500 }, { status: 200 }]
              await input().fill(name)
              await submit().click()
              await page.getByText(fixture.error, { exact: true }).waitFor()
              assert.equal(await input().inputValue(), name, 'Failed save lost entered value')
              await capture(name === fixture.long ? 'server-error-long' : 'server-error')
              await submit().click()
              await page.getByText(fixture.success, { exact: true }).waitFor()
              assert.equal(await input().inputValue(), name, 'Retry changed entered value')
              assert.equal(requests, 2)
            }
            return 'Failed saves preserve normal and long edits; retry succeeds with two total requests.'
          })
          await run('keyboard', 'keyboard-focus', async () => {
            await open()
            await page.keyboard.press('Tab')
            assert(
              await input().evaluate((el) => el === document.activeElement),
              'First focus is not the input',
            )
            const focus = await input().evaluate((el) => {
              const edge = el.closest('.tz-well')?.querySelector('.tz-edge')
              return edge && Number.parseFloat(getComputedStyle(edge).strokeWidth) > 1.5
            })
            await waitFor(
              () =>
                input().evaluate(
                  (el) =>
                    Number.parseFloat(
                      getComputedStyle(el.closest('.tz-well').querySelector('.tz-edge'))
                        .strokeWidth,
                    ) > 1.5,
                ),
              'Input focus line is not visible',
            )
            assert(focus !== null)
            await input().fill(fixture.edited)
            await page.keyboard.press('Tab')
            assert(
              await submit().evaluate((el) => el === document.activeElement),
              'Save is not next in keyboard order',
            )
            await waitFor(
              () =>
                submit().evaluate(
                  (el) =>
                    Number.parseFloat(getComputedStyle(el.querySelector('.tz-ring')).opacity) > 0.5,
                ),
              'Save focus ring is not visible',
            )
            await capture('button-focus')
            await page.keyboard.press('Enter')
            await page.getByText(fixture.success, { exact: true }).waitFor()
            return 'Keyboard reaches input then save; visible focus and Enter submission work.'
          })
          await run('layout', 'long-content', async () => {
            await open()
            await input().fill(fixture.long)
            const geometry = await page.evaluate(() => {
              const controls = [...document.querySelectorAll('main input, main button, main form')]
              return {
                overflow: document.documentElement.scrollWidth > innerWidth,
                clipped: controls.some((el) => {
                  const r = el.getBoundingClientRect()
                  return r.left < 0 || r.right > innerWidth || r.width <= 0
                }),
              }
            })
            assert(
              !geometry.overflow && !geometry.clipped,
              'Horizontal overflow or offscreen control',
            )
            return 'Page and form controls fit the viewport with long input.'
          })
          await run('theme', 'theme', async () => {
            await open()
            const declarations = harness.entries.get('design.tokens').data
            const expected = (token, selector) =>
              declarations
                .filter(
                  (t) =>
                    t.name === token &&
                    t.context.at(-1) === selector &&
                    (colorScheme === 'dark' ||
                      !t.context.some((c) => c.includes('prefers-color-scheme: dark'))),
                )
                .at(-1)?.value
            const styles = await page.evaluate(({ instructionId, instructionToken }) => {
              const button = document.querySelector('main button')
              const card = document.querySelector('main .tz-card')
              const stage = getComputedStyle(document.querySelector('main'))
              const helper = getComputedStyle(document.getElementById(instructionId))
              const reference = document.createElement('div')
              reference.style.cssText = `background:var(--tz-paper);color:var(${instructionToken});font-family:var(--tz-font)`
              document.body.append(reference)
              const expectedStyle = getComputedStyle(reference)
              const consumed = [stage.backgroundColor, helper.color, stage.fontFamily]
              const expectedConsumed = [
                expectedStyle.backgroundColor,
                expectedStyle.color,
                expectedStyle.fontFamily,
              ]
              reference.remove()

              return {
                consumed,
                expectedConsumed,
                paper: getComputedStyle(document.documentElement)
                  .getPropertyValue('--tz-paper')
                  .trim(),
                buttonAmp: getComputedStyle(button).getPropertyValue('--tz-amp').trim(),
                cardAmp: getComputedStyle(card).getPropertyValue('--tz-amp').trim(),
                buttonShade: getComputedStyle(button.querySelector(':scope > .tz-shell .tz-shade'))
                  .display,
                svg: !!button.querySelector(':scope > .tz-shell svg path'),
              }
            }, fixture)
            assert.deepEqual(
              styles.consumed,
              styles.expectedConsumed,
              'Stage and instruction do not consume their semantic tokens',
            )
            assert.equal(
              styles.paper,
              expected('--tz-paper', ':root'),
              'Theme differs from CSS authority',
            )
            assert.equal(
              styles.buttonAmp,
              expected('--tz-amp', '.tz'),
              'Nested button inherited foreign shape tokens',
            )
            assert.notEqual(
              styles.buttonAmp,
              styles.cardAmp,
              'Nested card and button lost distinct shape tokens',
            )
            assert.equal(styles.buttonShade, 'none', 'Card shadow leaked into button')
            assert(styles.svg, 'Material SVG was not painted')
            return 'CSS theme matches authority; nested button retains its own shape and shadow.'
          })
          await run('motion', 'motion', async () => {
            await open()
            const shell = page.locator('main button > .tz-shell').first()
            const animation = await shell.evaluate((el) => getComputedStyle(el).animationName)
            assert.equal(
              animation === 'none',
              reducedMotion === 'reduce',
              'Breathing animation does not follow reduced motion',
            )
            const button = submit()
            assert(
              (await shell.locator('svg').count()) > 0,
              'Reduced motion removed static material',
            )
            await button.hover()
            await page.waitForTimeout(180)
            if (reducedMotion === 'reduce') {
              const tilt = await button.evaluate((el) =>
                getComputedStyle(el).getPropertyValue('--tz-ny').trim(),
              )
              assert(['0deg', '0', ''].includes(tilt), 'Pointer motion remains enabled')
            }
            return 'Motion preference applied; static SVG retained.'
          })
          await run('examples', 'component-examples', async () => {
            await open()
            for (const entry of harness.entries.values()) {
              if (entry.kind !== 'component') continue
              for (const [prop, values] of Object.entries(entry.data.variants)) {
                for (const value of values) {
                  const example = page.locator(`[data-contract="${entry.id}:${prop}:${value}"]`)
                  assert(
                    (await example.count()) > 0,
                    `Missing rendered example ${entry.id}:${prop}:${value}`,
                  )
                  assert(
                    await example.first().isVisible(),
                    `Hidden example ${entry.id}:${prop}:${value}`,
                  )
                }
              }
            }
            return 'Every declared variant has a visible, typed package consumer example.'
          })
          await Promise.all(bodies)
          if (errors.length)
            checks.push({
              rule: 'RUNTIME',
              status: 'fail',
              observation: errors.join('\n'),
              viewport,
              colorScheme,
              reducedMotion,
              evidence: [],
            })
          await context.close()
        }
      }
    }
  } catch (error) {
    checks.push({ rule: 'EXECUTION', status: 'fail', observation: error.message, evidence: [] })
  } finally {
    await browser?.close()
  }
  for (const rule of harness.rules.filter((r) => r.scope === scenario.id)) {
    if (rule.detector === 'review')
      checks.push({
        rule: rule.id,
        status: 'needs-review',
        observation: rule.requirement,
        evidence: checks.flatMap((c) => c.evidence).slice(0, 4),
      })
    else if (
      checks.filter((c) => c.rule === rule.id).length <
      scenario.viewports.length * scenario.themes.length * scenario.motion.length
    )
      checks.push({
        rule: rule.id,
        status: 'not-evaluated',
        observation: 'Execution ended before all required viewport/theme/motion cases ran.',
        evidence: [],
      })
  }
  const report = {
    schemaVersion: 1,
    tools: { node: process.version, platform: process.platform, browser: browserVersion },
    checkerRevision: hash(readFileSync(new URL('./browser.mjs', import.meta.url))),
    packageVersion: harness.packageVersion,
    contractRevision: harness.contractRevision,
    scenario: scenario.id,
    artifactRevision: assets.size ? hash(JSON.stringify([...assets].sort())) : null,
    artifacts: Object.fromEntries([...assets].sort()),
    mechanicalStatus: checks.some((c) => c.status === 'fail' || c.status === 'not-evaluated')
      ? 'fail'
      : 'pass',
    coverage:
      'Local profile-edit preview with intercepted saves. No live backend writes. Component examples are not exhaustive accessibility or visual acceptance.',
    checks,
  }
  if (outputDir)
    writeFileSync(resolve(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
  return report
}
