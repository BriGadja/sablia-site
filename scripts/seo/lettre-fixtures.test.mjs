// Fixture issues for offline builds and dev (US-101). Pure: the environment and the clock are injected.
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fixtureLettres } from './lettre-fixtures.mjs'

const NOW = { now: new Date('2026-11-11T10:00:00Z') }
const one = (slug, opts = NOW) => fixtureLettres({ SABLIA_FIXTURE_LETTRES: slug }, opts)

describe('fixtureLettres', () => {
  it('returns nothing when the variable is unset or blank', () => {
    assert.deepEqual(fixtureLettres({}, NOW), [])
    assert.deepEqual(fixtureLettres({ SABLIA_FIXTURE_LETTRES: ' , ' }, NOW), [])
  })

  it('builds a realistic issue: three sections, a list, a link, a bare URL, a soft line break, a signature', () => {
    const [row] = one('2026-11-10-exemple-de-numero')
    assert.equal(row.slug, '2026-11-10-exemple-de-numero')
    assert.ok(row.titre.length > 10 && row.titre.length <= 90, row.titre)
    assert.ok(row.resume.length > 10 && row.resume !== row.titre, row.resume)
    const md = row.corps_md
    assert.equal((md.match(/^## \S/gm) ?? []).length, 3, 'three ## sections')
    assert.ok(/^- \S/m.test(md), 'a list')
    assert.ok(/\[[^\]]+\]\(https:\/\/[^)]+\)/.test(md), 'a Markdown link')
    assert.ok(/(^|\s)https:\/\/\S+/m.test(md), 'a bare URL')
    const blocks = md.split(/\n{2,}/)
    assert.ok(
      blocks.some((b) => b.includes('\n') && !/^(## |- )/m.test(b)),
      'a line break inside a paragraph',
    )
    assert.equal(blocks.at(-1).trim(), 'Brice', 'the signature line closes the body')
    assert.equal(row.youtube_id, null)
  })

  it('keeps the visitor-text rules: no em or en dash, no merge tag, no image', () => {
    for (const row of fixtureLettres(
      { SABLIA_FIXTURE_LETTRES: '2026-11-10-a,2026-11-03-b,2026-10-27-c' },
      NOW,
    )) {
      for (const text of [row.titre, row.resume, row.corps_md]) {
        assert.doesNotMatch(text, /[—–]/)
        assert.ok(!text.includes('{{'), 'no merge tag')
        assert.doesNotMatch(text, /!\[/)
      }
    }
  })

  it('dates the issue at 08:30 Paris on its slug day, the offset computed (winter +1, summer +2)', () => {
    const [winter] = one('2026-11-10-exemple-de-numero')
    assert.equal(winter.published_at, '2026-11-10T07:30:00+00:00')
    assert.equal(winter.updated_at, winter.published_at)
    const [summer] = one('2026-07-07-un-numero-d-ete')
    assert.equal(summer.published_at, '2026-07-07T06:30:00+00:00')
  })

  it('returns one row per slug, in the order given, with distinct titles', () => {
    const rows = fixtureLettres({ SABLIA_FIXTURE_LETTRES: '2026-11-03-b, 2026-11-10-a' }, NOW)
    assert.deepEqual(
      rows.map((r) => r.slug),
      ['2026-11-03-b', '2026-11-10-a'],
    )
    assert.notEqual(rows[0].titre, rows[1].titre)
  })

  it('refuses a slug dated after the build day (Paris), and accepts the day itself', () => {
    assert.throws(() => one('2026-11-12-demain'), /2026-11-12-demain.*after/)
    assert.equal(one('2026-11-11-aujourd-hui').length, 1)
    // 23:30 UTC on the 11th is already the 12th in Paris.
    assert.equal(one('2026-11-12-minuit', { now: new Date('2026-11-11T23:30:00Z') }).length, 1)
  })

  it('refuses a slug that is not yyyy-mm-dd-words', () => {
    for (const bad of [
      'exemple',
      '2026-13-40-x',
      '2026-11-10-Majuscule',
      '2026-11-10-',
      '2026-02-30-x',
    ]) {
      assert.throws(() => one(bad), /slug/, bad)
    }
  })

  it('THROWS on a strict, prod-slot or Vercel build: a fixture must never hide real rows', () => {
    const slug = '2026-11-10-exemple-de-numero'
    for (const extra of [{ PRERENDER_STRICT: '1' }, { SABLIA_SLOT: 'prod' }, { VERCEL: '1' }]) {
      assert.throws(
        () => fixtureLettres({ SABLIA_FIXTURE_LETTRES: slug, ...extra }, NOW),
        /SABLIA_FIXTURE_LETTRES/,
        JSON.stringify(extra),
      )
    }
    assert.equal(
      fixtureLettres({ SABLIA_FIXTURE_LETTRES: slug, SABLIA_SLOT: 'preview' }, NOW).length,
      1,
    )
  })

  it('stays silent on a strict build when no fixture is asked for', () => {
    assert.deepEqual(fixtureLettres({ PRERENDER_STRICT: '1', SABLIA_SLOT: 'prod' }, NOW), [])
  })
})
