/** Thousands separated by a non-breaking space, so a price never wraps mid-number. */
export function euros(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}
