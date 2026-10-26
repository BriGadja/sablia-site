/**
 * The four CRM pages, parsed once. A malformed JSON fails here, at build and in the tests, never
 * in front of a visitor. Order is the order of `CRM_SLUGS`.
 */
import hubspot from './hubspot.json'
import pipedrive from './pipedrive.json'
import salesforce from './salesforce.json'
import {
  CRM_SLUGS,
  type CrmPageContent,
  type CrmSlug,
  crmPageSchema,
  type PublishedCrmPage,
} from './schema'
import zoho from './zoho.json'

const RAW: Record<CrmSlug, unknown> = { hubspot, zoho, salesforce, pipedrive }

export const CRM_PAGES: Record<CrmSlug, CrmPageContent> = {
  hubspot: crmPageSchema.parse(RAW.hubspot),
  zoho: crmPageSchema.parse(RAW.zoho),
  salesforce: crmPageSchema.parse(RAW.salesforce),
  pipedrive: crmPageSchema.parse(RAW.pipedrive),
}

export const isCrmSlug = (value: string): value is CrmSlug =>
  (CRM_SLUGS as readonly string[]).includes(value)

/** The pages that may be linked and indexed. A draft never appears here. */
export function publishedCrmPages(): PublishedCrmPage[] {
  return CRM_SLUGS.flatMap((slug) => {
    const page = CRM_PAGES[slug]
    return page.status === 'published' ? [page] : []
  })
}
