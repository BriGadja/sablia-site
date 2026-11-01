/** The 3:2 photos of 09/10 prepared by `scripts/prepare-photos.py --set formation` (01, 03, 04, 05). */
export type PhotoId = '01' | '03' | '04' | '05'

type Props = {
  id: PhotoId
  alt: string
  className?: string
  /** `sizes` of the responsive image, matched to the layout slot. */
  sizes: string
  /** First screen: no lazy loading, high fetch priority. */
  eager?: boolean
}

const base = (id: PhotoId) => `/photos/formation-${id}`

export function Photo({ id, alt, className, sizes, eager = false }: Props) {
  return (
    // biome-ignore lint/performance/noImgElement: static export, no image optimizer
    <img
      className={className}
      src={`${base(id)}-900.webp`}
      srcSet={`${base(id)}-540.webp 540w, ${base(id)}-900.webp 900w, ${base(id)}-1200.webp 1200w`}
      sizes={sizes}
      width={1200}
      height={800}
      alt={alt}
      loading={eager ? undefined : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  )
}
