import { FORM } from '@/content/webinaire'

/**
 * Pure helpers of the `/webinaire` form: the request body of `POST /api/webinaire` and the reading
 * of its 400 answer (the server's error text names the field, `api/webinaire.ts` `decide`).
 */

export type FieldName = keyof typeof FORM.labels

const FIELDS = Object.keys(FORM.labels) as FieldName[]

const isField = (value: string): value is FieldName => (FIELDS as string[]).includes(value)

export interface RegistrationBody {
  prenom: string
  nom: string
  email: string
  telephone: string
  fonction: string
  taille: string
  usage_ia: string
  pourquoi: string
  rappel_consent: boolean
  website: string
  elapsedMs: number
}

/** The exact field set of the contract (U2 report); the box is a checkbox: absent = false. */
export function registrationBody(data: FormData, elapsedMs: number): RegistrationBody {
  const s = (name: string) => String(data.get(name) ?? '')
  return {
    prenom: s('prenom'),
    nom: s('nom'),
    email: s('email'),
    telephone: s('telephone'),
    fonction: s('fonction'),
    taille: s('taille'),
    usage_ia: s('usage_ia'),
    pourquoi: s('pourquoi'),
    rappel_consent: data.get('rappel_consent') === 'on',
    website: s('website'),
    elapsedMs,
  }
}

export type FieldProblem = { field: FieldName; message: string }

/** `null` when the 400 cannot be tied to a visible field (bad JSON, unknown path). */
export function problemFrom(error: string | undefined): FieldProblem | null {
  if (!error) return null
  if (error === FORM.phoneError) return { field: 'telephone', message: FORM.phoneError }
  const field = /\(champ : ([\w.]+)\)/.exec(error)?.[1]
  if (!field || !isField(field)) return null
  return { field, message: FORM.fieldError.replace('{champ}', FORM.labels[field]) }
}
