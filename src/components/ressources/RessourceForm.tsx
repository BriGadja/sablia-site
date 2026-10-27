'use client' // form state, fetch and the mount timestamp

import Link from 'next/link'
import { type FormEvent, useRef, useState } from 'react'
import { FOUND_VIA_EMPTY, FOUND_VIA_LABEL, FOUND_VIA_OPTIONS } from '@/content/found-via'
import { formError, formSuccess } from '@/lib/events'
import { site } from '@/lib/site'
import './ressource-form.css'

/**
 * The form in front of a resource (NS-19, decision D7). It posts to `api/ressources-request.ts`,
 * which mails the links and writes a `sabcrm_leads` row.
 *
 * The checkbox is unticked by default and stays that way unless the visitor ticks it: unticked
 * means nobody calls them. Ticking it reveals an optional phone field (Brice, 2026-10-12: a lead
 * asked to be contacted and left nothing to call); the email stays required either way. On success
 * the files appear on screen straight away — the form captures the lead, it does not lock the file.
 *
 * A second box, unticked too, subscribes to the Tuesday letter (US-82); the success screen then says
 * so, or offers `/newsletter` when it stayed unticked (US-84).
 *
 * Anti-spam is the honeypot plus a minimum delay of the contact form: no third-party script.
 */

interface RessourceFormProps {
  slug: string
  titre: string
}

interface Fichier {
  nom: string
  url: string
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'success'; files: Fichier[]; contact: boolean; newsletter: boolean }
  | { kind: 'error'; message: string }

export default function RessourceForm({ slug, titre }: RessourceFormProps) {
  const [state, setState] = useState<FormState>({ kind: 'idle' })
  const [wantsContact, setWantsContact] = useState(false)
  const [wantsNewsletter, setWantsNewsletter] = useState(false)
  /** Set at the first client render, so the prerendered HTML never bakes a timestamp. */
  const mountedAt = useRef(Date.now())

  const fallback = `L'envoi n'a pas abouti. Écrivez-nous directement à ${site.email}.`

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === 'pending') return
    const data = new FormData(event.currentTarget)
    setState({ kind: 'pending' })

    try {
      const response = await fetch('/api/ressources-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          prenom: String(data.get('prenom') ?? ''),
          email: String(data.get('email') ?? ''),
          slug,
          contact: wantsContact,
          newsletter: wantsNewsletter,
          telephone: wantsContact ? String(data.get('telephone') ?? '') : '',
          foundVia: String(data.get('foundVia') ?? ''),
          website: String(data.get('website') ?? ''),
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      // 204 is what a bot gets. It sees the same confirmation as everyone else.
      if (response.status === 204) {
        formSuccess('ressource')
        setState({ kind: 'success', files: [], contact: wantsContact, newsletter: wantsNewsletter })
        return
      }
      if (response.status === 200) {
        const body = (await response.json().catch(() => null)) as { files?: Fichier[] } | null
        formSuccess('ressource')
        setState({
          kind: 'success',
          files: body?.files ?? [],
          contact: wantsContact,
          newsletter: wantsNewsletter,
        })
        return
      }
      const body = (await response.json().catch(() => null)) as {
        error?: string
        code?: string
      } | null
      formError('ressource', body?.code ?? `http_${response.status}`)
      setState({
        kind: 'error',
        message:
          response.status === 400 || response.status === 404 ? (body?.error ?? fallback) : fallback,
      })
    } catch {
      formError('ressource', 'network')
      setState({ kind: 'error', message: fallback })
    }
  }

  if (state.kind === 'success') {
    return (
      <div data-state="success" className="v2-ressource-form" role="status">
        <h3>C'est à vous</h3>
        <p>Le lien vous est aussi envoyé par mail, pour le retrouver plus tard.</p>
        {state.contact && (
          <p>Vous avez demandé à être contacté : on revient vers vous sous 24 h ouvrées.</p>
        )}
        {state.files.length > 0 && (
          <ul className="files">
            {state.files.map((file) => (
              <li key={file.url}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.nom}
                </a>
              </li>
            ))}
          </ul>
        )}
        {state.newsletter ? (
          <p className="letter-line">Vous recevrez la lettre du mardi.</p>
        ) : (
          <p className="letter-line">
            <Link href="/newsletter" className="letter">
              Recevoir la lettre du mardi
            </Link>
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="v2-ressource-form">
      <h3>Recevoir cette ressource</h3>
      <p>Les fichiers s'affichent tout de suite et vous les recevez aussi par mail.</p>

      <form data-form="ressource" onSubmit={onSubmit} className="fields">
        <div className="field">
          <label htmlFor="ressource-prenom">Prénom</label>
          <input
            id="ressource-prenom"
            name="prenom"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="given-name"
          />
        </div>

        <div className="field">
          <label htmlFor="ressource-email">Email</label>
          <input
            id="ressource-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
          />
        </div>

        <label htmlFor="ressource-contact" className="check">
          <input
            id="ressource-contact"
            name="contact"
            type="checkbox"
            checked={wantsContact}
            onChange={(event) => setWantsContact(event.target.checked)}
          />
          <span>Je souhaite être contacté par Sablia</span>
        </label>

        {wantsContact && (
          <div className="field">
            <label htmlFor="ressource-telephone">Téléphone (facultatif)</label>
            <input
              id="ressource-telephone"
              name="telephone"
              type="tel"
              inputMode="tel"
              maxLength={40}
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              aria-describedby="ressource-telephone-aide"
            />
            <p id="ressource-telephone-aide" className="help">
              Pour qu'on vous appelle. Sans numéro, on vous répond par mail.
            </p>
          </div>
        )}

        <label htmlFor="ressource-newsletter" className="check">
          <input
            id="ressource-newsletter"
            name="newsletter"
            type="checkbox"
            checked={wantsNewsletter}
            onChange={(event) => setWantsNewsletter(event.target.checked)}
          />
          <span>Recevoir aussi la lettre du mardi (L&apos;IA au travail)</span>
        </label>

        <div className="field">
          <label htmlFor="ressource-found-via">{FOUND_VIA_LABEL}</label>
          <select id="ressource-found-via" name="foundVia" defaultValue="">
            <option value="">{FOUND_VIA_EMPTY}</option>
            {FOUND_VIA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
        <div className="trap" aria-hidden="true">
          <label htmlFor="ressource-website">Ne remplissez pas ce champ</label>
          <input
            id="ressource-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>

        <button type="submit" disabled={state.kind === 'pending'} className="submit">
          {state.kind === 'pending' ? 'Envoi en cours…' : `Recevoir ${titre}`}
        </button>

        {state.kind === 'error' && (
          <p data-state="error" role="alert" className="err">
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}
