import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initAnalytics, resetAnalyticsForTests } from './analytics'
import { clearConsent, writeConsent } from './consent'
import {
  formError,
  formSuccess,
  startEventTracking,
  trackVideoPlay,
  watchVideoProgress,
} from './events'

/**
 * The measurement oracle (US-71): every event the site promises to Umami, proven to reach
 * `window.umami.track` through the real analytics + events modules. Without consent only `click`,
 * `cta_book`, `outbound` and `scroll_25/50/75/100` leave the page; `form_*`, `video_*` and the
 * recorder exist only after « Tout accepter ». A failure here is a broken headline number.
 */
type TestWindow = Window & {
  happyDOM: { setURL: (url: string) => void }
  umami?: { track: (name: string, data?: object) => void }
  YT?: unknown
}
const w = window as unknown as TestWindow

const TIER1 = ['click', 'cta_book', 'outbound', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100']
const TIER2 = [
  'form_view',
  'form_start',
  'form_field',
  'form_submit',
  'form_success',
  'form_error',
  'video_play',
  'video_25',
  'video_50',
  'video_75',
  'video_100',
]

let track: ReturnType<typeof vi.fn>
let stop: () => void
let observe: (ratio: number) => void

const names = () => track.mock.calls.map((c) => c[0] as string)
const dataOf = (name: string) => track.mock.calls.find((c) => c[0] === name)?.[1]

const PAGE = `
  <nav id="n"><button id="book" data-cta-book>Réserver 30 min</button></nav>
  <main>
    <section id="top"><a id="out" href="https://app.sablia.io/x">Voir</a></section>
    <section id="fin">
      <form data-form="ressource"><input name="prenom"><input name="email"><input name="website"><button type="submit">Envoyer</button></form>
    </section>
  </main>
  <footer><a id="foot" href="/mentions-legales">Mentions</a></footer>`

function scrollTo(ratio: number) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: 1000,
    configurable: true,
  })
  Object.defineProperty(window, 'innerHeight', { value: 100, configurable: true })
  Object.defineProperty(window, 'scrollY', { value: ratio * 1000 - 100, configurable: true })
  window.dispatchEvent(new Event('scroll'))
}

beforeEach(() => {
  w.happyDOM.setURL('https://sablia.io/')
  window.localStorage.clear()
  clearConsent()
  resetAnalyticsForTests()
  document.head.replaceChildren()
  document.body.replaceChildren()
  document.body.insertAdjacentHTML('beforeend', PAGE)
  track = vi.fn()
  w.umami = { track }
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0)
    return 0
  })
  let callback: IntersectionObserverCallback = () => {}
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb
      }
      observe() {}
      disconnect() {}
    },
  )
  observe = (ratio) =>
    callback(
      [
        { target: document.querySelector('form'), intersectionRatio: ratio },
      ] as unknown as IntersectionObserverEntry[],
      {} as IntersectionObserver,
    )
  stop = startEventTracking()
})
afterEach(() => {
  stop()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  delete w.umami
  delete w.YT
})

function tier1Interactions() {
  document.getElementById('book')?.click()
  document.getElementById('out')?.click()
  for (const r of [0.25, 0.5, 0.75, 1]) scrollTo(r)
}

function tier2Interactions() {
  observe(0.6)
  const email = document.querySelector<HTMLInputElement>('input[name=email]')
  if (!email) throw new Error('fixture lost the email input')
  email.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
  email.value = 'x@y.fr'
  email.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
  document
    .querySelector('form')
    ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  formSuccess('ressource')
  formError('ressource', 'network')
}

function playVideo() {
  vi.useFakeTimers()
  let onState: (e: { data: number }) => void = () => {}
  let t = 0
  w.YT = {
    PlayerState: { PLAYING: 1 },
    Player: class {
      constructor(_el: unknown, opts: { events: { onStateChange: typeof onState } }) {
        onState = opts.events.onStateChange
      }
      getCurrentTime() {
        return t
      }
      getDuration() {
        return 100
      }
    },
  }
  trackVideoPlay('abc')
  watchVideoProgress(document.createElement('iframe'), 'abc')
  onState({ data: 1 })
  for (const pct of [25, 50, 75, 100]) {
    t = pct
    vi.advanceTimersByTime(1000)
  }
}

describe('without consent: exactly the tier-1 events', () => {
  it('fires click, cta_book, outbound and scroll_25/50/75/100, nothing else', () => {
    tier1Interactions()
    tier2Interactions()
    playVideo()
    const got = new Set(names())
    for (const n of TIER1) expect(got.has(n), `${n} missing`).toBe(true)
    for (const n of TIER2) expect(got.has(n), `${n} leaked without consent`).toBe(false)
    expect(document.head.querySelector('script[data-sablia="recorder"]')).toBeNull()
  })

  it('reports the booking click once, in its v2 zone vocabulary', () => {
    document.getElementById('book')?.click()
    expect(names().filter((n) => n === 'cta_book')).toHaveLength(1)
    expect(dataOf('cta_book')).toEqual({ zone: 'nav', label: 'Réserver 30 min' })
    document.getElementById('out')?.click()
    expect(dataOf('outbound')).toEqual({ host: 'app.sablia.io', zone: 'top' })
    document.getElementById('foot')?.click()
    expect(track.mock.calls.filter((c) => c[0] === 'click').pop()?.[1]).toMatchObject({
      zone: 'footer',
    })
  })
})

describe('after « Tout accepter »: tier 1 plus forms, video and the recorder', () => {
  beforeEach(() => {
    initAnalytics()
    writeConsent(true)
  })

  it('fires every form_* and video_* event, and injects the recorder', () => {
    tier1Interactions()
    tier2Interactions()
    playVideo()
    const got = new Set(names())
    for (const n of [...TIER1, ...TIER2]) expect(got.has(n), `${n} missing`).toBe(true)
    expect(document.head.querySelector('script[data-sablia="recorder"]')).not.toBeNull()
  })

  it('never reports a field value or the honeypot', () => {
    tier2Interactions()
    expect(JSON.stringify(track.mock.calls)).not.toContain('x@y.fr')
    const honeypot = document.querySelector<HTMLInputElement>('input[name=website]')
    if (!honeypot) throw new Error('fixture lost the honeypot')
    honeypot.value = 'bot'
    honeypot.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    expect(
      track.mock.calls.filter((c) => (c[1] as { field?: string })?.field === 'website'),
    ).toHaveLength(0)
  })
})
