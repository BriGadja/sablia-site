const COPY = {
  contact: {
    title: 'Message envoyé !',
    description: 'Merci pour votre message. Nous vous répondrons dans les 24 heures.',
  },
  diagnostic: {
    title: 'Demande enregistrée !',
    description: 'Merci ! Nous vous recontactons sous 48h pour planifier votre call discovery.',
  },
  default: {
    title: 'Merci !',
    description: 'Votre demande a bien été prise en compte.',
  },
} as const

/** Copy for `/thank-you?source=…`; an unknown or missing source gets the generic thanks. */
export function thanksCopy(source: string | null | undefined) {
  return source === 'contact' || source === 'diagnostic' ? COPY[source] : COPY.default
}
