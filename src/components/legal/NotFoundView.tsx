import Link from 'next/link'
import { Eyebrow } from '@/components/shell/Eyebrow'
import './notfound.css'

/** The 404 page in the charte (app/not-found.tsx is a thin wrapper). Next adds `noindex` to not-found responses. */
export function NotFoundView() {
  return (
    <main id="contenu" className="v2-notfound">
      <div className="wrap">
        <div className="v2-notfound-in">
          <Eyebrow>Erreur 404</Eyebrow>
          <h1>Page introuvable</h1>
          <p>Cette adresse ne mène à rien, ou plus à rien.</p>
          <div className="v2-notfound-actions">
            <Link className="v2-notfound-home" href="/">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
