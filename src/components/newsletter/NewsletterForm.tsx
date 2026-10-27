'use client' // form state, fetch, the mount timestamp and the token read from the address

import Link from 'next/link'
import { type FormEvent, useEffect, useRef, useState } from 'react'
import { formError, formSuccess } from '@/lib/events'
import { site } from '@/lib/site'

/**
 * The form of `/newsletter` and the landing of its two token links (plan sablia-newsletter-resend, C3).
 *
 * - No query: prénom + email → `POST /api/newsletter {kind:'request'}`. The answer is the same for a
 *   new, a subscribed and an opposed address, so the screen says « if this address is not already
 *   subscribed »; a bot answered 204 sees it too.
 * - `?c=<token>` (confirmation mail) or `?t=<token>` (invitation): a button. NOTHING is posted on load,
 *   so a mail scanner that opens the link subscribes nobody. The token is read with
 *   `window.location.search` in an effect (`useSearchParams` would need a Suspense boundary on a static
 *   page) and dropped from the address at once; Umami already ignores query strings (`analytics.ts`).
 *
 * Anti-spam is the honeypot plus the minimum delay of the other forms: no third-party script.
 */

type TokenAction = 'confirm' | 'invite'

type View =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'token'; action: TokenAction; token: string; sending: boolean; failed: boolean }
  | { kind: 'pending' }
  | { kind: 'subscribed'; prenom: string | null }
  | { kind: 'busy' }
  | { kind: 'stale' }
  | { kind: 'error' }

const FIRST_ISSUE = 'Premier numéro mardi 3 novembre.'

/** Reads `?c=` / `?t=` once, then removes them from the address bar and the history entry. */
function takeToken(): { action: TokenAction; token: string } | null {
  const params = new URLSearchParams(window.location.search)
  const confirm = params.get('c')
  const invite = params.get('t')
  if (!confirm && !invite) return null
  params.delete('c')
  params.delete('t')
  const rest = params.toString()
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${rest ? `?${rest}` : ''}${window.location.hash}`,
  )
  return confirm ? { action: 'confirm', token: confirm } : { action: 'invite', token: invite ?? '' }
}

export default function NewsletterForm() {
  const [view, setView] = useState<View>({ kind: 'idle' })
  /** Set at the first client render, so the prerendered HTML never bakes a timestamp. */
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    const found = takeToken()
    if (found) setView({ kind: 'token', ...found, sending: false, failed: false })
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (view.kind === 'sending') return
    const data = new FormData(event.currentTarget)
    setView({ kind: 'sending' })
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'request',
          prenom: String(data.get('prenom') ?? ''),
          email: String(data.get('email') ?? ''),
          website: String(data.get('website') ?? ''),
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })
      if (response.status === 200 || response.status === 204) {
        formSuccess('newsletter')
        setView({ kind: 'pending' })
        return
      }
      const body = (await response.json().catch(() => null)) as { code?: string } | null
      formError('newsletter', body?.code ?? `http_${response.status}`)
      setView(response.status === 429 ? { kind: 'busy' } : { kind: 'error' })
    } catch {
      formError('newsletter', 'network')
      setView({ kind: 'error' })
    }
  }

  async function onConfirm() {
    if (view.kind !== 'token' || view.sending) return
    const { action, token } = view
    setView({ ...view, sending: true, failed: false })
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: action, token }),
      })
      if (response.status === 200) {
        const body = (await response.json().catch(() => null)) as { prenom?: string } | null
        formSuccess(`newsletter_${action}`)
        setView({ kind: 'subscribed', prenom: body?.prenom ?? null })
        return
      }
      const body = (await response.json().catch(() => null)) as { code?: string } | null
      formError(`newsletter_${action}`, body?.code ?? `http_${response.status}`)
      // 404 and 410 read the same: the page never says whether an address opposed.
      if (response.status === 404 || response.status === 410) setView({ kind: 'stale' })
      else setView({ kind: 'token', action, token, sending: false, failed: true })
    } catch {
      formError(`newsletter_${action}`, 'network')
      setView({ kind: 'token', action, token, sending: false, failed: true })
    }
  }

  if (view.kind === 'token') {
    return (
      <div className="nl-card" data-state="token">
        <p className="nl-card-title">Dernière étape</p>
        <p>Confirmez l&apos;inscription de votre adresse à la lettre du mardi.</p>
        <button
          type="button"
          className="nl-submit"
          onClick={onConfirm}
          disabled={view.sending}
          aria-busy={view.sending}
        >
          Confirmer mon inscription
        </button>
        {view.failed && (
          <p role="alert" className="nl-err">
            La confirmation n&apos;a pas abouti. Réessayez, ou écrivez à{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
      </div>
    )
  }

  if (view.kind === 'pending' || view.kind === 'subscribed' || view.kind === 'busy') {
    const message =
      view.kind === 'pending'
        ? "Si cette adresse n'est pas déjà inscrite, un mail vient de partir : cliquez sur son lien pour confirmer."
        : view.kind === 'subscribed'
          ? `C'est fait${view.prenom ? `, ${view.prenom}` : ''}. ${FIRST_ISSUE}`
          : "Trop d'inscriptions aujourd'hui, réessayez demain."
    return (
      <div className="nl-card nl-done" data-state={view.kind} role="status">
        <svg
          className="nl-mark"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {view.kind === 'subscribed' ? (
            <>
              <circle cx="12" cy="12" r="10" />
              <path d="m8 12.5 3 3 5-6" />
            </>
          ) : view.kind === 'pending' ? (
            <>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </>
          ) : (
            <>
              <path d="M7 3h10M7 21h10" />
              <path d="M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />
            </>
          )}
        </svg>
        <p className="nl-done-text">{message}</p>
      </div>
    )
  }

  const sending = view.kind === 'sending'
  return (
    <div className="nl-card" data-state={view.kind}>
      {view.kind === 'stale' && (
        <p className="nl-notice" role="status">
          Ce lien n&apos;est plus valable. Pour recevoir la lettre, inscrivez-vous ci-dessous.
        </p>
      )}
      <form data-form="newsletter" onSubmit={onSubmit} className="nl-fields">
        <div className="nl-field">
          <label htmlFor="newsletter-prenom">Prénom</label>
          <input
            id="newsletter-prenom"
            name="prenom"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="given-name"
          />
        </div>
        <div className="nl-field">
          <label htmlFor="newsletter-email">Email</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
          />
        </div>

        {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
        <div className="nl-trap" aria-hidden="true">
          <label htmlFor="newsletter-website">Ne remplissez pas ce champ</label>
          <input
            id="newsletter-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <button type="submit" className="nl-submit" disabled={sending} aria-busy={sending}>
          Recevoir la lettre
        </button>

        <p className="nl-consent">
          En vous inscrivant, vous acceptez de recevoir la lettre du mardi. Un lien de
          désinscription dans chaque mail.{' '}
          <Link href="/politique-confidentialite">Politique de confidentialité</Link>
        </p>

        {view.kind === 'error' && (
          <p role="alert" className="nl-err">
            L&apos;inscription n&apos;a pas abouti : écrivez à{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        )}
      </form>
    </div>
  )
}
