import Link from 'next/link'

/**
 * The Tuesday letter, offered once at the end of every `/ressources/<slug>` page (plan
 * sablia-newsletter-circuit-croissance, D7, US-84; copy = Brice's decision 5). Static HTML: a plain
 * link to `/newsletter?via=ressource-<slug>`, so the sign-up carries its source tag; no client JS.
 */
export const NEWSLETTER_CARD = {
  sentence: "Une idée concrète d'IA au travail, chaque mardi matin.",
  cta: 'Recevoir ma newsletter',
} as const

export function newsletterHref(slug: string): string {
  return `/newsletter?via=ressource-${slug}`
}

export default function NewsletterCard({ slug }: { slug: string }) {
  return (
    <aside className="v2-ressources-letter" data-card="newsletter" aria-label="La lettre du mardi">
      <svg
        className="v2-ressources-letter-mark"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
      <p>{NEWSLETTER_CARD.sentence}</p>
      <Link className="v2-ressources-letter-cta" href={newsletterHref(slug)}>
        {NEWSLETTER_CARD.cta}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </aside>
  )
}
