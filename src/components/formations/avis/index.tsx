'use client'

import { useRef } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useStaged } from '../niveaux/useStaged'
import { ANSWERS, CASES, EYEBROW, SURVEY_LABEL, SURVEY_NOTE, TITLE } from './content'
import './avis.css'

export function Avis() {
  const ref = useRef<HTMLElement>(null)
  const stage = useStaged(ref)

  return (
    <section id="avis" ref={ref} className="v2-avis">
      <div className="wrap">
        <Eyebrow>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <div className="av-cases">
          {CASES.map((c) => (
            <article key={c.title} className="av-case">
              <span className="av-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.what}</p>
            </article>
          ))}
        </div>
        <div className="av-survey proof-temoignages">
          <div className="av-label">{SURVEY_LABEL}</div>
          <ul className="av-list">
            {ANSWERS.map((a, i) => (
              <li key={`${a.question}-${a.text}`} className={`av-ans${stage > i ? ' on' : ''}`}>
                <figure className="temoignage">
                  <blockquote>{`« ${a.text} »`}</blockquote>
                  <figcaption>{a.question}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <p className="av-note">{SURVEY_NOTE}</p>
        </div>
      </div>
    </section>
  )
}
