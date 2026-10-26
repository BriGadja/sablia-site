import { BULLETINS, TILES, VEILLE_PILLS } from './content'
import { PathIcon } from './icons'
import type { FlowState } from './state'

function tileClass(s: FlowState, i: number, keep: boolean) {
  if (s.vScan === i) return keep ? 'keep' : 'scan'
  const passed = s.vScan > i
  if (passed && keep) return `keep${s.vBul === TILES[i].n && !s.vSent ? ' cite' : ''}`
  if (passed) return 'dim'
  return ''
}

/** Job 2: nine sources are scanned at 07:00, the three that matter feed the morning mail. */
export function VeilleScene({ s }: { s: FlowState }) {
  return (
    <div className="scn">
      <div className="vl">
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <span className="fl-tag" style={{ margin: 0 }}>
              Vos sources
            </span>
            <span className={`vl-clock${s.vT ? ' tick' : ''}`}>
              <PathIcon d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 7v5l3 2" size={13} width={2.2} />
              {s.vT ? '07:00' : '06:59'}
            </span>
          </div>
          <div className="vl-grid">
            {TILES.map((t, i) => (
              <div key={t.t} className={`vl-tile ${tileClass(s, i, t.n > 0)}`.trim()}>
                <PathIcon d={t.icon} size={16} stroke="#131620" width={1.8} />
                <span
                  style={{
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {t.t}
                </span>
                {t.n > 0 && s.vScan >= i && <span className="vl-num">{t.n}</span>}
              </div>
            ))}
          </div>
        </div>
        <div className={`vl-mail${s.vKeep ? '' : ' wait'}`}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <b style={{ fontSize: 15 }}>Votre veille du matin</b>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#61677A' }}>
              07:02
            </span>
          </div>
          <div style={{ marginTop: 10, display: 'grid' }}>
            {BULLETINS.map((b, i) => (
              <div key={b} className="vl-bul">
                {s.vBul > i ? (
                  <>
                    <span className="vl-ref pop">{i + 1}</span>
                    <span className="rise">{b}</span>
                  </>
                ) : (
                  <>
                    <span className="vl-ref" style={{ background: '#EDEFF4', color: '#61677A' }}>
                      {i + 1}
                    </span>
                    <span className="vl-skel" />
                  </>
                )}
              </div>
            ))}
          </div>
          {s.vSent && (
            <div
              className="rise"
              style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}
            >
              {VEILLE_PILLS.map((p, i) => (
                <span key={p} className="vl-pill">
                  {i === 0 && <PathIcon d="M5 12l5 5L20 7" size={12} width={2.6} />}
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
