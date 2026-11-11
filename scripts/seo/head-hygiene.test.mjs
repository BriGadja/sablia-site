import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { test } from 'node:test'
import { checkOrganizationJsonLd } from './export-guards.mjs'

const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
const builtHome = new URL('../../dist/public/index.html', import.meta.url)

for (const bot of [
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'OAI-SearchBot',
  'PerplexityBot',
]) {
  test(`robots.txt allows ${bot}`, () => {
    assert.match(robots, new RegExp(`^User-agent: ${bot}\\nAllow: /$`, 'm'))
  })
}

test('robots.txt no longer lists Claude-Web', () => {
  assert.doesNotMatch(robots, /Claude-Web/)
})

// The JSON-LD is now rendered by OrganizationJsonLd (unit-tested in src/components/seo); here the
// BUILT home is parsed. Without a build the rows are skipped, loudly: export-guards re-runs the same
// check on every build.
test('built home: one Organization JSON-LD selling the training first, no retired claim', (t) => {
  if (!existsSync(builtHome)) return t.skip('no dist/public/index.html (run the build)')
  const html = readFileSync(builtHome, 'utf8')
  assert.deepEqual(checkOrganizationJsonLd(html), [])
  assert.ok(html.includes("L'IA au travail") || html.includes('L&#x27;IA au travail'))
})

test('checkOrganizationJsonLd reads a JSON-LD block (guards the guard)', () => {
  const ld = JSON.stringify({ '@id': 'https://sablia.io/#organization', description: 'Formation' })
  assert.deepEqual(checkOrganizationJsonLd(`<script type="application/ld+json">${ld}</script>`), [])
  assert.notDeepEqual(checkOrganizationJsonLd('<html></html>'), [])
})

// U13a (site-formation lot 1): what LLMs and agents read about Sablia says the training first. The
// CRM offer stays as a follow-on, without its price here (the red-line guard R11 allows no euro amount
// but the training's, and the training has no public price). One booking link: the training call.
const PUBLIC = (rel) => readFileSync(new URL(`../../public/${rel}`, import.meta.url), 'utf8')
const RETIRED = /intégration de Claude dans les CRM|Claude AI × CRM|agence/i
const EURO = /\d[\d\s\u00a0.,]*\s?(€|euros?)/i

test('llms.txt: the training first, the webinar, the follow-on offers, no price, no client count', () => {
  const llms = PUBLIC('llms.txt')
  assert.match(llms.split('\n').find((l) => l.startsWith('> ')) ?? '', /formation/i)
  for (const needle of [
    "L'IA au travail",
    'https://sablia.io/formations',
    'https://sablia.io/webinaire',
    'https://sablia.io/accompagnement',
    'https://sablia.io/realisations',
    'https://sablia.io/offres/compte-rendu-appel',
    'https://calendly.com/brice-gachadoat/echange-30-minutes',
    'Rouen',
  ])
    assert.ok(llms.includes(needle), `llms.txt lacks ${needle}`)
  assert.doesNotMatch(llms, /basée à Paris/)
  assert.doesNotMatch(llms, RETIRED)
  assert.doesNotMatch(llms, EURO)
  assert.doesNotMatch(llms, /Plus de 20 clients|calendly\.com\/brice-gachadoat\/30min/)
})

test('ai.txt: the description says the training, never the CRM agency', () => {
  const desc = PUBLIC('.well-known/ai.txt')
    .split('\n')
    .find((l) => l.startsWith('description: '))
  assert.match(desc ?? '', /^description: Formation à l'IA/)
  assert.doesNotMatch(desc ?? '', RETIRED)
})

test('manifest.json: the description is the site tagline', () => {
  const manifest = JSON.parse(PUBLIC('manifest.json'))
  const site = readFileSync(new URL('../../src/lib/site.ts', import.meta.url), 'utf8')
  const tagline = site.match(/tagline: "([^"]+)"/)?.[1]
  assert.equal(manifest.description, tagline)
  assert.doesNotMatch(manifest.description, RETIRED)
})
