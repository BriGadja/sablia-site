// Hero of /formations (01b § 3 Hero). The lede is the canonical term C10, verbatim.

export const EYEBROW = 'Formation pour équipes'
export const H1 = "L'IA au travail"
export const LEDE =
  "Trois jours sur vos propres dossiers : chaque participant repart avec ses outils en place, l'entreprise avec ses règles sur les données, et on mesure le temps passé avant et après."
export const CTA = 'Réserver 30 min'
export const REASSURE = "Gratuit, sans engagement. Le devis suit l'échange."

export interface Fact {
  key: string
  label: string
  value: string
}

export const FACTS: readonly Fact[] = [
  { key: 'duree', label: 'Durée', value: 'Trois jours, en six demi-journées' },
  { key: 'groupe', label: 'Groupe', value: "Jusqu'à 12 personnes" },
  { key: 'lieu', label: 'Lieu', value: 'Dans vos locaux' },
  { key: 'outil', label: 'Outil', value: 'Claude' },
]

// Alt text of photo 04, from the photo unit's report (02-U6.md).
export const PHOTO_ALT = "Brice Gachadoat montre l'écran de projection d'un geste du bras."
