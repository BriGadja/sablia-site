import { Helmet } from "react-helmet-async";
import metaTags from "../../../docs/meta-tags.json";

/**
 * SEO Component - Manages meta-tags for all pages
 *
 * Loads SEO configuration from docs/meta-tags.json and applies:
 * - Title tags optimized for search engines
 * - Meta descriptions for SERP CTR
 * - Open Graph tags for social media sharing
 * - Twitter Card tags
 * - Structured data (JSON-LD) for rich snippets
 * - Canonical URLs
 *
 * @param page - Page path (e.g., "/", "/tarifs", "/gap")
 */

interface SEOProps {
  page: "/" | "/tarifs" | "/gap" | "/roi" | "/about" | "/mentions-legales" | "/politique-confidentialite" | "/cgv";
}

export default function SEO({ page }: SEOProps) {
  const pageData = metaTags.pages[page] as any;
  const meta = metaTags.meta;

  if (!pageData) {
    console.warn(`SEO: No meta-tags found for page "${page}"`);
    return null;
  }

  const title = pageData.titleTemplate
    ? pageData.titleTemplate.replace("%s", pageData.title)
    : pageData.title;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={pageData.description} />
      {pageData.keywords && (
        <meta name="keywords" content={pageData.keywords.join(", ")} />
      )}

      {/* Canonical URL */}
      {pageData.canonical && (
        <link rel="canonical" href={pageData.canonical} />
      )}

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
          {pageData.twitter.image && (
            <meta name="twitter:image" content={pageData.twitter.image} />
          )}
          {pageData.twitter.creator && (
            <meta name="twitter:creator" content={pageData.twitter.creator} />
          )}
          <meta name="twitter:site" content={meta.twitterHandle} />
        </>
      )}

      {/* Structured Data (JSON-LD) */}
      {pageData.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(pageData.structuredData)}
        </script>
      )}

      {/* Additional Global Meta Tags */}
      <meta name="author" content={meta.author} />
      <meta name="language" content={metaTags.globalMetaTags.language} />
      <meta httpEquiv="content-language" content="fr" />
      <meta name="revisit-after" content={metaTags.globalMetaTags["revisit-after"]} />
    </Helmet>
  );
}
