import { Helmet } from 'react-helmet-async'
import metaTags from '../../../docs/meta-tags.json'

/**
 * SEO Component - Manages meta-tags for all pages
 *
 * Loads SEO configuration from docs/meta-tags.json and applies:
 * - Title tags optimized for search engines
 * - Meta descriptions for SERP CTR
 * - Open Graph tags for social media sharing
 * - Twitter Card tags
 * - Structured data (JSON-LD) for rich snippets
 * - BreadcrumbList schema for navigation context
 * - Canonical URLs
 *
 * @param page - Page path (e.g., "/", "/tarifs", "/gap")
 */

interface SEOProps {
  page:
    | '/'
    | '/tarifs'
    | '/gap'
    | '/roi'
    | '/about'
    | '/mentions-legales'
    | '/politique-confidentialite'
    | '/cgv'
    | '/faq'
    | '/cas-clients'
}

// Breadcrumb configuration for each page
const breadcrumbConfig: Record<string, { name: string; position: number }[]> = {
  '/': [],
  '/tarifs': [
    { name: 'Accueil', position: 1 },
    { name: 'Tarifs', position: 2 },
  ],
  '/gap': [
    { name: 'Accueil', position: 1 },
    { name: 'Analyse GAP', position: 2 },
  ],
  '/roi': [
    { name: 'Accueil', position: 1 },
    { name: 'Calculateur ROI', position: 2 },
  ],
  '/about': [
    { name: 'Accueil', position: 1 },
    { name: 'À propos', position: 2 },
  ],
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
  '/faq': [
    { name: 'Accueil', position: 1 },
    { name: 'FAQ', position: 2 },
  ],
  '/cas-clients': [
    { name: 'Accueil', position: 1 },
    { name: 'Cas clients', position: 2 },
  ],
}

/**
 * Generates BreadcrumbList structured data for SEO
 */
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
  const pageData = (metaTags.pages as Record<string, any>)[page]
  const meta = metaTags.meta

  if (!pageData) {
    console.warn(`SEO: No meta-tags found for page "${page}"`)
    return null
  }

  const title = pageData.titleTemplate
    ? pageData.titleTemplate.replace('%s', pageData.title)
    : pageData.title

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={pageData.description} />
      {pageData.keywords && <meta name="keywords" content={pageData.keywords.join(', ')} />}

      {/* Canonical URL */}
      {pageData.canonical && <link rel="canonical" href={pageData.canonical} />}

      {/* Robots */}
      {pageData.robots ? (
        <meta name="robots" content={pageData.robots} />
      ) : (
        <meta name="robots" content={metaTags.globalMetaTags.robots} />
      )}
      <meta name="googlebot" content={metaTags.globalMetaTags.googlebot} />

      {/* Open Graph / Facebook */}
      {pageData.openGraph && (
        <>
          <meta property="og:type" content={pageData.openGraph.type} />
          <meta property="og:url" content={pageData.openGraph.url} />
          <meta property="og:title" content={pageData.openGraph.title} />
          {pageData.openGraph.description && (
            <meta property="og:description" content={pageData.openGraph.description} />
          )}
          <meta property="og:site_name" content={pageData.openGraph.siteName || meta.siteName} />
          {pageData.openGraph.image && (
            <>
              <meta property="og:image" content={pageData.openGraph.image} />
              {pageData.openGraph.imageAlt && (
                <meta property="og:image:alt" content={pageData.openGraph.imageAlt} />
              )}
            </>
          )}
          <meta property="og:locale" content={meta.locale} />
        </>
      )}

      {/* Twitter */}
      {pageData.twitter && (
        <>
          <meta name="twitter:card" content={pageData.twitter.card} />
          <meta name="twitter:url" content={pageData.openGraph?.url || meta.domain + page} />
          <meta name="twitter:title" content={pageData.twitter.title} />
          <meta name="twitter:description" content={pageData.twitter.description} />
          {pageData.twitter.image && <meta name="twitter:image" content={pageData.twitter.image} />}
          {pageData.twitter.creator && (
            <meta name="twitter:creator" content={pageData.twitter.creator} />
          )}
          <meta name="twitter:site" content={meta.twitterHandle} />
        </>
      )}

      {/* Structured Data (JSON-LD) */}
      {pageData.structuredData && (
        <script type="application/ld+json">{JSON.stringify(pageData.structuredData)}</script>
      )}

      {/* BreadcrumbList Schema */}
      {generateBreadcrumbSchema(page) && (
        <script type="application/ld+json">{JSON.stringify(generateBreadcrumbSchema(page))}</script>
      )}

      {/* Additional Global Meta Tags */}
      <meta name="author" content={meta.author} />
      <meta name="language" content={metaTags.globalMetaTags.language} />
      <meta httpEquiv="content-language" content="fr" />
      <meta name="revisit-after" content={metaTags.globalMetaTags['revisit-after']} />
    </Helmet>
  )
}
