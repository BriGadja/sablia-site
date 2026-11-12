import Link from 'next/link'
import { WhenUpcoming } from '@/content/session-bar'
import { PATHS, SESSION } from '@/content/webinaire'
import './webinar-reminder.css'

const day = SESSION.date.replace(/\s+\d{4}$/, '') // « Jeudi 3 décembre »
const lead = 'Webinaire gratuit,'
const rest = ` ${day.charAt(0).toLowerCase()}${day.slice(1)} ${SESSION.hours} : « ${SESSION.title} »`

/**
 * Copy deck B5 `reminder.*` (US-109, US-107): the date, the hours and the title come from `SESSION`
 * (webinaire.ts, read only), never typed twice; the same derivation as the bar (`session-bar.ts`).
 */
export const REMINDER = {
  text: `${lead}${rest}`,
  cta: "Je m'inscris",
  href: PATHS.page,
} as const

/** A guillemet never ends or starts a line apart from its word, nor a figure apart from its unit. */
const keep = (s: string) =>
  s
    .replace(/« /g, '«\u00a0')
    .replace(/ »/g, '\u00a0»')
    .replace(/(\d) (?=\S)/g, '$1\u00a0')

function ReminderView() {
  return (
    <div className="v2-reminder" data-zone="rappel">
      <div className="wrap">
        <p className="rm-line">
          <svg
            className="rm-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
          </svg>
          <span className="rm-text">
            <strong>{lead}</strong>
            {keep(rest)}
          </span>
          <Link href={REMINDER.href} className="rm-cta">
            {REMINDER.cta}
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

/**
 * The light webinar reminder of `/formations` and `/conferences` (plan sablia-site-structure-offre F2):
 * one sentence and a link to `/webinaire` while the session is ahead, nothing from its start (the
 * switch is `WhenUpcoming`, never a date check here). Never a booking button: the pages that mount it
 * pin their count. `data-zone="rappel"` names its clicks apart from the bar's and the hero's.
 */
export function WebinarReminder() {
  return <WhenUpcoming upcoming={<ReminderView />} past={null} />
}
