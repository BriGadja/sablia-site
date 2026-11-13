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
test("built home: one Organization JSON-LD selling today's offer, no retired claim", (t) => {
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

// U13a (site-formation lot 1), then US-111 (plan sablia-site-structure-offre I1, copy deck B6): what
// LLMs and agents read about Sablia says what it does today, the monthly offer first, then the
// training and the conferences on request. No price here (the red-line guard R11 allows no euro
// amount but the training's; the monthly offer's price is on its page). One booking link: the
// « Échange de 30 minutes ».
const PUBLIC = (rel) => readFileSync(new URL(`../../public/${rel}`, import.meta.url), 'utf8')
const RETIRED = /intégration de Claude dans les CRM|Claude AI × CRM|agence/i
const EURO = /\d[\d\s\u00a0.,]*\s?(€|euros?)/i
// US-106: the « Référent IA » offer and the « Après la formation » section are gone; US-105: the old name.
const GONE = /référent|2 h par mois|Après la formation|temps partagé/i

test("llms.txt: today's offer first, the training, the conferences, no price, no client count", () => {
  const llms = PUBLIC('llms.txt')
  const summary = llms.split('\n').find((l) => l.startsWith('> ')) ?? ''
  assert.match(summary, /^> Sablia met l'IA en place/)
  assert.match(summary, /formation/i)
  for (const needle of [
    "L'IA au travail",
    '## Responsable IA externalisé',
    '## Conférences et séminaires',
    'https://sablia.io/responsable-ia-externalise',
    'https://sablia.io/formations',
    'https://sablia.io/conferences',
    'https://sablia.io/webinaire',
    'https://sablia.io/realisations',
    'https://sablia.io/offres/compte-rendu-appel',
    'https://calendly.com/brice-gachadoat/echange-30-minutes',
    'Rouen',
  ])
    assert.ok(llms.includes(needle), `llms.txt lacks ${needle}`)
  // The central offer comes first, before the training.
  assert.ok(
    llms.indexOf('## Responsable IA externalisé') <
      llms.indexOf("## La formation « L'IA au travail »"),
    'the monthly offer section is not before the training section',
  )
  assert.doesNotMatch(llms, /basée à Paris/)
  // US-105, US-106 (12/11): both retired addresses answer 301; llms.txt names the new one only.
  assert.doesNotMatch(llms, /sablia\.io\/(accompagnement|responsable-ia-temps-partage)\b/)
  assert.doesNotMatch(llms, RETIRED)
  assert.doesNotMatch(llms, GONE)
  assert.doesNotMatch(llms, EURO)
  assert.doesNotMatch(llms, /Plus de 20 clients|calendly\.com\/brice-gachadoat\/30min/)
  // Brice at VP2 (13/11, question 5): the training's conference option announces no duration (the
  // conference page gives each talk the length of what exists).
  assert.doesNotMatch(llms, /1 h 30/)
  assert.ok(llms.includes('- En option : une conférence pour votre équipe'), 'llms.txt option line')
  // One offer now shows its price: the « sur devis » answer names the training (offer-page review, F6 #5).
  assert.ok(llms.includes('**Combien coûte la formation ?**'), 'llms.txt FAQ price line not scoped')
  assert.doesNotMatch(llms, /Combien ça coûte/)
})

test('ai.txt: the description says what Sablia does today, never the CRM agency nor the référent', () => {
  const desc = PUBLIC('.well-known/ai.txt')
    .split('\n')
    .find((l) => l.startsWith('description: '))
  assert.match(desc ?? '', /^description: Sablia met l'IA en place/)
  assert.doesNotMatch(desc ?? '', RETIRED)
  assert.doesNotMatch(desc ?? '', GONE)
})

test('manifest.json: the description is the site tagline', () => {
  const manifest = JSON.parse(PUBLIC('manifest.json'))
  const site = readFileSync(new URL('../../src/lib/site.ts', import.meta.url), 'utf8')
  const tagline = site.match(/tagline: "([^"]+)"/)?.[1]
  assert.equal(manifest.description, tagline)
  assert.doesNotMatch(manifest.description, RETIRED)
})
