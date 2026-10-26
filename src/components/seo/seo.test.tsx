import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { of1 } from '@/content/of1'
import { BreadcrumbJsonLd } from './BreadcrumbJsonLd'
import { JsonLd, serializeJsonLd } from './JsonLd'
import { OrganizationJsonLd } from './OrganizationJsonLd'
import { VideoObjectJsonLd } from './VideoObjectJsonLd'

const blocks = (html: string) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1].replace(/\\u003c/g, '<')),
  )

describe('JsonLd', () => {
  it('escapes < so a value can never close the script tag', () => {
    const out = serializeJsonLd({ name: '</script><b>' })
    expect(out).not.toContain('<')
    expect(JSON.parse(out).name).toBe('</script><b>')
  })

  it('renders one ld+json script', () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Thing' }} />,
    )
    expect(blocks(html)).toHaveLength(1)
  })
})

describe('OrganizationJsonLd', () => {
  const html = renderToStaticMarkup(<OrganizationJsonLd />)
  const [org] = blocks(html)

  it('is the site-wide ProfessionalService with a stable @id', () => {
    expect(org['@type']).toBe('ProfessionalService')
    expect(org['@id']).toBe('https://sablia.io/#organization')
    expect(org.email).toBe('brice@sablia.io')
  })

  it('states the 7-day promise and none of the retired claims', () => {
    expect(org.description).toContain('7 jours')
    expect(html).not.toMatch(/30 jours/i)
    expect(html).not.toMatch(/dashboards intelligents/i)
  })

  it('offers the catalogue v1: OF-1 priced from of1.ts, voice agents and custom CRM without a price', () => {
    const offers = org.hasOfferCatalog.itemListElement as {
      itemOffered: { name: string }
      priceSpecification?: { price: number; priceCurrency: string; valueAddedTaxIncluded: boolean }
    }[]
    const of1Offer = offers.find((o) => o.itemOffered.name === of1.title)
    expect(of1Offer?.priceSpecification).toEqual({
      '@type': 'PriceSpecification',
      price: of1.price.oneShotHt,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
    })
    const onRequest = offers.filter((o) => o.itemOffered.name !== of1.title)
    expect(onRequest.map((o) => o.itemOffered.name)).toEqual(['Agent vocal', 'CRM sur mesure'])
    for (const o of onRequest) expect(o.priceSpecification).toBeUndefined()
  })

  it('names no client and no headcount', () => {
    expect(html).not.toMatch(/IAPreneurs|Noésia/i)
  })
})

describe('BreadcrumbJsonLd', () => {
  it('builds a positioned list with absolute URLs, Accueil first', () => {
    const [bc] = blocks(
      renderToStaticMarkup(
        <BreadcrumbJsonLd items={[{ name: 'Formations', path: '/formations' }]} />,
      ),
    )
    expect(bc['@type']).toBe('BreadcrumbList')
    expect(bc.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://sablia.io' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Formations',
        item: 'https://sablia.io/formations',
      },
    ])
  })
})

describe('VideoObjectJsonLd', () => {
  it('describes a video with an own-hosted thumbnail and no third-party host', () => {
    const html = renderToStaticMarkup(
      <VideoObjectJsonLd
        name="Démo"
        description="Une démo."
        youtubeId="abc123def45"
        uploadDate="2026-10-01"
        thumbnailPath="/video-thumbs/abc123def45.webp"
      />,
    )
    const [v] = blocks(html)
    expect(v['@type']).toBe('VideoObject')
    expect(v.thumbnailUrl).toBe('https://sablia.io/video-thumbs/abc123def45.webp')
    expect(v.uploadDate).toBe('2026-10-01')
    expect(html).not.toMatch(/ytimg|youtube\.com\/embed|iframe_api/)
  })
})
