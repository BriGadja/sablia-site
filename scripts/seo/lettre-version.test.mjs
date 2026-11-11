// The identity stamp of an issue page (US-101). The hub's publish step computes the same value in
// Python and compares it with the page it fetched: these vectors are the shared contract, asserted
// verbatim on both sides. Run: `node --test scripts/seo/lettre-version.test.mjs`
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { lettreVersion } from './lettre-version.mjs'

describe('lettreVersion', () => {
  it('hashes a title with guillemets, a no-break space, an em dash, an emoji, a tab, quotes and a backslash', () => {
    const row = {
      titre: "Relancer un devis : « l'outil »",
      resume: 'Été\u00a02026 — 50 %',
      corps_md:
        '## Titre\n\nBonjour,\n\n- un\n- deux\n\nhttps://x.y/z?a=1&b=2 😀\t"guillemets" \\ fin',
      youtube_id: null,
    }
    assert.equal(
      lettreVersion(row),
      'a24c85d3dac8e77614e79f18eceacbbd31320e3dbd12ef1f21a26ce05df9464b',
    )
  })

  it('hashes a plain row with a video id', () => {
    const row = {
      titre: 'Titre simple',
      resume: 'Résumé.',
      corps_md: 'Texte.',
      youtube_id: 'd5fo00AFqVM',
    }
    assert.equal(
      lettreVersion(row),
      'd90190df800e55985fe9b344f98c30ccf8819e97c7d3347816a8e06fdd231991',
    )
  })

  it('reads only the four text columns: a missing youtube_id is null, slug and dates never count', () => {
    const row = { titre: 'Titre simple', resume: 'Résumé.', corps_md: 'Texte.', youtube_id: null }
    const bare = { titre: 'Titre simple', resume: 'Résumé.', corps_md: 'Texte.' }
    const dated = {
      ...row,
      slug: '2026-11-17-x',
      published_at: '2026-11-17T07:30:00+00:00',
      updated_at: '2026-11-18T07:30:00+00:00',
    }
    assert.equal(lettreVersion(bare), lettreVersion(row))
    assert.equal(lettreVersion(dated), lettreVersion(row))
    assert.notEqual(lettreVersion({ ...row, resume: 'Résumé' }), lettreVersion(row))
  })
})
