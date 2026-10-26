'use client'

// Client component: error boundaries and their retry button are client-only.
import { useEffect } from 'react'
import './notfound.css'

export function ErrorView({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="contenu" className="v2-notfound">
      <div className="wrap">
        <div className="v2-notfound-in">
          <h1>Un incident est survenu</h1>
          <p>
            La page n&apos;a pas pu s&apos;afficher. Vous pouvez réessayer, ou revenir à
            l&apos;accueil.
          </p>
          <div className="v2-notfound-actions">
            <button type="button" className="v2-notfound-retry" onClick={() => retry()}>
              Réessayer
            </button>
            {/* A plain anchor: a broken client tree must not be asked to navigate softly. */}
            <a className="v2-notfound-home" href="/">
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
