import metaTags from '@docs/meta-tags.json'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'wouter'
import { ArrowRight } from '@/components/icons/lucide-crm'
import { openBookingUrl } from '@/components/landing/BookingModal'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import { euros } from '@/components/offre/format'
import ScrollToTop from '@/components/ScrollToTop'
import { CRM_PAGES, isCrmSlug } from '@/content/crm'
import {
  type CrmPageContent,
  crmBreadcrumbSchema,
  crmFaqSchema,
  crmServiceSchema,
  type PublishedCrmPage,
} from '@/content/crm/schema'
import { OF1_BOOKING_URL, OF1_ROUTE, of1 } from '@/content/of1'
import NotFound from './not-found'

interface CrmPageProps {
  /** The route param. Unknown or draft: the standard NotFound body, nothing else. */
  slug?: string
  /** Tests inject a page (the published fixture); the router passes `slug`. */
  content?: CrmPageContent
}

const SITE = 'https://sablia.io'

function PublishedView({ page }: { page: PublishedCrmPage }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const blocks = [page.where, page.followUp, page.prerequisites, page.pitfall] as const
  const pills = [
    `${euros(of1.price.oneShotHt)} € HT`,
    `${of1.price.monthlyHt} €/mois de supervision, premier mois offert`,
    `Livré en ${of1.delay.days} jours`,
  ]

  return (
    <>
      <Helmet>
        <title>{page.seo.title}</title>
        <meta name="title" content={page.seo.title} />
        <meta name="description" content={page.seo.description} />
        <link rel="canonical" href={`${SITE}${page.path}`} />
        <meta name="robots" content={metaTags.globalMetaTags.robots} />
        <meta name="googlebot" content={metaTags.globalMetaTags.googlebot} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}${page.path}`} />
        <meta property="og:title" content={page.seo.title} />
        <meta property="og:description" content={page.seo.description} />
        <meta property="og:locale" content={metaTags.meta.locale} />
        <meta httpEquiv="content-language" content="fr" />
        <script type="application/ld+json">{JSON.stringify(crmServiceSchema(page))}</script>
        <script type="application/ld+json">{JSON.stringify(crmFaqSchema(page))}</script>
        <script type="application/ld+json">{JSON.stringify(crmBreadcrumbSchema(page))}</script>
      </Helmet>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
        <TopNav
          tone="light"
          current={OF1_ROUTE}
          bookingUrl={OF1_BOOKING_URL}
          ctaLabel="Réserver 30 min"
        />
        <main>
          <section className="bg-surface-light px-8 pb-16 pt-section">
            <div className="mx-auto max-w-[820px]">
              <div className="eyebrow mb-6 inline-flex items-center gap-2 text-primary-active">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Compte rendu d'appel · {page.crm}
              </div>
              <h1 className="t-display-xl text-ink [text-wrap:balance]">{page.hero.title}</h1>
              <p className="mt-6 max-w-[620px] text-lg leading-relaxed text-body">
                {page.hero.lead}
              </p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {pills.map((pill) => (
                  <li
                    key={pill}
                    className="t-caption whitespace-nowrap rounded-pill border border-hairline-light bg-white px-3.5 py-2 text-ink"
                  >
                    {pill}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <button
                  type="button"
                  onClick={() => openBookingUrl(OF1_BOOKING_URL)}
                  className="t-button inline-flex h-11 items-center gap-2 rounded-md bg-primary-active px-5 text-on-primary hover:bg-primary-hover active:bg-primary-hover transition-shadow duration-base hover:shadow-glow-coral"
                >
                  Réserver 30 minutes avec Brice <ArrowRight size={16} />
                </button>
              </div>
              {page.proofLine ? (
                <p className="mt-8 max-w-[620px] border-l-2 border-primary pl-5 text-[17px] leading-relaxed text-ink">
                  {page.proofLine}
                </p>
              ) : null}
            </div>
          </section>

          <section className="border-t border-hairline-light bg-surface-light px-8 py-section">
            <div className="mx-auto max-w-[820px]">
              <h2 className="t-display-lg text-ink [text-wrap:balance]">
                Ce qui est propre à {page.crm}
              </h2>
              <div className="mt-10 flex flex-col gap-10">
                {blocks.map((block) => (
                  <div
                    key={block.heading}
                    className={
                      block === page.pitfall ? 'border-l-4 border-primary bg-white p-6' : undefined
                    }
                  >
                    <h3 className="t-title-sm text-ink">{block.heading}</h3>
                    <p className="mt-3 text-[17px] leading-relaxed text-body">{block.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-hairline-light bg-surface-light px-8 py-section">
            <div className="mx-auto max-w-[820px]">
              <h2 className="t-display-md text-ink [text-wrap:balance]">
                Ce que la documentation officielle de {page.crm} établit
              </h2>
              <ul data-testid="facts-cards" className="mt-8 space-y-4 sm:hidden">
                {page.facts.map((fact) => (
                  <li
                    key={fact.sourceId}
                    className="rounded-lg border border-hairline-light bg-white p-5"
                  >
                    <p className="font-medium text-ink">{fact.label}</p>
                    <p className="mt-2 leading-relaxed text-body">{fact.value}</p>
                    <p className="mt-3 text-[15px] text-muted-text [overflow-wrap:anywhere]">
                      Source :{' '}
                      <a
                        href={fact.sourceUrl}
                        rel="noreferrer"
                        target="_blank"
                        className="text-primary-active underline underline-offset-4"
                      >
                        {new URL(fact.sourceUrl).host}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-8 hidden overflow-x-auto rounded-lg border border-hairline-light bg-white sm:block">
                <table className="w-full border-collapse text-left text-[15px]">
                  <thead>
                    <tr className="border-b border-hairline-light">
                      <th scope="col" className="t-caption-uppercase px-5 py-3 text-muted-text">
                        Point
                      </th>
                      <th scope="col" className="t-caption-uppercase px-5 py-3 text-muted-text">
                        Dans {page.crm}
                      </th>
                      <th scope="col" className="t-caption-uppercase px-5 py-3 text-muted-text">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.facts.map((fact) => (
                      <tr
                        key={fact.sourceId}
                        className="border-b border-hairline-light last:border-b-0"
                      >
                        <th scope="row" className="px-5 py-4 align-top font-medium text-ink">
                          {fact.label}
                        </th>
                        <td className="px-5 py-4 align-top leading-relaxed text-body">
                          {fact.value}
                        </td>
                        <td className="px-5 py-4 align-top">
                          <a
                            href={fact.sourceUrl}
                            rel="noreferrer"
                            target="_blank"
                            className="whitespace-nowrap text-primary-active underline underline-offset-4"
                          >
                            {new URL(fact.sourceUrl).host}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="border-t border-hairline-light bg-surface-light px-8 py-section">
            <div className="mx-auto max-w-[820px]">
              <h2 className="t-display-md text-ink">Prix, délai, garantie</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-body">
                {euros(of1.price.oneShotHt)} € HT à l'installation, livré sous {of1.delay.days}{' '}
                jours calendaires à compter de la réception de vos accès. {of1.guarantee}
              </p>
              <p className="mt-5">
                <Link href={OF1_ROUTE} className="text-primary-active underline underline-offset-4">
                  Voir l'offre complète
                </Link>
              </p>
            </div>
          </section>

          <section className="border-t border-hairline-light bg-surface-light px-8 py-section">
            <div className="mx-auto max-w-[820px]">
              <h2 className="t-display-md text-ink">Les questions que vous vous posez</h2>
              <div className="mt-8 flex flex-col gap-8">
                {page.faq.map((item) => (
                  <div key={item.q}>
                    <h3 className="t-title-sm text-ink">{item.q}</h3>
                    <p className="mt-3 text-[16px] leading-relaxed text-body">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
        <FooterSection />
        <ScrollToTop />
      </motion.div>
    </>
  )
}

/**
 * A draft or unknown route answers with the standard NotFound body and `noindex`, never with the
 * internal `draftReason`: wording written for the team must not become public. The prerender
 * skips draft routes (scripts/seo/routes.mjs), so no static file exists for them either.
 */
export default function CrmPage({ slug, content }: CrmPageProps) {
  const page = content ?? (slug && isCrmSlug(slug) ? CRM_PAGES[slug] : undefined)

  if (!page || page.status !== 'published') {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <NotFound />
      </>
    )
  }
  return <PublishedView page={page} />
}
