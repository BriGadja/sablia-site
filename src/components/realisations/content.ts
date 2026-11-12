/**
 * Every new visitor string of `/realisations` (01b § 5 « New strings », rewritten from copy deck B5 of run
 * 2026-11-12-structure-site-offre for US-108), read whole by the anti-slop and red-line gates. The band's own
 * strings stay in `construit/content.ts` (moved as is, not rewritten).
 */

/** Deck B5 `real.meta.title`, `real.meta.description`. */
export const META = {
  title: 'Réalisations : automatisations, sites, formations et conférences · Sablia',
  description:
    'Ce que Sablia a construit depuis 2025 : automatisations, sites, applications, formations et conférences.',
}

/** The page h1 takes the role of the band's eyebrow, which is not rendered a second time. Deck B5 `real.head.intro`. */
export const HEAD = {
  title: 'Réalisations',
  intro:
    'Automatisations, sites, applications, formations et conférences, réalisés pour des clients depuis 2025.',
}

/**
 * Deck B5 `real.besoin.title`, `real.besoin.text`, `real.besoin.cta` (US-108): a one-off build has a visible but
 * discreet place under the intro, without a price; the button books the 30-minute call on the formation Calendly.
 */
export const BESOIN = {
  title: 'Un besoin précis ? Je construis aussi à la demande.',
  text: 'Un outil seul, sans contrat mensuel : on en parle trente minutes, puis vous recevez un devis écrit.',
  cta: 'Réserver 30 min',
}

/**
 * Closing band: the home's own copy (01b « Final band », gated in `home/faq/content.ts`), booked on the
 * formation Calendly by the page. 01b gives this page no band of its own, and the home's quiet webinar
 * link is left out: it names the 03/12 session, which the session bar already announces until it starts.
 */
export { FIN_BAND as FIN } from '@/components/home/faq/content'
