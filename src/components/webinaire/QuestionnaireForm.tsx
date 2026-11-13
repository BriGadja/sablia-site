'use client' // reads the token from the address, fetches the first name, holds the answers

import { type FormEvent, useEffect, useRef, useState } from 'react'
import { QUESTIONNAIRE, QUESTIONS, type Question } from '@/content/webinaire'
import { formError, formSuccess } from '@/lib/events'
import { MailText } from './MailText'
import { answerOf, answersBody, type Draft, emptyDraft, isToken } from './questionnaire-logic'

/**
 * The ten questions of `/webinaire/questionnaire?t=` (US-90).
 *
 * - Opening the link READS only: `GET /api/webinaire-questionnaire?t=` answers `{prenom}` or 404.
 *   The token is read once (kept in a ref, so a dev double effect does not lose it) and dropped from
 *   the address bar at once; Umami ignores query strings anyway (`analytics.ts`).
 * - Every question is optional; at least one answer is needed to send. The POST carries exactly
 *   q1..q10 as strings. 200 and 204 thank, 409 says « déjà enregistrées », 404 « lien non reconnu »;
 *   400 and failures keep the answers on screen.
 * - The ten questions are in the static HTML (SSR content rule); the submit stays disabled until
 *   the token is known.
 */

type Failure = 'invalid' | 'error' | null

type View =
  | { kind: 'checking' }
  | { kind: 'unknown' }
  | { kind: 'unreachable' }
  | { kind: 'ready'; prenom: string; sending: boolean; failure: Failure }
  | { kind: 'already' }
  | { kind: 'done'; prenom: string }

const API = '/api/webinaire-questionnaire'

function takeToken(): string | null {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('t')
  if (token === null) return null
  params.delete('t')
  const rest = params.toString()
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${rest ? `?${rest}` : ''}${window.location.hash}`,
  )
  return token
}

function Field({
  question,
  index,
  draft,
  onChange,
}: {
  question: Question
  index: number
  draft: Draft
  onChange: (next: Draft) => void
}) {
  const id = `questionnaire-${question.key}`
  const num = (
    <span className="wbn-q-num" aria-hidden="true">
      {String(index + 1).padStart(2, '0')}
    </span>
  )
  const hint = question.hint ? (
    <p id={`${id}-aide`} className="wbn-q-hint">
      {question.hint}
    </p>
  ) : null

  if (question.kind === 'long') {
    return (
      <div className="wbn-q" data-answered={answerOf(question, draft) !== '' || undefined}>
        {num}
        <label htmlFor={id} className="wbn-q-label">
          {question.label}
        </label>
        {hint}
        <textarea
          id={id}
          rows={3}
          maxLength={1000}
          value={draft.text}
          aria-describedby={question.hint ? `${id}-aide` : undefined}
          onChange={(event) => onChange({ ...draft, text: event.target.value })}
        />
      </div>
    )
  }

  const multi = question.kind === 'multi'
  const options = question.options ?? []
  const toggle = (option: string) => {
    if (!multi) return onChange({ ...draft, picks: [option] })
    const picks = draft.picks.includes(option)
      ? draft.picks.filter((p) => p !== option)
      : options.filter((o) => o === option || draft.picks.includes(o))
    onChange({ ...draft, picks })
  }
  return (
    <fieldset
      className="wbn-q"
      aria-labelledby={`${id}-legende`}
      data-answered={answerOf(question, draft) !== '' || undefined}
    >
      <legend className="wbn-q-label">
        {num}
        <span id={`${id}-legende`}>{question.label}</span>
      </legend>
      {hint}
      <div className="wbn-chips">
        {options.map((option) => (
          <label key={option} className="wbn-chip">
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={question.key}
              value={option}
              checked={draft.picks.includes(option)}
              onChange={() => toggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {question.detail && (
        <input
          type="text"
          className="wbn-q-detail"
          aria-label={question.detail}
          placeholder={question.detail}
          maxLength={200}
          value={draft.detail}
          onChange={(event) => onChange({ ...draft, detail: event.target.value })}
        />
      )}
    </fieldset>
  )
}

export default function QuestionnaireForm() {
  const [view, setView] = useState<View>({ kind: 'checking' })
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.key, emptyDraft()])),
  )
  const token = useRef<string | null | undefined>(undefined)
  const mountedAt = useRef(Date.now())

  useEffect(() => {
    if (token.current === undefined) token.current = takeToken()
    const value = token.current
    if (!isToken(value)) {
      setView({ kind: 'unknown' })
      return
    }
    let live = true
    fetch(`${API}?t=${value}`)
      .then(async (response) => {
        if (!live) return
        if (response.status === 200) {
          const body = (await response.json().catch(() => null)) as { prenom?: string } | null
          setView({ kind: 'ready', prenom: body?.prenom ?? '', sending: false, failure: null })
        } else if (response.status === 404) {
          setView({ kind: 'unknown' })
        } else {
          setView({ kind: 'unreachable' })
        }
      })
      .catch(() => {
        if (live) setView({ kind: 'unreachable' })
      })
    return () => {
      live = false
    }
  }, [])

  const answered = QUESTIONS.filter((q) => answerOf(q, drafts[q.key] ?? emptyDraft()) !== '').length

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (view.kind !== 'ready' || view.sending || answered === 0 || !isToken(token.current)) return
    const ready = view
    const website = String(new FormData(event.currentTarget).get('website') ?? '')
    setView({ ...ready, sending: true, failure: null })
    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          token: token.current,
          answers: answersBody(drafts),
          website,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      })
      if (response.status === 200 || response.status === 204) {
        formSuccess('webinaire_questionnaire')
        setView({ kind: 'done', prenom: ready.prenom })
        return
      }
      const body = (await response.json().catch(() => null)) as { code?: string } | null
      formError('webinaire_questionnaire', body?.code ?? `http_${response.status}`)
      if (response.status === 409) setView({ kind: 'already' })
      else if (response.status === 404) setView({ kind: 'unknown' })
      else
        setView({
          ...ready,
          sending: false,
          failure: response.status === 400 ? 'invalid' : 'error',
        })
    } catch {
      formError('webinaire_questionnaire', 'network')
      setView({ ...ready, sending: false, failure: 'error' })
    }
  }

  if (view.kind === 'unknown' || view.kind === 'already' || view.kind === 'unreachable') {
    const message =
      view.kind === 'unknown'
        ? QUESTIONNAIRE.unknown
        : view.kind === 'already'
          ? QUESTIONNAIRE.already
          : QUESTIONNAIRE.unreachable
    return (
      <div className="wbn-card wbn-notice" data-state={view.kind} role="status">
        <p>
          <MailText text={message} />
        </p>
      </div>
    )
  }

  if (view.kind === 'done') {
    return (
      <div className="wbn-card wbn-done" data-state="done" role="status">
        <svg
          className="wbn-done-mark"
          width="48"
          height="48"
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
        <p>{QUESTIONNAIRE.done.replace('{prenom}', view.prenom ? `, ${view.prenom}` : '')}</p>
      </div>
    )
  }

  const ready = view.kind === 'ready' ? view : null
  const sending = ready?.sending ?? false
  return (
    <form className="wbn-qform" data-form="webinaire-questionnaire" onSubmit={onSubmit}>
      {ready ? (
        <p className="wbn-hello">
          {QUESTIONNAIRE.hello.replace(' {prenom}', ready.prenom ? ` ${ready.prenom}` : '')}
        </p>
      ) : (
        <p className="wbn-hello wbn-loading" role="status">
          {QUESTIONNAIRE.loading}
        </p>
      )}

      <div className="wbn-progress">
        <span className="wbn-progress-text" aria-live="polite">
          {QUESTIONNAIRE.progress.replace('{n}', String(answered))}
        </span>
        <span
          className="wbn-progress-bar"
          role="progressbar"
          aria-label={QUESTIONNAIRE.progressLabel}
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={answered}
        >
          <span style={{ transform: `scaleX(${answered / 10})` }} />
        </span>
      </div>

      {QUESTIONS.map((question, index) => (
        <Field
          key={question.key}
          question={question}
          index={index}
          draft={drafts[question.key] ?? emptyDraft()}
          onChange={(next) => setDrafts((all) => ({ ...all, [question.key]: next }))}
        />
      ))}

      {/* Honeypot: invisible to a visitor, out of the tab order, irresistible to a bot. */}
      <div className="wbn-trap" aria-hidden="true">
        <label htmlFor="questionnaire-website">Ne remplissez pas ce champ</label>
        <input
          id="questionnaire-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="wbn-qsend">
        <button
          type="submit"
          className="wbn-submit"
          disabled={!ready || sending || answered === 0}
          aria-busy={sending}
          aria-describedby={answered === 0 ? 'questionnaire-min' : undefined}
        >
          {sending ? QUESTIONNAIRE.sending : QUESTIONNAIRE.submit}
        </button>
        {answered === 0 && (
          <p id="questionnaire-min" className="wbn-q-hint">
            {QUESTIONNAIRE.needOne}
          </p>
        )}
        {ready?.failure && (
          <p role="alert" className="wbn-err">
            <MailText
              text={ready.failure === 'invalid' ? QUESTIONNAIRE.invalid : QUESTIONNAIRE.error}
            />
          </p>
        )}
      </div>
    </form>
  )
}
