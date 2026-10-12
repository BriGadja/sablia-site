// Route manifest (contract C2) — the single list of static pages, read by the prerender and by the
// sitemap generator. Pure data and a pure resolver: importing it launches nothing.
//
// `sources` = the page component and the content modules ONLY that page reads. Shared chrome
// (TopNav, FooterSection, App.tsx, index.html) is deliberately absent: a nav tweak must not bump
// every page's `lastmod`.
// `indexable` = true | false | { fromJson: file } — the latter is derived from the JSON `status`
// ("published" → indexable, "draft" → not and flagged `draft: true` so the prerender skips it),
// never stored twice.
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const P = 'client/src/pages'
const L = 'client/src/components/landing'
const O = 'client/src/components/offre'
const C = 'client/src/content'

export const PAGE_ROUTES = [
  {
    path: '/',
    sources: [
      `${P}/Landing.tsx`,
      `${L}/HeroSection.tsx`,
      `${L}/CRMStrip.tsx`,
      `${L}/OffreSection.tsx`,
      `${L}/FormationsSection.tsx`,
      `${L}/CalloutSection.tsx`,
      `${C}/home.ts`,
    ],
    indexable: true,
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/mentions-legales',
    sources: [`${P}/MentionsLegales.tsx`],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/politique-confidentialite',
    sources: [`${P}/PolitiqueConfidentialite.tsx`],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/cgv',
    sources: [`${P}/CGV.tsx`],
    indexable: true,
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: '/guides/integrer-l-ia-dans-votre-entreprise',
    sources: [`${P}/GuideIaEntreprise.tsx`, `${C}/of1.ts`],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/offres/compte-rendu-appel',
    sources: [
      `${P}/OffreCompteRenduAppel.tsx`,
      `${C}/of1.ts`,
      `${C}/of1-schema.ts`,
      `${C}/faq-carried.ts`,
      `${C}/proof.ts`,
      `${O}/AudienceStrip.tsx`,
      `${O}/IncludedExcludedSection.tsx`,
      `${O}/ObjectionSection.tsx`,
      `${O}/OffreCallout.tsx`,
      `${O}/OffreFaq.tsx`,
      `${O}/OffreHero.tsx`,
      `${O}/PricingSection.tsx`,
      `${O}/ProofStrip.tsx`,
      `${O}/VariantsSection.tsx`,
    ],
    indexable: true,
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/ressources',
    sources: [`${P}/Ressources.tsx`],
    indexable: true,
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    // Prerendered (Helmet emits noindex) but kept out of the sitemap.
    path: '/thank-you',
    sources: [`${P}/ThankYou.tsx`],
    indexable: false,
    changefreq: 'yearly',
    priority: 0.1,
  },
]

/** Returns the routes with every `{ fromJson }` replaced by a boolean read from the JSON status. */
export function resolveRoutes({ root = ROOT, routes = PAGE_ROUTES } = {}) {
  return routes.map((route) => {
    if (typeof route.indexable !== 'object' || route.indexable === null) return { ...route }
    const file = route.indexable.fromJson
    const full = join(root, file)
    if (!existsSync(full)) {
      throw new Error(`routes: ${route.path} reads ${file} for its status, but the file is missing`)
    }
    const { status } = JSON.parse(readFileSync(full, 'utf8'))
    if (status !== 'published' && status !== 'draft') {
      throw new Error(
        `routes: ${file} has status ${JSON.stringify(status)} (expected "published" or "draft")`,
      )
    }
    return { ...route, indexable: status === 'published', draft: status === 'draft' }
  })
}
