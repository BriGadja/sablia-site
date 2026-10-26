// Hermetic tests for the /ressources/{slug} prerender helpers (US-54). No network: `fetch`,
// `sleep` and `warn` are injected. Run: `node --test scripts/seo/prerender-ressources.test.mjs`
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import {
  assertRessourceHtml,
  extractFromHtml,
  listPublishedSlugs,
  ressourceRoutes,
  ressourceTitle,
} from './ressources.mjs'
import { PAGE_ROUTES, resolveRoutes } from './routes.mjs'

const KEY = 'anon-key-for-tests'

const ROWS = [
  {
    slug: 'older',
    titre: 'Older',
    resume: 'r1',
    published_at: '2026-10-01T00:00:00Z',
    published: true,
  },
  {
    slug: 'newer',
    titre: 'Newer',
    resume: 'r2',
    published_at: '2026-10-08T00:00:00Z',
    published: true,
  },
  { slug: 'draft', titre: 'Draft', resume: 'r3', published_at: null, published: false },
]

/** A fake PostgREST: honours `published=eq.true` and `order=published_at.desc` from the URL. */
function fakeSupabase(rows, calls = []) {
  return async (url, init) => {
    calls.push({ url: String(url), init })
    const u = new URL(String(url))
    let out = [...rows]
    if (u.searchParams.get('published') === 'eq.true') out = out.filter((r) => r.published)
    if (u.searchParams.get('order') === 'published_at.desc') {
      out.sort((a, b) => String(b.published_at).localeCompare(String(a.published_at)))
    }
    return { ok: true, status: 200, json: async () => out.map(({ published, ...r }) => r) }
  }
}

const noSleep = async () => {}

describe('listPublishedSlugs', () => {
  it('returns only published rows, newest first', async () => {
    const calls = []
    const rows = await listPublishedSlugs({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: fakeSupabase(ROWS, calls),
      sleep: noSleep,
    })
    assert.deepEqual(
      rows.map((r) => r.slug),
      ['newer', 'older'],
    )
    const q = new URL(calls[0].url)
    assert.equal(
      q.searchParams.get('select'),
      'slug,titre,resume,youtube_id,published_at,updated_at',
    )
    assert.equal(q.searchParams.get('published'), 'eq.true')
    assert.equal(calls[0].init.headers.apikey, KEY)
  })

  it('retries 3 times with backoff then throws', async () => {
    let n = 0
    const waits = []
    await assert.rejects(
      listPublishedSlugs({
        env: { VITE_SUPABASE_ANON_KEY: KEY },
        fetch: async () => {
          n++
          throw new Error('network down')
        },
        sleep: async (ms) => waits.push(ms),
      }),
      /network down/,
    )
    assert.equal(n, 3)
    assert.equal(waits.length, 2)
    assert.ok(waits[1] > waits[0], 'backoff grows')
  })

  it('succeeds when a later try works', async () => {
    let n = 0
    const rows = await listPublishedSlugs({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: async (...a) => {
        n++
        if (n < 3) throw new Error('flaky')
        return fakeSupabase(ROWS)(...a)
      },
      sleep: noSleep,
    })
    assert.equal(rows.length, 2)
  })

  it('throws at once when VERCEL is set and the anon key is missing', async () => {
    let called = false
    await assert.rejects(
      listPublishedSlugs({
        env: { VERCEL: '1' },
        fetch: async () => {
          called = true
        },
        sleep: noSleep,
      }),
      /VITE_SUPABASE_ANON_KEY/,
    )
    assert.equal(called, false)
  })

  it('throws at once when PRERENDER_STRICT is set (self-hosted build) and the anon key is missing', async () => {
    let called = false
    await assert.rejects(
      listPublishedSlugs({
        env: { PRERENDER_STRICT: '1' },
        fetch: async () => {
          called = true
        },
        sleep: noSleep,
      }),
      /VITE_SUPABASE_ANON_KEY/,
    )
    assert.equal(called, false)
  })

  it('only warns without the key when neither VERCEL nor PRERENDER_STRICT is set', async () => {
    const warnings = []
    const rows = await listPublishedSlugs({
      env: {},
      fetch: async () => {
        throw new Error('must not be called')
      },
      sleep: noSleep,
      warn: (m) => warnings.push(m),
    })
    assert.deepEqual(rows, [])
    assert.equal(warnings.length, 1)
  })

  it('throws on a non-OK response (after the retries)', async () => {
    let n = 0
    await assert.rejects(
      listPublishedSlugs({
        env: { VITE_SUPABASE_ANON_KEY: KEY },
        fetch: async () => {
          n++
          return { ok: false, status: 500, json: async () => ({}) }
        },
        sleep: noSleep,
      }),
      /500/,
    )
    assert.equal(n, 3)
  })

  it('returns [] with a warning outside Vercel when the key is missing', async () => {
    const warnings = []
    const rows = await listPublishedSlugs({
      env: {},
      fetch: async () => {
        throw new Error('must not be called')
      },
      sleep: noSleep,
      warn: (m) => warnings.push(m),
    })
    assert.deepEqual(rows, [])
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /VITE_SUPABASE_ANON_KEY/)
  })

  it('treats no published row as a valid empty list, not an error', async () => {
    const rows = await listPublishedSlugs({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: fakeSupabase([]),
      sleep: noSleep,
    })
    assert.deepEqual(rows, [])
  })
})

describe('ressourceRoutes', () => {
  it('gives /ressources/{slug} for each row', () => {
    assert.deepEqual(ressourceRoutes([{ slug: 'a' }, { slug: 'b-c' }]), [
      '/ressources/a',
      '/ressources/b-c',
    ])
  })
})

const ROW = {
  slug: 'claude-pipedrive',
  titre: 'Claude & Pipedrive « test »',
  resume: 'Un "résumé" d\'une <ressource> & plus',
}

const GOOD = {
  title: `${ROW.titre} — Sablia`,
  canonical: 'https://sablia.io/ressources/claude-pipedrive',
  description: ROW.resume,
  h1: ROW.titre,
  text: `${ROW.titre} ${ROW.resume} Le corps de la ressource, assez long pour être un vrai corps.`,
  html: '<main data-ready="true"></main>',
}

describe('assertRessourceHtml', () => {
  it('accepts decoded values, with entities and quotes in the title', () => {
    assert.doesNotThrow(() => assertRessourceHtml(GOOD, ROW))
  })

  it('rejects the home title (the defect this fixes)', () => {
    assert.throws(
      () =>
        assertRessourceHtml({ ...GOOD, title: 'Sablia — Le CRM qui se remplit tout seul' }, ROW),
      /title/,
    )
  })

  it('rejects the home canonical', () => {
    assert.throws(
      () => assertRessourceHtml({ ...GOOD, canonical: 'https://sablia.io/' }, ROW),
      /canonical/,
    )
  })

  it('rejects a description that is not the résumé, but skips it when résumé is null', () => {
    assert.throws(() => assertRessourceHtml({ ...GOOD, description: 'other' }, ROW), /description/)
    assert.doesNotThrow(() =>
      assertRessourceHtml({ ...GOOD, description: null }, { ...ROW, resume: null }),
    )
  })

  it('rejects a wrong h1 and a page without its body text', () => {
    assert.throws(() => assertRessourceHtml({ ...GOOD, h1: 'Ressource indisponible' }, ROW), /h1/)
    assert.throws(() => assertRessourceHtml({ ...GOOD, text: 'Chargement…' }, ROW), /body|text/)
  })

  it('rejects a mounted iframe: the video must sit behind its click-to-play facade (US-67)', () => {
    const withPlayer = {
      ...GOOD,
      html: '<main data-ready="true"><iframe src="https://www.youtube-nocookie.com/embed/x"></iframe></main>',
    }
    assert.throws(() => assertRessourceHtml(withPlayer, ROW), /iframe/)
  })

  it('rejects any public contenu-ressources file URL in the html', () => {
    const leaky = {
      ...GOOD,
      html: '<a href="https://x.supabase.co/storage/v1/object/public/contenu-ressources/a/b.pdf">',
    }
    assert.throws(() => assertRessourceHtml(leaky, ROW), /contenu-ressources/)
  })

  it('checks the first paragraph of corps_md when the row carries it', () => {
    const row = { ...ROW, corps_md: '## Titre\n\nPremier paragraphe unique.\n\nSuite.' }
    assert.throws(() => assertRessourceHtml(GOOD, row), /body/)
    assert.doesNotThrow(() =>
      assertRessourceHtml({ ...GOOD, text: `${GOOD.text} Premier paragraphe unique.` }, row),
    )
  })
})

describe('extractFromHtml', () => {
  it('decodes entities so serialized html passes the same check', () => {
    const html = `<html><head><title>Claude &amp; Pipedrive « test » — Sablia</title>
<link rel="canonical" href="https://sablia.io/ressources/claude-pipedrive" data-rh="true">
<meta name="description" content="Un &quot;résumé&quot; d'une &lt;ressource&gt; &amp; plus"></head>
<body><main><h1>Claude &amp; Pipedrive &laquo; test &raquo;</h1><p>Le corps &amp; la suite de la ressource.</p></main></body></html>`
    const dom = extractFromHtml(html)
    assert.equal(dom.title, 'Claude & Pipedrive « test » — Sablia')
    assert.equal(dom.description, 'Un "résumé" d\'une <ressource> & plus')
    assert.equal(dom.h1, 'Claude & Pipedrive « test »')
    assert.doesNotThrow(() =>
      assertRessourceHtml({ ...dom, text: `${dom.h1} ${ROW.resume} ${dom.text}` }, ROW),
    )
  })
})

describe('routes manifest', () => {
  it('lists the 16 routes (v2: /formations, /accompagnement, Google Sheets and Excel 365 pages added) with page-specific sources only', () => {
    assert.deepEqual(
      PAGE_ROUTES.map((r) => r.path),
      [
        '/',
        '/formations',
        '/accompagnement',
        '/mentions-legales',
        '/politique-confidentialite',
        '/cgv',
        '/guides/integrer-l-ia-dans-votre-entreprise',
        '/offres/compte-rendu-appel',
        '/offres/compte-rendu-appel/hubspot',
        '/offres/compte-rendu-appel/zoho',
        '/offres/compte-rendu-appel/salesforce',
        '/offres/compte-rendu-appel/pipedrive',
        '/offres/compte-rendu-appel/google-sheets',
        '/offres/compte-rendu-appel/excel-365',
        '/ressources',
        '/thank-you',
      ],
    )
    for (const r of PAGE_ROUTES) {
      assert.ok(r.sources.length > 0, `${r.path} has sources`)
      for (const s of r.sources) {
        assert.doesNotMatch(s, /SiteHeader|SiteFooter|layout\.tsx|shell\//, `${r.path}: ${s}`)
      }
    }
  })
})

describe('resolveRoutes', () => {
  function tempRoot(files) {
    const root = mkdtempSync(join(tmpdir(), 'routes-'))
    for (const [rel, body] of Object.entries(files)) {
      mkdirSync(join(root, rel, '..'), { recursive: true })
      writeFileSync(join(root, rel), JSON.stringify(body))
    }
    return root
  }
  const entry = (file) => ({
    path: `/x/${file}`,
    sources: [file],
    indexable: { fromJson: file },
    changefreq: 'monthly',
    priority: 0.6,
  })

  it('derives indexable from the JSON status: published yes, draft no', () => {
    const root = tempRoot({
      'c/a.json': { status: 'published' },
      'c/b.json': { status: 'draft', draftReason: 'later' },
    })
    const out = resolveRoutes({ root, routes: [entry('c/a.json'), entry('c/b.json')] })
    assert.deepEqual(
      out.map((r) => [r.path, r.indexable]),
      [
        ['/x/c/a.json', true],
        ['/x/c/b.json', false],
      ],
    )
  })

  it('keeps boolean entries as they are', () => {
    const out = resolveRoutes({
      root: tempRoot({}),
      routes: [{ path: '/', sources: ['p'], indexable: true, changefreq: 'weekly', priority: 1 }],
    })
    assert.equal(out[0].indexable, true)
  })

  it('accepts a list of candidate files and reads the first one that exists', () => {
    const root = tempRoot({ 'new/a.json': { status: 'published' } })
    const out = resolveRoutes({
      root,
      routes: [{ ...entry('x'), indexable: { fromJson: ['old/a.json', 'new/a.json'] } }],
    })
    assert.equal(out[0].indexable, true)
  })

  it('names every candidate when none exists', () => {
    assert.throws(
      () =>
        resolveRoutes({
          root: tempRoot({}),
          routes: [{ ...entry('x'), indexable: { fromJson: ['old/a.json', 'new/a.json'] } }],
        }),
      /old\/a\.json.*new\/a\.json/,
    )
  })

  it('throws a clear error naming the missing file', () => {
    const root = tempRoot({})
    assert.throws(
      () => resolveRoutes({ root, routes: [entry('c/missing.json')] }),
      /c\/missing\.json/,
    )
  })

  it('throws on an unknown status', () => {
    const root = tempRoot({ 'c/a.json': { status: 'maybe' } })
    assert.throws(() => resolveRoutes({ root, routes: [entry('c/a.json')] }), /status/)
  })

  it('resolves the real manifest without a CRM file', () => {
    assert.equal(resolveRoutes().length, PAGE_ROUTES.length)
  })
})

// 2026-10-18: `data-ready` and the title change land in one React commit, but Helmet writes <title>
// later; the build read the loading title « Ressource — Sablia » and failed the deploy of 48cc7aa.
// The prerender now waits for THIS exact title, shared with the assertion so the two cannot drift.
describe('ressourceTitle', () => {
  it('is the title the page renders once its row is read, never the loading title', () => {
    const row = { slug: 'pipedrive-nouveau-lead', titre: 'Brancher Pipedrive' }
    assert.equal(ressourceTitle(row), 'Brancher Pipedrive — Sablia')
    assert.notEqual(ressourceTitle(row), 'Ressource — Sablia')
  })

  it('is the title assertRessourceHtml demands', () => {
    const row = { slug: 's', titre: 'T', resume: null }
    assert.throws(
      () => assertRessourceHtml({ title: 'Ressource — Sablia' }, row),
      /expected "T — Sablia"/,
    )
  })
})
