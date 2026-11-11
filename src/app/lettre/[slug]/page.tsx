import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { articleSchema } from '@/components/lettre/article-schema'
import { LETTRE } from '@/components/lettre/content'
import { loadLettre, loadLettreParams } from '@/components/lettre/data'
import { parisDate } from '@/components/lettre/date'
import { LettreBody } from '@/components/lettre/LettreBody'
import '@/components/lettre/lettre.css'
import { posterPath } from '@/components/ressources/poster'
import { posterFor } from '@/components/ressources/RessourceCard'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { FOUNDER } from '@/components/seo/OrganizationJsonLd'
import { Cta } from '@/components/shell/Cta'
import { Eyebrow } from '@/components/shell/Eyebrow'
import VideoFacade from '@/components/VideoFacade'
import { frenchSpacing } from '@/lib/format'
import { pageMetadata } from '@/lib/seo'

/** Only the issues published at build time exist; any other slug is a real 404 until the next build. */
export const dynamicParams = false

export async function generateStaticParams() {
  return await loadLettreParams()
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lettre = await loadLettre(slug)
  if (!lettre) return { title: LETTRE.missingTitle }
  return pageMetadata({
    path: `/lettre/${lettre.slug}`,
    title: `${lettre.titre} · Sablia`,
    description: lettre.resume,
  })
}

/**
 * `/lettre/{slug}` (US-101): one Tuesday letter as a reading page. The title, the résumé as lede, the
 * byline with the send date (the same instant as `datePublished`), the week's video behind its
 * click-to-play facade, the body, then one way to subscribe. Rendered at build from
 * `contenu_lettres`, which the hub's send command writes after the mail left.
 */
export default async function LettrePage({ params }: Props) {
  const { slug } = await params
  const lettre = await loadLettre(slug)
  if (!lettre) notFound()

  const poster = lettre.youtube_id ? posterPath(lettre.youtube_id) : null
  return (
    <main id="contenu" data-ready="true" className="v2-lettre">
      <BreadcrumbJsonLd
        items={[
          { name: 'Newsletter', path: '/newsletter' },
          { name: lettre.titre, path: `/lettre/${lettre.slug}` },
        ]}
      />
      <JsonLd data={articleSchema(lettre, poster)} />
      <div className="wrap">
        <article className="lt-col">
          <header className="lt-head">
            <Eyebrow>{LETTRE.eyebrow}</Eyebrow>
            <h1>{frenchSpacing(lettre.titre)}</h1>
            <p className="lt-lede">{frenchSpacing(lettre.resume)}</p>
            <p className="lt-byline">
              {`${LETTRE.byline.by} `}
              <Link href="/#derriere">{FOUNDER.name}</Link>
              {`, ${LETTRE.byline.on} `}
              <time dateTime={lettre.published_at}>{parisDate(lettre.published_at)}</time>
            </p>
            <span className="lt-rule" aria-hidden="true" />
          </header>
          {lettre.youtube_id && (
            <div className="lt-video">
              <VideoFacade
                youtubeId={lettre.youtube_id}
                title={lettre.titre}
                thumbnail={posterFor(lettre.youtube_id)}
              />
            </div>
          )}
          <LettreBody markdown={lettre.corps_md} />
        </article>
      </div>
      <section id="abonnement" className="lt-sub">
        <div className="wrap">
          <div className="lt-sub-card">
            <p>{LETTRE.abonnement.text}</p>
            <Cta href="/newsletter" size="lg" arrow>
              {LETTRE.abonnement.label}
            </Cta>
          </div>
        </div>
      </section>
    </main>
  )
}
