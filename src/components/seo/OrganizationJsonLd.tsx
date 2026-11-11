import { of1 } from '@/content/of1'
import { SITE_ORIGIN } from '@/lib/seo'
import { site } from '@/lib/site'
import { JsonLd } from './JsonLd'

// Site-wide ProfessionalService (every page, via the root layout). The training « L'IA au travail »
// leads (plan site-formation-lot1, U13a) and has no public price, so no priceSpecification; its texts
// are the 01b strings. OF-1 (the CRM call report) stays as a follow-on, priced from of1.ts (the offer
// file's mirror); the référent IA, voice agents and custom CRM are « sur demande », no price. No
// `Event` for the webinar (PRODUCT.md).
const onRequest = (name: string, description: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, description },
})

const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

// The founder as schema.org `Person`; also the `Article` author of the issue pages.
export const FOUNDER = {
  '@type': 'Person',
  name: 'Brice Gachadoat',
  url: 'https://www.linkedin.com/in/brice-gachadoat-03942795/',
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Sablia',
        alternateName: `Sablia, ${lowerFirst(site.tagline)}`,
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/logo.svg`,
        image: `${SITE_ORIGIN}/og-image-home.png`,
        description:
          "Formation à l'IA pour les équipes des entreprises : trois jours dans leurs locaux, jusqu'à 12 personnes, pour apprendre à travailler avec Claude (Anthropic) sur leurs propres dossiers. Premier pas : un webinaire gratuit d'une heure, le jeudi midi. Ensuite, un référent IA, ou Claude intégré sur mesure dans le CRM et les outils de l'entreprise.",
        email: 'brice@sablia.io',
        founder: FOUNDER,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.locality,
          addressRegion: site.region,
          addressCountry: 'FR',
        },
        serviceType: [
          "Formation à l'IA en entreprise",
          'Référent IA',
          'Intégration de Claude dans le CRM',
          'Automatisation des processus commerciaux',
        ],
        areaServed: [
          { '@type': 'AdministrativeArea', name: site.region },
          { '@type': 'Country', name: 'France' },
        ],
        knowsAbout: [
          'Claude',
          'Anthropic',
          "Formation à l'IA en entreprise",
          "Intégration de l'IA en entreprise",
          'Salesforce',
          'HubSpot',
          'Pipedrive',
          'Zoho CRM',
          'Automatisation CRM',
          'n8n',
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Catalogue Sablia',
          itemListElement: [
            onRequest(
              "L'IA au travail",
              "Trois jours dans vos locaux, jusqu'à 12 personnes : votre équipe apprend Claude sur ses propres dossiers, avec ses règles sur les données. Le devis suit un échange gratuit de 30 minutes.",
            ),
            onRequest(
              'Référent IA',
              'Une séance de 2 h par mois avec votre équipe, et vos questions sous 48 h.',
            ),
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: of1.title, description: of1.promise },
              priceSpecification: {
                '@type': 'PriceSpecification',
                price: of1.price.oneShotHt,
                priceCurrency: 'EUR',
                valueAddedTaxIncluded: false,
              },
            },
            onRequest('Agent vocal', 'Sur demande.'),
            onRequest('CRM sur mesure', 'Sur demande.'),
          ],
        },
      }}
    />
  )
}
