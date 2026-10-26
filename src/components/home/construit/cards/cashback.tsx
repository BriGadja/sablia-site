import { type CardProps, lit, outline, panel } from '../types'

interface Row {
  name: string
  pct: number
  val: string
  color: string
  weight: number
  hot: boolean
  ty: number
}

/** Rate table: at step 1 competitor A overtakes, at step 2 the rows swap places, at step 3 the alert shows. */
function rows(l: number): Row[] {
  return [
    {
      name: 'Vous',
      pct: 74,
      val: '4,5 %',
      color: '#D9A441',
      weight: 600,
      hot: false,
      ty: l >= 2 ? 44 : 0,
    },
    {
      name: 'Concurrent A',
      pct: l >= 1 ? 82 : 72,
      val: l >= 1 ? '5,0 %' : '4,4 %',
      color: '#131620',
      weight: 400,
      hot: l >= 1,
      ty: l >= 2 ? -44 : 0,
    },
    {
      name: 'Concurrent C',
      pct: 69,
      val: '4,2 %',
      color: '#131620',
      weight: 400,
      hot: false,
      ty: 0,
    },
    {
      name: 'Concurrent B',
      pct: 62,
      val: '3,8 %',
      color: '#131620',
      weight: 400,
      hot: false,
      ty: 0,
    },
  ]
}

/** The cashback platform: today's competitor rates, read every morning. */
export function CashbackCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 0, width: 680, height: 36 }}>
        <div className={outline(stage)} />
        <div
          className={panel(stage, 0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 14px',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Taux du jour
          <span className="bp-mono">Relevé à 07:00</span>
        </div>
      </div>
      {rows(stage.l).map((r, j) => (
        <div
          key={r.name}
          className="bp-c mv"
          style={{
            left: 0,
            top: 48 + 44 * j,
            width: 680,
            height: 36,
            transform: `translateY(${r.ty}px)`,
          }}
        >
          <div className={outline(stage)} style={{ transitionDelay: `${70 * (j + 1)}ms` }} />
          <div className={panel(stage, j + 1)}>
            <div className="bp-row">
              <span style={{ fontWeight: r.weight }}>{r.name}</span>
              <span className="bp-track">
                <i style={{ width: `${r.pct}%`, background: r.color }} />
              </span>
              <span className={`bp-val${r.hot ? ' hot' : ''}`}>{r.val}</span>
            </div>
          </div>
        </div>
      ))}
      <span className={`bp-alert ${lit(stage, 3)}`} style={{ left: 0, top: 228 }}>
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
          <path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
        </svg>
        Un concurrent est passé devant ce matin
      </span>
    </>
  )
}
