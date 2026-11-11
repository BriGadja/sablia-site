'use client'

// Client component: the portrait uncovers and its gold frame settles once in view (useArmedReveal).
import { useRef } from 'react'
import { Dune } from '@/components/shell/Dune'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { useArmedReveal } from '@/lib/hooks/useArmedReveal'
import { PHOTOS, QUI } from '../content'
import { photoSrcSet, typo } from '../text'
import './qui.css'

/** The paragraph of « Qui je suis » with the school's name as the link, as the home writes it. */
function QuiText() {
  const [before, after] = typo(QUI.text).split(QUI.school.link)
  return (
    <p className="tpq-text">
      {before}
      <a href={QUI.school.href} className="tpq-school">
        {QUI.school.link}
      </a>
      {after}
    </p>
  )
}

/** `#qui`: who you work with, the portrait of the home in its gold frame, one paragraph. */
export function Qui() {
  const ref = useRef<HTMLElement>(null)
  const reveal = useArmedReveal(ref)
  const photo = PHOTOS.portrait

  return (
    <section id="qui" ref={ref} className="v2-tp-qui" data-reveal={reveal}>
      <Dune back="#C68A8E" front="#F4ECDD" />
      <div className="wrap tpq-grid">
        <figure className="tpq-portrait">
          {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
          <img
            src={`/photos/formation-${photo.n}-900.webp`}
            srcSet={photoSrcSet(photo.n)}
            sizes="(max-width: 900px) calc(100vw - 42px), 360px"
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            alt={photo.alt}
          />
        </figure>
        <div className="tpq-copy">
          <Eyebrow>{QUI.eyebrow}</Eyebrow>
          <h2>{typo(QUI.title)}</h2>
          <QuiText />
        </div>
      </div>
    </section>
  )
}
