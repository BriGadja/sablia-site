import type { Metadata } from 'next'
import { loadList } from '@/components/ressources/data'
import { RessourceCard } from '@/components/ressources/RessourceCard'
import '@/components/ressources/ressources.css'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { FinBand } from '@/components/shell/FinBand'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  path: '/ressources',
  title: 'Ressources : les templates de nos vidéos — Sablia',
  description:
    "Chaque vidéo Sablia montre une automatisation en direct et laisse le workflow, le schéma et le mode d'emploi pour la refaire chez vous.",
})

/**
 * `/ressources`, rendered at build from `contenu_ressources` (anon key). Three states stay
 * distinct on screen: the list, « nothing yet » (normal until the first video) and « unreadable ».
 * Publishing a resource triggers a rebuild (`scripts/site-redeploy.py`).
 */
export default async function RessourcesPage() {
  const rows = await loadList()
  return (
    <>
      <main id="contenu" className="v2-ressources">
        <div className="wrap">
          <div className="v2-ressources-head">
            <Eyebrow>Ressources</Eyebrow>
            <h1>Les templates de nos vidéos</h1>
            <p className="v2-ressources-lead">
              Chaque vidéo montre une automatisation en direct et laisse derrière elle ce qu'il faut
              pour la refaire chez vous : le workflow, le schéma, le mode d'emploi.
            </p>
          </div>

          {rows === null && (
            <p data-state="unavailable" className="v2-ressources-state">
              La bibliothèque est momentanément indisponible. Réessayez dans un instant.
            </p>
          )}
          {rows !== null && rows.length === 0 && (
            <p data-state="empty" className="v2-ressources-state">
              Les premières ressources arrivent avec la première vidéo.
            </p>
          )}
          {rows !== null && rows.length > 0 && (
            <ul className="v2-ressources-list">
              {rows.map((row) => (
                <RessourceCard key={row.slug} row={row} />
              ))}
            </ul>
          )}
        </div>
      </main>
      <FinBand
        title="Trente minutes pour voir ce que ça donne chez vous."
        text="Vous nous montrez votre CRM, nous vous disons ce qui s'automatise."
      />
    </>
  )
}
