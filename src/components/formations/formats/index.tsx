import Link from 'next/link'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { EYEBROW, FORMATS, LINK_LABEL, TITLE } from './content'
import './formats.css'

export function Formats() {
  return (
    <section id="formats" className="v2-formats">
      <div className="wrap">
        <Eyebrow>{EYEBROW}</Eyebrow>
        <h2>{TITLE}</h2>
        <div className="fm-grid">
          {FORMATS.map((f) => (
            <article key={f.title} className="fm-card">
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131620"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={f.icon} />
              </svg>
              <h3>{f.title}</h3>
              <p>{f.what}</p>
              {f.link && (
                <Link href="/accompagnement" className="fm-link">
                  {LINK_LABEL}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
