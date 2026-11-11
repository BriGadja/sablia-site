import { FOUNDER } from '@/components/seo/OrganizationJsonLd'
import { DEFAULT_OG_IMAGE, SITE_ORIGIN } from '@/lib/seo'
import type { Lettre } from './data'

const HOUR_MS = 60 * 60 * 1000

/**
 * `dateModified`: the edit time only when the text really changed after the send. The hub moves
 * `updated_at` on a text change only, but a publication made just after the send may still stamp it a
 * few minutes later: under an hour it is the same version.
 */
function modifiedAt({ published_at, updated_at }: Lettre): string {
  const published = Date.parse(published_at)
  const updated = Date.parse(updated_at)
  if (Number.isNaN(published) || Number.isNaN(updated)) return published_at
  return updated - published > HOUR_MS ? updated_at : published_at
}

/**
 * The `Article` data of an issue page (US-101). Dates come from the send instant (`published_at`, the
 * same value the page shows), the author is the founder Person of the organisation block, the
 * publisher points at that block. `image` is the own-hosted poster (`posterPath`, never a YouTube host)
 * when the issue has one, else the default social image the page's Open Graph tags already carry. No
 * `VideoObject` here: a post that embeds a video is not a watch page.
 */
export function articleSchema(lettre: Lettre, poster: string | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: lettre.titre,
    description: lettre.resume,
    inLanguage: 'fr-FR',
    datePublished: lettre.published_at,
    dateModified: modifiedAt(lettre),
    author: FOUNDER,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    mainEntityOfPage: `${SITE_ORIGIN}/lettre/${lettre.slug}`,
    image: `${SITE_ORIGIN}${poster ?? DEFAULT_OG_IMAGE}`,
  }
}
