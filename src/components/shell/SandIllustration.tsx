import type { CSSProperties, ReactNode } from 'react'
import './ill-head.css'
import './sand-illustration.css'

type Props = {
  /** Path under /illus, e.g. `/illus/offre-contour-nuit.webp`. */
  src: string
  /** Desktop height in px (phones fall back to 170 px). */
  height: number
  /** No night background and no rounded corners (the offer and Formations bands). */
  bare?: boolean
  /** CSS `object-position` of the image inside its box. */
  position?: string
  /** First screen: skip lazy loading. */
  eager?: boolean
}

/** Decorative sand drawing, revealed by a scroll-driven wipe (`.ill-draw`, base.css). */
export function SandIllustration({
  src,
  height,
  bare = false,
  position = '50% 50%',
  eager = false,
}: Props) {
  return (
    <figure
      className={`v2-ill${bare ? ' is-bare' : ''}`}
      aria-hidden="true"
      style={{ '--ill-h': `${height}px` } as CSSProperties}
    >
      {/* biome-ignore lint/performance/noImgElement: static export, no image optimizer */}
      <img
        className="ill-draw"
        src={src}
        alt=""
        loading={eager ? undefined : 'lazy'}
        style={{ objectPosition: position }}
      />
    </figure>
  )
}

/** Section heading row: title block on the left, drawing on the right (one column on phones). */
export function IllHead({ children }: { children: ReactNode }) {
  return <div className="v2-ill-head">{children}</div>
}
