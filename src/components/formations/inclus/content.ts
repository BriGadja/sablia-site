// « Inclus » of /formations (01b § 3 Included): the offer sheet's four bonuses, then C9 verbatim. No value in euros.

export const EYEBROW = 'Inclus'
export const TITLE = 'Ce qui reste après les trois jours.'

export interface Item {
  key: string
  text: string
}

export const ITEMS: readonly Item[] = [
  { key: 'charte', text: "La charte IA de l'entreprise." },
  { key: 'plan', text: 'Le plan de formation documenté.' },
  { key: 'questions', text: '30 jours de questions par mail, réponse sous 48 h.' },
  {
    key: 'bibliotheque',
    text: 'La bibliothèque des consignes et assistants créés en séance, par métier.',
  },
  {
    key: 'fin-de-formation',
    text: 'Une attestation de fin de formation est remise à chaque participant.',
  },
]
