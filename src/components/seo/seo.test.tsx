import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { of1 } from '@/content/of1'
import { site } from '@/lib/site'
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

  // US-100: Rouen without a street (the registered office stays on the legal pages only).
  it('the address is Rouen without a street, areaServed names Normandie and France', () => {
    expect(org.address.addressLocality).toBe('Rouen')
    expect(org.address.addressRegion).toBe('Normandie')
    expect(org.address.addressCountry).toBe('FR')
    expect(org.address).not.toHaveProperty('streetAddress')
    expect(org.address).not.toHaveProperty('postalCode')
    const areas = org.areaServed as { name: string }[]
    expect(areas.map((a) => a.name)).toEqual(['Normandie', 'France'])
  })

  // US-111 (plan sablia-site-structure-offre I1, copy deck B6 `org.*`): every page carries this block,
  // so it says what Sablia does today: the monthly offer first, then the training, then the shorter
  // formats and the conferences on request. The webinar is one dated session: it has no place here.
  it('says what Sablia does today: the monthly offer, the training, the conferences on request', () => {
    expect(org.alternateName).toBe(
      `Sablia, ${site.tagline.charAt(0).toLowerCase()}${site.tagline.slice(1)}`,
    )
    expect(org.description).toMatch(/^Sablia met l'IA en place/)
    expect(org.description).toContain('un responsable IA externalisé au mois')
    expect(org.description).toContain(
      "construit les outils, forme l'équipe et entretient ce qui tourne",
    )
    expect(org.description).toContain('trois jours')
    expect(org.description).toContain('Claude')
    expect(org.description).toContain('conférences, sur demande')
    expect(org.description).not.toMatch(/webinaire/i)
    expect(org.serviceType).toEqual([
      'Responsable IA externalisé',
      "Formation à l'IA en entreprise",
      "Conférences et séminaires sur l'IA",
      'Intégration de Claude dans le CRM',
      'Automatisation des processus commerciaux',
    ])
  })

  it('is no longer the CRM-integration agency and carries none of the retired claims', () => {
    expect(html).not.toMatch(/dans les CRM|× CRM|agence/i)
    expect(html).not.toMatch(/30 jours/i)
    expect(html).not.toMatch(/dashboards intelligents/i)
    expect(html).not.toContain('"Event"')
    // US-106: the « Référent IA » is no longer an offer; US-105: the old name of the monthly offer.
    expect(html).not.toMatch(/référent|2 h par mois|temps partagé/i)
  })

  it('catalogue: the monthly offer, the training, the conferences, the CRM offer; only the CRM offer priced', () => {
    const offers = org.hasOfferCatalog.itemListElement as {
      itemOffered: { name: string; description: string }
      priceSpecification?: { price: number; priceCurrency: string; valueAddedTaxIncluded: boolean }
    }[]
    expect(offers.map((o) => o.itemOffered.name)).toEqual([
      'Responsable IA externalisé',
      "L'IA au travail",
      'Conférences et séminaires',
      of1.title,
    ])
    expect(offers[0].itemOffered.description).toContain('Engagement de trois mois')
    expect(offers[1].itemOffered.description).toContain("jusqu'à 12 personnes")
    expect(offers[2].itemOffered.description).toContain('Sur demande, prix sur devis.')
    const priced = offers.filter((o) => o.priceSpecification)
    expect(priced.map((o) => o.itemOffered.name)).toEqual([of1.title])
    expect(priced[0].priceSpecification).toEqual({
      '@type': 'PriceSpecification',
      price: of1.price.oneShotHt,
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
    })
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
