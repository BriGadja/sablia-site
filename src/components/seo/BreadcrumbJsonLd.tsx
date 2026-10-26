import { SITE_ORIGIN } from '@/lib/seo'
import { JsonLd } from './JsonLd'

export interface Crumb {
  name: string
  /** Absolute path of the page: `/formations`. */
  path: string
}

/** BreadcrumbList; « Accueil » is added first. */
export function BreadcrumbJsonLd({ items }: { items: readonly Crumb[] }) {
  const crumbs = [
    { name: 'Accueil', url: SITE_ORIGIN },
    ...items.map((c) => ({ name: c.name, url: `${SITE_ORIGIN}${c.path}` })),
  ]
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      }}
    />
  )
}
