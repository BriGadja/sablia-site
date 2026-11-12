import { of1 } from '@/content/of1'
import { SITE_ORIGIN } from '@/lib/seo'
import { site } from '@/lib/site'
import { JsonLd } from './JsonLd'

// Site-wide ProfessionalService (every page, via the root layout). Its texts are copy deck B6 `org.*`
// (plan sablia-site-structure-offre I3, US-111): what Sablia does today, the monthly offer
// « Responsable IA externalisé » first, then the training « L'IA au travail », the conferences on
// request and OF-1 (the CRM call report). Only OF-1 is priced here, from of1.ts (the offer file's
// mirror): the monthly price lives on its page, the training and the conferences are on quote. No
// `Event` for the webinar (PRODUCT.md), and the webinar, one dated session, is not in the description.
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
          "Sablia met l'IA en place dans les PME de 10 à 50 personnes : un responsable IA externalisé au mois, qui construit les outils, forme l'équipe et entretient ce qui tourne ; la formation « L'IA au travail », trois jours dans l'entreprise, jusqu'à 12 personnes, avec Claude (Anthropic) ; des formats plus courts et des conférences, sur demande.",
        email: 'brice@sablia.io',
        founder: FOUNDER,
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.locality,
          addressRegion: site.region,
          addressCountry: 'FR',
        },
        serviceType: [
          'Responsable IA externalisé',
          "Formation à l'IA en entreprise",
          "Conférences et séminaires sur l'IA",
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
              'Responsable IA externalisé',
              "Chaque mois, un outil de plus en service, une équipe qui sait s'en servir, et le suivi de ce qui tourne. Engagement de trois mois, puis résiliable chaque mois.",
            ),
            onRequest(
              "L'IA au travail",
              "Trois jours dans vos locaux, jusqu'à 12 personnes : votre équipe apprend Claude sur ses propres dossiers, avec ses règles sur les données. Le devis suit un échange gratuit de 30 minutes.",
            ),
            onRequest(
              'Conférences et séminaires',
              "Une conférence ou une matinée de séminaire sur l'IA, pour toute l'équipe. Sur demande, prix sur devis.",
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
          ],
        },
      }}
    />
  )
}
