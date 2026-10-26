import { type CardProps, outline, panel } from '../types'

const TILES = Array.from({ length: 29 }, (_, j) => j)
const WEEKS = Array.from({ length: 8 }, (_, j) => j)

/** Noésia school: the 29-video module, then a live workshop every other week. */
export function NoesiaCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 4, width: 680, height: 44 }}>
        <div className={outline(stage)} />
        <div
          className={panel(stage, 0, 'dark')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 600 }}>Module Claude Code</span>
          <span className="bp-mono" style={{ color: '#A4AABD', fontSize: 12 }}>
            10 h · 29 vidéos
          </span>
        </div>
      </div>
      <div className="bp-c" style={{ left: 0, top: 60, width: 680, height: 116 }}>
        <div className={outline(stage)} style={{ transitionDelay: '80ms' }} />
        <div
          className={panel(stage, 1)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, minmax(0, 1fr))',
            gap: 8,
            padding: 14,
            alignContent: 'center',
          }}
        >
          {TILES.map((j) => (
            <span
              key={j}
              className={`bp-tile${stage.b >= 2 ? ' in' : ''}`}
              style={{ transitionDelay: `${j * 28}ms` }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#D9A441" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          ))}
        </div>
      </div>
      <div className="bp-c" style={{ left: 0, top: 190, width: 680, height: 66 }}>
        <div className={outline(stage)} style={{ transitionDelay: '160ms' }} />
        <div
          className={panel(stage, 2)}
          style={{
            display: 'grid',
            gridTemplateColumns: '136px repeat(8, minmax(0, 1fr))',
            gap: 8,
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600 }}>Ateliers en direct</span>
          {WEEKS.map((j) => (
            <span key={j} className="bp-wk">
              <b
                className={j % 2 === 0 && stage.l >= 1 ? 'on' : ''}
                style={{ transitionDelay: `${j * 110}ms` }}
              >
                {j % 2 === 0 ? 'Atelier' : ''}
              </b>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
