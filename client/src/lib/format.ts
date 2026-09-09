/**
 * Price formatting shared by the pages that quote the catalogue: a plain space as thousands
 * separator (the way OF-1's own prose writes "1 490 € HT"), never the narrow no-break space that
 * `toLocaleString('fr-FR')` emits and that a copy guard would not match.
 */
export function eurHt(amount: number): string {
  return `${amount.toLocaleString('fr-FR').replace(/ /g, ' ')} € HT`
}
