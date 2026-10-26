/** Header navigation, in display order. `match` is the pathname that marks the link as the current page. */
export const NAV_LINKS = [
  { href: '/#offre', label: "Compte rendu d'appel", match: '/' },
  { href: '/formations', label: 'Formations', match: '/formations' },
  { href: '/accompagnement', label: 'Accompagnement', match: '/accompagnement' },
  { href: '/#construit', label: 'Réalisations', match: null },
] as const
