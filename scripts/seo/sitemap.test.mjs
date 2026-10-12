import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { buildSitemap } from './generate-sitemap.mjs'
import { checkLedger, hashSources, writeLedger } from './stamp-lastmod.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const GENERATOR = join(HERE, 'generate-sitemap.mjs')
const STAMP = join(HERE, 'stamp-lastmod.mjs')

const ROUTES = [
  { path: '/', sources: ['a.txt'], indexable: true, changefreq: 'weekly', priority: 1.0 },
  { path: '/ressources', sources: ['b.txt'], indexable: true, changefreq: 'weekly', priority: 0.8 },
  { path: '/thank-you', sources: ['c.txt'], indexable: false, changefreq: 'yearly', priority: 0.1 },
  { path: '/legal', sources: ['d.txt'], indexable: true, changefreq: 'yearly', priority: 0.3 },
  {
    path: '/offres/x/draft',
    sources: ['e.txt'],
    indexable: false,
    draft: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/offres/x/live',
    sources: ['f.txt'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
]
const LEDGER = {
  '/': { lastmod: '2026-06-18', hash: 'sha256:x' },
  '/ressources': { lastmod: '2026-09-22', hash: 'sha256:x' },
  '/legal': { lastmod: '2026-05-26', hash: 'sha256:x' },
  '/offres/x/live': { lastmod: '2026-10-01', hash: 'sha256:x' },
}
const META = {
  pages: { '/legal': { robots: 'noindex, follow' }, '/': { robots: 'index, follow' } },
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
const lastmodOf = (xml, loc) =>
  new RegExp(`<loc>${loc.replace(/[/.]/g, '\\$&')}</loc>\\s*<lastmod>([^<]+)</lastmod>`).exec(
    xml,
  )?.[1]

test('lists indexable routes and published resources, never drafts, noindex or thank-you', () => {
  const xml = buildSitemap({
    routes: ROUTES,
    ledger: LEDGER,
    metaTags: META,
    resources: [{ slug: 'un', published_at: '2026-09-01T10:00:00Z', updated_at: null }],
  })
  assert.deepEqual(locs(xml).sort(), [
    'https://sablia.io/',
    'https://sablia.io/offres/x/live',
    'https://sablia.io/ressources',
    'https://sablia.io/ressources/un',
  ])
})

test('a route whose meta-tags robots says noindex is left out even if the manifest says indexable', () => {
  const xml = buildSitemap({ routes: ROUTES, ledger: LEDGER, metaTags: META, resources: [] })
  assert.ok(!locs(xml).includes('https://sablia.io/legal'))
})

test('lastmod: route = ledger date; resource = updated_at ?? published_at', () => {
  const xml = buildSitemap({
    routes: ROUTES,
    ledger: LEDGER,
    metaTags: META,
    resources: [
      { slug: 'a', published_at: '2026-09-01T10:00:00Z', updated_at: '2026-09-05T08:00:00Z' },
      { slug: 'b', published_at: '2026-09-02T10:00:00Z', updated_at: null },
    ],
  })
  assert.equal(lastmodOf(xml, 'https://sablia.io/'), '2026-06-18')
  assert.equal(lastmodOf(xml, 'https://sablia.io/ressources/a'), '2026-09-05')
  assert.equal(lastmodOf(xml, 'https://sablia.io/ressources/b'), '2026-09-02')
})

test('/ressources lastmod = max(ledger date, latest resource date)', () => {
  const newer = buildSitemap({
    routes: ROUTES,
    ledger: LEDGER,
    metaTags: META,
    resources: [{ slug: 'z', published_at: '2026-10-03T00:00:00Z', updated_at: null }],
  })
  assert.equal(lastmodOf(newer, 'https://sablia.io/ressources'), '2026-10-03')
  const older = buildSitemap({
    routes: ROUTES,
    ledger: LEDGER,
    metaTags: META,
    resources: [{ slug: 'z', published_at: '2026-01-03T00:00:00Z', updated_at: null }],
  })
  assert.equal(lastmodOf(older, 'https://sablia.io/ressources'), '2026-09-22')
})

test('url shape keeps loc, lastmod, changefreq, priority; escapes XML', () => {
  const xml = buildSitemap({
    routes: ROUTES,
    ledger: LEDGER,
    metaTags: META,
    resources: [{ slug: 'a&b', published_at: '2026-09-01T00:00:00Z' }],
  })
  assert.match(
    xml,
    /<url>\s*<loc>https:\/\/sablia\.io\/<\/loc>\s*<lastmod>2026-06-18<\/lastmod>\s*<changefreq>weekly<\/changefreq>\s*<priority>1\.0<\/priority>\s*<\/url>/,
  )
  assert.ok(xml.includes('/ressources/a&amp;b'))
})

test('an indexable route with no ledger entry makes the generator throw', () => {
  assert.throws(
    () => buildSitemap({ routes: ROUTES, ledger: {}, metaTags: META, resources: [] }),
    /no lastmod/,
  )
})

function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'seo-stamp-'))
  for (const f of 'abcdef') writeFileSync(join(root, `${f}.txt`), `content ${f}`)
  return root
}

test('hashSources is stable and changes with content', () => {
  const root = fixtureRoot()
  const h1 = hashSources(root, ['a.txt', 'b.txt'])
  assert.equal(h1, hashSources(root, ['a.txt', 'b.txt']))
  assert.match(h1, /^sha256:[0-9a-f]{64}$/)
  writeFileSync(join(root, 'b.txt'), 'changed')
  assert.notEqual(h1, hashSources(root, ['a.txt', 'b.txt']))
})

test('checkLedger: clean, drifted, missing; non-indexable routes are skipped', () => {
  const root = fixtureRoot()
  const ledger = writeLedger({ root, routes: ROUTES, ledger: {}, today: '2026-10-12' })
  assert.deepEqual(checkLedger({ root, routes: ROUTES, ledger }), [])
  assert.equal(ledger['/thank-you'], undefined)
  assert.equal(ledger['/offres/x/draft'], undefined)
  writeFileSync(join(root, 'a.txt'), 'edited')
  writeFileSync(join(root, 'c.txt'), 'edited, non-indexable')
  assert.deepEqual(
    checkLedger({ root, routes: ROUTES, ledger }).map((d) => d.path),
    ['/'],
  )
  const noEntry = { ...ledger }
  delete noEntry['/offres/x/live']
  assert.ok(
    checkLedger({ root, routes: ROUTES, ledger: noEntry }).some((d) => d.path === '/offres/x/live'),
  )
})

test('writeLedger bumps only the drifted routes to today', () => {
  const root = fixtureRoot()
  const first = writeLedger({ root, routes: ROUTES, ledger: {}, today: '2026-06-01' })
  writeFileSync(join(root, 'f.txt'), 'edited')
  const next = writeLedger({ root, routes: ROUTES, ledger: first, today: '2026-10-12' })
  assert.equal(next['/offres/x/live'].lastmod, '2026-10-12')
  assert.equal(next['/'].lastmod, '2026-06-01')
  assert.equal(next['/'].hash, first['/'].hash)
})

test('stamp-lastmod CLI: --check exits 1 on drift, 0 when clean; --write fixes it', () => {
  const root = fixtureRoot()
  const routesFile = join(root, 'routes.json')
  const ledgerFile = join(root, 'lastmod.json')
  writeFileSync(routesFile, JSON.stringify(ROUTES))
  const run = (flag) =>
    spawnSync(
      'node',
      [
        STAMP,
        flag,
        '--root',
        root,
        '--routes',
        routesFile,
        '--ledger',
        ledgerFile,
        '--today',
        '2026-10-12',
      ],
      { encoding: 'utf8' },
    )
  assert.equal(run('--check').status, 1)
  assert.equal(run('--write').status, 0)
  assert.equal(run('--check').status, 0)
  writeFileSync(join(root, 'd.txt'), 'edited')
  assert.equal(run('--check').status, 1)
  assert.equal(run('--write').status, 0)
  assert.equal(run('--check').status, 0)
  assert.equal(JSON.parse(readFileSync(ledgerFile, 'utf8'))['/legal'].lastmod, '2026-10-12')
})

test('generator CLI with no Supabase key (local build) writes the static pages and exits 0', () => {
  const dir = mkdtempSync(join(tmpdir(), 'seo-gen-'))
  mkdirSync(join(dir, 'public'))
  const out = join(dir, 'public', 'sitemap.xml')
  const env = { ...process.env }
  delete env.VITE_SUPABASE_ANON_KEY
  delete env.VERCEL
  const res = spawnSync('node', [GENERATOR, '--out', out], { env, encoding: 'utf8' })
  assert.equal(res.status, 0, res.stderr)
  const xml = readFileSync(out, 'utf8')
  assert.ok(locs(xml).includes('https://sablia.io/offres/compte-rendu-appel'))
  assert.ok(!locs(xml).some((l) => l.endsWith('/thank-you')))
})

test('generator CLI on Vercel without the key fails the build', () => {
  const dir = mkdtempSync(join(tmpdir(), 'seo-gen-'))
  const env = { ...process.env, VERCEL: '1' }
  delete env.VITE_SUPABASE_ANON_KEY
  const res = spawnSync('node', [GENERATOR, '--out', join(dir, 'sitemap.xml')], {
    env,
    encoding: 'utf8',
  })
  assert.notEqual(res.status, 0)
})
