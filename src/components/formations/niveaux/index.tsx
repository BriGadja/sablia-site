'use client'

import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { IllHead, SandIllustration } from '@/components/shell/SandIllustration'
import { EYEBROW, LEAD, RUNGS, TITLE } from './content'
import './niveaux.css'
import { useStaged } from './useStaged'

export function Niveaux() {
  const ref = useRef<HTMLElement>(null)
  const stage = useStaged(ref)
  const width = Math.round((100 * Math.max(0, stage - 1)) / 3)

  return (
    <section id="niveaux" ref={ref} className="v2-niveaux">
      <div className="wrap">
        <IllHead>
          <div>
            <Eyebrow>{EYEBROW}</Eyebrow>
            <h2>{TITLE}</h2>
            <p className="nv-lead">{LEAD}</p>
          </div>
          <SandIllustration src="/illus/formations-contour-nuit.webp" height={220} />
        </IllHead>
        <ol className="nv-ladder">
          <li className="nv-line" aria-hidden="true">
            <i style={{ width: `${width}%` }} />
          </li>
          {RUNGS.map((r, i) => (
            <li key={r.title} className={`nv-rung${stage > i ? ' on' : ''}`}>
              <span className="nv-dot" aria-hidden="true" />
              <div className="nv-n">{`Niveau ${i + 1}`}</div>
              <h3>{r.title}</h3>
              <p className="nv-what">{r.what}</p>
              <p className="nv-who">{`Pour ${r.who}`}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
