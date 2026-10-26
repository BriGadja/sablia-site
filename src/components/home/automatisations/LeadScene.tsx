import { LEADS, RULES, TEAM } from './content'
import { OkDot, PathIcon } from './icons'
import type { FlowState } from './state'

const MAIL = 'M4 6h16v12H4zM4 7l8 6 8-6'

function LeadCard({ i, attr }: { i: number; attr: boolean }) {
  const l = LEADS[i]
  return (
    <div className="ld-card in">
      <b className="ld-name">{l.name}</b>
      <small className="ld-who">
        {l.who} · {l.src}
      </small>
      <span className="ld-attrs">
        <span className={`ld-attr${attr ? ' on' : ''}`}>{l.size}</span>
        <span className="ld-attr">{l.city}</span>
        <span className="ld-attr">{l.need}</span>
      </span>
    </div>
  )
}

const msgText = (i: number) => {
  const l = LEADS[i]
  return `${l.name}, ${l.size}, ${l.need.toLowerCase()}`
}

/** Job 1: a lead lands, the rules pick a colleague, an envelope flies to them. */
export function LeadScene({ s }: { s: FlowState }) {
  const showA = s.lN === 0 && s.lIn
  const showB = s.lN === 1 && s.lIn
  return (
    <div className="scn">
      <div className="ld">
        <div className="ld-col">
          <span className="fl-tag ld-head">Pipedrive · nouveaux leads</span>
          <div className="ld-stack">
            {showA && <LeadCard i={0} attr={s.lN === 0 && s.lAttr} />}
            {s.lN === 1 && (
              <div className="ld-done rise">
                <OkDot />
                <b>{LEADS[0].name}</b>
                <span style={{ color: '#61677A' }}>→ {TEAM[LEADS[0].m].name}</span>
              </div>
            )}
            {showB && <LeadCard i={1} attr={s.lN === 1 && s.lAttr} />}
          </div>
        </div>
        <div className="ld-col">
          <span className="fl-tag ld-head">Vos règles</span>
          {RULES.map((r, i) => {
            const v = s.lR[i]
            return (
              <div key={r} className="ld-row">
                <span className={`ld-rule${v === 2 ? ' yes' : v === 1 ? ' no' : ''}`}>
                  <span className="ld-mark">
                    {v === 2 && <PathIcon d="M5 12l5 5L20 7" size={10} stroke="#131620" width={3.4} />}
                    {v === 1 && <PathIcon d="M6 6l12 12M18 6L6 18" size={9} stroke="#FFFFFF" width={3.4} />}
                  </span>
                  {r}
                </span>
              </div>
            )
          })}
        </div>
        <div className="ld-col">
          <span className="fl-tag ld-head">Votre équipe</span>
          {TEAM.map((p, i) => (
            <div key={p.name} className="ld-row">
              <span
                className={`ld-person${s.lMsg >= 0 && s.lEnv === 0 && LEADS[s.lMsg].m === i ? ' got' : ''}`}
              >
                <span className="ld-av">
                  {p.av}
                  {s.lCnt[i] > 0 && <span className="ld-badge">{s.lCnt[i]}</span>}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
              </span>
            </div>
          ))}
        </div>
        <span
          className={`ld-env${s.lEnv ? ' vis' : ''}`}
          style={{
            left: s.lEnv === 2 ? (s.lX != null ? `${s.lX}px` : 'calc(67% - 14px)') : 'calc(67% - 80px)',
            top: 51 + 52 * s.lRow,
            transition: s.lEnv === 2 ? 'left 1s cubic-bezier(.65,0,.35,1), opacity .2s' : 'none',
          }}
        >
          <PathIcon d={MAIL} size={16} stroke="#131620" width={2} />
        </span>
      </div>
      <div className="ld-msg">
        <PathIcon d={MAIL} size={18} stroke="#835A0C" />
        {s.lMsg < 0 && <span style={{ color: '#61677A' }}>En attente d'un nouveau lead…</span>}
        {s.lMsg >= 0 && (
          <span key={s.lMsg} className="rise">
            <b>{TEAM[LEADS[s.lMsg].m].name} reçoit</b> : {msgText(s.lMsg)}. Rien à ressaisir.
          </span>
        )}
      </div>
    </div>
  )
}
