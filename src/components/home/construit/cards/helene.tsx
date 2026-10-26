import type { CSSProperties } from 'react'
import { type CardProps, lit, outline, panel } from '../types'

const Check = ({ size, width = 3 }: { size: number; width?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12l5 5L20 7" />
  </svg>
)

const bar = (width: string, extra: CSSProperties = {}): CSSProperties => ({ width, ...extra })

/** The last row is the Thursday mail; it is the one that stays highlighted. */
const ROWS: [string, string][] = [
  ['Mardi', 'Séance de 10 h'],
  ['Mercredi', 'Séance de 14 h'],
  ['Mercredi', 'Séance de 17 h'],
  ['Jeudi 20:30', 'Mails de suivi'],
]

/** Hélène: her site on the left, the week of sessions turning into summaries and the Thursday mail on the right. */
export function HeleneCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 16, width: 236, height: 232 }}>
        <div className={outline(stage)} />
        <div className={panel(stage, 0)}>
          <div className="bp-h" style={{ gap: 6 }}>
            <span className="bp-dot" />
            <span className="bp-dot" />
            <span className="bp-dot" />
            <span className="bp-mono" style={{ marginLeft: 6 }}>
              Son site
            </span>
          </div>
          <div style={{ padding: '18px 16px', display: 'grid', gap: 9 }}>
            <span className="bp-bar" style={bar('84%', { height: 11, background: '#131620' })} />
            <span className="bp-bar" style={bar('58%', { height: 11, background: '#131620' })} />
            <span className="bp-bar" style={bar('92%', { marginTop: 4 })} />
            <span className="bp-bar" style={bar('70%')} />
            <span
              style={{ display: 'block', width: 92, height: 26, borderRadius: 7, background: '#D9A441', marginTop: 6 }}
            />
          </div>
          <span className={`bp-ok ${lit(stage, 1)}`} style={{ left: 14, bottom: 14 }}>
            <Check size={12} />
            En ligne
          </span>
        </div>
      </div>
      <div className="bp-c" style={{ left: 258, top: 16, width: 422, height: 232 }}>
        <div className={outline(stage)} style={{ transitionDelay: '90ms' }} />
        <div className={panel(stage, 1)}>
          <div className="bp-h" style={{ justifyContent: 'space-between' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131620"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 5h16v15H4zM4 9h16M8 3v4M16 3v4" />
              </svg>
              Cette semaine
            </span>
            <span className="bp-mono">Après chaque séance</span>
          </div>
          {ROWS.map(([day, what], j) => (
            <div
              key={what + j}
              className={`bp-sr${j === 3 ? ' hot' : ''}${stage.l >= j + 2 ? ' on' : ''}`}
            >
              <span className="bp-mono" style={{ color: '#131620', width: 92 }}>
                {day}
              </span>
              <span>{what}</span>
              <span className="st">
                <Check size={12} />
                {j === 3 ? 'Envoyés' : 'Résumé prêt'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
