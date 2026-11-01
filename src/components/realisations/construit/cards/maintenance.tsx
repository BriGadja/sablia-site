import { type CardProps, lit, outline, panel } from '../types'

const ADDRESSES = ['8 av. de Bretagne', '3 place du Marché', "27 rue Jeanne-d'Arc"]
const TICK_DELAYS = [0, 140, 280]

const Check = ({ size, width }: { size: number; width: number }) => (
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

/** Maintenance company: requests received by mail become a record, a work order and an invoice, with no re-keying. */
export function MaintenanceCard({ stage }: CardProps) {
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 24, width: 236, height: 168 }}>
        <div className={outline(stage)} />
        <div className={panel(stage, 0)}>
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
              <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
            </svg>
            Demandes reçues
          </div>
          {ADDRESSES.map((ad, j) => (
            <div
              key={ad}
              className={`bp-mr${stage.l >= 2 * j + 1 && stage.l < 2 * j + 3 ? ' on' : ''}`}
            >
              Demande d'intervention<span className="pdf">PDF</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bp-c" style={{ left: 258, top: 24, width: 422, height: 168 }}>
        <div className={outline(stage)} style={{ transitionDelay: '90ms' }} />
        <div className={panel(stage, 1)}>
          <div className="bp-tr hd">
            <span>Adresse</span>
            <span>Fiche</span>
            <span>Bon</span>
            <span>Facture</span>
          </div>
          {ADDRESSES.map((ad, j) => (
            <div key={ad} className={`bp-tr${stage.l >= 2 * j + 1 ? ' in' : ''}`}>
              <span className="ad">{ad}</span>
              {TICK_DELAYS.map((d) => (
                <span
                  key={d}
                  className={`bp-tick${stage.l >= 2 * j + 2 ? ' on' : ''}`}
                  style={d ? { transitionDelay: `${d}ms` } : undefined}
                >
                  <Check size={11} width={3.2} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className={`bp-ok ${lit(stage, 7)}`} style={{ left: 258, top: 208 }}>
        <Check size={12} width={3} />
        Aucune ressaisie
      </span>
    </>
  )
}
