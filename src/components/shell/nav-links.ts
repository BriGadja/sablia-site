/**
 * Header navigation, in display order: the site ranged by intent, the monthly offer first (US-103,
 * plan sablia-site-structure-offre). `match` is the pathname that marks the link as the current page.
 * The four intents, then the resource library (US-112, Brice 18/11: the videos and their files had
 * no door from the header). The same links at any date: the webinar is reached from the header
 * button (`NAV_CTA`) while its session is ahead, never from a menu entry.
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
  { href: '/ressources', label: 'Ressources', match: '/ressources' },
] as const

/** The header button while a webinar is upcoming (01b `nav.cta`). */
export const NAV_CTA = 'Prochain webinaire'
