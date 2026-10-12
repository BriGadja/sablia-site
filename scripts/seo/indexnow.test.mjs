import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { buildRequest, diffSitemaps, interpret, parseSitemap } from './indexnow.mjs'

const sm = (entries) =>
  `<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries
    .map(([loc, lm]) => `<url><loc>${loc}</loc>${lm ? `<lastmod>${lm}</lastmod>` : ''}</url>`)
    .join('\n')}</urlset>`

const OLD = sm([
  ['https://sablia.io/', '2026-06-18'],
  ['https://sablia.io/a', '2026-06-18'],
  ['https://sablia.io/b', '2026-06-18'],
])
const NEW = sm([
  ['https://sablia.io/', '2026-06-18'],
  ['https://sablia.io/a', '2026-10-12'],
  ['https://sablia.io/b', '2026-06-18'],
  ['https://sablia.io/c', '2026-10-12'],
  ['https://other.example/x', '2026-10-12'],
])

test('parseSitemap reads loc/lastmod pairs', () => {
  const m = parseSitemap(OLD)
  assert.equal(m.size, 3)
  assert.equal(m.get('https://sablia.io/a'), '2026-06-18')
})

test('diffSitemaps returns new URLs and lastmod changes only, host-filtered', () => {
  assert.deepEqual(diffSitemaps(NEW, OLD), ['https://sablia.io/a', 'https://sablia.io/c'])
})

test('diffSitemaps never returns the whole site when nothing changed', () => {
  assert.deepEqual(diffSitemaps(OLD, OLD), [])
})

test('diffSitemaps caps at 10000', () => {
  const big = sm(Array.from({ length: 10050 }, (_, i) => [`https://sablia.io/p${i}`, '2026-10-12']))
  assert.equal(diffSitemaps(big, sm([])).length, 10000)
})

test('buildRequest targets the documented lowercase endpoint', () => {
  const r = buildRequest({
    host: 'sablia.io',
    key: 'k'.repeat(32),
    urlList: ['https://sablia.io/a'],
  })
  assert.equal(r.url, 'https://api.indexnow.org/indexnow')
  assert.equal(r.method, 'POST')
  assert.deepEqual(JSON.parse(r.body), {
    host: 'sablia.io',
    key: 'k'.repeat(32),
    keyLocation: `https://sablia.io/${'k'.repeat(32)}.txt`,
    urlList: ['https://sablia.io/a'],
  })
})

test('interpret maps statuses', () => {
  assert.equal(interpret(200).level, 'ok')
  assert.equal(interpret(202).level, 'ok')
  for (const s of [422, 429]) {
    assert.equal(interpret(s).level, 'warning')
    assert.equal(interpret(s).exit, 0)
  }
  for (const s of [400, 403]) {
    assert.equal(interpret(s).level, 'failure')
    assert.notEqual(interpret(s).exit, 0)
  }
})

const run = (args) =>
  spawnSync('node', [new URL('./indexnow.mjs', import.meta.url).pathname, ...args], {
    encoding: 'utf8',
  })
const dir = mkdtempSync(join(tmpdir(), 'indexnow-'))
writeFileSync(join(dir, 'new.xml'), NEW)
writeFileSync(join(dir, 'old.xml'), OLD)

test('--dry-run prints list, host and key location, makes no call', () => {
  const r = run([
    '--dry-run',
    '--sitemap',
    join(dir, 'new.xml'),
    '--previous-sitemap',
    join(dir, 'old.xml'),
  ])
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /https:\/\/sablia\.io\/a/)
  assert.match(r.stdout, /https:\/\/sablia\.io\/c/)
  assert.doesNotMatch(r.stdout, /sablia\.io\/b\b/)
  assert.match(r.stdout, /host: sablia\.io/)
  assert.match(r.stdout, /keyLocation: https:\/\/sablia\.io\/[0-9a-f]{32}\.txt/)
})

test('--all selects every sablia.io URL', () => {
  const r = run(['--dry-run', '--all', '--sitemap', join(dir, 'new.xml')])
  assert.equal(r.status, 0, r.stderr)
  for (const p of ['', 'a', 'b', 'c']) assert.ok(r.stdout.includes(`https://sablia.io/${p}\n`), p)
  assert.doesNotMatch(r.stdout, /other\.example/)
})

test('unreachable previous sitemap falls back to --all and says so', () => {
  const r = run([
    '--dry-run',
    '--sitemap',
    join(dir, 'new.xml'),
    '--previous-sitemap',
    join(dir, 'missing.xml'),
  ])
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout + r.stderr, /falling back to --all/)
  assert.match(r.stdout, /sablia\.io\/b/)
})
