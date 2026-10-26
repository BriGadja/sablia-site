import { JOBS, THINK_STATUS, THINK_STEPS } from './content'
import { PathIcon } from './icons'
import type { FlowState } from './state'

const BLK = '#161B29'

/** Job 0: the typed request, the agent thinking, three output cards. Also the frame of every job's outputs. */
export function FlowScene({ s }: { s: FlowState }) {
  const job = JOBS[s.shown]
  const swapOp = s.aPh === 'swap' ? 0 : 1
  const used = s.aPh === 'think' || s.aPh === 'out'
  const traced = s.aPh === 'send' || s.aPh === 'think' || s.aPh === 'out'
  const ready = s.aPh === 'out' || s.aPh === 'swap'
  const status =
    s.aPh === 'think'
      ? THINK_STATUS[Math.max(0, Math.min(2, s.aStep))]
      : ready
        ? 'Prêt · à valider'
        : s.aPh === 'send'
          ? 'Demande reçue'
          : 'En attente'
  const on = (b: boolean) => (b ? ' on' : '')

  return (
    <div className="flow">
      <div style={{ minWidth: 0 }}>
        <span className="fl-tag">La demande</span>
        <p className={`fl-msg${s.aPh === 'send' ? ' send' : ''}`}>
          <span>{job.request.slice(0, s.typed)}</span>
          <span className={`caret${s.aPh === 'type' ? '' : ' off'}`} />
        </p>
        <div className="fl-ctx">
          {job.context.map((t, i) => (
            <span
              key={t}
              className={`fl-chip${used ? ' used' : ''}`}
              style={{ transitionDelay: `${i * 150}ms`, opacity: swapOp }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="fl-link">
        <svg className="fl-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path className="fl-base" d="M0 50 L100 50" />
          <path className={`fl-trace${on(traced)}`} pathLength={100} d="M0 50 L100 50" />
        </svg>
        <span className={`fl-trav${s.aPh === 'send' ? ' go' : ''}`}>
          <PathIcon d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" size={14} stroke="#835A0C" width={2} />
        </span>
      </div>
      <div className={`fl-agent${s.aPh === 'think' ? ' think' : ''}`} style={{ background: BLK }}>
        <span className="fl-badge">
          <PathIcon
            d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"
            size={26}
            stroke="#131620"
            width={2}
          />
        </span>
        <b style={{ opacity: swapOp }}>{job.agent}</b>
        <small className={`fl-status${ready ? ' ready' : ''}`}>{status}</small>
        <div className="fl-bar">
          <i
            style={{
              width: `${s.bar ? 100 : 0}%`,
              transition: s.bar ? 'width 2.4s cubic-bezier(.2,.7,.2,1)' : 'none',
            }}
          />
        </div>
        <div className="fl-steps">
          {THINK_STEPS.map((t, i) => (
            <span
              key={t}
              className={`fl-pill${s.aStep === i ? ' on' : s.aStep > i ? ' done' : ''}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <svg className="fl-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="fl-base" d="M0 50 C50 50 50 14 100 14" />
        <path className="fl-base" d="M0 50 L100 50" />
        <path className="fl-base" d="M0 50 C50 50 50 86 100 86" />
        <path className={`fl-trace${on(s.outs > 0)}`} pathLength={100} d="M0 50 C50 50 50 14 100 14" />
        <path className={`fl-trace${on(s.outs > 1)}`} pathLength={100} d="M0 50 L100 50" />
        <path className={`fl-trace${on(s.outs > 2)}`} pathLength={100} d="M0 50 C50 50 50 86 100 86" />
      </svg>
      <div className="fl-out">
        {job.outputs.map((o, i) => (
          <div key={o.title} className={`fl-card${on(s.outs > i)}`}>
            <span className={`fl-ico${s.aPh === 'swap' ? ' swap' : ''}`}>
              <PathIcon d={o.icon} size={18} stroke="#131620" />
            </span>
            <span style={{ minWidth: 0 }}>
              <b>{o.title}</b>
              <small>{o.sub}</small>
            </span>
            <em className="fl-ok">
              <PathIcon d="M5 12l5 5L20 7" size={12} stroke="#FFFFFF" width={3} />
            </em>
          </div>
        ))}
      </div>
    </div>
  )
}
