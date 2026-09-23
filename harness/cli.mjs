#!/usr/bin/env node
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { checkDesign, loadHarness, resolveContext, searchDesign } from './core.mjs'
import { installSkills } from './install.mjs'

try {
  const [command, ...args] = process.argv.slice(2)
  let result
  switch (command) {
    case 'search':
      assert.equal(args.length, 1, 'Usage: tezawari-design search QUERY')
      result = searchDesign(loadHarness(), args[0])
      break
    case 'resolve':
      assert.equal(args.length, 1, 'Usage: tezawari-design resolve SCENARIO')
      result = resolveContext(loadHarness(), args[0])
      break
    case 'check': {
      assert(
        args.length >= 1 && args.length <= 3,
        'Usage: tezawari-design check SCENARIO [ROUTE] [OUTPUT_DIRECTORY]',
      )
      result = await checkDesign(
        loadHarness(),
        { scenarioId: args[0], route: args[1] ?? '/' },
        {
          origin: process.env.TEZAWARI_PREVIEW_ORIGIN,
          outputDir: resolve(args[2] ?? 'test-results/tezawari'),
        },
      )
      process.exitCode = result.mechanicalStatus === 'pass' ? 0 : 1
      break
    }
    case 'mcp':
      assert.equal(args.length, 0, 'Usage: tezawari-design mcp')
      await (await import('./mcp.mjs')).serve()
      break
    case 'install-skills':
      assert(
        args.length === 1 || (args.length === 2 && args[1] === '--remove'),
        'Usage: tezawari-design install-skills PROJECT [--remove]',
      )
      result = installSkills(args[0], { remove: args[1] === '--remove' })
      break
    default:
      throw new Error(
        'Commands: search QUERY | resolve SCENARIO | check SCENARIO [ROUTE] [OUTPUT] | mcp | install-skills PROJECT [--remove]',
      )
  }
  if (result) console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error.message)
  process.exitCode = 2
}
