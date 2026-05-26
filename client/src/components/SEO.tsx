import metaTags from '@docs/meta-tags.json'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  page: '/' | '/mentions-legales' | '/politique-confidentialite' | '/cgv' | '/thank-you' | 'home'
}

const breadcrumbConfig: Record<string, { name: string; position: number }[]> = {
  '/': [],
  '/mentions-legales': [
    { name: 'Accueil', position: 1 },
    { name: 'Mentions légales', position: 2 },
  ],
  '/politique-confidentialite': [
    { name: 'Accueil', position: 1 },
    { name: 'Politique de confidentialité', position: 2 },
  ],
  '/cgv': [
    { name: 'Accueil', position: 1 },
    { name: 'CGV', position: 2 },
  ],
}

function generateBreadcrumbSchema(page: string) {
  const breadcrumbs = breadcrumbConfig[page]
  if (!breadcrumbs || breadcrumbs.length === 0) return null
  const domain = metaTags.meta.domain
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.position === 1 ? `${domain}/` : `${domain}${page}`,
    })),
  }
}

export default function SEO({ page }: SEOProps) {
  const key = page === 'home' ? '/' : page
  const pageData = (metaTags.pages as Record<string, Record<string, any>>)[key]
  const meta = metaTags.meta

  if (!pageData) return null

  const title = pageData.titleTemplate
    ? (pageData.titleTemplate as string).replace('%s', pageData.title as string)
    : (pageData.title as string)

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={pageData.description as string} />
      {pageData.keywords && (
        <meta name="keywords" content={(pageData.keywords as string[]).join(', ')} />
      )}
      {pageData.canonical && <link rel="canonical" href={pageData.canonical as string} />}
      {pageData.robots ? (
        <meta name="robots" content={pageData.robots as string} />
      ) : (
        <meta name="robots" content={metaTags.globalMetaTags.robots} />
      )}
      <meta name="googlebot" content={metaTags.globalMetaTags.googlebot} />

      {pageData.openGraph && (
        <meta property="og:type" content={(pageData.openGraph as Record<string, string>).type} />
      )}
      {pageData.openGraph && (
        <meta property="og:url" content={(pageData.openGraph as Record<string, string>).url} />
      )}
      {pageData.openGraph && (
        <meta property="og:title" content={(pageData.openGraph as Record<string, string>).title} />
      )}
      {pageData.openGraph && (pageData.openGraph as Record<string, string>).description && (
        <meta
          property="og:description"
          content={(pageData.openGraph as Record<string, string>).description}
        />
      )}
      {pageData.openGraph && (
        <meta
          property="og:site_name"
          content={(pageData.openGraph as Record<string, string>).siteName || meta.siteName}
        />
      )}
      {pageData.openGraph && (pageData.openGraph as Record<string, string>).image && (
        <meta property="og:image" content={(pageData.openGraph as Record<string, string>).image} />
      )}
      {pageData.openGraph && <meta property="og:locale" content={meta.locale} />}

      {pageData.twitter && (
        <meta name="twitter:card" content={(pageData.twitter as Record<string, string>).card} />
      )}
      {pageData.twitter && (
        <meta name="twitter:title" content={(pageData.twitter as Record<string, string>).title} />
      )}
      {pageData.twitter && (
        <meta
          name="twitter:description"
          content={(pageData.twitter as Record<string, string>).description}
        />
      )}
      {pageData.twitter && <meta name="twitter:site" content={meta.twitterHandle} />}

      {pageData.structuredData && (
        <script type="application/ld+json">{JSON.stringify(pageData.structuredData)}</script>
      )}
      {generateBreadcrumbSchema(key) && (
        <script type="application/ld+json">{JSON.stringify(generateBreadcrumbSchema(key))}</script>
      )}

      <meta name="author" content={meta.author} />
      <meta name="language" content={metaTags.globalMetaTags.language} />
      <meta httpEquiv="content-language" content="fr" />
      <meta name="revisit-after" content={metaTags.globalMetaTags['revisit-after']} />
    </Helmet>
  )
}
