/**
 * The offer page and its CRM pages, rendered through React (the server-rendered markup is what the
 * static export writes): content, structure, structured data, the 404 rule.
 */
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FAQ_CARRIED } from '@/content/faq-carried'
import { publishedCrmPages } from '@/content/crm'
import { SPREADSHEET_PAGES, SPREADSHEET_SLUGS } from '@/content/crm/spreadsheets'
import { OF1_ROUTE, of1 } from '@/content/of1'

vi.mock('next/navigation', () => ({
  usePathname: () => OF1_ROUTE,
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))

import CrmPage, { dynamicParams, generateMetadata, generateStaticParams } from './[crm]/page'
import ExcelPage from './excel-365/page'
import SheetsPage from './google-sheets/page'
import OfferPage, { metadata } from './page'

const plain = (t: string | null) => (t ?? '').replace(/[   ]/g, ' ')
const jsonLd = (c: HTMLElement) =>
  Array.from(c.querySelectorAll('script[type="application/ld+json"]')).map((s) =>
    JSON.parse(s.textContent ?? '{}'),
  )

describe('offer page', () => {
  it('has one h1, the offer title, in a <main id="contenu">', () => {
    const { container } = render(<OfferPage />)
    const h1s = container.querySelectorAll('h1')
    expect(h1s).toHaveLength(1)
    expect(plain(h1s[0].textContent)).toBe(of1.title)
    expect(container.querySelector('main#contenu')).not.toBeNull()
  })

  it('renders the readable text of the whole offer in the markup', () => {
    const { container } = render(<OfferPage />)
    const text = plain(container.textContent)
    for (const crm of of1.crms) expect(text).toContain(crm)
    for (const item of [...of1.included, ...of1.excluded]) expect(text).toContain(plain(item))
    for (const v of of1.variants) expect(text).toContain(v.title)
    expect(text).toContain('1 490 € HT')
    expect(text).toContain('149')
    expect(text).toContain(plain(of1.guarantee))
    expect(text).toContain('OneDrive ou SharePoint')
  })

  it('keeps the section ids that links point into', () => {
    const { container } = render(<OfferPage />)
    for (const id of ['variantes', 'inclus', 'prix', 'preuve', 'faq', 'fin'])
      expect(container.querySelector(`#${id}`), id).not.toBeNull()
  })

  it('renders every FAQ entry, the carried ones included, as native disclosure', () => {
    const { container } = render(<OfferPage />)
    expect(container.querySelectorAll('#faq details')).toHaveLength(
      of1.faq.length + FAQ_CARRIED.length,
    )
  })

  it('every booking button is the shared BookingButton', () => {
    const { container } = render(<OfferPage />)
    const labelled = Array.from(container.querySelectorAll('a, button')).filter((el) =>
      /Réserver/.test(el.textContent ?? ''),
    )
    expect(labelled.length).toBeGreaterThanOrEqual(2)
    for (const el of labelled) expect(el.hasAttribute('data-cta-book')).toBe(true)
  })

  it('links each CRM that has a page', () => {
    const { container } = render(<OfferPage />)
    const hrefs = Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'))
    for (const page of publishedCrmPages()) expect(hrefs).toContain(page.path)
    for (const slug of SPREADSHEET_SLUGS) expect(hrefs).toContain(SPREADSHEET_PAGES[slug].path)
  })

  it('emits Service, FAQPage and BreadcrumbList JSON-LD', () => {
    const { container } = render(<OfferPage />)
    const types = jsonLd(container).map((d) => d['@type'])
    expect(types).toEqual(expect.arrayContaining(['Service', 'FAQPage', 'BreadcrumbList']))
  })

  it('has page metadata with the canonical path', () => {
    expect(metadata.alternates?.canonical).toBe(OF1_ROUTE)
  })

  it('writes no em dash and no old brand name', () => {
    const { container } = render(<OfferPage />)
    expect(container.textContent).not.toMatch(/[—―]/)
    expect(container.textContent).not.toMatch(/IAPreneurs/i)
  })
})

describe('CRM pages', () => {
  it('generates exactly the published slugs and 404s the rest', async () => {
    expect(dynamicParams).toBe(false)
    expect(generateStaticParams().map((p) => p.crm)).toEqual(publishedCrmPages().map((p) => p.slug))
    await expect(CrmPage({ params: Promise.resolve({ crm: 'nope' }) })).rejects.toThrow(
      'NEXT_NOT_FOUND',
    )
  })

  for (const page of publishedCrmPages()) {
    it(`${page.slug}: renders its h1, blocks, facts with sources, price from the module`, async () => {
      const el = await CrmPage({ params: Promise.resolve({ crm: page.slug }) })
      const { container } = render(el)
      expect(plain(container.querySelector('h1')?.textContent ?? '')).toBe(page.hero.title)
      const text = plain(container.textContent)
      for (const b of [page.where, page.followUp, page.prerequisites, page.pitfall])
        expect(text).toContain(plain(b.body))
      for (const f of page.facts) {
        expect(text).toContain(plain(f.value))
        expect(container.querySelector(`a[href="${f.sourceUrl}"]`)).not.toBeNull()
      }
      expect(text).toContain('1 490 € HT')
      for (const q of page.faq) expect(text).toContain(plain(q.a))
      const types = jsonLd(container).map((d) => d['@type'])
      expect(types).toEqual(expect.arrayContaining(['Service', 'FAQPage', 'BreadcrumbList']))
      expect(container.querySelectorAll('h1')).toHaveLength(1)
    })

    it(`${page.slug}: metadata is the page's own`, async () => {
      const m = await generateMetadata({ params: Promise.resolve({ crm: page.slug }) })
      expect(m.alternates?.canonical).toBe(page.path)
      expect(m.title).toEqual({ absolute: page.seo.title })
    })
  }

  it('pipedrive alone shows the anonymous production line', async () => {
    for (const page of publishedCrmPages()) {
      const el = await CrmPage({ params: Promise.resolve({ crm: page.slug }) })
      const { container, unmount } = render(el)
      expect(container.textContent?.includes("société d'investissement locatif")).toBe(
        page.slug === 'pipedrive',
      )
      unmount()
    }
  })
})

describe('spreadsheet pages', () => {
  const pages = [
    ['google-sheets', SheetsPage],
    ['excel-365', ExcelPage],
  ] as const
  for (const [slug, Page] of pages) {
    it(`${slug}: renders its content, no facts table, JSON-LD`, () => {
      const page = SPREADSHEET_PAGES[slug]
      const { container } = render(<Page />)
      expect(plain(container.querySelector('h1')?.textContent ?? '')).toBe(page.hero.title)
      const text = plain(container.textContent)
      for (const b of page.blocks) expect(text).toContain(plain(b.body))
      for (const q of page.faq) expect(text).toContain(plain(q.a))
      expect(container.querySelector('table')).toBeNull()
      expect(jsonLd(container).map((d) => d['@type'])).toEqual(
        expect.arrayContaining(['Service', 'FAQPage', 'BreadcrumbList']),
      )
    })
  }
})
