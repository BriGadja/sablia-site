import { track } from './analytics'
import { hasReplayConsent } from './consent'

/**
 * What sablia.io reports to its own Umami (plan sablia-io-lot0-vps, Decision 6, event map).
 *
 * Two tiers. WITHOUT consent only `click`, `cta_book`, `outbound` and `scroll_*` leave the page —
 * feature use, destination and scroll depth, the "au plus trois types d'évènements" of the CNIL
 * audience-measurement self-assessment. `video_*` and `form_*` need « Tout accepter ». No event
 * ever carries a field VALUE, a query string or a visitor identifier: labels are our own button
 * texts, hosts are reduced to a short list, form fields are reported by NAME.
 */

const CONSENT_ONLY = /^(video_|form_)/
const PAGE = () => window.location.pathname

type Props = Record<string, string | number | boolean>

export function emit(name: string, data?: Props): void {
  if (CONSENT_ONLY.test(name) && !hasReplayConsent()) return
  track(name, data)
}

// ── zones, labels, destinations ───────────────────────────────────────────────

/** Nearest `[data-zone]`, else the section id, else the landmark, else « page ». */
export function zoneOf(el: Element | null): string {
  if (!el) return 'page'
  const marked = el.closest('[data-zone]')?.getAttribute('data-zone')
  if (marked) return marked
  const section = el.closest('section[id]')?.id
  if (section) return section
  if (el.closest('nav, header')) return 'nav'
  if (el.closest('footer')) return 'footer'
  if (el.closest('main')) return 'main'
  return 'page'
}

export function labelOf(el: Element): string {
  const aria = el.getAttribute('aria-label')?.trim()
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  return (aria || text || el.getAttribute('title') || 'sans libellé').slice(0, 60)
}

const OWN_HOSTS = new Set(['sablia.io', 'www.sablia.io'])

/** `null` for our own pages and non-web schemes; otherwise a short, fixed vocabulary. */
export function outboundHost(href: string, ownHost: string): string | null {
  let url: URL
  try {
    url = new URL(href, `https://${ownHost}/`)
  } catch {
    return null
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^www\./, '')
  if (host === ownHost || OWN_HOSTS.has(host)) return null
  if (host === 'linkedin.com' || host.endsWith('.linkedin.com')) return 'linkedin.com'
  if (host === 'youtube.com' || host.endsWith('.youtube.com') || host === 'youtu.be')
    return 'youtube.com'
  if (host === 'calendly.com') return 'calendly.com'
  if (host === 'app.sablia.io') return 'app.sablia.io'
  return 'other'
}

// ── booking ───────────────────────────────────────────────────────────────────

let lastZone = 'unknown'
let lastLabel = ''

/** Called by `openBookingUrl()`, the single call site of every « Réserver 30 min » button. */
export function trackBooking(): void {
  emit('cta_book', { zone: lastZone, label: lastLabel })
}

// ── forms ─────────────────────────────────────────────────────────────────────

export function formSuccess(form: string): void {
  emit('form_success', { form, page: PAGE() })
}

export function formError(form: string, code: string): void {
  emit('form_error', { form, code, page: PAGE() })
}

// ── video ─────────────────────────────────────────────────────────────────────

export function trackVideoPlay(id: string): void {
  emit('video_play', { id, page: PAGE() })
}

interface YouTubePlayer {
  getCurrentTime(): number
  getDuration(): number
}
interface YouTubeApi {
  Player: new (
    el: HTMLIFrameElement,
    opts: { events: { onStateChange: (event: { data: number }) => void } },
  ) => YouTubePlayer
  PlayerState?: { PLAYING: number }
}
type YtWindow = Window & { YT?: YouTubeApi; onYouTubeIframeAPIReady?: () => void }

let apiRequested = false
function withYouTubeApi(run: (api: YouTubeApi) => void): void {
  const w = window as YtWindow
  if (w.YT?.Player) {
    run(w.YT)
    return
  }
  const previous = w.onYouTubeIframeAPIReady
  w.onYouTubeIframeAPIReady = () => {
    previous?.()
    if (w.YT?.Player) run(w.YT)
  }
  if (apiRequested) return
  apiRequested = true
  const script = document.createElement('script')
  script.src = 'https://www.youtube.com/iframe_api'
  document.head.appendChild(script)
}

const VIDEO_STEPS = [25, 50, 75, 100] as const

/**
 * Reports how far a visitor watches, from the player's own clock. Consent only — and without it the
 * YouTube API script is not even requested. Called after the click that mounted the iframe.
 */
export function watchVideoProgress(iframe: HTMLIFrameElement, id: string): void {
  if (!hasReplayConsent()) return
  withYouTubeApi((api) => {
    const fired = new Set<number>()
    let timer: ReturnType<typeof setInterval> | undefined
    const tick = (player: YouTubePlayer) => {
      const duration = player.getDuration()
      if (!(duration > 0)) return
      const pct = (player.getCurrentTime() / duration) * 100
      for (const step of VIDEO_STEPS) {
        if (pct >= step && !fired.has(step)) {
          fired.add(step)
          emit(`video_${step}`, { id, page: PAGE() })
        }
      }
    }
    const playing = api.PlayerState?.PLAYING ?? 1
    const player = new api.Player(iframe, {
      events: {
        onStateChange: (event) => {
          if (event.data === playing) {
            if (!timer) timer = setInterval(() => tick(player), 1000)
          } else if (timer) {
            clearInterval(timer)
            timer = undefined
          }
        },
      },
    })
  })
}

// ── the delegated listeners ───────────────────────────────────────────────────

type MaybePrerender = Window & { __SABLIA_PRERENDER__?: boolean }
const SCROLL_STEPS = [25, 50, 75, 100] as const

/** Installs the click, scroll and form listeners. Returns a function that removes them (tests). */
export function startEventTracking(): () => void {
  if ((window as MaybePrerender).__SABLIA_PRERENDER__ === true) return () => {}

  // clicks
  const onClick = (event: MouseEvent) => {
    const target = event.target as Element | null
    if (!target?.closest) return
    if (target.closest('[data-consent-banner]') || target.closest('input, textarea, select')) return
    const el = target.closest('a, button, [role="button"]')
    if (!el) return
    const zone = zoneOf(el)
    const label = labelOf(el)
    lastZone = zone
    lastLabel = label
    const isLink = el.tagName === 'A'
    emit('click', { label, zone, kind: isLink ? 'link' : 'button' })
    if (isLink) {
      const host = outboundHost(el.getAttribute('href') ?? '', window.location.hostname)
      if (host) emit('outbound', { host, zone })
    }
    if (el.hasAttribute('data-cta-book')) emit('cta_book', { zone, label })
  }
  document.addEventListener('click', onClick, true)

  // scroll depth
  let currentPath = PAGE()
  const reached = new Set<number>()
  let queued = false
  const measure = () => {
    queued = false
    if (PAGE() !== currentPath) {
      currentPath = PAGE()
      reached.clear()
    }
    const total = document.documentElement.scrollHeight
    if (!(total > 0)) return
    const ratio = ((window.scrollY + window.innerHeight) / total) * 100
    for (const step of SCROLL_STEPS) {
      const hit = step === 100 ? ratio >= 99 : ratio >= step
      if (hit && !reached.has(step)) {
        reached.add(step)
        emit(`scroll_${step}`, { page: currentPath })
      }
    }
  }
  const onScroll = () => {
    if (queued) return
    queued = true
    window.requestAnimationFrame(measure)
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // forms (consent-gated inside emit)
  const started = new WeakSet<Element>()
  const filled = new WeakMap<Element, Set<string>>()
  const viewed = new WeakSet<Element>()
  const formOf = (el: EventTarget | null) =>
    (el as Element | null)?.closest?.('form[data-form]') ?? null
  const onFocusIn = (event: FocusEvent) => {
    const form = formOf(event.target)
    if (!form || started.has(form)) return
    started.add(form)
    emit('form_start', { form: form.getAttribute('data-form') ?? '', page: PAGE() })
  }
  const onFocusOut = (event: FocusEvent) => {
    const form = formOf(event.target)
    const field = event.target as HTMLInputElement | null
    if (!form || !field?.name || field.name === 'website') return
    if (field.value.trim() === '') return
    const seen = filled.get(form) ?? new Set<string>()
    filled.set(form, seen)
    if (seen.has(field.name)) return
    seen.add(field.name)
    emit('form_field', {
      form: form.getAttribute('data-form') ?? '',
      field: field.name,
      page: PAGE(),
    })
  }
  const onSubmit = (event: Event) => {
    const form = formOf(event.target)
    if (form) emit('form_submit', { form: form.getAttribute('data-form') ?? '', page: PAGE() })
  }
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  document.addEventListener('submit', onSubmit, true)

  // form_view: half of the form visible, once
  let observer: IntersectionObserver | undefined
  let mutations: MutationObserver | undefined
  if (typeof IntersectionObserver !== 'undefined') {
    const watched = new WeakSet<Element>()
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.5 && !viewed.has(entry.target)) {
            viewed.add(entry.target)
            emit('form_view', { form: entry.target.getAttribute('data-form') ?? '', page: PAGE() })
          }
        }
      },
      { threshold: [0, 0.5, 1] },
    )
    const scan = () => {
      for (const form of Array.from(document.querySelectorAll('form[data-form]'))) {
        if (!watched.has(form)) {
          watched.add(form)
          observer?.observe(form)
        }
      }
    }
    scan()
    if (typeof MutationObserver !== 'undefined') {
      mutations = new MutationObserver(scan)
      mutations.observe(document.body, { childList: true, subtree: true })
    }
  }

  return () => {
    document.removeEventListener('click', onClick, true)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    document.removeEventListener('submit', onSubmit, true)
    observer?.disconnect()
    mutations?.disconnect()
  }
}
