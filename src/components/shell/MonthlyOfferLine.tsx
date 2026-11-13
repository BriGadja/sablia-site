import Link from 'next/link'
import { MENSUEL } from '@/components/home/mensuel/content'
import { DOORS } from '@/components/home/top/content'
import './monthly-offer-line.css'

const door = DOORS.find((d) => d.href === MENSUEL.link.href)
if (door === undefined) throw new Error(`no home door leads to ${MENSUEL.link.href}`)

/**
 * Brice at VP2 (13/11, question 8): before the closing band of `/formations`, `/conferences` and
 * `/realisations`, a line leads to the monthly offer. Its words are the home's first door (label and
 * line) and the home's monthly link (copy deck B2 `home.door.1.*`, `home.mensuel.link`), read from those
 * modules, never typed twice.
 */
export const MONTHLY_LINE = {
  lead: door.label,
  text: `${door.line.charAt(0).toLowerCase()}${door.line.slice(1)}`,
  cta: MENSUEL.link.label,
  href: MENSUEL.link.href,
} as const

type Props = {
  /** The ground of the section above, so the line and the room under it read as that section's end. */
  ground: 'rose' | 'sand' | 'paper'
}

/**
 * One sentence and a link, on the ground of the section above, then the room the `#fin` dune overlaps.
 * Never a booking button: the pages that mount it pin their count. `data-zone="mensuel"`, the zone of
 * the home's monthly block, names its clicks (the link also carries `dest` « responsable-ia »).
 */
export function MonthlyOfferLine({ ground }: Props) {
  return (
    <div className={`v2-monthly-line is-${ground}`} data-zone="mensuel">
      <div className="wrap">
        <p className="ml-line">
          <span className="ml-text">
            <strong>{MONTHLY_LINE.lead}</strong>
            {` : ${MONTHLY_LINE.text}`}
          </span>
          <Link href={MONTHLY_LINE.href} className="ml-cta">
            {MONTHLY_LINE.cta}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </p>
      </div>
    </div>
  )
}
