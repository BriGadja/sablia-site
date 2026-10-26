// `lastmod` ledger (US-55). The sitemap date of a page is the day its own sources last changed, not
// the day of the build. `scripts/seo/lastmod.json` = { "/path": { lastmod, hash } }, `hash` = sha256
// over the route's `sources` (routes.mjs, contract C2).
//   --check  exit 1 when an indexable route has no entry or its hash drifted (NOT part of the build)
//   --write  bump only the drifted routes to today (UTC)
// Test hooks: --root DIR, --routes FILE.json, --ledger FILE, --today YYYY-MM-DD.
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolveRoutes } from './routes.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
export const DEFAULT_ROOT = resolve(HERE, '..', '..')
export const DEFAULT_LEDGER = join(HERE, 'lastmod.json')

/** A trailing-slash source is a directory: its files, tests excluded, in a stable order. */
function expand(root, source, warn) {
  const full = join(root, source)
  if (!existsSync(full)) {
    warn(`[seo:stamp] source not found yet, skipped: ${source}`)
    return []
  }
  if (!source.endsWith('/')) return [source]
  const out = []
  const walk = (rel) => {
    for (const name of readdirSync(join(root, rel)).sort()) {
      const next = `${rel}${name}`
      if (statSync(join(root, next)).isDirectory()) walk(`${next}/`)
      else if (!/\.test\.[cm]?[jt]sx?$/.test(name)) out.push(next)
    }
  }
  walk(source)
  return out
}

export function hashSources(root, sources, { warn = console.warn } = {}) {
  const h = createHash('sha256')
  for (const file of sources.flatMap((s) => expand(root, s, warn))) {
    h.update(`${file}\n`)
    h.update(readFileSync(join(root, file)))
    h.update('\n')
  }
  return `sha256:${h.digest('hex')}`
}

const stampable = (routes) => routes.filter((r) => r.indexable === true)

/** Indexable routes whose ledger entry is missing or stale: [{ path, reason, hash }]. */
export function checkLedger({ root = DEFAULT_ROOT, routes, ledger }) {
  const drifted = []
  for (const route of stampable(routes)) {
    const hash = hashSources(root, route.sources)
    const entry = ledger[route.path]
    if (!entry) drifted.push({ path: route.path, reason: 'no ledger entry', hash })
    else if (entry.hash !== hash)
      drifted.push({ path: route.path, reason: 'sources changed', hash })
  }
  return drifted
}

/** Returns a new ledger: drifted routes carry today's date, the others are untouched. */
export function writeLedger({ root = DEFAULT_ROOT, routes, ledger, today }) {
  const next = { ...ledger }
  for (const { path, hash } of checkLedger({ root, routes, ledger })) {
    next[path] = { lastmod: today, hash }
  }
  return next
}

function arg(argv, name) {
  const i = argv.indexOf(name)
  return i === -1 ? undefined : argv[i + 1]
}

function main(argv) {
  const root = arg(argv, '--root') ?? DEFAULT_ROOT
  const ledgerFile = arg(argv, '--ledger') ?? DEFAULT_LEDGER
  const routesFile = arg(argv, '--routes')
  const routes = routesFile ? JSON.parse(readFileSync(routesFile, 'utf8')) : resolveRoutes({ root })
  let ledger = {}
  try {
    ledger = JSON.parse(readFileSync(ledgerFile, 'utf8'))
  } catch {
    // no ledger yet: every indexable route is "missing"
  }

  if (argv.includes('--check')) {
    const drifted = checkLedger({ root, routes, ledger })
    for (const d of drifted) console.error(`[seo:stamp] ${d.path}: ${d.reason}`)
    if (drifted.length > 0) {
      console.error('[seo:stamp] run: node scripts/seo/stamp-lastmod.mjs --write')
      return 1
    }
    return 0
  }
  if (argv.includes('--write')) {
    const today = arg(argv, '--today') ?? new Date().toISOString().slice(0, 10)
    const before = checkLedger({ root, routes, ledger }).map((d) => d.path)
    const next = writeLedger({ root, routes, ledger, today })
    writeFileSync(ledgerFile, `${JSON.stringify(next, null, 2)}\n`)
    console.log(`[seo:stamp] ${before.length} route(s) bumped to ${today}: ${before.join(', ')}`)
    return 0
  }
  console.error('usage: stamp-lastmod.mjs --check | --write')
  return 2
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exit(main(process.argv.slice(2)))
}
