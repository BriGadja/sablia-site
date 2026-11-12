/**
 * Header navigation, in display order: the site ranged by intent, the monthly offer first (US-103,
 * plan sablia-site-structure-offre). `match` is the pathname that marks the link as the current page.
 * The same four links at any date: the webinar is reached from the header button (`NAV_CTA`) while
 * its session is ahead, never from a menu entry.
 */
export const NAV_LINKS = [
  {
    href: '/responsable-ia-externalise',
    label: 'Responsable IA externalisé',
    match: '/responsable-ia-externalise',
  },
  { href: '/formations', label: 'Formations', match: '/formations' },
  { href: '/conferences', label: 'Conférences', match: '/conferences' },
  { href: '/realisations', label: 'Réalisations', match: '/realisations' },
] as const

/** The header button while a webinar is upcoming (01b `nav.cta`). */
export const NAV_CTA = 'Prochain webinaire'
