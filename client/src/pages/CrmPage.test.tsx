import { render, screen, waitFor, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { euros } from '@/components/offre/format'
import fixtureJson from '@/content/crm/__fixtures__/published-fixture.json'
import { CRM_SLUGS, type CrmPageContent, crmPageSchema } from '@/content/crm/schema'
import { OF1_ROUTE, of1 } from '@/content/of1'
import CrmPage from './CrmPage'

/**
 * The CRM page template (P10a), proven on a PUBLISHED FIXTURE before any real content exists:
 * the fixture is the only published page until P10b-P13, and the four real files are drafts.
 */
const published = crmPageSchema.parse(fixtureJson) as Extract<
  CrmPageContent,
  { status: 'published' }
>
const draft = crmPageSchema.parse({
  status: 'draft',
  slug: 'zoho',
  crm: 'Zoho',
  path: '/offres/compte-rendu-appel/zoho',
  draftReason: 'raison interne qui ne doit jamais être affichée',
})

const renderPage = (content: CrmPageContent) => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  return render(
    <HelmetProvider>
      <CrmPage content={content} />
    </HelmetProvider>,
  )
}

const head = () => document.head

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CrmPage template: a published page (fixture)', () => {
  it('fixture: renders one h1, the specific section, four blocks and the facts table', () => {
    const { container } = renderPage(published)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(published.hero.title)

    expect(
      screen.getByRole('heading', { level: 2, name: `Ce qui est propre à ${published.crm}` }),
    ).toBeTruthy()
    for (const block of [
      published.where,
      published.followUp,
      published.prerequisites,
      published.pitfall,
    ]) {
      expect(screen.getByRole('heading', { level: 3, name: block.heading })).toBeTruthy()
      expect(container.textContent).toContain(block.body)
    }

    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(published.facts.length + 1)
    for (const fact of published.facts) {
      expect(
        within(table)
          .getAllByRole('link')
          .map((a) => a.getAttribute('href')),
      ).toContain(fact.sourceUrl)
    }
  })

  it('fixture: price, delay and guarantee are rendered from the offer module', () => {
    const { container } = renderPage(published)
    const text = (container.textContent ?? '').replace(/ /g, ' ')
    expect(text).toContain(`${euros(of1.price.oneShotHt).replace(/ /g, ' ')} € HT`)
    expect(text).toContain(`${of1.delay.days} jours`)
    expect(text).toContain(of1.guarantee)
  })

  it('fixture: offers exactly one booking button in the page body, and a link to the offer', () => {
    renderPage(published)
    expect(screen.getAllByRole('button', { name: /Réserver 30 minutes avec Brice/ })).toHaveLength(
      1,
    )
    const offerLinks = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === OF1_ROUTE && !a.closest('nav'))
    expect(offerLinks.length).toBeGreaterThan(0)
  })

  it('fixture: renders the FAQ visibly, one h3 per question', () => {
    renderPage(published)
    for (const item of published.faq) {
      expect(screen.getByRole('heading', { level: 3, name: item.q })).toBeTruthy()
      expect(screen.getByText(item.a)).toBeTruthy()
    }
  })

  it('fixture: marks the offer page current in the bar', () => {
    const { container } = renderPage(published)
    const current = (container.querySelector('nav') as Element).querySelectorAll(
      'a[aria-current="page"]',
    )
    expect(current).toHaveLength(1)
    expect(current[0].getAttribute('href')).toBe(OF1_ROUTE)
  })

  it('fixture: sets the title, description and a self-canonical, indexable', async () => {
    renderPage(published)
    await waitFor(() => expect(document.title).toBe(published.seo.title))
    expect(head().querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      published.seo.description,
    )
    expect(head().querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `https://sablia.io${published.path}`,
    )
    expect(head().querySelector('meta[name="robots"]')?.getAttribute('content')).not.toMatch(
      /noindex/,
    )
  })

  it('fixture: emits Service and FAQPage JSON-LD built from the JSON and the offer', async () => {
    renderPage(published)
    await waitFor(() =>
      expect(head().querySelectorAll('script[type="application/ld+json"]').length).toBeGreaterThan(
        1,
      ),
    )
    const blocks = Array.from(head().querySelectorAll('script[type="application/ld+json"]')).map(
      (s) => JSON.parse(s.textContent ?? '{}'),
    )
    const service = blocks.find((b) => b['@type'] === 'Service')
    const faq = blocks.find((b) => b['@type'] === 'FAQPage')
    expect(service.offers.price).toBe(String(of1.price.oneShotHt))
    expect(service.url).toBe(`https://sablia.io${published.path}`)
    // site-check's jsonld-names-visible: the Service name must be text a reader sees (the h1).
    expect(service.name).toBe(published.hero.title)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(service.name)
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      published.faq.map((f) => f.q),
    )
  })

  it('fixture: shows the proof line only when the JSON carries one', () => {
    const without = renderPage(published)
    expect(without.container.textContent).not.toContain('investissement locatif')
    without.unmount()
    const line = "En production chez une société d'investissement locatif : texte de test."
    const withLine = renderPage({ ...published, proofLine: line })
    expect(withLine.container.textContent).toContain(line)
  })
})

describe('CrmPage template: a draft page', () => {
  it('draft: renders the NotFound body, never the internal reason, no booking button', () => {
    const { container } = renderPage(draft)
    expect(container.textContent).toContain('404 Page Not Found')
    expect(container.textContent).not.toContain(draft.status === 'draft' ? draft.draftReason : 'x')
    expect(screen.queryByRole('button', { name: /Réserver/ })).toBeNull()
    expect(container.querySelectorAll('a[href*="calendly"]')).toHaveLength(0)
    expect(screen.queryByRole('heading', { level: 1, name: /compte rendu/i })).toBeNull()
  })

  it('draft: asks not to be indexed', async () => {
    renderPage(draft)
    await waitFor(() =>
      expect(head().querySelector('meta[name="robots"]')?.getAttribute('content')).toMatch(
        /noindex/,
      ),
    )
  })
})

describe('CrmPage template: the route component', () => {
  it('an unknown slug renders the NotFound body', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { container } = render(
      <HelmetProvider>
        <CrmPage slug="inconnu" />
      </HelmetProvider>,
    )
    expect(container.textContent).toContain('404 Page Not Found')
  })

  it('the four real slugs render without throwing, whatever their status', () => {
    for (const slug of CRM_SLUGS) {
      vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
      const { unmount } = render(
        <HelmetProvider>
          <CrmPage slug={slug} />
        </HelmetProvider>,
      )
      unmount()
    }
  })
})
