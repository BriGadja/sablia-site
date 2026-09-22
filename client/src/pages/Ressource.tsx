import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import RessourceForm from '@/components/ressources/RessourceForm'
import ScrollToTop from '@/components/ScrollToTop'
import { fetchRessource, type Ressource as RessourceRow } from '@/lib/contenu'

/**
 * `/ressources/{slug}` — one resource, read live from Supabase (NS-19, decision D7).
 *
 * This route is deliberately NOT prerendered: it is parametric, and the list it belongs to changes
 * with every video. It renders client-side and carries its own `<Helmet>`; an unknown slug is
 * `noindex`, so an unpublished resource never enters an index.
 *
 * The files sit behind the form, but the form captures the lead — it does not lock the file
 * (decision D8). The URLs it hands out are public and unguessable.
 */

interface RessourceProps {
  slug: string
}

type PageState =
  | { kind: 'loading' }
  | { kind: 'ready'; row: RessourceRow }
  | { kind: 'missing' }
  | { kind: 'unavailable' }

/** `corps_md` is our own prose, not visitor input: blank lines become paragraphs, nothing else. */
function paragraphs(markdown: string): { key: string; text: string; heading: boolean }[] {
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

export default function Ressource({ slug }: RessourceProps) {
  const [state, setState] = useState<PageState>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ kind: 'loading' })
    fetchRessource(slug).then((row) => {
      if (cancelled) return
      if (row === null) setState({ kind: 'unavailable' })
      else if (row === undefined) setState({ kind: 'missing' })
      else setState({ kind: 'ready', row })
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  const title = state.kind === 'ready' ? `${state.row.titre} — Sablia` : 'Ressource — Sablia'
  const indexable = state.kind === 'ready'

  return (
    <>
      <ScrollToTop />
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={`https://sablia.io/ressources/${slug}`} />
        {state.kind === 'ready' && state.row.resume && (
          <meta name="description" content={state.row.resume} />
        )}
        {!indexable && <meta name="robots" content="noindex" />}
      </Helmet>
      <TopNav />
      <main>
        <section className="relative pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-48">
          <div className="container-editorial">
            <div className="mx-auto max-w-3xl">
              <p className="t-caption-uppercase mb-6 text-on-dark-muted">
                <a href="/ressources" className="hover:text-on-dark">
                  Ressources
                </a>
              </p>

              {state.kind === 'loading' && (
                <p className="text-[15px] text-on-dark-muted">Chargement…</p>
              )}

              {state.kind === 'unavailable' && (
                <>
                  <h1 className="t-display-lg text-on-dark">Ressource indisponible</h1>
                  <p
                    data-state="unavailable"
                    className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-on-dark-body"
                  >
                    Nous n'arrivons pas à lire cette ressource pour le moment. Réessayez dans un
                    instant.
                  </p>
                </>
              )}

              {state.kind === 'missing' && (
                <>
                  <h1 className="t-display-lg text-on-dark">Cette ressource n'existe pas</h1>
                  <p
                    data-state="missing"
                    className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-on-dark-body"
                  >
                    Elle n'est pas encore publiée, ou le lien a changé.{' '}
                    <a href="/ressources" className="text-primary underline underline-offset-4">
                      Voir toutes les ressources
                    </a>
                    .
                  </p>
                </>
              )}

              {state.kind === 'ready' && (
                <>
                  <h1 className="t-display-lg text-on-dark">{state.row.titre}</h1>
                  {state.row.resume && (
                    <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-relaxed text-on-dark-body">
                      {state.row.resume}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {state.kind === 'ready' && (
          <section className="relative pb-24 md:pb-32">
            <div className="container-editorial">
              <div className="mx-auto flex max-w-3xl flex-col gap-12">
                <hr className="border-t border-hairline" />

                {state.row.youtube_id && (
                  <div className="aspect-video w-full max-w-full overflow-hidden rounded-xl border border-hairline">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${state.row.youtube_id}`}
                      title={state.row.titre}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full border-0"
                    />
                  </div>
                )}

                {state.row.corps_md && (
                  <div className="legal-prose">
                    {paragraphs(state.row.corps_md).map((block) =>
                      block.heading ? (
                        <h2 key={block.key} className="t-title-lg text-on-dark">
                          {block.text}
                        </h2>
                      ) : (
                        <p
                          key={block.key}
                          className="text-[15px] leading-relaxed text-on-dark-body"
                        >
                          {block.text}
                        </p>
                      ),
                    )}
                  </div>
                )}

                <RessourceForm slug={state.row.slug} titre={state.row.titre} />
              </div>
            </div>
          </section>
        )}
      </main>
      <FooterSection />
    </>
  )
}
