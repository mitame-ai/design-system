import assert from 'node:assert/strict'
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve, sep } from 'node:path'
import { digest, packageRoot } from './core.mjs'

// Installation is explicit and project-local. No global client settings are touched.
export function installSkills(directory, { remove = false } = {}) {
  const root = realpathSync(directory)
  const paths = ['install', 'build', 'review', 'improve'].map(
    (task) => `.agents/skills/tezawari-${task}/SKILL.md`,
  )
  const manifestPath = resolve(root, '.agents/tezawari-skills.json')
  function safe(path) {
    const target = resolve(root, path)
    assert(target.startsWith(root + sep), 'Invalid install target')
    let parent = target
    while (parent !== root) {
      const stat = lstatSync(parent, { throwIfNoEntry: false })
      assert(!stat?.isSymbolicLink(), `Refusing symlink: ${parent}`)
      parent = dirname(parent)
    }
    return target
  }
  safe('.agents/tezawari-skills.json')
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, 'utf8'))
    : { files: {} }
  // Preflight every file before writing anything, including partial upgrades.
  for (const path of paths) {
    const target = safe(path)
    if (existsSync(target))
      assert.equal(
        digest(readFileSync(target)),
        manifest.files[path],
        `Edited/unmanaged skill conflict: ${path}`,
      )
    else if (remove && manifest.files[path]) continue
  }
  const next = {
    package: '@mitame-ai/design-system',
    version: JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8')).version,
    files: {},
  }
  for (const path of paths) {
    const target = safe(path)
    if (remove) {
      if (manifest.files[path]) rmSync(target, { force: true })
    } else {
      const content = readFileSync(resolve(packageRoot, path))
      mkdirSync(dirname(target), { recursive: true })
      writeFileSync(target, content)
      next.files[path] = digest(content)
    }
  }
  if (remove) rmSync(manifestPath, { force: true })
  else writeFileSync(manifestPath, `${JSON.stringify(next, null, 2)}\n`)
  return { action: remove ? 'removed' : 'installed', root, files: paths }
}
