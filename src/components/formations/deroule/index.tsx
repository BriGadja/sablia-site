'use client'

import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useStaged } from '../niveaux/useStaged'
import { EYEBROW, STEPS, TITLE } from './content'
import './deroule.css'

export function Deroule() {
  const ref = useRef<HTMLElement>(null)
  const stage = useStaged(ref)

  return (
    <section id="deroule" ref={ref} className="v2-deroule">
      <div className="wrap">
        <Eyebrow>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <ol className="de-steps">
          {STEPS.map((s, i) => (
            <li
              key={s.n}
              className={`de-step${stage > i ? ' on' : ''}${stage === i + 1 && stage < 4 ? ' cur' : ''}`}
            >
              <div className="de-head">
                <span className="de-n">{s.n}</span>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#131620"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={s.icon} />
                </svg>
              </div>
              <h3>{s.title}</h3>
              <p>{s.what}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
