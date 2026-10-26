import { CONSENT_EVENT, hasReplayConsent } from './consent'

/**
 * Audience measurement of sablia.io, plan sablia-io-lot0-vps (Decisions 6 and 7).
 *
 * Tier 1 — the cookieless tracker (`/m/a.js`, served by our own origin: Caddy exposes a fixed
 * allowlist under `/m/` and strips the prefix before the self-hosted Umami). No cookie, no
 * identifier, query strings dropped.
 *
 * Tier 2 — the session recorder (`/m/r.js`: replays and heatmaps). Loaded ONLY after the visitor
 * chose « Tout accepter ». The recorder has no stop: withdrawing a consent that was already acted
 * on reloads the page.
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

let trackerStarted = false
let recorderStarted = false
let consentListener: (() => void) | null = null

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
    script.setAttribute('data-exclude-search', 'true')
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
  if (websiteId === null || trackerStarted) return false
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
  if (websiteId === null || recorderStarted) return false
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
