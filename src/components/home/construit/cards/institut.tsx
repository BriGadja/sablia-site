import type { CSSProperties } from 'react'
import { type CardProps, lit, outline, panel } from '../types'

const tick = (delay?: string): CSSProperties | undefined => (delay ? { transitionDelay: delay } : undefined)

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

const LOCK = 'M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4'

/** The institute: the address bar swaps the Wix URL for its own domain, a page below, the hosting panel beside. */
export function InstitutCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 8, width: 440, height: 44 }}>
        <div className={outline(stage)} />
        <div
          className={panel(stage, 0)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}
        >
          <svg
            className={`bp-lock ${lit(stage, 1)}`}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={LOCK} />
          </svg>
          <span className={`bp-swap bp-mono ${lit(stage, 1)}`} style={{ fontSize: 12.5 }}>
            <span className="old">institut.wixsite.com/accueil</span>
            <span className="nu">Son propre domaine</span>
          </span>
        </div>
      </div>
      <div className="bp-c" style={{ left: 0, top: 64, width: 440, height: 120 }}>
        <div className={outline(stage)} style={{ transitionDelay: '80ms' }} />
        <div
          className={panel(stage, 1)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 120px',
            gap: 16,
            alignItems: 'center',
            padding: '0 16px',
          }}
        >
          <div style={{ display: 'grid', gap: 9 }}>
            <span className="bp-bar" style={{ width: '90%', height: 11, background: '#131620' }} />
            <span className="bp-bar" style={{ width: '64%', height: 11, background: '#131620' }} />
            <span className="bp-bar" style={{ width: '80%', marginTop: 2 }} />
            <span
              style={{ display: 'block', width: 96, height: 24, borderRadius: 7, background: '#161B29', marginTop: 4 }}
            />
          </div>
          <span style={{ display: 'block', height: 88, borderRadius: 10, background: '#E9EBF1' }} />
        </div>
      </div>
      <div className="bp-c" style={{ left: 0, top: 196, width: 440, height: 60 }}>
        <div className={outline(stage)} style={{ transitionDelay: '160ms' }} />
        <div
          className={panel(stage, 2)}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: '50%', background: '#F8EED9' }} />
              <span className="bp-bar" style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
      <div className="bp-c" style={{ left: 464, top: 8, width: 216, height: 248 }}>
        <div className={outline(stage)} style={{ transitionDelay: '240ms' }} />
        <div className={panel(stage, 3)}>
          <div className="bp-h">
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
              <path d={LOCK} />
            </svg>
            Hébergé à son nom
          </div>
          <div style={{ padding: '16px 14px', display: 'grid', gap: 14 }}>
            {[
              ['Domaine', undefined],
              ['Hébergement', '180ms'],
            ].map(([label, delay]) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5 }}
              >
                {label}
                <span className={`bp-tick ${lit(stage, 2)}`} style={tick(delay)}>
                  <Check size={11} width={3.2} />
                </span>
              </div>
            ))}
          </div>
          <span className={`bp-ok ${lit(stage, 3)}`} style={{ left: 14, bottom: 14 }}>
            <Check size={12} />
            En ligne
          </span>
        </div>
      </div>
    </>
  )
}
