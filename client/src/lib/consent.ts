/**
 * The visitor's analytics choice (US-66). Only « replay » (session recording + heatmaps) depends
 * on it: the cookieless audience measurement does not. The choice is kept in `localStorage`, a
 * tracer the CNIL lists among those exempt from consent because it stores the choice itself
 * (https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi).
 *
 * Anything but a fresh, well-formed, explicit « replay: true » reads as NO consent.
 */
export const CONSENT_KEY = 'sablia_consent'
export const CONSENT_EVENT = 'sablia:consent'
export const OPEN_EVENT = 'sablia:consent-open'
/** 6 months (183 days): the CNIL recommends keeping both consent and refusal for that long. */
export const CONSENT_TTL_MS = 183 * 24 * 60 * 60 * 1000

export interface Consent {
  v: 1
  replay: boolean
  at: string
}

/** Used only when the storage throws (private window, blocked site data): lasts for the page. */
let memory: Consent | null = null

function isFresh(value: unknown, now: number): value is Consent {
  if (typeof value !== 'object' || value === null) return false
  const c = value as Record<string, unknown>
  if (c.v !== 1 || typeof c.replay !== 'boolean' || typeof c.at !== 'string') return false
  const at = Date.parse(c.at)
  return Number.isFinite(at) && at <= now && now - at < CONSENT_TTL_MS
}

export function readConsent(now: number = Date.now()): Consent | null {
  let raw: string | null
  try {
    raw = window.localStorage.getItem(CONSENT_KEY)
  } catch {
    return memory !== null && isFresh(memory, now) ? memory : null
  }
  if (raw === null) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return isFresh(parsed, now) ? parsed : null
  } catch {
    return null
  }
}

export function hasReplayConsent(now: number = Date.now()): boolean {
  return readConsent(now)?.replay === true
}

export function writeConsent(replay: boolean, now: number = Date.now()): Consent {
  const consent: Consent = { v: 1, replay, at: new Date(now).toISOString() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    memory = null
  } catch {
    memory = consent
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
  return consent
}

export function clearConsent(): void {
  memory = null
  try {
    window.localStorage.removeItem(CONSENT_KEY)
  } catch {
    // storage unavailable: nothing was kept there
  }
  window.dispatchEvent(new Event(CONSENT_EVENT))
}

/** The footer link « Gérer mes choix » asks the banner to open again. */
export function requestConsentBanner(): void {
  window.dispatchEvent(new Event(OPEN_EVENT))
}
