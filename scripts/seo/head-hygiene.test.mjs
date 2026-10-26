import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const robots = readFileSync(new URL('../../public/robots.txt', import.meta.url), 'utf8')
const html = readFileSync(new URL('../../client/index.html', import.meta.url), 'utf8')

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

test('JSON-LD organization description states the 7-day promise', () => {
  const line = html.split('\n').find((l) => l.includes('"description": "Agence française'))
  assert.ok(line, 'organization description line not found')
  assert.ok(line.includes('7 jours'))
  assert.ok(!line.includes('30 jours'))
  assert.ok(!line.includes('dashboards intelligents'))
})
