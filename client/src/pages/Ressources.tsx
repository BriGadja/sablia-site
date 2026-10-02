import { cva } from 'class-variance-authority'
import { useEffect, useState } from 'react'
import { ArrowRight } from '@/components/icons/lucide-crm'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
import VideoFacade from '@/components/VideoFacade'
import { fetchRessources, type RessourceSummary } from '@/lib/contenu'

/**
 * `/ressources` — the library of what our videos give away (NS-19, decision D7).
 *
 * The list is read live from Supabase with the anon key, so publishing a resource never requires
 * a deploy. Three states, and they are genuinely different on screen: loading, "nothing published
 * yet" (the normal state until the first video goes out) and "we could not read it".
 */

type ListState =
  | { kind: 'loading' }
  | { kind: 'ready'; rows: RessourceSummary[] }
  | { kind: 'unavailable' }

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const card = cva(
  'grid gap-4 rounded-xl border border-hairline bg-surface-card p-3 transition-colors duration-base hover:border-primary sm:gap-5 sm:p-4',
  { variants: { video: { true: 'sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]', false: '' } } },
)

/**
 * One resource: its video on the left, so a visitor who lands here without having seen the videos
 * finds them (Brice, 2026-10-02), and on the right the title, the summary and the way in. The
 * thumbnail comes from YouTube's image server: resources are published without a deploy, so there
 * is no local copy to serve. Without a video the card keeps its text alone.
 */
function RessourceCard({ row }: { row: RessourceSummary }) {
  const date = formatDate(row.published_at)
  return (
    <li className={card({ video: row.youtube_id !== null })}>
      {row.youtube_id && (
        <div className="min-w-0 self-center">
          <VideoFacade
            youtubeId={row.youtube_id}
            title={row.titre}
            thumbnail={{
              src: `https://i.ytimg.com/vi/${row.youtube_id}/sddefault.jpg`,
              width: 640,
              height: 480,
            }}
            size="compact"
          />
        </div>
      )}
      <a
        href={`/ressources/${row.slug}`}
        className="group flex min-w-0 flex-col px-2 py-1 sm:px-1 sm:pr-2"
      >
        <h2 className="text-[1.125rem] font-medium leading-snug text-on-dark">{row.titre}</h2>
        {row.resume && (
          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-on-dark-body">
            {row.resume}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          {date && <span className="t-caption-uppercase text-on-dark-muted">{date}</span>}
          <span className="t-button ml-auto inline-flex h-9 items-center gap-1.5 rounded-md bg-primary-active px-4 text-on-primary hover:bg-primary-hover active:bg-primary-hover group-hover:bg-primary-hover transition-shadow duration-base hover:shadow-glow-coral">
            Voir la ressource <ArrowRight size={15} />
          </span>
        </div>
      </a>
    </li>
  )
}

export default function Ressources() {
  const [state, setState] = useState<ListState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchRessources().then((rows) => {
      if (cancelled) return
      setState(rows === null ? { kind: 'unavailable' } : { kind: 'ready', rows })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      <SEO page="/ressources" />
      <TopNav />
      <main>
        <section className="relative pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-48">
          <div className="container-editorial">
            <div className="mx-auto max-w-3xl">
              <p className="t-caption-uppercase mb-6 text-on-dark-muted">Ressources</p>
              <h1 className="t-display-lg text-on-dark">
                Les templates et les schémas de nos vidéos
              </h1>
              <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-on-dark-body">
                Chaque vidéo montre une automatisation en direct et laisse derrière elle ce qu'il
                faut pour la refaire chez vous : le workflow, le schéma, le mode d'emploi.
              </p>
            </div>
          </div>
        </section>

        <section className="relative pb-24 md:pb-32">
          <div className="container-editorial">
            <div className="mx-auto max-w-3xl">
              <hr className="mb-12 border-t border-hairline" />

              {state.kind === 'loading' && (
                <p className="text-[15px] text-on-dark-muted">Chargement…</p>
              )}

              {state.kind === 'unavailable' && (
                <p data-state="unavailable" className="text-[15px] text-on-dark-body">
                  La bibliothèque est momentanément indisponible. Réessayez dans un instant.
                </p>
              )}

              {state.kind === 'ready' && state.rows.length === 0 && (
                <p data-state="empty" className="text-[15px] text-on-dark-body">
                  Les premières ressources arrivent avec la première vidéo.
                </p>
              )}

              {state.kind === 'ready' && state.rows.length > 0 && (
                <ul className="flex flex-col gap-4">
                  {state.rows.map((row) => (
                    <RessourceCard key={row.slug} row={row} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </>
  )
}
