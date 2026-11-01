/**
 * Every new visitor string of `/realisations` (01b § 5 « New strings »), read whole by the anti-slop
 * and red-line gates. The band's own strings stay in `construit/content.ts` (moved as is, not rewritten).
 */

export const META = {
  title: 'Réalisations : automatisations, sites et formations · Sablia',
  description:
    'Ce que Sablia a construit depuis 2025 : automatisations, sites, applications et formations, et des agents vocaux sur demande.',
}

/** The page h1 takes the role of the band's eyebrow, which is not rendered a second time. */
export const HEAD = {
  title: 'Réalisations',
  intro:
    'Automatisations, sites, applications et formations, construits pour nos clients depuis 2025.',
}

/**
 * Closing band: the home's own copy (01b « Final band », gated in `home/faq/content.ts`), booked on the
 * formation Calendly by the page. 01b gives this page no band of its own, and the home's quiet webinar
 * link is left out: it names the 19/11 session, which the session bar already announces until it starts.
 */
export { FIN_BAND as FIN } from '@/components/home/faq/content'
