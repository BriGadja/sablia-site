'use client'

import { useAccompagnementMode } from '@/components/accompagnement/hero/mode'
import { Eyebrow } from '@/components/shell/Eyebrow'
import './livrables.css'

export function AccompagnementLivrables() {
  const { ver, data } = useAccompagnementMode()
  return (
    <section id="livrables" className="v2-acc-livrables">
      <div className="wrap">
        <Eyebrow>À la fin</Eyebrow>
        <h2 className="acc-h2">Vous repartez avec.</h2>
        <div className="deliv" key={ver}>
          {data.delivs.map(([title, what, icon], i) => (
            <article key={title} className="dcard" style={{ animationDelay: `${i * 110}ms` }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131620"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={icon} />
              </svg>
              <h3>{title}</h3>
              <p>{what}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
