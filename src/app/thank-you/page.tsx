import Link from 'next/link'
import { Suspense } from 'react'
import { ThanksBody } from '@/components/legal/ThanksBody'
import { thanksCopy } from '@/components/legal/thanks-copy'
import { pageMetadata } from '@/lib/seo'
import '@/components/legal/thanks.css'

export const metadata = pageMetadata({
  path: '/thank-you',
  title: 'Merci — Sablia',
  description: 'Votre demande a bien été prise en compte.',
  noindex: true,
})

const fallback = thanksCopy(null)

export default function ThankYouPage() {
  return (
    <main id="contenu" className="v2-thanks">
      <div className="wrap">
        <div className="v2-thanks-in">
          <svg
            className="v2-thanks-mark"
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 3 3 5-6" />
          </svg>
          {/* The query is read in the browser only; the static HTML carries the generic thanks. */}
          <Suspense
            fallback={
              <>
                <h1>{fallback.title}</h1>
                <p className="v2-thanks-lead">{fallback.description}</p>
              </>
            }
          >
            <ThanksBody />
          </Suspense>
          <Link className="v2-thanks-home" href="/">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </main>
  )
}
