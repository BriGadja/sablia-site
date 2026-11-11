const FORMAT = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Paris',
})

/**
 * The visible date of an issue: the Paris calendar day of its send instant, in French long form
 * (« 17 novembre 2026 », « 1er décembre 2026 »). The same instant feeds `datePublished`, so the
 * visible and the structured dates agree. `''` for an instant that cannot be read or is missing
 * (`new Date(null)` would be the epoch, « 1er janvier 1970 »).
 */
export function parisDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return FORMAT.formatToParts(date)
    .map((part) => (part.type === 'day' && part.value === '1' ? '1er' : part.value))
    .join('')
}
