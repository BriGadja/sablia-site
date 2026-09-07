import metaTags from '@docs/meta-tags.json'
import { Helmet } from 'react-helmet-async'

interface SEOProps {
  page:
    | '/'
    | '/mentions-legales'
    | '/politique-confidentialite'
    | '/cgv'
    | '/guides/integrer-l-ia-dans-votre-entreprise'
    | '/offres/compte-rendu-appel'
    | '/thank-you'
    | 'home'
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
  '/guides/integrer-l-ia-dans-votre-entreprise': [
    { name: 'Accueil', position: 1 },
    { name: "Intégrer l'IA dans votre entreprise", position: 2 },
  ],
  '/offres/compte-rendu-appel': [
    { name: 'Accueil', position: 1 },
    { name: 'Le CRM qui se remplit tout seul après chaque appel', position: 2 },
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
  const pageData = (metaTags.pages as Record<string, Record<string, unknown>>)[key]
  const meta = metaTags.meta

  if (!pageData) return null

  // meta-tags.json is untyped JSON: narrow once here rather than casting at every use site.
  const titleTemplate = pageData.titleTemplate as string | undefined
  const rawTitle = pageData.title as string
  const description = pageData.description as string
  const keywords = pageData.keywords as string[] | undefined
  const canonical = pageData.canonical as string | undefined
  const robots = pageData.robots as string | undefined
  const openGraph = pageData.openGraph as Record<string, string> | undefined
  const twitter = pageData.twitter as Record<string, string> | undefined
  const structuredData = pageData.structuredData as Record<string, unknown> | undefined
  const breadcrumbSchema = generateBreadcrumbSchema(key)

  const title = titleTemplate ? titleTemplate.replace('%s', rawTitle) : rawTitle

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={robots ?? metaTags.globalMetaTags.robots} />
      <meta name="googlebot" content={metaTags.globalMetaTags.googlebot} />

      {openGraph && <meta property="og:type" content={openGraph.type} />}
      {openGraph && <meta property="og:url" content={openGraph.url} />}
      {openGraph && <meta property="og:title" content={openGraph.title} />}
      {openGraph?.description && <meta property="og:description" content={openGraph.description} />}
      {openGraph && <meta property="og:site_name" content={openGraph.siteName || meta.siteName} />}
      {openGraph?.image && <meta property="og:image" content={openGraph.image} />}
      {openGraph && <meta property="og:locale" content={meta.locale} />}

      {twitter && <meta name="twitter:card" content={twitter.card} />}
      {twitter && <meta name="twitter:title" content={twitter.title} />}
      {twitter && <meta name="twitter:description" content={twitter.description} />}
      {twitter && <meta name="twitter:site" content={meta.twitterHandle} />}

      {structuredData && (
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}

      <meta name="author" content={meta.author} />
      <meta name="language" content={metaTags.globalMetaTags.language} />
      <meta httpEquiv="content-language" content="fr" />
      <meta name="revisit-after" content={metaTags.globalMetaTags['revisit-after']} />
    </Helmet>
  )
}
