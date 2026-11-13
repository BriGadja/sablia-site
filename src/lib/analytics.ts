import { CONSENT_EVENT, hasReplayConsent } from './consent'

/**
 * Audience measurement of sablia.io, plan sablia-io-lot0-vps (Decisions 6 and 7).
 *
 * Tier 1, the cookieless tracker (`/m/a.js`, served by our own origin: Caddy exposes a fixed
 * allowlist under `/m/` and strips the prefix before the self-hosted Umami). No cookie, no
 * identifier. The query string is dropped except `utm_source`, `utm_medium` and `utm_campaign`
 * (see `keepUtm`): the served tracker blanks the whole search when its exclude-search attribute is set,
 * before any hook runs, so that attribute is NOT used and a `data-before-send` hook does the trim.
 *
 * Tier 2, the session recorder (`/m/r.js`: replays and heatmaps). Loaded ONLY after the visitor
 * chose « Tout accepter ». The recorder has no stop: withdrawing a consent that was already acted
 * on reloads the page.
 *
 * A device opts out once with `?stats=off` (back with `?stats=on`): it sets Umami's own
 * `umami.disabled` localStorage flag, which the tracker reads before every send. The recorder is a
 * separate script that does not read it, so `startAnalytics`/`loadRecorder` check it too.
 *
 * Every function is a no-op on a host we do not own (localhost, a Vercel preview, a mirror) and
 * inside the prerender run, so neither the static HTML nor a stranger's copy is ever measured.
 */

/** Public identifiers (they appear in the page source anyway): one Umami website per hostname. */
export const WEBSITE_IDS: Record<string, string> = {
  'sablia.io': '592b2b4f-0af3-4915-9126-e34449a102f3',
  'preview.sablia.io': 'ccb14f7b-5933-45c3-9f09-6bacb8967027',
}

type AnalyticsWindow = Window & {
  umami?: { track: (name: string, data?: object) => void }
}

/** Umami's own opt-out key: any truthy value stops the tracker from sending. */
export const UMAMI_DISABLED_KEY = 'umami.disabled'
/** Name of the global function the tracker calls through `data-before-send`. */
export const BEFORE_SEND_NAME = 'sabliaBeforeSend'
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign']

let trackerStarted = false
let recorderStarted = false
let consentListener: (() => void) | null = null

export function statsDisabled(): boolean {
  try {
    return window.localStorage.getItem(UMAMI_DISABLED_KEY) !== null
  } catch {
    return false
  }
}

/** `?stats=off` sets the device flag, `?stats=on` clears it; the parameter then leaves the URL. */
export function applyStatsParam(): void {
  try {
    const url = new URL(window.location.href)
    const value = url.searchParams.get('stats')
    if (value === null) return
    if (value === 'off') window.localStorage.setItem(UMAMI_DISABLED_KEY, '1')
    else if (value === 'on') window.localStorage.removeItem(UMAMI_DISABLED_KEY)
    else return
    url.searchParams.delete('stats')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  } catch {
    // blocked storage: the device simply stays measured
  }
}

/** Keeps only the three UTM keys of a URL's query; every other parameter is dropped. */
export function keepUtm(href: string): string {
  try {
    const base = 'https://x.invalid'
    const url = new URL(href, base)
    const kept = new URLSearchParams()
    for (const key of UTM_KEYS) {
      const value = url.searchParams.get(key)
      if (value !== null) kept.set(key, value)
    }
    const query = kept.toString()
    const out = url.pathname + (query ? `?${query}` : '') + url.hash
    return url.origin === base ? out : url.origin + out
  } catch {
    return href
  }
}

/** Our own hosts (the measured two plus `www`). An external referrer is left as the browser gave it. */
const OWN_HOSTS = new Set(['sablia.io', 'www.sablia.io', 'preview.sablia.io'])

/**
 * A referrer from our own site: relative (the served tracker strips our origin from a same-origin
 * referrer, query kept) or absolute on one of `OWN_HOSTS`. Protocol-relative `//host` is external.
 */
function ownReferrer(ref: string): boolean {
  if (ref.startsWith('/')) return !ref.startsWith('//')
  try {
    return OWN_HOSTS.has(new URL(ref).hostname)
  } catch {
    return false
  }
}

/**
 * The tracker's `data-before-send` hook, never cancels: trims the query of `payload.url`, and of
 * `payload.referrer` when it is our own page (after a client navigation it is the previous url,
 * which could still carry `?t=` or `?c=`).
 */
export function beforeSend<T>(_type: string, payload: T): T {
  const p = payload as { url?: unknown; referrer?: unknown } | null
  if (p && typeof p.url === 'string') p.url = keepUtm(p.url)
  if (p && typeof p.referrer === 'string' && ownReferrer(p.referrer))
    p.referrer = keepUtm(p.referrer)
  return payload
}

export function websiteIdFor(hostname: string): string | null {
  return Object.hasOwn(WEBSITE_IDS, hostname) ? WEBSITE_IDS[hostname] : null
}

/** Test seam: forget what this page already injected. */
export function resetAnalyticsForTests(): void {
  trackerStarted = false
  recorderStarted = false
  if (consentListener) window.removeEventListener(CONSENT_EVENT, consentListener)
  consentListener = null
}

export function track(name: string, data?: Record<string, string | number | boolean>): void {
  try {
    ;(window as AnalyticsWindow).umami?.track(name, data)
  } catch {
    // a blocked or broken tracker must never break a click
  }
}

function inject(kind: 'tracker' | 'recorder', src: string, websiteId: string): void {
  const script = document.createElement('script')
  script.defer = true
  script.src = src
  script.dataset.sablia = kind
  script.setAttribute('data-website-id', websiteId)
  script.setAttribute('data-host-url', `${window.location.origin}/m`)
  if (kind === 'tracker') {
    ;(window as unknown as Record<string, unknown>)[BEFORE_SEND_NAME] = beforeSend
    script.setAttribute('data-before-send', BEFORE_SEND_NAME)
    script.setAttribute('data-domains', window.location.hostname)
  }
  document.head.appendChild(script)
}

function target(): string | null {
  return websiteIdFor(window.location.hostname)
}

/** Tier 1. Returns true only when it injected the tracker just now. */
export function startAnalytics(): boolean {
  const websiteId = target()
  if (websiteId === null || trackerStarted || statsDisabled()) return false
  trackerStarted = true
  inject('tracker', '/m/a.js', websiteId)
  return true
}

export function recorderLoaded(): boolean {
  return recorderStarted
}

/** Tier 2. Callers go through `applyConsent`; exported for the tests. */
export function loadRecorder(): boolean {
  const websiteId = target()
  if (websiteId === null || recorderStarted || statsDisabled()) return false
  recorderStarted = true
  inject('recorder', '/m/r.js', websiteId)
  return true
}

/** Brings the page in line with the stored choice. Withdrawal after the fact reloads the page. */
export function applyConsent(reload: () => void = () => window.location.reload()): void {
  if (hasReplayConsent()) {
    loadRecorder()
    return
  }
  if (recorderStarted) reload()
}

/** Idempotent: one listener however many times it is called. */
export function initAnalytics(): void {
  startAnalytics()
  applyConsent()
  if (consentListener) window.removeEventListener(CONSENT_EVENT, consentListener)
  consentListener = () => applyConsent()
  window.addEventListener(CONSENT_EVENT, consentListener)
}
