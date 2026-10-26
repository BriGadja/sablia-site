import { of1 } from '@/content/of1'
import { SITE_ORIGIN } from '@/lib/seo'
import { JsonLd } from './JsonLd'

// Site-wide ProfessionalService (every page, via the root layout). Catalogue v1: OF-1 is priced from
// of1.ts (the offer file's mirror); voice agents and custom CRM are « sur demande », no price.
const onRequest = (name: string, description: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, description },
})

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Sablia',
        alternateName: "Sablia, agence d'intégration de Claude dans les CRM",
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/logo.svg`,
        image: `${SITE_ORIGIN}/og-image-home.png`,
        description: `Agence française d'intégration de Claude (Anthropic) dans les CRM des PME : le compte rendu d'appel et la tâche de relance écrits dans votre CRM, livrés en ${of1.delay.days} jours.`,
        email: 'brice@sablia.io',
        founder: {
          '@type': 'Person',
          name: 'Brice Gachadoat',
          url: 'https://www.linkedin.com/in/brice-gachadoat-03942795/',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '60 rue François Ier',
          postalCode: '75008',
          addressLocality: 'Paris',
          addressCountry: 'FR',
        },
        serviceType: [
          'Intégration de Claude dans le CRM',
          'Automatisation des processus commerciaux',
          'Conseil et formation IA',
        ],
        areaServed: { '@type': 'Country', name: 'France' },
        knowsAbout: [
          'Claude',
          'Anthropic',
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
