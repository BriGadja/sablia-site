/**
 * Shape of a CRM page (`hubspot|zoho|salesforce|pipedrive.json`), contract C2 of
 * plans/visibilite-llm-sablia.md.
 *
 * One discriminant, `status`. A `draft` carries only its identity and a written reason; it is
 * noindex, not routable, absent from the sitemap and from every link. A `published` page carries
 * what is specific to its CRM, each fact tied to a source of the hub ledger (contract C4). The
 * route manifest derives `indexable` from `status`, so it is stored once.
 */
import { z } from 'zod'
import { OF1_ROUTE, of1 } from '../of1'

export const CRM_SLUGS = ['hubspot', 'zoho', 'salesforce', 'pipedrive'] as const
export type CrmSlug = (typeof CRM_SLUGS)[number]

/** Hosts a fact may cite: the official documentation of the four CRMs (contract C4). */
export const CRM_SOURCE_HOSTS = [
  'developers.hubspot.com',
  'knowledge.hubspot.com',
  'www.zoho.com',
  'help.zoho.com',
  'developer.salesforce.com',
  'help.salesforce.com',
  'developers.pipedrive.com',
  'support.pipedrive.com',
  'pipedrive.readme.io',
] as const

export const crmPath = (slug: CrmSlug) => `${OF1_ROUTE}/${slug}` as const

const text = z.string().trim().min(1)
const block = z.object({ heading: text, body: text }).strict()

const fact = z
  .object({
    label: text,
    value: text,
    /** Entry `### F<n>` of `research/visibilite-llm/crm-sources/{slug}.md`. */
    sourceId: z.string().regex(/^F\d+$/),
    sourceUrl: z
      .string()
      .url()
      .refine(
        (url) => {
          const { protocol, host } = new URL(url)
          return protocol === 'https:' && (CRM_SOURCE_HOSTS as readonly string[]).includes(host)
        },
        { message: 'sourceUrl must be https on an allowlisted official documentation host' },
      ),
  })
  .strict()

const identity = {
  slug: z.enum(CRM_SLUGS),
  crm: text,
  path: z.string(),
}

const draftSchema = z
  .object({ status: z.literal('draft'), ...identity, draftReason: text })
  .strict()

const publishedSchema = z
  .object({
    status: z.literal('published'),
    ...identity,
    seo: z.object({ title: text.max(75), description: text.max(175) }).strict(),
    hero: z.object({ title: text, lead: text }).strict(),
    where: block,
    followUp: block,
    prerequisites: block,
    pitfall: block,
    facts: z.array(fact).min(4),
    faq: z.array(z.object({ q: text, a: text }).strict()).min(3),
    /** Anonymous production line (grill Q9): allowed on the Pipedrive page only, see the doorway test. */
    proofLine: text.optional(),
  })
  .strict()

export const crmPageSchema = z
  .discriminatedUnion('status', [draftSchema, publishedSchema])
  .superRefine((page, ctx) => {
    if (page.path !== crmPath(page.slug)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['path'],
        message: `path must be ${crmPath(page.slug)}`,
      })
    }
  })

export type CrmPageContent = z.infer<typeof crmPageSchema>
export type PublishedCrmPage = Extract<CrmPageContent, { status: 'published' }>
export type DraftCrmPage = Extract<CrmPageContent, { status: 'draft' }>

const SITE = 'https://sablia.io'

/** Service JSON-LD: the price is the module's, never the JSON's. */
export function crmServiceSchema(page: PublishedCrmPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.hero.title,
    description: page.seo.description,
    serviceType: `Automatisation de compte rendu d'appel dans ${page.crm}`,
    url: `${SITE}${page.path}`,
    provider: { '@id': `${SITE}/#organization` },
    areaServed: { '@type': 'Country', name: 'France' },
    offers: {
      '@type': 'Offer',
      price: String(of1.price.oneShotHt),
      priceCurrency: 'EUR',
      url: `${SITE}${page.path}`,
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: String(of1.price.oneShotHt),
        priceCurrency: 'EUR',
        valueAddedTaxIncluded: false,
      },
    },
  }
}

export function crmFaqSchema(page: PublishedCrmPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((entry) => ({
      '@type': 'Question',
      name: entry.q,
      acceptedAnswer: { '@type': 'Answer', text: entry.a },
    })),
  }
}

export function crmBreadcrumbSchema(page: PublishedCrmPage) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Le CRM qui se remplit tout seul après chaque appel',
        item: `${SITE}${OF1_ROUTE}`,
      },
      { '@type': 'ListItem', position: 3, name: page.crm, item: `${SITE}${page.path}` },
    ],
  }
}
