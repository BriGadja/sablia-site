import { FinBand } from '@/components/shell/FinBand'

/**
 * @off-source Not a clause of OF-1: do not look for it there, and do not let it drift into the
 * offer by copy-paste. It is a risk reversal Brice validated on 2026-09-07, consistent with the
 * refund guarantee and free to honour (giving a date at the end of a call costs nothing).
 * Second and last line of the page that states something OF-1 does not; the other is the closing
 * line of ObjectionSection. `of1.copy.test.ts` counts them and fails if a third appears unmarked.
 */
const OFF_SOURCE_PROMISE =
  "30 minutes en partage d'écran avec Brice. Vous repartez avec la variante qui colle à votre terrain et une date de livraison, que nous travaillions ensemble ou non."

/** The closing band of the offer and CRM pages. */
export default function OffreCallout() {
  return <FinBand title="On regarde votre CRM ensemble." text={OFF_SOURCE_PROMISE} />
}
