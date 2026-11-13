import { Eyebrow } from '@/components/shell/Eyebrow'
import { ROLE } from '../content'
import { Emphasis, typo } from '../text'
import './role.css'

/** A map pin, gold-dark stroke (Rouen). */
const Pin = () => (
  <svg
    className="tpr-pin"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 21s-6.5-6.1-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </svg>
)

/**
 * `#role`: the role placed between its two neighbours (the searched words « consultant IA » and
 * « DSI externalisé »), side by side, then the three verbs of the offer and where I work from.
 */
export function Role() {
  return (
    <section id="role" className="v2-tp-role">
      <div className="wrap">
        <div className="tpr-head">
          <Eyebrow>{ROLE.eyebrow}</Eyebrow>
          <h2>{ROLE.title}</h2>
        </div>
        <div className="tpr-poles">
          {ROLE.poles.map((p) => (
            <p key={p.key} className={`tpr-pole is-${p.key}`}>
              <Emphasis text={typo(p.text)} terms={[typo(p.term)]} className="tpr-term" />
            </p>
          ))}
        </div>
        <p className="tpr-pillars">
          <Emphasis text={typo(ROLE.pillars)} terms={ROLE.verbs} className="tpr-verb" />
        </p>
        <p className="tpr-place">
          <Pin />
          <span>{typo(ROLE.place)}</span>
        </p>
      </div>
    </section>
  )
}
