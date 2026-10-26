/**
 * Guard for the two spreadsheet pages: they hold only what the hub offer file states, follow the
 * house rules, and are not twins of each other or of the four CRM pages (doorway rule, 8-word run).
 */
import { describe, expect, it } from 'vitest'
import { of1 } from '../of1'
import banned from './banned-figures.json'
import { CRM_PAGES } from './index'
import { SPREADSHEET_PAGES, SPREADSHEET_SLUGS } from './spreadsheets'

const normalise = (t: string) => t.replace(/[ {3}]/g, ' ').replace(/[’‘]/g, "'")

function leaves(node: unknown, out: string[] = []): string[] {
  if (typeof node === 'string') out.push(normalise(node))
  else if (Array.isArray(node)) for (const n of node) leaves(n, out)
  else if (node && typeof node === 'object') for (const v of Object.values(node)) leaves(v, out)
  return out
}

function shingles(texts: string[], size = 8) {
  const out = new Set<string>()
  for (const t of texts) {
    const w = t
      .toLowerCase()
      .replace(/[^\p{L}\p{N}']+/gu, ' ')
      .trim()
      .split(' ')
      .filter(Boolean)
    for (let i = 0; i + size <= w.length; i++) out.add(w.slice(i, i + size).join(' '))
  }
  return out
}

describe('spreadsheet pages', () => {
  it('are the two slugs the route manifest knows', () => {
    expect([...SPREADSHEET_SLUGS]).toEqual(['google-sheets', 'excel-365'])
    for (const slug of SPREADSHEET_SLUGS) {
      expect(SPREADSHEET_PAGES[slug].path).toBe(`/offres/compte-rendu-appel/${slug}`)
    }
  })

  for (const slug of SPREADSHEET_SLUGS) {
    const page = SPREADSHEET_PAGES[slug]
    const text = leaves(page).join('\n')

    it(`${slug}: seo fits, hero title is at most 7 words, 4 blocks, 3+ questions`, () => {
      expect(page.seo.title.length).toBeLessThanOrEqual(75)
      expect(page.seo.description.length).toBeLessThanOrEqual(175)
      expect(page.hero.title.split(/\s+/).length).toBeLessThanOrEqual(7)
      expect(page.blocks).toHaveLength(4)
      expect(page.faq.length).toBeGreaterThanOrEqual(3)
      expect(page.facts).toBeUndefined()
    })

    it(`${slug}: house rules (no em dash, banned figure, source, partner word, client name)`, () => {
      expect(text).not.toMatch(/[—―]/)
      for (const source of banned.regexes) expect(text).not.toMatch(new RegExp(source, 'i'))
      for (const source of banned.sources)
        expect(text.toLowerCase()).not.toContain(source.toLowerCase())
      for (const word of ['partenaire', 'certifié', 'agréé', 'Norloc', 'Qwertys', 'IAPreneurs'])
        expect(text.toLowerCase()).not.toContain(word.toLowerCase())
    })

    it(`${slug}: the price on the page is the module's`, () => {
      expect(text).toContain(String(of1.price.oneShotHt).replace(/(\d)(\d{3})$/, '$1 $2'))
    })
  }

  it('Excel names the OneDrive / SharePoint condition of the hub offer file', () => {
    const text = leaves(SPREADSHEET_PAGES['excel-365']).join(' ')
    expect(text).toContain('OneDrive')
    expect(text).toContain('SharePoint')
  })

  it('share no 8-word run with each other or with a published CRM page', () => {
    const own = SPREADSHEET_SLUGS.map((s) => [s, shingles(leaves(SPREADSHEET_PAGES[s]))] as const)
    const others = Object.values(CRM_PAGES).flatMap((p) =>
      p.status === 'published' ? [[p.slug, shingles(leaves(p))] as const] : [],
    )
    for (const [slugA, a] of own) {
      for (const [slugB, b] of [...own, ...others]) {
        if (slugA === slugB) continue
        expect(
          [...a].filter((x) => b.has(x)),
          `${slugA} vs ${slugB}`,
        ).toEqual([])
      }
    }
  })
})
