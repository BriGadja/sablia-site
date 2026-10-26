import type { Metadata } from 'next'
import Link from 'next/link'

// Next injects `noindex` into not-found responses itself.
export const metadata: Metadata = { title: 'Page introuvable' }

export default function NotFound() {
  return (
    <main
      id="contenu"
      style={{ maxWidth: 640, margin: '0 auto', padding: '96px 16px 120px', color: '#131620' }}
    >
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          color: '#61677A',
          margin: 0,
        }}
      >
        Erreur 404
      </p>
      <h1 style={{ fontSize: 36, lineHeight: 1.15, margin: '12px 0 16px' }}>Page introuvable</h1>
      <p style={{ fontSize: 17, lineHeight: 1.5, color: '#3A3F4D', margin: '0 0 28px' }}>
        Cette adresse ne mène à rien, ou plus à rien.
      </p>
      <Link
        href="/"
        style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, fontWeight: 500 }}
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  )
}
