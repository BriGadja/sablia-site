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
test('built home: one Organization JSON-LD stating the 7-day promise, no retired claim', (t) => {
  if (!existsSync(builtHome)) return t.skip('no dist/public/index.html (run the build)')
  const html = readFileSync(builtHome, 'utf8')
  assert.deepEqual(checkOrganizationJsonLd(html), [])
  assert.ok(html.includes('7 jours'))
})

test('checkOrganizationJsonLd reads a JSON-LD block (guards the guard)', () => {
  const ld = JSON.stringify({ '@id': 'https://sablia.io/#organization', description: '7 jours' })
  assert.deepEqual(checkOrganizationJsonLd(`<script type="application/ld+json">${ld}</script>`), [])
  assert.notDeepEqual(checkOrganizationJsonLd('<html></html>'), [])
})
