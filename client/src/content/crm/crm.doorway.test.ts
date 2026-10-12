/**
 * Doorway guard for the four CRM pages (contract C2/C4 of plans/visibilite-llm-sablia.md).
 *
 * Google's doorway policy: near-identical pages that differ by a name are worthless to readers and
 * a liability to the site. So a page is `published` only when it carries what is specific to its
 * CRM, sourced in a hub ledger; otherwise it stays a `draft` (noindex, not routable, not linked).
 *
 * The tests iterate the FOUR named files, by `status`, never a `*.json` glob: `banned-figures.json`
 * and `__fixtures__/` share the folder. They stay green while the pages are drafts and tighten as
 * P10b-P13 publish. The published rules are also run against a fixture, so they are proven before
 * any real content exists.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// @ts-expect-error: plain ESM manifest shared with the Node scripts, no type declarations
import { resolveRoutes } from '../../../../scripts/seo/routes.mjs'
import { of1 } from '../of1'
import banned from './banned-figures.json'
import { publishedCrmPages } from './index'
import {
  CRM_SLUGS,
  CRM_SOURCE_HOSTS,
  type CrmSlug,
  crmPageSchema,
  type PublishedCrmPage,
} from './schema'

const HERE = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(HERE, '../..')
/** Hub ledgers, read through the relative path (of1.parity.test.ts precedent). */
const HUB_LEDGER_DIR = resolve(HERE, '../../../../../../../../research/visibilite-llm/crm-sources')
const FIXTURE = resolve(HERE, '__fixtures__/published-fixture.json')
const FIXTURE_LEDGER = resolve(HERE, '__fixtures__/ledger-fixture.md')

/** The words a page of ours may never use: we are not a partner of, nor certified by, any CRM. */
const BANNED_WORDS = ['partenaire', 'certifié', 'agréé', 'Norloc']
/** The phrase that identifies the Pipedrive production line (grill Q9). */
const PROOF_MARKER = "société d'investissement locatif"
const SHINGLE = 8

type RouteRow = { path: string; indexable: boolean; draft?: boolean }

function normalise(text: string): string {
  return text
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/[   ]/g, ' ')
    .replace(/[’‘]/g, "'")
}

function leaves(node: unknown, out: string[] = []): string[] {
  if (typeof node === 'string') out.push(normalise(node))
  else if (typeof node === 'number') out.push(String(node))
  else if (Array.isArray(node)) for (const item of node) leaves(item, out)
  else if (node !== null && typeof node === 'object')
    for (const v of Object.values(node)) leaves(v, out)
  return out
}

function loadPage(file: string) {
  return crmPageSchema.parse(JSON.parse(readFileSync(file, 'utf8')))
}

const realFile = (slug: CrmSlug) => join(HERE, `${slug}.json`)

function routeOf(path: string): RouteRow {
  const route = (resolveRoutes() as RouteRow[]).find((r) => r.path === path)
  if (!route) throw new Error(`no route manifest entry for ${path}`)
  return route
}

/** `### F<n>` entries of a ledger: id -> URL. */
function ledgerUrls(path: string): Map<string, string> {
  const text = readFileSync(path, 'utf8')
  const out = new Map<string, string>()
  for (const section of text.split(/^###\s+/m).slice(1)) {
    const id = section.match(/^(F\d+)\b/)?.[1]
    const url = section.match(/^\s*[-*]?\s*URL\s*:\s*(\S+)/im)?.[1]
    if (id && url) out.set(id, url)
  }
  return out
}

/** CRM-specific prose of a published page, the only blocks that can make two pages twins. */
function specificBlocks(page: PublishedCrmPage): string[] {
  return [page.hero, page.where, page.followUp, page.prerequisites, page.pitfall, page.faq].flatMap(
    (block) => leaves(block),
  )
}

function shingles(texts: string[], size = SHINGLE): Set<string> {
  const out = new Set<string>()
  for (const text of texts) {
    const words = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}']+/gu, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
    for (let i = 0; i + size <= words.length; i++) out.add(words.slice(i, i + size).join(' '))
  }
  return out
}

function sharedShingles(a: PublishedCrmPage, b: PublishedCrmPage): string[] {
  const sb = shingles(specificBlocks(b))
  return [...shingles(specificBlocks(a))].filter((s) => sb.has(s))
}

function walkSources(visit: (full: string) => void, dir = SRC) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== '__fixtures__') walkSources(visit, full)
    } else if (/\.(ts|tsx|json)$/.test(entry.name) && !/\.test\./.test(entry.name)) {
      visit(full)
    }
  }
}

/** Every rule a PUBLISHED page must satisfy, applied to the fixture and to each real page. */
function expectPublishedRules(page: PublishedCrmPage, ledgerPath: string, label: string) {
  const text = leaves(page).join('\n')
  const ledger = ledgerUrls(ledgerPath)

  expect(page.seo.title.length, `${label}: seo.title`).toBeGreaterThan(0)
  expect(page.seo.description.length, `${label}: seo.description`).toBeGreaterThan(0)
  expect(page.facts.length, `${label}: facts`).toBeGreaterThanOrEqual(4)
  expect(page.faq.length, `${label}: faq`).toBeGreaterThanOrEqual(3)

  for (const fact of page.facts) {
    const url = ledger.get(fact.sourceId)
    expect(url, `${label}: ${fact.sourceId} is not in the ledger`).toBeDefined()
    expect(url, `${label}: ${fact.sourceId} URL differs from the ledger`).toBe(fact.sourceUrl)
    expect(CRM_SOURCE_HOSTS as readonly string[]).toContain(new URL(fact.sourceUrl).host)
  }
  expect(new Set(page.facts.map((f) => f.sourceId)).size, `${label}: distinct sources`).toBe(
    page.facts.length,
  )

  for (const word of BANNED_WORDS) expect(text.toLowerCase()).not.toContain(word.toLowerCase())
  for (const source of banned.regexes) expect(text).not.toMatch(new RegExp(source, 'i'))
  for (const source of banned.sources)
    expect(text.toLowerCase()).not.toContain(source.toLowerCase())
  expect(text).not.toMatch(/[—―]/)

  // Price, delay and guarantee come from `of1` at render time, never from the JSON.
  const squeezed = text.replace(/\s/g, '')
  expect(squeezed).not.toContain(String(of1.price.oneShotHt))
  expect(squeezed).not.toContain(`${of1.price.monthlyHt}€`)
  expect(text).not.toMatch(new RegExp(`\\b${of1.delay.days} jours`))
  expect(text).not.toContain(of1.guarantee.slice(0, 40))
}

describe('doorway guard: the template rules hold on a published fixture', () => {
  const fixture = loadPage(FIXTURE) as PublishedCrmPage

  it('fixture: the fixture is a published page', () => {
    expect(fixture.status).toBe('published')
  })

  it('fixture: a published page satisfies every rule', () => {
    expectPublishedRules(fixture, FIXTURE_LEDGER, 'fixture')
  })

  it('fixture: a literal price in the JSON fails the guard', () => {
    const bad = structuredClone(fixture)
    bad.where.body = `${bad.where.body} Comptez 1 490 euros.`
    expect(() => expectPublishedRules(bad, FIXTURE_LEDGER, 'bad')).toThrow()
  })

  it('fixture: a fact whose source is not in the ledger fails the guard', () => {
    const bad = structuredClone(fixture)
    bad.facts[0].sourceId = 'F99'
    expect(() => expectPublishedRules(bad, FIXTURE_LEDGER, 'bad')).toThrow()
  })

  it('fixture: a host off the allowlist fails the schema', () => {
    const bad = structuredClone(fixture)
    bad.facts[0].sourceUrl = 'https://example.com/doc'
    expect(crmPageSchema.safeParse(bad).success).toBe(false)
  })

  it('fixture: a banned word or figure fails the guard', () => {
    for (const phrase of ['Nous sommes partenaire officiel.', '80 % des projets échouent.']) {
      const bad = structuredClone(fixture)
      bad.pitfall.body = phrase
      expect(() => expectPublishedRules(bad, FIXTURE_LEDGER, 'bad')).toThrow()
    }
  })

  it('fixture: pages sharing an 8-word run are twins, distinct pages are not', () => {
    const twin = structuredClone(fixture)
    expect(sharedShingles(fixture, twin).length).toBeGreaterThan(0)

    const other = structuredClone(fixture)
    other.hero = { title: 'Un titre autre', lead: 'Une accroche autre.' }
    other.where.heading = 'Un autre titre de bloc'
    other.followUp.heading = 'Encore un titre différent'
    other.prerequisites.heading = 'Des prérequis autrement nommés'
    other.pitfall.heading = 'Une mise en garde distincte'
    other.where.body = 'Un texte tout autre qui ne ressemble en rien à celui du gabarit.'
    other.followUp.body = 'Encore un autre propos sans lien avec le premier gabarit.'
    other.prerequisites.body = 'Des prérequis dits autrement, avec des mots qui changent.'
    other.pitfall.body = 'Un piège décrit avec un vocabulaire sans rapport avec le premier.'
    other.faq = other.faq.map((_, i) => ({ q: `Autre question ${i} ?`, a: `Autre réponse ${i}.` }))
    expect(sharedShingles(fixture, other)).toEqual([])
  })

  it('fixture: a draft needs a written reason', () => {
    const base = {
      status: 'draft',
      slug: 'zoho',
      crm: 'Zoho',
      path: '/offres/compte-rendu-appel/zoho',
    }
    expect(crmPageSchema.safeParse({ ...base, draftReason: '' }).success).toBe(false)
    expect(crmPageSchema.safeParse(base).success).toBe(false)
    expect(crmPageSchema.safeParse({ ...base, draftReason: 'à rédiger' }).success).toBe(true)
  })

  it('fixture: a path that does not match the slug fails the schema', () => {
    const bad = { ...structuredClone(fixture), path: '/offres/compte-rendu-appel/zoho' }
    expect(crmPageSchema.safeParse(bad).success).toBe(false)
  })
})

describe('doorway guard: the four real CRM pages', () => {
  it('the four slugs are the four named files, and each file exists', () => {
    expect([...CRM_SLUGS]).toEqual(['hubspot', 'zoho', 'salesforce', 'pipedrive'])
    for (const slug of CRM_SLUGS) expect(existsSync(realFile(slug))).toBe(true)
  })

  for (const slug of CRM_SLUGS) {
    const file = realFile(slug)
    const raw = JSON.parse(readFileSync(file, 'utf8'))
    const page = crmPageSchema.parse(raw)

    it(`${slug}: the file parses, and its slug and path match its name`, () => {
      expect(page.slug).toBe(slug)
      expect(page.path).toBe(`/offres/compte-rendu-appel/${slug}`)
    })

    if (page.status === 'draft') {
      it(`${slug}: a draft carries a reason and is absent from the published pages`, () => {
        expect(page.draftReason.trim().length).toBeGreaterThan(0)
        expect(publishedCrmPages().map((p) => p.slug)).not.toContain(slug)
      })

      it(`${slug}: a draft is linked nowhere in the client sources`, () => {
        const offenders: string[] = []
        walkSources((full) => {
          // The page's own JSON states its path: that is the page, not a link to it.
          if (full === file) return
          if (readFileSync(full, 'utf8').includes(page.path)) offenders.push(full)
        })
        expect(offenders).toEqual([])
      })

      it(`${slug}: a draft is not indexable and is flagged for the prerender to skip`, () => {
        const route = routeOf(page.path)
        expect(route.indexable).toBe(false)
        expect(route.draft).toBe(true)
      })
    } else {
      it(`${slug}: a published page satisfies every rule`, () => {
        expectPublishedRules(page, join(HUB_LEDGER_DIR, `${slug}.md`), slug)
      })

      it(`${slug}: a published page is indexable in the route manifest`, () => {
        const route = routeOf(page.path)
        expect(route.indexable).toBe(true)
        expect(route.draft).toBe(false)
      })

      it(`${slug}: a published page shares no 8-word run with another published page`, () => {
        for (const other of CRM_SLUGS) {
          if (other === slug) continue
          const otherPage = loadPage(realFile(other))
          if (otherPage.status !== 'published') continue
          expect(sharedShingles(page, otherPage), `${slug} vs ${other}`).toEqual([])
        }
      })
    }

    it(`${slug}: the proof line exists only in a JSON that carries proofLine`, () => {
      const hasMarker = leaves(raw).some((t) => t.includes(PROOF_MARKER))
      if (page.status === 'published' && page.proofLine) {
        expect(slug).toBe('pipedrive')
        expect(page.proofLine).toContain(PROOF_MARKER)
      } else {
        expect(hasMarker).toBe(false)
      }
    })
  }

  it('no client source other than pipedrive.json carries the proof line', () => {
    const offenders: string[] = []
    walkSources((full) => {
      if (full.endsWith('/crm/pipedrive.json')) return
      if (normalise(readFileSync(full, 'utf8')).includes(PROOF_MARKER)) offenders.push(full)
    })
    expect(offenders).toEqual([])
  })
})
