/**
 * Per-page metadata for the Metadata API. Each page calls `pageMetadata` from its own
 * `metadata` / `generateMetadata` export: it is never used in the root layout, because anything set
 * there is inherited by 404.html, which must carry no canonical.
 *
 * `metadataBase` is production's origin on every page, so a preview slot never writes its own host
 * into a canonical or an OG URL. Canonicals carry no trailing slash (the home is the bare origin);
 * `scripts/seo/export-guards.mjs` re-checks that on the built HTML.
 */
import type { Metadata } from 'next'

export const SITE_ORIGIN = 'https://sablia.io'
const TWITTER_HANDLE = '@sablia_io'

export interface PageSeo {
  /** Absolute path of the page: `/`, `/formations`, `/ressources/un-slug`. No trailing slash. */
  path: string
  /** The whole `<title>`, as it must read (no site suffix is appended). */
  title: string
  description: string
  /** Kept out of the index (and of the sitemap, see routes.mjs). */
  noindex?: boolean
  /** Path under /public of the Open Graph image (default `/og-image.png`). */
  image?: string
  /** Path under /public of the Twitter image (default `/twitter-image.png`). */
  twitterImage?: string
}

export function pageMetadata({
  path,
  title,
  description,
  noindex = false,
  image = '/og-image.png',
  twitterImage = '/twitter-image.png',
}: PageSeo): Metadata {
  if (!path.startsWith('/')) throw new Error(`seo: path must start with "/", got "${path}"`)
  if (path.length > 1 && path.endsWith('/')) {
    throw new Error(`seo: path must not carry a trailing slash, got "${path}"`)
  }
  if (!title.trim()) throw new Error(`seo: ${path} has no title`)
  if (!description.trim()) throw new Error(`seo: ${path} has no description`)

  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'Sablia',
      locale: 'fr_FR',
      url: path,
      title,
      description,
      images: [{ url: `${SITE_ORIGIN}${image}` }],
    },
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title,
      description,
      images: [`${SITE_ORIGIN}${twitterImage}`],
    },
  }
}
