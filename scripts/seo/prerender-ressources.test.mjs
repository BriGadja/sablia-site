// Hermetic tests for the /ressources/{slug} prerender helpers (US-54). No network: `fetch`,
// `sleep` and `warn` are injected. Run: `node --test scripts/seo/prerender-ressources.test.mjs`
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it } from 'node:test'
import {
  assertLettreHtml,
  assertRessourceHtml,
  extractFromHtml,
  listPublishedLettres,
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
const quiet = () => {}

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
  it('lists the 23 routes (v2: /formations, /accompagnement, Google Sheets and Excel 365 pages added; /newsletter on 27/10; /webinaire and its three noindex pages on 01/11; /realisations on 01/11; /responsable-ia-temps-partage on 11/11) with page-specific sources only', () => {
    assert.deepEqual(
      PAGE_ROUTES.map((r) => r.path),
      [
        '/',
        '/realisations',
        '/formations',
        '/accompagnement',
        '/responsable-ia-temps-partage',
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
        '/newsletter',
        '/webinaire',
        '/webinaire/merci',
        '/webinaire/apres-reservation',
        '/webinaire/questionnaire',
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

// ---------------------------------------------------------------------------------------------
// The Tuesday letter (US-101): ONE reader for every process of the build chain, and the assertion
// the export guards run on each built issue page.

const LETTRES = [
  {
    slug: '2026-11-03-plus-ancien',
    titre: 'Plus ancien',
    resume: 'r1',
    corps_md: '## A\n\nTexte.',
    youtube_id: null,
    published_at: '2026-11-03T07:30:00+00:00',
    updated_at: '2026-11-03T07:30:00+00:00',
    published: true,
  },
  {
    slug: '2026-11-10-plus-recent',
    titre: 'Plus récent',
    resume: 'r2',
    corps_md: '## B\n\nTexte.',
    youtube_id: 'abc123def45',
    published_at: '2026-11-10T07:30:00+00:00',
    updated_at: '2026-11-10T07:30:00+00:00',
    published: true,
  },
  {
    slug: '2026-11-17-brouillon',
    titre: 'Brouillon',
    resume: 'r3',
    corps_md: 'x',
    youtube_id: null,
    published_at: null,
    updated_at: null,
    published: false,
  },
]

describe('listPublishedLettres', () => {
  it('reads contenu_lettres: published rows only, newest first, every column the page needs', async () => {
    const calls = []
    const rows = await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: fakeSupabase(LETTRES, calls),
      sleep: noSleep,
      log: quiet,
    })
    assert.deepEqual(
      rows.map((r) => r.slug),
      ['2026-11-10-plus-recent', '2026-11-03-plus-ancien'],
    )
    assert.equal(calls.length, 1)
    const q = new URL(calls[0].url)
    assert.match(q.pathname, /\/rest\/v1\/contenu_lettres$/)
    assert.equal(
      q.searchParams.get('select'),
      'slug,titre,resume,corps_md,youtube_id,published_at,updated_at',
    )
    assert.equal(q.searchParams.get('published'), 'eq.true')
    assert.equal(q.searchParams.get('order'), 'published_at.desc')
    assert.equal(calls[0].init.headers.apikey, KEY)
  })

  it('sorts again by published_at descending, whatever order the server answers', async () => {
    const unsorted = async () => ({
      ok: true,
      status: 200,
      json: async () => [LETTRES[0], LETTRES[1]].map(({ published, ...r }) => r),
    })
    const rows = await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: unsorted,
      sleep: noSleep,
      log: quiet,
    })
    assert.equal(rows[0].slug, '2026-11-10-plus-recent')
  })

  it('retries 3 times with a growing backoff; strict then THROWS', async () => {
    let n = 0
    const waits = []
    await assert.rejects(
      listPublishedLettres({
        env: { VITE_SUPABASE_ANON_KEY: KEY, PRERENDER_STRICT: '1' },
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

  it('outside strict mode an unreadable table warns once and answers []', async () => {
    const warnings = []
    let n = 0
    const rows = await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: async () => {
        n++
        return { ok: false, status: 500, json: async () => ({}) }
      },
      sleep: noSleep,
      warn: (m) => warnings.push(m),
    })
    assert.deepEqual(rows, [])
    assert.equal(n, 3)
    assert.equal(warnings.length, 1)
    assert.match(warnings[0], /contenu_lettres.*500/)
  })

  it('a strict build on Vercel also throws on an unreadable table', async () => {
    await assert.rejects(
      listPublishedLettres({
        env: { VITE_SUPABASE_ANON_KEY: KEY, VERCEL: '1' },
        fetch: async () => ({ ok: false, status: 503, json: async () => ({}) }),
        sleep: noSleep,
      }),
      /503/,
    )
  })

  it('succeeds when a later try works', async () => {
    let n = 0
    const rows = await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY, PRERENDER_STRICT: '1' },
      fetch: async (...a) => {
        n++
        if (n < 3) throw new Error('flaky')
        return fakeSupabase(LETTRES)(...a)
      },
      sleep: noSleep,
      log: quiet,
    })
    assert.equal(rows.length, 2)
  })

  it('without the key: throws at once on a strict or Vercel build, warns and answers [] elsewhere', async () => {
    for (const env of [{ PRERENDER_STRICT: '1' }, { VERCEL: '1' }]) {
      let called = false
      await assert.rejects(
        listPublishedLettres({
          env,
          fetch: async () => {
            called = true
          },
          sleep: noSleep,
        }),
        /VITE_SUPABASE_ANON_KEY/,
      )
      assert.equal(called, false)
    }
    const warnings = []
    const rows = await listPublishedLettres({
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

  it('treats no published issue as a valid empty list, strict or not', async () => {
    const rows = await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY, PRERENDER_STRICT: '1' },
      fetch: fakeSupabase([]),
      sleep: noSleep,
      log: quiet,
    })
    assert.deepEqual(rows, [])
  })

  it('serves the fixtures first: no network, no key needed, newest first', async () => {
    const rows = await listPublishedLettres({
      env: {
        SABLIA_FIXTURE_LETTRES: '2026-11-03-exemple-ancien,2026-11-10-exemple-de-numero',
        VITE_SUPABASE_ANON_KEY: KEY,
      },
      fetch: async () => {
        throw new Error('must not be called')
      },
      sleep: noSleep,
      log: quiet,
    })
    assert.deepEqual(
      rows.map((r) => r.slug),
      ['2026-11-10-exemple-de-numero', '2026-11-03-exemple-ancien'],
    )
    assert.ok(rows.every((r) => typeof r.corps_md === 'string' && r.corps_md.length > 0))
  })

  it('logs one line « [lettres] N issue(s) read » per successful read, through the injected logger', async () => {
    const lines = []
    await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: fakeSupabase(LETTRES),
      sleep: noSleep,
      log: (m) => lines.push(m),
    })
    assert.deepEqual(lines, ['[lettres] 2 issue(s) read'])

    const empty = []
    await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY, PRERENDER_STRICT: '1' },
      fetch: fakeSupabase([]),
      sleep: noSleep,
      log: (m) => empty.push(m),
    })
    assert.deepEqual(empty, ['[lettres] 0 issue(s) read'])

    const fixtures = []
    await listPublishedLettres({
      env: { SABLIA_FIXTURE_LETTRES: '2026-11-10-exemple-de-numero' },
      fetch: async () => {
        throw new Error('must not be called')
      },
      sleep: noSleep,
      log: (m) => fixtures.push(m),
    })
    assert.deepEqual(fixtures, ['[lettres] 1 issue(s) read (SABLIA_FIXTURE_LETTRES)'])

    const failed = []
    await listPublishedLettres({
      env: { VITE_SUPABASE_ANON_KEY: KEY },
      fetch: async () => ({ ok: false, status: 500, json: async () => ({}) }),
      sleep: noSleep,
      warn: quiet,
      log: (m) => failed.push(m),
    })
    assert.deepEqual(failed, [], 'no count line when nothing was read')
  })

  it('drops a row without a readable published_at, with one warning, strict or not', async () => {
    const [older, newer] = LETTRES.map(({ published, ...r }) => r)
    for (const extra of [{}, { PRERENDER_STRICT: '1' }]) {
      for (const bad of [null, undefined, '', 'pas une date']) {
        const warnings = []
        const lines = []
        const rows = await listPublishedLettres({
          env: { VITE_SUPABASE_ANON_KEY: KEY, ...extra },
          fetch: async () => ({
            ok: true,
            status: 200,
            json: async () => [newer, { ...older, published_at: bad }],
          }),
          sleep: noSleep,
          warn: (m) => warnings.push(m),
          log: (m) => lines.push(m),
        })
        const label = `${JSON.stringify(extra)} ${JSON.stringify(bad)}`
        assert.deepEqual(
          rows.map((r) => r.slug),
          ['2026-11-10-plus-recent'],
          label,
        )
        assert.equal(warnings.length, 1, label)
        assert.match(warnings[0], /2026-11-03-plus-ancien.*published_at/, label)
        assert.deepEqual(lines, ['[lettres] 1 issue(s) read'], label)
      }
    }
  })

  it('propagates the fixture refusal of a strict build', async () => {
    await assert.rejects(
      listPublishedLettres({
        env: { SABLIA_FIXTURE_LETTRES: '2026-11-10-exemple-de-numero', PRERENDER_STRICT: '1' },
        fetch: async () => {
          throw new Error('must not be called')
        },
        sleep: noSleep,
      }),
      /SABLIA_FIXTURE_LETTRES/,
    )
  })
})

const NBSP = '\u00a0'
const LROW = {
  slug: '2026-11-10-exemple',
  titre: 'Relancer un devis : « sans y penser »',
  resume: "Ce que l'outil ne fait pas & ce qu'il faut préparer.",
  corps_md: '## Pourquoi\n\nTexte.',
  youtube_id: null,
  published_at: '2026-11-10T07:30:00+00:00',
  updated_at: '2026-11-10T07:30:00+00:00',
}
const ld = (data) => `<script type="application/ld+json">${JSON.stringify(data)}</script>`
const ARTICLE = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: LROW.titre,
  datePublished: LROW.published_at,
  author: { '@type': 'Person', name: 'Brice Gachadoat' },
}
const lhtml = ({
  main = '<main id="contenu" data-ready="true" class="v2-lettre">',
  blocks = ld(ARTICLE),
  before = '',
  body = '<h2>Pourquoi</h2><p>Texte.</p>',
} = {}) => `${main}${blocks}${before}<div class="lt-body" data-body="lettre">${body}</div></main>`
const LGOOD = {
  title: `${LROW.titre} · Sablia`,
  canonical: 'https://sablia.io/lettre/2026-11-10-exemple',
  description: LROW.resume,
  h1: LROW.titre,
  text: `${LROW.titre} ${LROW.resume} Pourquoi Texte.`,
  html: lhtml(),
}

describe('assertLettreHtml', () => {
  it('accepts the page of its row', () => {
    assert.doesNotThrow(() => assertLettreHtml(LGOOD, LROW))
  })

  it('squashes spaces on BOTH sides: a no-break space in the title or the résumé never fails a build', () => {
    const typo = { ...LROW, titre: `Relancer un devis${NBSP}: « sans y penser »` }
    assert.doesNotThrow(() => assertLettreHtml(LGOOD, typo))
    const dom = {
      ...LGOOD,
      title: `Relancer un devis${NBSP}:${NBSP}« sans y penser » · Sablia`,
      h1: `Relancer un devis${NBSP}: « sans  y penser »`,
      description: `Ce que l'outil ne fait pas${NBSP}& ce qu'il faut préparer.`,
    }
    assert.doesNotThrow(() => assertLettreHtml(dom, LROW))
  })

  it('rejects another title, canonical, description or h1', () => {
    assert.throws(() => assertLettreHtml({ ...LGOOD, title: 'Sablia' }, LROW), /title/)
    // « · Sablia », like the other v2 pages: the em dash never reaches a visitor (F-build Finding 3)
    assert.throws(
      () => assertLettreHtml({ ...LGOOD, title: `${LROW.titre} — Sablia` }, LROW),
      /title/,
    )
    assert.throws(
      () => assertLettreHtml({ ...LGOOD, canonical: '/lettre/2026-11-10-exemple' }, LROW),
      /canonical/,
    )
    assert.throws(
      () => assertLettreHtml({ ...LGOOD, canonical: 'https://sablia.io/newsletter' }, LROW),
      /canonical/,
    )
    assert.throws(() => assertLettreHtml({ ...LGOOD, description: 'autre' }, LROW), /description/)
    assert.throws(() => assertLettreHtml({ ...LGOOD, h1: 'Autre' }, LROW), /h1/)
  })

  it('rejects a page whose visible text lacks the résumé', () => {
    assert.throws(
      () => assertLettreHtml({ ...LGOOD, text: `${LROW.titre} Pourquoi Texte.` }, LROW),
      /résumé/,
    )
  })

  it('rejects a <main> without data-ready="true"', () => {
    const html = lhtml({ main: '<main id="contenu" class="v2-lettre">' })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html }, LROW), /data-ready/)
  })

  it('wants an Article block with its author name and the row datePublished', () => {
    assert.throws(
      () => assertLettreHtml({ ...LGOOD, html: lhtml({ blocks: '' }) }, LROW),
      /Article/,
    )
    const noAuthor = lhtml({ blocks: ld({ ...ARTICLE, author: { '@type': 'Person' } }) })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: noAuthor }, LROW), /author/)
    const noDate = lhtml({ blocks: ld({ ...ARTICLE, datePublished: undefined }) })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: noDate }, LROW), /datePublished/)
    const otherDate = lhtml({ blocks: ld({ ...ARTICLE, datePublished: '2026-01-01' }) })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: otherDate }, LROW), /datePublished/)
    const escaped = lhtml({
      blocks: `<script type="application/ld+json">${JSON.stringify(ARTICLE).replace(/</g, '\\u003c')}</script>`,
    })
    assert.doesNotThrow(() => assertLettreHtml({ ...LGOOD, html: escaped }, LROW))
  })

  it('rejects an iframe anywhere, a merge tag anywhere, an image in the body', () => {
    const iframe = lhtml({
      before: '<iframe src="https://www.youtube-nocookie.com/embed/x"></iframe>',
    })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: iframe }, LROW), /iframe/)
    const tag = lhtml({ body: '<p>Bonjour {{{contact.first_name|}}},</p>' })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: tag }, LROW), /merge tag/)
    const img = lhtml({ body: '<p><img src="https://example.com/a.png" alt=""/></p>' })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: img }, LROW), /img/)
  })

  it('accepts the own-hosted video poster before the body, and wants the body block itself', () => {
    const poster = lhtml({
      before:
        '<button aria-label="Lire la vidéo : x"><img src="/_posters/abc123def45.webp" alt=""/></button>',
    })
    assert.doesNotThrow(() => assertLettreHtml({ ...LGOOD, html: poster }, LROW))
    const noBody = `<main id="contenu" data-ready="true">${ld(ARTICLE)}<p>Texte.</p></main>`
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: noBody }, LROW), /body/)
  })

  it('rejects an issue page whose body block is empty', () => {
    for (const body of ['', '   ', '<p></p>', '<p> </p>\n']) {
      assert.throws(
        () => assertLettreHtml({ ...LGOOD, html: lhtml({ body }) }, LROW),
        /body block is empty/,
        JSON.stringify(body),
      )
    }
  })

  it('rejects a body without the first ## heading of corps_md, and only when corps_md has one', () => {
    const other = lhtml({ body: '<h2>Autre chose</h2><p>Texte.</p>' })
    assert.throws(() => assertLettreHtml({ ...LGOOD, html: other }, LROW), /first ## heading/)
    const plain = { ...LROW, corps_md: 'Bonjour,\n\nTexte sans section.\n\n# Un grand titre' }
    const html = lhtml({ body: '<p>Bonjour,</p><p>Texte sans section.</p><h2>Un grand titre</h2>' })
    assert.doesNotThrow(() => assertLettreHtml({ ...LGOOD, html }, plain))
  })

  it('reads the first ## heading through inline Markdown, entities and spacing', () => {
    const row = {
      ...LROW,
      corps_md:
        "Bonjour,\n\n##   Pourquoi **l'outil** &amp; [la page](https://sablia.io/x) `devis.md` ##\n\nTexte.\n\n## Deuxième",
    }
    const body =
      '<p>Bonjour,</p><h2>Pourquoi <strong>l&#x27;outil</strong> &amp; <a href="https://sablia.io/x">la page</a> <code>devis.md</code></h2><p>Texte.</p><h2>Deuxième</h2>'
    assert.doesNotThrow(() => assertLettreHtml({ ...LGOOD, html: lhtml({ body }) }, row))
  })
})
