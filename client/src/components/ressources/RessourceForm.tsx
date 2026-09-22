import { track } from '@vercel/analytics'
import { type FormEvent, useRef, useState } from 'react'
import { site } from '@/lib/site'

/**
 * The form in front of a resource (NS-19, decision D7). It posts to `api/ressources-request.ts`,
 * which mails the links and writes a `sabcrm_leads` row.
 *
 * The checkbox is unticked by default and stays that way unless the visitor ticks it: unticked
 * means nobody calls them. On success the files appear on screen straight away — the form captures
 * the lead, it does not lock the file.
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
  | { kind: 'success'; files: Fichier[] }
  | { kind: 'error'; message: string }

const FIELD =
  'h-10 w-full rounded-md border border-hairline bg-canvas px-3.5 text-[15px] text-on-dark placeholder:text-on-dark-soft focus:border-primary focus:shadow-ring-coral focus:outline-none'
const LABEL = 'text-[13px] font-medium text-on-dark-body'

export default function RessourceForm({ slug, titre }: RessourceFormProps) {
  const [state, setState] = useState<FormState>({ kind: 'idle' })
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
          contact: data.get('contact') === 'on',
          website: String(data.get('website') ?? ''),
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })

      // 204 is what a bot gets. It sees the same confirmation as everyone else.
      if (response.status === 204) {
        track('ressource_request', { status: 'sent' })
        setState({ kind: 'success', files: [] })
        return
      }
      if (response.status === 200) {
        const body = (await response.json().catch(() => null)) as { files?: Fichier[] } | null
        track('ressource_request', { status: 'sent' })
        setState({ kind: 'success', files: body?.files ?? [] })
        return
      }
      if (response.status === 400 || response.status === 404) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        setState({ kind: 'error', message: body?.error ?? fallback })
        return
      }
      setState({ kind: 'error', message: fallback })
    } catch {
      setState({ kind: 'error', message: fallback })
    }
  }

  if (state.kind === 'success') {
    return (
      <div
        data-state="success"
        className="rounded-xl border border-hairline bg-surface-card p-8"
        role="status"
      >
        <h3 className="t-title-lg text-on-dark">C'est à vous</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-on-dark-body">
          Le lien vous est aussi envoyé par mail, pour le retrouver plus tard.
        </p>
        {state.files.length > 0 && (
          <ul className="mt-6 flex flex-col gap-3">
            {state.files.map((file) => (
              <li key={file.url}>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] text-primary underline underline-offset-4"
                >
                  {file.nom}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface-card p-8">
      <h3 className="t-title-lg text-on-dark">Recevoir cette ressource</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-on-dark-body">
        Les fichiers s'affichent tout de suite et vous les recevez aussi par mail.
      </p>

      <form data-form="ressource" onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="ressource-prenom" className={LABEL}>
            Prénom
          </label>
          <input
            id="ressource-prenom"
            name="prenom"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="given-name"
            className={FIELD}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="ressource-email" className={LABEL}>
            Email
          </label>
          <input
            id="ressource-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={FIELD}
          />
        </div>

        <label
          htmlFor="ressource-contact"
          className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-on-dark-body"
        >
          <input
            id="ressource-contact"
            name="contact"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline bg-canvas accent-primary"
          />
          <span>Je souhaite être contacté par Sablia</span>
        </label>

        {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
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

        <button
          type="submit"
          disabled={state.kind === 'pending'}
          className="t-button mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 text-on-primary transition-shadow duration-base hover:shadow-glow-coral disabled:opacity-60"
        >
          {state.kind === 'pending' ? 'Envoi en cours…' : `Recevoir ${titre}`}
        </button>

        {state.kind === 'error' && (
          <p data-state="error" role="alert" className="text-[13px] leading-relaxed text-error">
            {state.message}
          </p>
        )}
      </form>
    </div>
  )
}
