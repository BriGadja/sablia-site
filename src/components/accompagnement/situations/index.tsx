'use client'

import { useAccompagnementMode } from '@/components/accompagnement/hero/mode'
import { Eyebrow } from '@/components/shell/Eyebrow'
import './situations.css'

export function AccompagnementSituations() {
  const { ver, data } = useAccompagnementMode()
  return (
    <section id="situations" className="v2-acc-situations">
      <div className="wrap">
        <Eyebrow>Le point de départ</Eyebrow>
        <h2 className="acc-h2">Vous vous reconnaissez ?</h2>
        <div className="situ" key={ver}>
          {data.situs.map((text, i) => (
            <div key={text} className="situ-card" style={{ animationDelay: `${i * 120}ms` }}>
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
