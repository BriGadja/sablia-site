import { track } from '@vercel/analytics'
import { type FormEvent, useRef, useState } from 'react'
import { site } from '@/lib/site'

/**
 * The site's first contact form (A7, 2026-09-18). It posts to the Vercel function
 * `api/contact.ts`, which mails brice@sablia.io and writes a `sabcrm_leads` row. Anti-spam is a
 * honeypot plus a minimum delay, decided over a captcha: no third-party script, no friction for a
 * visitor who is about to describe a seminar.
 */

/** The four values the portal questionnaire already writes into `sabcrm_leads.team_size`. */
const TEAM_SIZES = [
  { value: 'je_suis_seul(e)', label: 'Je suis seul(e)' },
  { value: '2_à_5_personnes', label: '2 à 5 personnes' },
  { value: '6_à_20_personnes', label: '6 à 20 personnes' },
  { value: 'plus_de_20_personnes', label: 'Plus de 20 personnes' },
] as const

type FormState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success' }
  | { kind: 'error'; message: string }

const FIELD =
  'h-10 w-full rounded-md border border-hairline bg-canvas px-3.5 text-[15px] text-on-dark placeholder:text-on-dark-soft focus:border-primary focus:shadow-ring-coral focus:outline-none'
const LABEL = 'text-[13px] font-medium text-on-dark-body'

export default function ContactForm() {
  const [state, setState] = useState<FormState>({ kind: 'idle' })
  /** Set at the first client render, so the prerendered HTML never bakes a timestamp. */
  const mountedAt = useRef(Date.now())

  const fallback = `Le message n'est pas parti. Écrivez-nous directement à ${site.email}.`

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === 'pending') return
    const data = new FormData(event.currentTarget)
    setState({ kind: 'pending' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          company: String(data.get('company') ?? ''),
          email: String(data.get('email') ?? ''),
          teamSize: String(data.get('teamSize') ?? ''),
          message: String(data.get('message') ?? ''),
          website: String(data.get('website') ?? ''),
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      // 204 is what a bot gets. It sees the same thank-you as everyone else.
      if (response.status === 200 || response.status === 204) {
        track('contact_form', { status: 'sent' })
        setState({ kind: 'success' })
        return
      }
      if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        setState({ kind: 'error', message: body?.error ?? fallback })
        return
      }
      setState({ kind: 'error', message: fallback })
    } catch {
      setState({ kind: 'error', message: fallback })
    }
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-8">
      <h3 className="t-title-lg text-on-dark">Contactez-nous</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-on-dark-body">
        Séminaire, formation ou toute autre question&nbsp;: nous répondons par mail.
      </p>

      {state.kind === 'success' ? (
        <p
          data-state="success"
          role="status"
          className="mt-6 text-[15px] leading-relaxed text-on-dark"
        >
          Merci, votre demande est bien envoyée. Nous vous répondons par mail.
        </p>
      ) : (
        <form data-form="contact" onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-name" className={LABEL}>
              Nom
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={120}
              autoComplete="name"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-company" className={LABEL}>
              Société
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              required
              maxLength={160}
              autoComplete="organization"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-email" className={LABEL}>
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              className={FIELD}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-team-size" className={LABEL}>
              Taille de l'équipe
            </label>
            <select id="contact-team-size" name="teamSize" required className={FIELD}>
              {TEAM_SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {size.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="contact-message" className={LABEL}>
              Votre demande
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={3000}
              placeholder="Le contexte, la date envisagée, ce que vous attendez de l'intervention."
              className="min-h-[120px] w-full rounded-md border border-hairline bg-canvas px-3.5 py-2.5 text-[15px] leading-relaxed text-on-dark placeholder:text-on-dark-soft focus:border-primary focus:shadow-ring-coral focus:outline-none"
            />
          </div>

          {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Ne remplissez pas ce champ</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </div>

          <button
            type="submit"
            disabled={state.kind === 'pending'}
            className="t-button mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral disabled:opacity-60"
          >
            {state.kind === 'pending' ? 'Envoi en cours…' : 'Envoyer la demande'}
          </button>

          {state.kind === 'error' && (
            <p data-state="error" role="alert" className="text-[13px] leading-relaxed text-error">
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  )
}
