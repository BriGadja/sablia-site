/**
 * The next-webinar facts the shell and the pages share (plan site-formation-lot1, Data contract
 * « Session facts »): the start, the routes that carry the bar, the bar copy (01b § 0) and the
 * client switch. Date and title come from `SESSION` (webinaire.ts, read only): never typed twice.
 */
import { PATHS, SESSION } from './webinaire'

export { useSessionUpcoming, WhenUpcoming } from '@/components/shell/WhenUpcoming'
export { buildTime, SESSION_START, sessionUpcoming } from './session-clock'

/** False on `/webinaire` and its after-pages (trailing slash included): the form is already there. */
export function barShownOn(pathname: string | null): boolean {
  if (!pathname) return true
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return path !== PATHS.page && !path.startsWith(`${PATHS.page}/`)
}

const day = SESSION.date.replace(/\s+\d{4}$/, '') // « Jeudi 19 novembre »
const hour = /\d{1,2} h/.exec(SESSION.hours)?.[0] ?? '' // « 12 h »
const sector = SESSION.title.split(' : ')[0] // « Bureaux d'études »

export const BAR = {
  aria: 'Prochain webinaire',
  label: 'Webinaire gratuit',
  text: `${day} à ${hour} : « ${SESSION.title} »`,
  textShort: `${day}, ${hour} · ${sector.charAt(0).toLowerCase()}${sector.slice(1)}`,
  cta: "Je m'inscris",
  href: PATHS.page,
} as const
