import { BON, FACTURE, FICHE, THUMBS } from './content'
import { OkDot, PathIcon } from './icons'
import type { FlowState } from './state'

const PDF_ICON = 'M7 3h7l4 4v14H7zM14 3v4h4'

function Skel({ width }: { width: string }) {
  return <span className="iv-skel" style={{ width }} />
}

/** Job 3: a mailed PDF becomes a fiche, a bon, then an invoice. */
export function InterventionScene({ s }: { s: FlowState }) {
  const amount = `${s.iTot.toFixed(2).replace('.', ',')} € HT`
  return (
    <div className="scn">
      <div className="iv">
        <div className={`iv-mail${s.iMail ? ' in' : ''}`}>
          <div style={{ fontSize: 12, color: '#61677A' }}>De : Syndic Les Tilleuls</div>
          <b style={{ display: 'block', marginTop: 2, fontSize: 14 }}>Fuite au 3e étage</b>
          <div className="iv-pdf">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: '#61677A',
              }}
            >
              <PathIcon d={PDF_ICON} size={13} width={2} />
              demande-intervention.pdf
            </div>
            <span className="iv-line" style={{ width: '70%' }} />
            {FICHE.map(([, v], i) => (
              <div key={v} style={{ margin: '7px 0' }}>
                <span className={`iv-hl${s.iHl > i ? ' on' : ''}`}>{v}</span>
              </div>
            ))}
            <span className="iv-line" style={{ width: '55%' }} />
          </div>
        </div>
        <svg
          width="40"
          height="24"
          viewBox="0 0 40 24"
          fill="none"
          stroke="#D9A441"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ justifySelf: 'center' }}
          aria-hidden="true"
        >
          <path d="M4 12h30M27 5l7 7-7 7" />
        </svg>
        <div className={`iv-sheet${s.iFlip ? ' flip' : ''}`}>
          {s.iDoc === 0 && (
            <>
              <span className="fl-tag">Fiche d'intervention n° 248</span>
              {FICHE.map(([k, v], i) => (
                <div key={k} className="iv-row">
                  <span style={{ color: '#61677A' }}>{k}</span>
                  {s.iHl > i ? (
                    <b className="fill" style={{ fontWeight: 500 }}>
                      {v}
                    </b>
                  ) : (
                    <Skel width="70%" />
                  )}
                </div>
              ))}
            </>
          )}
          {s.iDoc === 1 && (
            <>
              <span className="fl-tag">Bon d'intervention n° 248</span>
              {BON.map(([k, v], i) => (
                <div key={k} className="iv-row">
                  <span style={{ color: '#61677A' }}>{k}</span>
                  {i !== 1 ? (
                    <b style={{ fontWeight: 500 }}>{v}</b>
                  ) : s.iBonT ? (
                    <b className="flash1" style={{ fontWeight: 500 }}>
                      {v}
                    </b>
                  ) : (
                    <b style={{ fontWeight: 500, color: '#835A0C' }}>Jeudi matin</b>
                  )}
                </div>
              ))}
              {s.iStamp && <span className="iv-stamp">Planifié</span>}
            </>
          )}
          {s.iDoc === 2 && (
            <>
              <span className="fl-tag">Facture n° 248</span>
              {FACTURE.map(([k, v], i) => (
                <div key={k} className="iv-row fa">
                  {s.iFa > i ? (
                    <>
                      <span className="rise" style={{ color: '#3A3F4D' }}>
                        {k}
                      </span>
                      <span
                        className="rise"
                        style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}
                      >
                        {v}
                      </span>
                    </>
                  ) : (
                    <>
                      <Skel width="60%" />
                      <span />
                    </>
                  )}
                </div>
              ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: 10,
                  fontWeight: 600,
                }}
              >
                <span>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 16 }}>{amount}</span>
              </div>
            </>
          )}
        </div>
        <div className="iv-stack">
          <span className="fl-tag" style={{ margin: 0 }}>
            Produits
          </span>
          {THUMBS.map((t, i) => (
            <div key={t} className={`iv-thumb${s.iStack > i ? ' on' : ''}`}>
              <PathIcon d={PDF_ICON} size={14} stroke="#131620" width={2} />
              {t}
              {s.iStack > i && (
                <span style={{ marginLeft: 'auto', display: 'inline-flex' }}>
                  <OkDot pop />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
