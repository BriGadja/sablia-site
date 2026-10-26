// Route manifest (contract C2) — the single list of static pages, read by the prerender and by the
// sitemap generator. Pure data and a pure resolver: importing it launches nothing.
//
// `sources` = the page component and the content modules ONLY that page reads. Shared chrome
// (TopNav, FooterSection, App.tsx, index.html) is deliberately absent: a nav tweak must not bump
// every page's `lastmod`.
// A source ending in `/` is a directory: every non-test file under it (see stamp-lastmod). A source
// that does not exist yet is skipped with a warning, so a route can be declared before its page lands.
// `indexable` = true | false | { fromJson: file | [file, …] } — the latter is derived from the JSON
// `status` ("published" → indexable, "draft" → not and flagged `draft: true`: no page is built, and
// one that exists must be noindex), never stored twice. A list = candidate locations, first that exists.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const A = 'src/app'
const H = 'src/components/home'
const C = 'src/content'

const crmJson = (crm) => [`${C}/crm/${crm}.json`, `client/${C}/crm/${crm}.json`]

export const PAGE_ROUTES = [
  {
    path: '/',
    sources: [
      `${A}/page.tsx`,
      `${A}/home-metadata.ts`,
      `${H}/HomePage.tsx`,
      ...[
        'top',
        'scene',
        'automatisations',
        'construit',
        'formations',
        'derriere',
        'videos',
        'faq',
        'fin',
      ].map((id) => `${H}/${id}/`),
    ],
    indexable: true,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/formations',
    sources: [`${A}/formations/`, 'src/components/formations/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/accompagnement',
    sources: [`${A}/accompagnement/`, 'src/components/accompagnement/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/mentions-legales',
    sources: [`${A}/mentions-legales/`, 'src/components/legal/', 'src/content/legal/'],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/politique-confidentialite',
    sources: [`${A}/politique-confidentialite/`, 'src/components/legal/', 'src/content/legal/'],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/cgv',
    sources: [`${A}/cgv/`, 'src/components/legal/', 'src/content/legal/'],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/guides/integrer-l-ia-dans-votre-entreprise',
    sources: [`${A}/guides/`, `${C}/of1.ts`],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/offres/compte-rendu-appel',
    sources: [
      `${A}/offres/compte-rendu-appel/page.tsx`,
      `${C}/of1.ts`,
      `${C}/of1-schema.ts`,
      `${C}/faq-carried.ts`,
      `${C}/proof.ts`,
      'src/components/offre/',
    ],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.9,
  },
  ...['hubspot', 'zoho', 'salesforce', 'pipedrive'].map((crm) => ({
    // P10a: `indexable` is derived from the JSON `status`; a draft is neither built nor in the
    // sitemap. `sources` = the JSON only, so a template tweak bumps no `lastmod`.
    path: `/offres/compte-rendu-appel/${crm}`,
    sources: [crmJson(crm)[0]],
    indexable: { fromJson: crmJson(crm) },
    changefreq: 'monthly',
    priority: 0.8,
  })),
  ...['google-sheets', 'excel-365'].map((tool) => ({
    path: `/offres/compte-rendu-appel/${tool}`,
    sources: [`${A}/offres/compte-rendu-appel/${tool}/`],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  })),
  {
    path: '/ressources',
    sources: [`${A}/ressources/`, 'src/lib/contenu.ts'],
    indexable: true,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    // Built (the page emits noindex) but kept out of the sitemap.
    path: '/thank-you',
    sources: [`${A}/thank-you/`, 'src/components/legal/', 'src/content/legal/'],
    indexable: false,
    changefreq: 'yearly',
    priority: 0.1,
  },
]

/** Returns the routes with every `{ fromJson }` replaced by a boolean read from the JSON status. */
export function resolveRoutes({ root = ROOT, routes = PAGE_ROUTES } = {}) {
  return routes.map((route) => {
    if (typeof route.indexable !== 'object' || route.indexable === null) return { ...route }
    const candidates = [route.indexable.fromJson].flat()
    const file = candidates.find((f) => existsSync(join(root, f)))
    if (!file) {
      throw new Error(
        `routes: ${route.path} reads ${candidates.join(' or ')} for its status, but no such file exists`,
      )
    }
    const { status } = JSON.parse(readFileSync(join(root, file), 'utf8'))
    if (status !== 'published' && status !== 'draft') {
      throw new Error(
        `routes: ${file} has status ${JSON.stringify(status)} (expected "published" or "draft")`,
      )
    }
    return { ...route, indexable: status === 'published', draft: status === 'draft' }
  })
}
