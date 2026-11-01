/** Header navigation, in display order (01b § 1). `match` is the pathname that marks the link as the current page. */
export const NAV_LINKS = [
  { href: '/formations', label: 'Formation', match: '/formations' },
  { href: '/webinaire', label: 'Webinaires', match: '/webinaire' },
  { href: '/accompagnement', label: 'Après la formation', match: '/accompagnement' },
  { href: '/realisations', label: 'Réalisations', match: '/realisations' },
] as const

/** The header button while a webinar is upcoming (01b `nav.cta`). */
export const NAV_CTA = 'Prochain webinaire'
