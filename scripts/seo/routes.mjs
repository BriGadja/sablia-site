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

const crmJson = (crm) => [`${C}/crm/${crm}.json`]

export const PAGE_ROUTES = [
  {
    path: '/',
    sources: [
      `${A}/page.tsx`,
      `${A}/home-metadata.ts`,
      `${H}/HomePage.tsx`,
      // The home's bands in page order (US-104, plan sablia-site-structure-offre). `scene` lives on the
      // CRM offer page, `construit` on /realisations and `apres` gave way to `mensuel`: none dates the home.
      ...[
        'top',
        'mensuel',
        'automatisations',
        'offre',
        'formations',
        'conferences',
        'videos',
        'derriere',
        'webinaire',
        'faq',
      ].map((id) => `${H}/${id}/`),
      // #fin is the shell's FinBand; its home copy lives in faq/content.ts (FIN_BAND).
    ],
    indexable: true,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    // The wall of realisations that left the home (#construit, moved under src/components/realisations/).
    path: '/realisations',
    sources: [`${A}/realisations/`, 'src/components/realisations/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/formations',
    sources: [`${A}/formations/`, 'src/components/formations/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    // Talks and seminars on request (US-107), price on quote; reached from the menu and the home.
    path: '/conferences',
    sources: [`${A}/conferences/`, 'src/components/conferences/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    // The monthly offer « Responsable IA externalisé » (US-99, renamed by US-105 on 12/11), price
    // shown; outside /offres/** on purpose (header-cta.ts gives every /offres/** route the CRM
    // Calendly). Its old address and /accompagnement answer 301 here (server/static.ts).
    path: '/responsable-ia-externalise',
    sources: [`${A}/responsable-ia-externalise/`, 'src/components/temps-partage/'],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.9,
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
    path: '/newsletter',
    // The list of issues (#numeros) takes its strings and dates from the letter's module (US-102).
    sources: [
      `${A}/newsletter/`,
      'src/components/newsletter/',
      'src/components/lettre/content.ts',
      'src/components/lettre/date.ts',
    ],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    // Webinar registration (plan webinaire-bureaux-etudes-2026-11-01, US-86); copy in one module.
    path: '/webinaire',
    sources: [`${A}/webinaire/page.tsx`, `${C}/webinaire.ts`, 'src/components/webinaire/'],
    indexable: true,
    changefreq: 'weekly',
    priority: 0.7,
  },
  ...['merci', 'apres-reservation', 'questionnaire'].map((slug) => ({
    // Built (each page emits noindex) but kept out of the sitemap (US-86, US-88, US-90).
    path: `/webinaire/${slug}`,
    sources: [`${A}/webinaire/${slug}/`, `${C}/webinaire.ts`],
    indexable: false,
    changefreq: 'yearly',
    priority: 0.1,
  })),
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
