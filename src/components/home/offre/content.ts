/**
 * Visitor text of the home training band (run site-formation-lot1, copy draft 01b § Home « The offer,
 * 3 days »; eyebrow from copy deck B2 `home.offre.eyebrow`, US-104: « L'offre » would read as the
 * monthly offer that now opens the page). No price: the price comes in the quote, after the call
 * (grill 01/11, Q3).
 */

export const OFFRE = {
  eyebrow: 'Formations',
  title: 'Trois jours, six demi-journées.',
  cards: [
    { key: 'jours', big: '3 jours', sub: 'chez vous, en six demi-journées' },
    { key: 'groupe', big: '12', sub: 'personnes au plus' },
    { key: 'dossiers', big: 'Vos dossiers', sub: 'et vos règles sur les données' },
  ],
  /** Groups of half-days on the bar (they add up to six), each with its caption under the bar. */
  groups: [
    {
      key: 'direction',
      label: 'Direction',
      halfDays: 1,
      step: "Demi-journée 1, avec la direction : vos cas d'usage et vos règles sur les données.",
    },
    {
      key: 'metier',
      label: 'Par métier',
      halfDays: 4,
      step: 'Demi-journées 2 à 5, par métier : chaque équipe travaille sur ses dossiers réels.',
    },
    {
      key: 'cloture',
      label: 'Clôture',
      halfDays: 1,
      step: 'Demi-journée 6 : la mesure « après » et le plan de formation.',
    },
  ],
  prix: "Le prix arrive dans le devis, après l'échange de 30\u00a0minutes.",
  link: "Voir l'offre en détail",
  href: '/formations',
} as const
