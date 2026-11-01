/**
 * Header navigation, in display order (01b § 1). `match` is the pathname that marks the link as the
 * current page. `untilSession`: the link leaves the menu at `SESSION_START`, because `/webinaire` is
 * the one session page (frozen) and would sell a past date until lot 2 brings the list.
 */
export const NAV_LINKS = [
  { href: '/formations', label: 'Formation', match: '/formations' },
  { href: '/webinaire', label: 'Webinaires', match: '/webinaire', untilSession: true },
  { href: '/accompagnement', label: 'Après la formation', match: '/accompagnement' },
  { href: '/realisations', label: 'Réalisations', match: '/realisations' },
] as const

/** The menu for a session state (`useSessionUpcoming()`): all of it while upcoming, then without « Webinaires ». */
export function navLinksFor(upcoming: boolean) {
  return upcoming ? NAV_LINKS : NAV_LINKS.filter((l) => !('untilSession' in l))
}

/** The header button while a webinar is upcoming (01b `nav.cta`). */
export const NAV_CTA = 'Prochain webinaire'
