'use client'

// Client component: the four rows rise in turn once the section scrolls in (useArmedReveal).
import { type CSSProperties, useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { CHAQUE_MOIS } from '../content'
import { typo } from '../text'
import './chaque-mois.css'

/** Stroke icons, gold-dark: two days in the month, the team session, the upkeep, a mail. */
const ICONS: Readonly<Record<string, string>> = {
  'deux-jours':
    'M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M8 13h3v3H8zM13 13h3v3h-3z',
  seance:
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.6a5.5 5.5 0 0 1 3 5.4',
  suivi: 'M19.5 12A7.5 7.5 0 0 1 6 16.5M4.5 12A7.5 7.5 0 0 1 18 7.5M18 3.5v4h-4M6 20.5v-4h4',
  questions:
    'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5zM4.5 6.5l7.5 6 7.5-6',
}

/** `#chaque-mois`: what each following month holds, four rows. */
export function ChaqueMois() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)

  return (
    <section id="chaque-mois" ref={ref} className="v2-tp-chaque-mois" data-reveal={reveal}>
      <div className="wrap tpc-grid">
        <div className="tpc-head">
          <Eyebrow>{CHAQUE_MOIS.eyebrow}</Eyebrow>
          <h2>{CHAQUE_MOIS.title}</h2>
        </div>
        <ul className="tpc-list">
          {CHAQUE_MOIS.items.map((item, i) => (
            <li key={item.key} className="tpc-item" style={{ '--i': i } as CSSProperties}>
              <svg
                className="tpc-icon"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={ICONS[item.key] ?? ICONS.questions} />
              </svg>
              <p>{typo(item.text)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
