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

// U13a: the home's lastmod follows the training sections; the bands that left it (scene, construit) do not.
test('home sources = the training sections, without scene and construit', () => {
  const home = PAGE_ROUTES.find((x) => x.path === '/')
  const H = 'src/components/home'
  assert.deepEqual(home?.sources, [
    'src/app/page.tsx',
    'src/app/home-metadata.ts',
    `${H}/HomePage.tsx`,
    ...[
      'top',
      'offre',
      'automatisations',
      'formations',
      'derriere',
      'webinaire',
      'apres',
      'videos',
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
