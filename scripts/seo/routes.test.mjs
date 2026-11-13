import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { PAGE_ROUTES, resolveRoutes } from './routes.mjs'

// US-95 (plan site-formation-lot1, U1; green when U13a adds the route).
test('/realisations is an indexable page route', () => {
  const r = PAGE_ROUTES.find((x) => x.path === '/realisations')
  assert.ok(r, '/realisations missing from PAGE_ROUTES')
  assert.equal(r.indexable, true)
  assert.notEqual(r.draft, true)
  assert.equal(r.changefreq, 'monthly')
  assert.equal(r.priority, 0.7)
})

// U13a: the page and its own components (the moved #construit band lands in src/components/realisations/).
test('/realisations sources = its page and its components', () => {
  const r = PAGE_ROUTES.find((x) => x.path === '/realisations')
  assert.deepEqual(r?.sources, ['src/app/realisations/', 'src/components/realisations/'])
})

// US-107 (plan sablia-site-structure-offre I2): the conferences page is indexed, dated by its page and
// its own components.
test('/conferences is an indexable page route dated by its page and its components', () => {
  const r = PAGE_ROUTES.find((x) => x.path === '/conferences')
  assert.ok(r, '/conferences missing from PAGE_ROUTES')
  assert.equal(r.indexable, true)
  assert.notEqual(r.draft, true)
  assert.equal(r.changefreq, 'monthly')
  assert.equal(r.priority, 0.8)
  assert.deepEqual(r.sources, ['src/app/conferences/', 'src/components/conferences/'])
})

// US-104: the home's lastmod follows its bands in page order (#mensuel and #conferences in, #apres out);
// the bands that left it (scene, construit, apres) do not date it.
test('home sources = its bands in page order, without scene, construit and apres', () => {
  const home = PAGE_ROUTES.find((x) => x.path === '/')
  const H = 'src/components/home'
  assert.deepEqual(home?.sources, [
    'src/app/page.tsx',
    'src/app/home-metadata.ts',
    `${H}/HomePage.tsx`,
    ...[
      'top',
      'mensuel',
      'automatisations',
      'offre',
      'formations',
      'conferences',
      'videos',
      'derriere',
      'webinaire',
      'faq',
    ].map((id) => `${H}/${id}/`),
  ])
})

// The sitemap generator throws on an indexable route without a ledger date, which fails the build.
test('every indexable route has a lastmod in the ledger', () => {
  const ledger = JSON.parse(readFileSync(new URL('./lastmod.json', import.meta.url), 'utf8'))
  const missing = resolveRoutes()
    .filter((r) => r.indexable === true && !ledger[r.path]?.lastmod)
    .map((r) => r.path)
  assert.deepEqual(missing, [])
})
