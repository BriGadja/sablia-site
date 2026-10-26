import { SEANCE_BARS, SEANCE_DAYS, SEANCE_MARKS, SEANCE_ROWS } from './content'
import { PathIcon } from './icons'
import type { FlowState } from './state'

const MAIL = 'M4 6h16v12H4zM4 7l8 6 8-6'

/** Job 4: a recording is marked at three moments, the report fills, the follow-up mail is scheduled for Thursday. */
export function SeanceScene({ s }: { s: FlowState }) {
  const time = `${String(Math.floor(52 * s.sP)).padStart(2, '0')}:00`
  return (
    <div className="scn">
      <div className="se-player">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <PathIcon
              d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3M5 11a7 7 0 0 0 14 0M12 18v3"
              size={15}
              stroke="#D9A441"
              width={2}
            />
            Séance de mardi
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#A4AABD' }}>
            {time} / 52:00
          </span>
        </div>
        <div className="se-track">
          {SEANCE_MARKS.map((m, i) =>
            s.sMk > i ? (
              <span key={m.t} className="se-mk" style={{ left: m.at }}>
                <b>
                  {i + 1} · {m.t}
                </b>
                <i />
              </span>
            ) : null,
          )}
          <div className="se-bars">
            {SEANCE_BARS.map((h, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed decorative bars
              <span key={i} className={i / 48 < s.sP ? 'past' : ''} style={{ height: h }} />
            ))}
          </div>
          <span className="se-head" style={{ left: `${(100 * s.sP).toFixed(1)}%` }} />
        </div>
      </div>
      <div className="se-low">
        <div className="se-doc">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <b style={{ fontSize: 15 }}>Compte rendu de séance</b>
            {s.sRelu && (
              <span className="vl-pill pop">
                <PathIcon d="M5 12l5 5L20 7" size={12} width={2.6} />
                Relu par vous
              </span>
            )}
          </div>
          <div style={{ marginTop: 8 }}>
            {SEANCE_ROWS.map(([k, v], i) => (
              <div key={k} className="se-row">
                <span
                  className="vl-ref"
                  style={
                    s.sMk > i
                      ? { background: '#F8EED9', color: '#835A0C' }
                      : { background: '#EDEFF4', color: '#A4AABD' }
                  }
                >
                  {i + 1}
                </span>
                <span style={{ color: '#61677A' }}>{k}</span>
                {s.sMk > i ? (
                  <span className="rise" style={{ fontWeight: 500 }}>
                    {v}
                  </span>
                ) : (
                  <span className="iv-skel" style={{ width: '75%' }} />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="fl-tag">Le mail de suivi</span>
          <div className="se-week">
            {SEANCE_DAYS.map((d, i) => (
              <div key={d} className={`se-day${i === 3 && s.sMail === 3 ? ' hot' : ''}`}>
                {d}
                {i === 3 && s.sMail === 3 && (
                  <span
                    className="rise"
                    style={{
                      position: 'absolute',
                      left: 8,
                      right: 6,
                      bottom: 8,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Programmé
                  </span>
                )}
              </div>
            ))}
            <span
              className={`se-chip${s.sMail ? ' vis' : ''}`}
              style={{
                left: s.sMail >= 2 ? 'calc(60% + 9px)' : 'calc(20% + 7px)',
                transition:
                  s.sMail >= 2
                    ? 'left .85s cubic-bezier(.65,0,.35,1), opacity .25s'
                    : 'opacity .25s',
              }}
            >
              <PathIcon d={MAIL} size={13} stroke="#835A0C" width={2} />
              20:30
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
