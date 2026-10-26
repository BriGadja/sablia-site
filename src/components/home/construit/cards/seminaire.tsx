import { type CardProps, lit, outline, panel } from '../types'

/**
 * A full 4 x 6 grid on purpose: the mockup drew 23 seats, which read as a headcount of the room.
 * A complete grid of anonymous seats shows « a room » and no number.
 */
const SEATS = Array.from({ length: 24 }, (_, j) => j)

/** Engineering consultancy: a morning that puts generative AI in the team's hands (demo, then the room fills). */
export function SeminaireCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 170, top: 4, width: 340, height: 96 }}>
        <div className={outline(stage)} />
        <div className={panel(stage, 0, 'dark')}>
          <div className={`bp-screen ${lit(stage, 1)}`}>
            <span className="bp-mono" style={{ color: '#835A0C', textTransform: 'uppercase' }}>
              Démo
            </span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#131620' }}>
              Sur leurs propres cas
            </span>
          </div>
        </div>
      </div>
      <div className="bp-c" style={{ left: 150, top: 116, width: 380, height: 140 }}>
        <div className={outline(stage)} style={{ transitionDelay: '90ms' }} />
        <div
          className={panel(stage, 1)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 24px)',
            gap: '8px 22px',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          {SEATS.map((j) => (
            <svg
              key={j}
              className={`bp-seat${stage.b >= 2 ? ' in' : ''}${stage.l >= 2 ? ' on' : ''}`}
              style={{ transitionDelay: `${Math.floor(j / 6) * 120 + (j % 6) * 25}ms` }}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4.2" />
              <path d="M3.5 22a8.5 7 0 0 1 17 0z" />
            </svg>
          ))}
        </div>
      </div>
    </>
  )
}
