import Link from 'next/link'
import type { ReactNode } from 'react'
import { Cta } from './Cta'
import { Dune } from './Dune'
import './fin-band.css'

type Props = {
  title: string
  text: ReactNode
  /** Quiet secondary link under the button (home only: the guide and free resources). */
  link?: { href: string; label: string }
}

/** The closing `#fin` band, shared by every page: dune, banner image, copy on the right, booking CTA. */
export function FinBand({ title, text, link }: Props) {
  return (
    <section id="fin" className="v2-fin-band">
      <Dune back="#C68A8E" front="#161B29" />
      {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
      <img className="v2-fin-img" src="/illus/fin-banner.webp" alt="" loading="lazy" />
      <div className="wrap v2-fin-in">
        <div className="v2-fin-copy">
          <h2>{title}</h2>
          <p>{text}</p>
          <div className="v2-fin-actions">
            <Cta variant="light" size="lg" arrow />
            {link && <Link href={link.href}>{link.label}</Link>}
          </div>
        </div>
      </div>
    </section>
  )
}
