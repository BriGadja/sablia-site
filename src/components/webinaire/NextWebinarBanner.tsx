import Link from 'next/link'
import { NEXT_WEBINAR_BANNER } from '@/content/webinaire'
import './next-webinar-banner.css'

type Banner = typeof NEXT_WEBINAR_BANNER

/**
 * « Prochain webinaire » strip (todo t-20261031-33). Shipped OFF: nothing renders while
 * `enabled` is false, and no page mounts it yet; turning it on after the merge = the flag plus one
 * mount line (above the header's bar or at the top of the home).
 */
export function NextWebinarBanner({ banner = NEXT_WEBINAR_BANNER }: { banner?: Banner }) {
  if (!banner.enabled) return null
  return (
    <aside className="v2-wbn-banner" aria-label={banner.label}>
      <div className="wrap wbn-banner-in">
        <span className="wbn-banner-label">{banner.label}</span>
        <span className="wbn-banner-text">{banner.text}</span>
        <Link href={banner.href} className="wbn-banner-link">
          {banner.cta}
        </Link>
      </div>
    </aside>
  )
}
