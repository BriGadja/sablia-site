import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import './legal.css'

type Props = {
  /** Small mono line above the title. */
  folio: string
  title: ReactNode
  intro?: ReactNode
  /** « Dernière mise à jour : … » line closing the page. */
  updated?: ReactNode
  children: ReactNode
}

/** Shared frame of the legal pages and the guide: sand hero, then a card carrying the prose. */
export function LegalPage({ folio, title, intro, updated, children }: Props) {
  return (
    <main id="contenu" className="v2-legal">
      <header className="v2-legal-hero">
        <div className="wrap">
          <div className="v2-legal-narrow">
            <Eyebrow>{folio}</Eyebrow>
            <h1>{title}</h1>
            {intro && <p className="v2-legal-intro">{intro}</p>}
          </div>
        </div>
      </header>
      <div className="wrap">
        <div className="v2-legal-narrow v2-legal-card">
          {children}
          {updated && <p className="v2-legal-updated">{updated}</p>}
        </div>
      </div>
    </main>
  )
}

export function LegalSection({
  title,
  id,
  children,
}: {
  title: string
  id?: string
  children: ReactNode
}) {
  return (
    <section className="v2-legal-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
