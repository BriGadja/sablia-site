import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Eyebrow } from '@/components/shell/Eyebrow'
import { MailText } from '@/components/webinaire/MailText'
import { MerciBooking } from '@/components/webinaire/MerciBooking'
import { BOOKING_URL, MERCI } from '@/content/webinaire'
import { pageMetadata } from '@/lib/seo'
import '@/components/webinaire/webinaire.css'

export const metadata = pageMetadata({
  path: '/webinaire/merci',
  title: MERCI.meta.title,
  description: MERCI.meta.description,
  noindex: true,
})

/**
 * `/webinaire/merci`: where the form lands (US-86). What happens next, in the order it happens: the
 * Google invitation, the two reminders, the start; then spam and how to leave. The booking line
 * shows only once the webinar's own booking link is set (`BOOKING_URL`, owner U8).
 */
export default function MerciPage() {
  return (
    <main id="contenu" className="v2-webinaire">
      <section id="top" className="wbn-after">
        <div className="wrap wbn-after-in">
          <svg
            className="wbn-after-mark"
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
          <Eyebrow>{MERCI.eyebrow}</Eyebrow>
          <h1>{MERCI.title}</h1>
          <p className="wbn-lede">{MERCI.lede}</p>

          <ol className="wbn-steps is-vertical">
            {MERCI.steps.map((step, index) => (
              <li key={step.key} style={{ '--i': String(index) } as CSSProperties}>
                <span className="wbn-step-dot" aria-hidden="true" />
                <span className="wbn-step-when">{step.when}</span>
                <span className="wbn-step-what">{step.what}</span>
              </li>
            ))}
          </ol>

          <div className="wbn-card wbn-after-notes">
            <p>
              <MailText text={MERCI.spam} />
            </p>
            <p>{MERCI.leave}</p>
          </div>

          <MerciBooking url={BOOKING_URL} />

          <Link className="wbn-home" href="/">
            {MERCI.home}
          </Link>
        </div>
      </section>
    </main>
  )
}
