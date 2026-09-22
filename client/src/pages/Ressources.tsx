import { useEffect, useState } from 'react'
import FooterSection from '@/components/landing/FooterSection'
import TopNav from '@/components/landing/TopNav'
import ScrollToTop from '@/components/ScrollToTop'
import SEO from '@/components/SEO'
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
                  {state.rows.map((row) => {
                    const date = formatDate(row.published_at)
                    return (
                      <li key={row.slug}>
                        <a
                          href={`/ressources/${row.slug}`}
                          className="block rounded-xl border border-hairline bg-surface-card p-6 transition-colors duration-base hover:border-primary"
                        >
                          <h2 className="t-title-lg text-on-dark">{row.titre}</h2>
                          {row.resume && (
                            <p className="mt-2 text-[15px] leading-relaxed text-on-dark-body">
                              {row.resume}
                            </p>
                          )}
                          {date && (
                            <p className="t-caption-uppercase mt-4 text-on-dark-muted">{date}</p>
                          )}
                        </a>
                      </li>
                    )
                  })}
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
