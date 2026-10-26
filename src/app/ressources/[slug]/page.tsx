import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { loadRessource, loadSlugParams } from '@/components/ressources/data'
import { posterPath } from '@/components/ressources/poster'
import { posterFor } from '@/components/ressources/RessourceCard'
import RessourceForm from '@/components/ressources/RessourceForm'
import VideoFacade from '@/components/VideoFacade'
import '@/components/ressources/ressources.css'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { VideoObjectJsonLd } from '@/components/seo/VideoObjectJsonLd'
import { pageMetadata } from '@/lib/seo'

/** Only the slugs published at build time exist; any other one is a real 404 until the next build. */
export const dynamicParams = false

export async function generateStaticParams() {
  return await loadSlugParams()
}

interface Props {
  params: Promise<{ slug: string }>
}

/** `corps_md` is our own prose, not visitor input: blank lines become paragraphs, `#` lines headings. */
function blocks(markdown: string): { key: string; text: string; heading: boolean }[] {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => ({
      key: `${index}-${block.slice(0, 24)}`,
      text: block.replace(/^#{1,6}\s+/, ''),
      heading: /^#{1,6}\s+/.test(block),
    }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const row = await loadRessource(slug)
  if (!row) return { title: 'Ressource introuvable' }
  return pageMetadata({
    path: `/ressources/${row.slug}`,
    title: `${row.titre} — Sablia`,
    description: row.resume ?? row.titre,
  })
}

/**
 * `/ressources/{slug}`: the video first (click-to-load facade, no iframe in the static HTML), the
 * resource body, then the form. The files sit behind the form, but the form captures the lead, it
 * does not lock the file (decision D8): their URLs never appear in the static HTML.
 */
export default async function RessourcePage({ params }: Props) {
  const { slug } = await params
  const row = await loadRessource(slug)
  if (!row) notFound()

  const poster = row.youtube_id ? posterPath(row.youtube_id) : null
  return (
    <main id="contenu" data-ready="true" className="v2-ressources">
      <BreadcrumbJsonLd
        items={[
          { name: 'Ressources', path: '/ressources' },
          { name: row.titre, path: `/ressources/${row.slug}` },
        ]}
      />
      {row.youtube_id && poster && row.published_at && (
        <VideoObjectJsonLd
          name={row.titre}
          description={row.resume ?? row.titre}
          youtubeId={row.youtube_id}
          uploadDate={row.published_at.slice(0, 10)}
          thumbnailPath={poster}
        />
      )}
      <div className="wrap">
        <div className="v2-ressources-head">
          <Link href="/ressources" className="v2-ressources-crumb">
            Ressources
          </Link>
          <h1>{row.titre}</h1>
          {row.resume && <p className="v2-ressources-lead">{row.resume}</p>}
        </div>

        <div className="v2-ressources-col">
          {row.youtube_id && (
            <VideoFacade
              youtubeId={row.youtube_id}
              title={row.titre}
              thumbnail={posterFor(row.youtube_id)}
            />
          )}
          {row.corps_md && (
            <div className="v2-ressources-body">
              {blocks(row.corps_md).map((block) =>
                block.heading ? (
                  <h2 key={block.key}>{block.text}</h2>
                ) : (
                  <p key={block.key}>{block.text}</p>
                ),
              )}
            </div>
          )}
          <RessourceForm slug={row.slug} titre={row.titre} />
        </div>
      </div>
    </main>
  )
}
