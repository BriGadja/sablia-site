'use client' // form state, fetch and the mount timestamp

import Link from 'next/link'
import { type FormEvent, useRef, useState } from 'react'
import { FORM, PATHS, TAILLE_OPTIONS, USAGE_OPTIONS } from '@/content/webinaire'
import { formError, formSuccess } from '@/lib/events'
import { type FieldName, type FieldProblem, problemFrom, registrationBody } from './form-logic'
import { MailText } from './MailText'

/**
 * The registration form of `/webinaire` (US-86). Posts the contract of `api/webinaire.ts`:
 * 200 and 204 (a bot answered by the honeypot or the 3 s floor) both mean « registered » and lead to
 * `/webinaire/merci`; 429 says « réessayez demain »; a 400 is shown under the field it names;
 * anything else points to Brice's address. The callback box is unticked and stays so unless the
 * visitor ticks it. Nothing is sent on mount.
 */

type View =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'busy' }
  | { kind: 'invalid'; problem: FieldProblem }
  | { kind: 'error' }

type Props = {
  /** Called once the registration is accepted (default: go to `/webinaire/merci`). */
  onRegistered?: () => void
}

const goToMerci = () => window.location.assign(PATHS.merci)
const ID = (field: FieldName) => `webinaire-${field}`
const ERR = (field: FieldName) => `webinaire-${field}-erreur`

export default function WebinaireForm({ onRegistered = goToMerci }: Props) {
  const [view, setView] = useState<View>({ kind: 'idle' })
  /** Set at the first client render, so the prerendered HTML never bakes a timestamp. */
  const mountedAt = useRef(Date.now())
  const sendingRef = useRef(false)

  const problem = view.kind === 'invalid' ? view.problem : null
  const invalid = (field: FieldName) => problem?.field === field
  const describedBy = (field: FieldName, ...more: string[]) =>
    [...more, invalid(field) ? ERR(field) : ''].filter(Boolean).join(' ') || undefined

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sendingRef.current) return
    sendingRef.current = true
    const form = event.currentTarget
    const body = registrationBody(new FormData(form), Date.now() - mountedAt.current)
    setView({ kind: 'sending' })
    try {
      const response = await fetch('/api/webinaire', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (response.status === 200 || response.status === 204) {
        formSuccess('webinaire')
        onRegistered()
        return
      }
      const answer = (await response.json().catch(() => null)) as {
        error?: string
        code?: string
      } | null
      formError('webinaire', answer?.code ?? `http_${response.status}`)
      sendingRef.current = false
      if (response.status === 429) {
        setView({ kind: 'busy' })
        return
      }
      const found = response.status === 400 ? problemFrom(answer?.error) : null
      if (found) {
        setView({ kind: 'invalid', problem: found })
        form.querySelector<HTMLElement>(`[name="${found.field}"]`)?.focus()
        return
      }
      setView({ kind: 'error' })
    } catch {
      formError('webinaire', 'network')
      sendingRef.current = false
      setView({ kind: 'error' })
    }
  }

  const sending = view.kind === 'sending'
  const fieldError = (field: FieldName) =>
    invalid(field) && problem ? (
      <p id={ERR(field)} role="alert" className="wbn-field-err">
        {problem.message}
      </p>
    ) : null

  const text = (
    field: 'prenom' | 'nom' | 'email' | 'telephone' | 'fonction',
    type: string,
    extra: Record<string, string | number> = {},
  ) => (
    <div className="wbn-field">
      <label htmlFor={ID(field)}>{FORM.labels[field]}</label>
      <input
        id={ID(field)}
        name={field}
        type={type}
        required
        aria-invalid={invalid(field) || undefined}
        aria-describedby={describedBy(field)}
        {...extra}
      />
      {fieldError(field)}
    </div>
  )

  const choices = (
    field: 'taille' | 'usage_ia',
    options: readonly { value: string; label: string }[],
  ) => (
    <div
      className="wbn-choices"
      role="radiogroup"
      aria-labelledby={`${ID(field)}-legende`}
      aria-invalid={invalid(field) || undefined}
      aria-describedby={describedBy(field)}
      aria-required="true"
    >
      <span id={`${ID(field)}-legende`} className="wbn-choices-label">
        {FORM.labels[field]}
      </span>
      <div className="wbn-chips">
        {options.map((option) => (
          <label key={option.value} className="wbn-chip">
            <input type="radio" name={field} value={option.value} required />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {fieldError(field)}
    </div>
  )

  return (
    <form data-form="webinaire" className="wbn-form" onSubmit={onSubmit}>
      <div className="wbn-row">
        {text('prenom', 'text', { autoComplete: 'given-name', maxLength: 80 })}
        {text('nom', 'text', { autoComplete: 'family-name', maxLength: 80 })}
      </div>
      <div className="wbn-row">
        {text('email', 'email', { autoComplete: 'email', maxLength: 200 })}
        {text('telephone', 'tel', {
          autoComplete: 'tel',
          inputMode: 'tel',
          maxLength: 40,
          placeholder: FORM.placeholders.telephone,
        })}
      </div>
      {text('fonction', 'text', {
        autoComplete: 'organization-title',
        maxLength: 120,
        placeholder: FORM.placeholders.fonction,
      })}
      {choices('taille', TAILLE_OPTIONS)}
      {choices('usage_ia', USAGE_OPTIONS)}

      <div className="wbn-field">
        <label htmlFor={ID('pourquoi')}>{FORM.labels.pourquoi}</label>
        <textarea
          id={ID('pourquoi')}
          name="pourquoi"
          rows={3}
          maxLength={1000}
          aria-invalid={invalid('pourquoi') || undefined}
          aria-describedby={describedBy('pourquoi')}
        />
        {fieldError('pourquoi')}
      </div>

      <div className="wbn-consent">
        <label htmlFor="webinaire-rappel" className="wbn-check">
          <input
            id="webinaire-rappel"
            name="rappel_consent"
            type="checkbox"
            aria-describedby="webinaire-rappel-info"
          />
          <span>{FORM.rappel.label}</span>
        </label>
        <p id="webinaire-rappel-info" className="wbn-info">
          <MailText text={FORM.rappel.info} />
        </p>
      </div>

      {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
      <div className="wbn-trap" aria-hidden="true">
        <label htmlFor="webinaire-website">Ne remplissez pas ce champ</label>
        <input
          id="webinaire-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <button type="submit" className="wbn-submit" disabled={sending} aria-busy={sending}>
        {sending ? FORM.sending : FORM.submit}
      </button>

      {view.kind === 'busy' && (
        <p role="alert" className="wbn-err">
          <MailText text={FORM.busy} />
        </p>
      )}
      {view.kind === 'error' && (
        <p role="alert" className="wbn-err">
          <MailText text={FORM.error} />
        </p>
      )}

      <p className="wbn-privacy">
        {FORM.privacy} <Link href="/politique-confidentialite">{FORM.privacyLink}</Link>
      </p>
    </form>
  )
}
