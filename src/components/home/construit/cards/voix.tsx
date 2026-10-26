import { type CardProps, outline, panel } from '../types'

const BARS = [10, 22, 30, 16, 34, 24, 12, 28, 36, 18, 14, 30, 26, 10, 20, 32, 16, 12]
const QUOTES = [
  '« Je vous propose mardi à 10 h. »',
  '« Mercredi 14 h 30, ça vous va ? »',
  "« Jeudi 9 h, c'est noté. »",
]
const SLOTS = ['Mar. 10:00', 'Mer. 14:30', 'Jeu. 09:00']

/** Voice agents (on request, last card): an inbound call, the agent proposes slots, the advisor's agenda fills. */
export function VoixCard({ stage }: CardProps) {
  const talking = stage.l >= 1 && stage.l <= 6
  const current = Math.min(2, Math.max(0, Math.ceil(stage.l / 2) - 1))
  return (
    <>
      <div className="bp-c" style={{ left: 0, top: 24, width: 316, height: 216 }}>
        <div className={outline(stage)} />
        <div
          className={panel(stage, 0, 'dark')}
          style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8FCB9B' }} />
            Appel entrant · agent vocal
          </div>
          <div className="bp-wave">
            {BARS.map((h, j) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: static decorative bars, never reordered
                key={j}
                className={talking ? 'bar' : ''}
                style={{ height: stage.l >= 1 ? h : 4, animationDelay: `${j * 50}ms` }}
              />
            ))}
          </div>
          <div className="bp-quotes">
            {QUOTES.map((t, j) => (
              <span
                key={t}
                className={`bp-quote${
                  stage.l >= 2 * j + 1 && j === current
                    ? ' on'
                    : stage.l >= 2 * j + 1
                      ? ' gone'
                      : ''
                }`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="bp-c" style={{ left: 340, top: 24, width: 340, height: 216 }}>
        <div className={outline(stage)} style={{ transitionDelay: '90ms' }} />
        <div
          className={panel(stage, 1)}
          style={{ padding: 14, display: 'grid', gap: 8, alignContent: 'start' }}
        >
          <span className="bp-mono" style={{ textTransform: 'uppercase' }}>
            Agenda du conseiller
          </span>
          {SLOTS.map((t, j) => {
            const ok = stage.l >= 2 * j + 2
            return (
              <div key={t} className={`bp-ag${ok ? ' on' : ''}`}>
                <span className="bp-mono" style={{ color: '#131620', fontSize: 12 }}>
                  {t}
                </span>
                <span className="st">
                  {ok && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                  {ok ? 'Rendez-vous pris' : 'Libre'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
