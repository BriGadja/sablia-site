'use client'

import { useEffect } from 'react'

export default function ErrorPage({
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
    <main
      id="contenu"
      style={{ maxWidth: 640, margin: '0 auto', padding: '96px 16px 120px', color: '#131620' }}
    >
      <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: '0 0 16px' }}>
        Un incident est survenu
      </h1>
      <p style={{ fontSize: 17, lineHeight: 1.5, color: '#3A3F4D', margin: '0 0 28px' }}>
        La page n&apos;a pas pu s&apos;afficher. Vous pouvez réessayer, ou revenir à l&apos;accueil.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        style={{
          minHeight: 44,
          padding: '0 20px',
          borderRadius: 12,
          border: '1px solid #131620',
          background: '#131620',
          color: '#FFFFFF',
          font: 'inherit',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        Réessayer
      </button>{' '}
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: 44,
          marginLeft: 12,
          fontWeight: 500,
        }}
      >
        Retour à l&apos;accueil
      </a>
    </main>
  )
}
