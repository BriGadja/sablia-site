/**
 * JSON-LD built from `of1` : never hand-written, so a price can only ever be the module's price.
 *
 * Hygiene, not a SERP promise: Google dropped FAQ rich results on 2026-05-07, and its price rich
 * results are documented for `Product`, not `Service`. Both blocks are valid schema.org and cost
 * nothing; neither is sold as a search feature.
 */
import { OF1_ROUTE, of1 } from './of1'

const SITE = 'https://sablia.io'

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: of1.title,
  description: of1.promise,
  serviceType: "Automatisation de compte rendu d'appel dans le CRM",
  url: `${SITE}${OF1_ROUTE}`,
  provider: { '@id': `${SITE}/#organization` },
  areaServed: { '@type': 'Country', name: 'France' },
  offers: {
    '@type': 'Offer',
    price: String(of1.price.oneShotHt),
    priceCurrency: 'EUR',
    url: `${SITE}${OF1_ROUTE}`,
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: String(of1.price.oneShotHt),
      priceCurrency: 'EUR',
      valueAddedTaxIncluded: false,
    },
  },
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: of1.faq.map((entry) => ({
    '@type': 'Question',
    name: entry.q,
    acceptedAnswer: { '@type': 'Answer', text: entry.a },
  })),
}
