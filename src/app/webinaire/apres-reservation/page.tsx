import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { APRES } from '@/content/webinaire'
import { pageMetadata } from '@/lib/seo'
import '@/components/webinaire/webinaire.css'

export const metadata = pageMetadata({
  path: '/webinaire/apres-reservation',
  title: APRES.meta.title,
  description: APRES.meta.description,
  noindex: true,
})

/**
 * `/webinaire/apres-reservation` (US-88): what follows a booked 30-minute call, in five steps
 * (appel, résumé écrit, devis, convention, paiement). Says nothing about funding. The sand line runs
 * through the five steps once at load; reduced motion shows it drawn.
 */
export default function ApresReservationPage() {
  return (
    <main id="contenu" className="v2-webinaire">
      <section id="top" className="wbn-after">
        <div className="wrap wbn-after-in is-wide">
          <Eyebrow>{APRES.eyebrow}</Eyebrow>
          <h1>{APRES.title}</h1>
          <p className="wbn-lede">{APRES.lede}</p>

          <h2 className="wbn-steps-title">{APRES.stepsTitle}</h2>
          <ol className="wbn-steps is-path">
            {APRES.steps.map((step, index) => (
              <li key={step.key} style={{ '--i': String(index) } as CSSProperties}>
                <span className="wbn-step-dot" aria-hidden="true">
                  {index + 1}
                </span>
                <span className="wbn-step-when">{step.title}</span>
                <span className="wbn-step-what">{step.line}</span>
              </li>
            ))}
          </ol>

          <p className="wbn-note">{APRES.move}</p>

          <Link className="wbn-home" href="/">
            {APRES.home}
          </Link>
        </div>
      </section>
    </main>
  )
}
