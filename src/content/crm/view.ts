/**
 * What the shared CRM page component renders. The four JSON pages and the two spreadsheet pages
 * both reduce to it, so one template serves all six.
 */
import { OF1_ROUTE } from '../of1'

export const crmPath = (slug: string) => `${OF1_ROUTE}/${slug}` as const

export interface CrmViewFact {
  label: string
  value: string
  sourceId: string
  sourceUrl: string
}

export interface CrmView {
  /** « HubSpot », « Google Sheets »: the tool the page is about. */
  tool: string
  path: string
  hero: { title: string; lead: string }
  /** Four blocks; `warn` marks the one drawn as a caution. */
  blocks: { heading: string; body: string; warn?: boolean }[]
  /** Sourced facts of the four CRM pages; the spreadsheet pages have none. */
  facts?: CrmViewFact[]
  faq: { q: string; a: string }[]
  /** Anonymous production line, Pipedrive only. */
  proofLine?: string
}
