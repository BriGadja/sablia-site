// Guards on the static export (dist/public). Pure checks over a fixture directory: no build, no network.
import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { describe, it } from 'node:test'
import { checkExport, checkOrganizationJsonLd } from './export-guards.mjs'

const page = ({
  title = 'T',
  h1 = '<h1>Titre</h1>',
  canonical = '',
  robots = '',
  body = '',
} = {}) =>
  `<!DOCTYPE html><html lang="fr"><head><title>${title}</title>${
    canonical ? `<link rel="canonical" href="${canonical}"/>` : ''
  }${robots ? `<meta name="robots" content="${robots}"/>` : ''}</head><body><main>${h1}${body}</main></body></html>`

const ROUTES = [
  { path: '/', indexable: true },
  { path: '/cgv', indexable: true },
  { path: '/ressources', indexable: true },
  { path: '/thank-you', indexable: false },
  { path: '/offres/compte-rendu-appel/hubspot', indexable: false, draft: true },
]
const ROW = { slug: 'ma-video', titre: 'Ma vidéo', youtube_id: 'abc123def45' }

function fixture(overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'export-'))
  const files = {
    'index.html': page({
      canonical: 'https://sablia.io',
      body: '<a href="/ressources/ma-video">v</a>',
    }),
    'cgv.html': page({ canonical: 'https://sablia.io/cgv' }),
    'thank-you.html': page({
      canonical: 'https://sablia.io/thank-you',
      robots: 'noindex, nofollow',
    }),
    'ressources.html': page({
      canonical: 'https://sablia.io/ressources',
      body: '<a href="/ressources/ma-video">Ma vidéo</a>',
    }),
    'ressources/ma-video.html': page({
      title: 'Ma vidéo — Sablia',
      h1: '<h1>Ma vidéo</h1>',
      canonical: 'https://sablia.io/ressources/ma-video',
      body: '<script></script>',
    }).replace('<main>', '<main data-ready="true">'),
    '404.html': page({ h1: '<p>Introuvable</p>' }),
    '_not-found.html': page({ h1: '<p>Introuvable</p>' }),
    'escalier-modeles.html': '<html><body>standalone</body></html>',
    ...overrides,
  }
  for (const [rel, body] of Object.entries(files)) {
    if (body === null) continue
    mkdirSync(dirname(join(dir, rel)), { recursive: true })
    writeFileSync(join(dir, rel), body)
  }
  return dir
}
const run = (dir, extra = {}) => checkExport({ dir, routes: ROUTES, rows: [ROW], ...extra })

describe('checkExport', () => {
  it('accepts a clean export', () => {
    assert.deepEqual(run(fixture()), [])
  })

  it('exempts 404.html and _not-found.html (no canonical, no h1 by design)', () => {
    assert.deepEqual(run(fixture()), [])
  })

  it('rejects the analytics tracker baked into a page', () => {
    const dir = fixture({
      'cgv.html': page({
        canonical: 'https://sablia.io/cgv',
        body: '<script src="/m/a.js"></script>',
      }),
    })
    assert.match(run(dir).join('\n'), /cgv.*\/m\/a\.js/)
  })

  it('rejects zero or two h1', () => {
    const none = fixture({
      'cgv.html': page({ canonical: 'https://sablia.io/cgv', h1: '<p>x</p>' }),
    })
    assert.match(run(none).join('\n'), /cgv.*h1/)
    const two = fixture({
      'cgv.html': page({ canonical: 'https://sablia.io/cgv', h1: '<h1>a</h1><h1>b</h1>' }),
    })
    assert.match(run(two).join('\n'), /cgv.*h1/)
  })

  it('rejects a missing canonical', () => {
    const dir = fixture({ 'cgv.html': page() })
    assert.match(run(dir).join('\n'), /cgv.*canonical/)
  })

  it('rejects a canonical with a trailing slash or on another origin', () => {
    assert.match(
      run(fixture({ 'cgv.html': page({ canonical: 'https://sablia.io/cgv/' }) })).join('\n'),
      /cgv.*canonical/,
    )
    assert.match(
      run(fixture({ 'cgv.html': page({ canonical: 'https://example.com/cgv' }) })).join('\n'),
      /cgv.*canonical/,
    )
  })

  it('rejects a canonical that is not the page own URL', () => {
    assert.match(
      run(fixture({ 'cgv.html': page({ canonical: 'https://sablia.io/' }) })).join('\n'),
      /cgv.*canonical/,
    )
  })

  it('rejects noindex on an indexable route and a missing noindex on a non-indexable one', () => {
    const a = fixture({
      'cgv.html': page({ canonical: 'https://sablia.io/cgv', robots: 'noindex' }),
    })
    assert.match(run(a).join('\n'), /cgv.*noindex/)
    const b = fixture({ 'thank-you.html': page({ canonical: 'https://sablia.io/thank-you' }) })
    assert.match(run(b).join('\n'), /thank-you.*noindex/)
  })

  it('does not require a draft route page, but wants noindex when one exists', () => {
    assert.deepEqual(run(fixture()), [])
    const dir = fixture({
      'offres/compte-rendu-appel/hubspot.html': page({
        canonical: 'https://sablia.io/offres/compte-rendu-appel/hubspot',
      }),
    })
    assert.match(run(dir).join('\n'), /hubspot.*noindex/)
  })

  it('rejects an indexable route with no page', () => {
    assert.match(run(fixture({ 'cgv.html': null })).join('\n'), /\/cgv.*missing/)
  })

  it('rejects a page that no route lists', () => {
    const dir = fixture({ 'orphan.html': page({ canonical: 'https://sablia.io/orphan' }) })
    assert.match(run(dir).join('\n'), /orphan.*routes\.mjs/)
  })

  it('rejects a published resource without its page, its own title or data-ready', () => {
    assert.match(run(fixture({ 'ressources/ma-video.html': null })).join('\n'), /ma-video.*missing/)
    const wrongTitle = fixture({
      'ressources/ma-video.html': page({
        title: 'Autre — Sablia',
        h1: '<h1>Ma vidéo</h1>',
        canonical: 'https://sablia.io/ressources/ma-video',
      }).replace('<main>', '<main data-ready="true">'),
    })
    assert.match(run(wrongTitle).join('\n'), /ma-video.*title/)
    const notReady = fixture({
      'ressources/ma-video.html': page({
        title: 'Ma vidéo — Sablia',
        h1: '<h1>Ma vidéo</h1>',
        canonical: 'https://sablia.io/ressources/ma-video',
      }),
    })
    assert.match(run(notReady).join('\n'), /ma-video.*data-ready/)
  })

  it('reads the body text decoded: an apostrophe rendered as &#x27; still matches the row', () => {
    const row = {
      slug: 'ma-video',
      titre: "Brancher l'appli",
      resume: "pour qu'une tâche tourne & finisse",
      youtube_id: 'abc123def45',
    }
    const body = (resume) => `<h2>Brancher l&#x27;appli</h2><p>${resume}</p>`
    const build = (resume) =>
      fixture({
        'ressources/ma-video.html': page({
          title: 'Brancher l&#x27;appli — Sablia',
          h1: '<h1>Brancher l&#x27;appli</h1>',
          canonical: 'https://sablia.io/ressources/ma-video',
          body: body(resume),
        })
          .replace('<main>', '<main data-ready="true">')
          .replace(
            '</head>',
            '<meta name="description" content="pour qu&#x27;une tâche tourne &amp; finisse"/></head>',
          ),
      })
    const ok = build('pour qu&#x27;une tâche tourne &amp; finisse')
    assert.deepEqual(run(ok, { rows: [row] }), [])
    const lacking = build('un autre texte')
    assert.match(run(lacking, { rows: [row] }).join('\n'), /missing the résumé/)
  })

  it('rejects a resource page that bakes the unavailable state', () => {
    const dir = fixture({
      'ressources/ma-video.html': page({
        title: 'Ma vidéo — Sablia',
        h1: '<h1>Ma vidéo</h1>',
        canonical: 'https://sablia.io/ressources/ma-video',
        body: 'Chargement…',
      }).replace('<main>', '<main data-ready="true">'),
    })
    assert.match(run(dir).join('\n'), /ma-video.*Chargement/)
  })

  it('rejects a /ressources page that does not list every slug', () => {
    const dir = fixture({ 'ressources.html': page({ canonical: 'https://sablia.io/ressources' }) })
    assert.match(run(dir).join('\n'), /\/ressources.*ma-video/)
  })

  it('checks the home video tiles against the slug list', () => {
    const ghost = fixture({
      'index.html': page({
        canonical: 'https://sablia.io',
        body: '<a href="/ressources/fantome">v</a>',
      }),
    })
    assert.match(run(ghost).join('\n'), /home.*fantome/)
    const yt = fixture({
      'index.html': page({
        canonical: 'https://sablia.io',
        body: '<a href="https://www.youtube.com/watch?v=abc123def45">v</a>',
      }),
    })
    assert.match(run(yt).join('\n'), /home.*abc123def45/)
  })

  it('accepts a home tile linking to YouTube when no row has that video', () => {
    const dir = fixture({
      'index.html': page({
        canonical: 'https://sablia.io',
        body: '<a href="https://www.youtube.com/watch?v=zzzzzzzzzzz">v</a>',
      }),
    })
    assert.deepEqual(run(dir), [])
  })

  it('fails on an export with no html at all', () => {
    assert.match(run(mkdtempSync(join(tmpdir(), 'empty-'))).join('\n'), /no html/i)
  })

  it('takes no resource row as an empty list (no resource page expected)', () => {
    const dir = fixture({
      'ressources/ma-video.html': null,
      'index.html': page({ canonical: 'https://sablia.io' }),
    })
    assert.deepEqual(checkExport({ dir, routes: ROUTES, rows: [] }), [])
  })
})

describe('checkOrganizationJsonLd', () => {
  const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`
  const ORG = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://sablia.io/#organization',
    description: 'livré en 7 jours',
  }
  it('accepts one organization with its id', () => {
    assert.deepEqual(checkOrganizationJsonLd(ld(ORG)), [])
  })
  it('rejects a missing, doubled, or unparseable block', () => {
    assert.match(checkOrganizationJsonLd('<html></html>').join(), /organization/i)
    assert.match(checkOrganizationJsonLd(ld(ORG) + ld(ORG)).join(), /organization/i)
    assert.match(
      checkOrganizationJsonLd('<script type="application/ld+json">{</script>').join(),
      /json/i,
    )
  })
  it('rejects the retired claims', () => {
    assert.match(
      checkOrganizationJsonLd(ld({ ...ORG, description: 'en 30 jours' })).join(),
      /30 jours/,
    )
    assert.match(
      checkOrganizationJsonLd(ld({ ...ORG, description: 'Dashboards intelligents' })).join(),
      /dashboards intelligents/i,
    )
  })
})
