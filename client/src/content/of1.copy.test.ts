/**
 * Editorial + coherence guard for the OF-1 product page.
 *
 * The parity test binds the module to the offer; this one binds the PAGE to the house rules:
 * no em dash, none of the banned AI figures, no day-rate or man-day wording, no social proof
 * (zero client delivered on this offer), one CTA URL, and a route registered in every place that
 * must agree. It reads the component sources when they exist, so it grows teeth as the page lands.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { OF1_BOOKING_URL, OF1_ROUTE, of1 } from './of1'
import { faqSchema, serviceSchema } from './of1-schema'

const HERE = dirname(fileURLToPath(import.meta.url))
const OFFRE_COMPONENTS_DIR = resolve(HERE, '../components/offre')
const PAGE_FILE = resolve(HERE, '../pages/OffreCompteRenduAppel.tsx')
const APP_FILE = resolve(HERE, '../App.tsx')
const SEO_FILE = resolve(HERE, '../components/SEO.tsx')
const PRERENDER_FILE = resolve(HERE, '../../../scripts/prerender.mjs')
const SITEMAP_FILE = resolve(HERE, '../../public/sitemap.xml')
const META_TAGS_FILE = resolve(HERE, '../../../docs/meta-tags.json')

/**
 * The codebase writes `100&nbsp;%`; an unnormalised match would walk straight past `80&nbsp;%`.
 * Every entity and every exotic space becomes a plain space before any assertion runs.
 */
function normalise(text: string): string {
  return text.replace(/&nbsp;|&#160;|&#xa0;/gi, ' ').replace(/[   ]/g, ' ')
}

/** Every string and number the module carries, plus the two exported constants. */
function contentLeaves(): string[] {
  const leaves: string[] = [OF1_ROUTE, OF1_BOOKING_URL]
  const walk = (node: unknown): void => {
    if (typeof node === 'string') leaves.push(node)
    else if (typeof node === 'number') leaves.push(String(node))
    else if (Array.isArray(node)) for (const item of node) walk(item)
    else if (node !== null && typeof node === 'object') for (const v of Object.values(node)) walk(v)
  }
  walk(of1)
  return leaves.map(normalise)
}

/** Component + page sources, once they exist. Absence is tolerated: they land in Phases C and E. */
function pageSources(): { path: string; text: string }[] {
  const files: string[] = []
  if (existsSync(OFFRE_COMPONENTS_DIR)) {
    for (const name of readdirSync(OFFRE_COMPONENTS_DIR)) {
      if (name.endsWith('.tsx') && !name.endsWith('.test.tsx')) {
        files.push(join(OFFRE_COMPONENTS_DIR, name))
      }
    }
  }
  if (existsSync(PAGE_FILE)) files.push(PAGE_FILE)
  return files.map((path) => ({ path, text: normalise(readFileSync(path, 'utf8')) }))
}

const LEAVES = contentLeaves()
const SOURCES = pageSources()
const ALL_TEXT = [...LEAVES, ...SOURCES.map((s) => s.text)]

/** The twelve figures of memory/reference-chiffres-ia-bannis.md, plus their citation ring. */
const BANNED_FIGURES: RegExp[] = [
  /\b(80|95|70|19|94|46|51|54|36|35|96|26|17) ?%/,
  /\b70,9 ?%/,
  /18,6 milliards/i,
  /\b1 ?200 entreprises/i,
  /\b5 ?h ?30\b/i,
  /\b5h30\b/i,
]

const BANNED_SOURCES = [
  'Incenteev',
  'Introhive',
  'RAND',
  'McKinsey',
  'Gartner',
  'METR',
  'Pendo',
  'Zylo',
  'Eurostat',
  'France Num',
  'selon une étude',
]

/** Day-rate wording, and every name that would read as social proof we do not have. */
const BANNED_WORDING = [
  'TJM',
  'jour-homme',
  'jours-homme',
  'jour homme',
  'jours homme',
  'témoignage',
  'Norloc',
  'Qwertys',
  'VB Mobilier',
  'Nestenn',
  'Nesten',
]

const REQUIRED_IN_PAGE = [
  '2 à 20 personnes',
  '1 490',
  '149',
  'remier mois offert',
  '7 jours',
  'intégralement remboursé',
  'https://calendly.com/brice-gachadoat/30min',
]

/** French words that lost their accents — the module is client-facing copy, not code. */
const UNACCENTED =
  /\b(donnees|equipe|equipes|telephonie|apres|deja|delai|premiere|etape|etapes|synthese|controle|resiliable|cree|creee|remplacons)\b/i

describe('OF-1 copy guard: characters and figures', () => {
  it('uses no em dash anywhere in the copy or the page sources', () => {
    for (const text of ALL_TEXT) {
      expect(text).not.toMatch(/[—―]/)
    }
  })

  it('carries none of the banned AI figures', () => {
    for (const text of ALL_TEXT) {
      for (const pattern of BANNED_FIGURES) {
        expect(text).not.toMatch(pattern)
      }
    }
  })

  it('names none of the banned statistic sources', () => {
    for (const text of ALL_TEXT) {
      for (const source of BANNED_SOURCES) {
        expect(text.toLowerCase()).not.toContain(source.toLowerCase())
      }
    }
  })
})

describe('OF-1 copy guard: what the page must never say', () => {
  it('never prices in day rates or man-days, and shows no social proof', () => {
    for (const text of ALL_TEXT) {
      for (const banned of BANNED_WORDING) {
        expect(text.toLowerCase()).not.toContain(banned.toLowerCase())
      }
    }
  })

  it('anchors on no competitor price', () => {
    for (const text of ALL_TEXT) {
      expect(text).not.toMatch(/\b(500|1 000|1000) ?€/)
    }
  })

  it('keeps the French copy accented', () => {
    for (const leaf of LEAVES) {
      expect(leaf).not.toMatch(UNACCENTED)
    }
  })

  it('uses no `any` in the page sources', () => {
    for (const source of SOURCES) {
      expect(`${source.path}: ${source.text}`).not.toMatch(/:\s*any\b|\bas any\b|<any>/)
    }
  })
})

describe('OF-1 copy guard: what the page must say', () => {
  it('carries every load-bearing fact of the offer', () => {
    const haystack = ALL_TEXT.join('\n')
    for (const required of REQUIRED_IN_PAGE) {
      expect(haystack).toContain(required)
    }
  })

  it('offers exactly one booking URL', () => {
    for (const source of SOURCES) {
      const urls = source.text.match(/https:\/\/calendly\.com\/[a-z0-9-]+\/[a-z0-9-]+/g) ?? []
      for (const url of urls) {
        expect(url).toBe(OF1_BOOKING_URL)
      }
    }
  })
})

describe('OF-1 copy guard: route coherence', () => {
  it('registers the route in App.tsx', () => {
    const app = readFileSync(APP_FILE, 'utf8')
    expect(app).toContain('OF1_ROUTE')
    expect(app).toContain('<Route path={OF1_ROUTE}')
  })

  it('registers the route in the prerender script', () => {
    expect(readFileSync(PRERENDER_FILE, 'utf8')).toContain(OF1_ROUTE)
  })

  it('registers the route in the sitemap', () => {
    expect(readFileSync(SITEMAP_FILE, 'utf8')).toContain(`https://sablia.io${OF1_ROUTE}`)
  })

  it('registers the route in meta-tags.json', () => {
    const metaTags: { pages: Record<string, unknown> } = JSON.parse(
      readFileSync(META_TAGS_FILE, 'utf8'),
    )
    expect(Object.keys(metaTags.pages)).toContain(OF1_ROUTE)
  })

  it('registers the route in SEO.tsx', () => {
    expect(readFileSync(SEO_FILE, 'utf8')).toContain(OF1_ROUTE)
  })
})

describe('OF-1 copy guard: structured data', () => {
  it('prices the Service offer from the module, never by hand', () => {
    expect(serviceSchema.offers.price).toBe(String(of1.price.oneShotHt))
    expect(serviceSchema.offers.priceCurrency).toBe('EUR')
    expect(serviceSchema.offers.priceSpecification.price).toBe(String(of1.price.oneShotHt))
    expect(serviceSchema.offers.priceSpecification.valueAddedTaxIncluded).toBe(false)
  })

  it('publishes every FAQ entry the page renders', () => {
    expect(faqSchema.mainEntity).toHaveLength(of1.faq.length)
    expect(faqSchema.mainEntity[0].name).toBe(of1.faq[0].q)
  })
})
