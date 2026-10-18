import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { track } from './analytics'
import { clearConsent, writeConsent } from './consent'
import {
  emit,
  formError,
  formSuccess,
  labelOf,
  outboundHost,
  startEventTracking,
  trackBooking,
  trackVideoPlay,
  watchVideoProgress,
  zoneOf,
} from './events'

/**
 * US-65: what the site reports. Without consent only clicks, booking, outbound links and scroll
 * depth leave the page (CNIL « au plus trois types d'évènements »); video and form steps need the
 * « Tout accepter » consent. No event ever carries a field value, a URL with a query, or a PII.
 */
vi.mock('./analytics', () => ({ track: vi.fn() }))

type TestWindow = Window & {
  happyDOM: { setURL: (url: string) => void }
  YT?: unknown
}

const calls = () => vi.mocked(track).mock.calls
const names = () => calls().map((c) => c[0])
const last = () => calls()[calls().length - 1]

function page(html: string) {
  document.body.replaceChildren()
  document.body.insertAdjacentHTML('beforeend', html)
}

let stop: () => void = () => {}

beforeEach(() => {
  ;(window as unknown as TestWindow).happyDOM.setURL('https://sablia.io/')
  window.localStorage.clear()
  clearConsent()
  vi.mocked(track).mockReset()
  stop = () => {}
})
afterEach(() => {
  stop()
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.replaceChildren()
})

describe('tiers', () => {
  it('lets click, cta_book, outbound and scroll events through without consent', () => {
    for (const n of ['click', 'cta_book', 'outbound', 'scroll_25', 'scroll_100']) emit(n, { a: 1 })
    expect(names()).toEqual(['click', 'cta_book', 'outbound', 'scroll_25', 'scroll_100'])
  })

  it('drops video_* and form_* events until the visitor accepted', () => {
    for (const n of ['video_play', 'video_50', 'form_view', 'form_start', 'form_submit'])
      emit(n, { id: 'x' })
    expect(calls()).toHaveLength(0)
    writeConsent(false)
    emit('form_view', {})
    expect(calls()).toHaveLength(0)
    writeConsent(true)
    emit('form_view', { form: 'contact' })
    expect(names()).toEqual(['form_view'])
  })
})

describe('zones, labels and outbound hosts', () => {
  it('reads the zone from data-zone, else the section id, else the landmark', () => {
    page(`
      <nav><a id="n">Offre</a></nav>
      <section id="offre"><button id="s">Voir</button></section>
      <section data-zone="hero" id="x"><a id="z">Réserver</a></section>
      <main><a id="m">Reste</a></main>
      <footer><a id="f">Mentions</a></footer>
      <div><a id="o">Orphelin</a></div>`)
    const z = (id: string) => zoneOf(document.getElementById(id))
    expect(z('n')).toBe('nav')
    expect(z('s')).toBe('offre')
    expect(z('z')).toBe('hero')
    expect(z('m')).toBe('main')
    expect(z('f')).toBe('footer')
    expect(z('o')).toBe('page')
  })

  it('labels with aria-label, else the trimmed text cut at 60 characters', () => {
    page(
      `<a id="a" aria-label="Retour accueil">x</a><button id="b">  Réserver   30 min \n </button><button id="c">${'long '.repeat(30)}</button>`,
    )
    expect(labelOf(document.getElementById('a') as Element)).toBe('Retour accueil')
    expect(labelOf(document.getElementById('b') as Element)).toBe('Réserver 30 min')
    expect(labelOf(document.getElementById('c') as Element).length).toBeLessThanOrEqual(60)
  })

  it('keeps only the host of the destinations we care about, « other » for the rest, null for ours', () => {
    expect(outboundHost('https://www.linkedin.com/in/brice', 'sablia.io')).toBe('linkedin.com')
    expect(outboundHost('https://youtu.be/abc', 'sablia.io')).toBe('youtube.com')
    expect(outboundHost('https://www.youtube.com/@x', 'sablia.io')).toBe('youtube.com')
    expect(outboundHost('https://calendly.com/brice-gachadoat/30min?x=1', 'sablia.io')).toBe(
      'calendly.com',
    )
    expect(outboundHost('https://app.sablia.io/questionnaire', 'sablia.io')).toBe('app.sablia.io')
    expect(outboundHost('https://example.org/page', 'sablia.io')).toBe('other')
    expect(outboundHost('https://sablia.io/cgv', 'sablia.io')).toBeNull()
    expect(outboundHost('/ressources', 'sablia.io')).toBeNull()
    expect(outboundHost('mailto:brice@sablia.io', 'sablia.io')).toBeNull()
    expect(outboundHost('tel:+33600000000', 'sablia.io')).toBeNull()
  })
})

describe('clicks', () => {
  it('reports a button click with label, zone and kind — and the zone feeds cta_book', () => {
    page('<nav><button id="b">Réserver 30 min</button></nav>')
    stop = startEventTracking()
    document.getElementById('b')?.click()
    expect(last()).toEqual(['click', { label: 'Réserver 30 min', zone: 'nav', kind: 'button' }])
    trackBooking()
    expect(last()).toEqual(['cta_book', { zone: 'nav', label: 'Réserver 30 min' }])
  })

  it('reports an outbound link with its host only, and no click on text inputs', () => {
    page(
      '<section id="contact"><a id="l" href="https://www.linkedin.com/in/brice-gachadoat?utm=x">LinkedIn</a><input id="i" name="email"><textarea id="t"></textarea></section>',
    )
    stop = startEventTracking()
    document.getElementById('l')?.click()
    expect(names()).toEqual(['click', 'outbound'])
    expect(calls()[0][1]).toEqual({ label: 'LinkedIn', zone: 'contact', kind: 'link' })
    expect(calls()[1][1]).toEqual({ host: 'linkedin.com', zone: 'contact' })
    vi.mocked(track).mockReset()
    document.getElementById('i')?.click()
    document.getElementById('t')?.click()
    expect(calls()).toHaveLength(0)
  })

  it('reports data-cta-book links as cta_book (the thank-you page link bypasses openBookingUrl)', () => {
    page(
      '<main><a id="c" data-cta-book href="https://calendly.com/brice-gachadoat/30min">Réserver un call</a></main>',
    )
    stop = startEventTracking()
    document.getElementById('c')?.click()
    expect(names()).toEqual(['click', 'outbound', 'cta_book'])
    expect(calls()[2][1]).toEqual({ zone: 'main', label: 'Réserver un call' })
  })

  it('ignores the consent banner itself', () => {
    page('<section data-consent-banner><button id="b">Tout accepter</button></section>')
    stop = startEventTracking()
    document.getElementById('b')?.click()
    expect(calls()).toHaveLength(0)
  })
})

describe('scroll depth', () => {
  function scrollTo(ratio: number, doc = 4000, view = 1000) {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: doc,
      configurable: true,
    })
    Object.defineProperty(window, 'innerHeight', { value: view, configurable: true })
    Object.defineProperty(window, 'scrollY', { value: ratio * doc - view, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  }

  it('fires 25/50/75/100 once each per page view, with the page path only', async () => {
    vi.useFakeTimers()
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    ;(window as unknown as TestWindow).happyDOM.setURL('https://sablia.io/cgv?x=secret')
    stop = startEventTracking()
    scrollTo(0.3)
    scrollTo(0.55)
    scrollTo(0.55)
    scrollTo(1)
    expect(calls().map((c) => [c[0], c[1]])).toEqual([
      ['scroll_25', { page: '/cgv' }],
      ['scroll_50', { page: '/cgv' }],
      ['scroll_75', { page: '/cgv' }],
      ['scroll_100', { page: '/cgv' }],
    ])
  })

  it('starts again on another page', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0)
      return 0
    })
    stop = startEventTracking()
    scrollTo(0.3)
    ;(window as unknown as TestWindow).happyDOM.setURL('https://sablia.io/ressources')
    scrollTo(0.3)
    expect(calls().map((c) => c[1])).toEqual([{ page: '/' }, { page: '/ressources' }])
  })
})

describe('forms (consent only, names only)', () => {
  const FORM =
    '<form data-form="contact"><input name="name"><input name="email"><input name="website"><select name="teamSize"><option value="">-</option><option value="a">A</option></select></form>'

  it('reports nothing without consent', () => {
    page(FORM)
    stop = startEventTracking()
    const f = document.querySelector('input[name=name]') as HTMLInputElement
    f.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    f.value = 'Claire'
    f.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    expect(calls()).toHaveLength(0)
  })

  it('reports start once, each filled field once by NAME, the submit, never a value', () => {
    writeConsent(true)
    page(FORM)
    stop = startEventTracking()
    const name = document.querySelector('input[name=name]') as HTMLInputElement
    const email = document.querySelector('input[name=email]') as HTMLInputElement
    const honeypot = document.querySelector('input[name=website]') as HTMLInputElement
    name.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    email.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    name.value = 'Claire Martin'
    name.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    name.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    email.value = ''
    email.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    honeypot.value = 'http://spam.example'
    honeypot.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    document
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    expect(calls().map((c) => [c[0], c[1]])).toEqual([
      ['form_start', { form: 'contact', page: '/' }],
      ['form_field', { form: 'contact', field: 'name', page: '/' }],
      ['form_submit', { form: 'contact', page: '/' }],
    ])
    expect(JSON.stringify(calls())).not.toContain('Claire')
    expect(JSON.stringify(calls())).not.toContain('spam.example')
  })

  it('reports success, and error with its code only', () => {
    writeConsent(true)
    formSuccess('ressource')
    formError('contact', 'invalid_payload')
    expect(calls().map((c) => [c[0], c[1]])).toEqual([
      ['form_success', { form: 'ressource', page: '/' }],
      ['form_error', { form: 'contact', code: 'invalid_payload', page: '/' }],
    ])
  })

  it('reports form_view once when half of the form is visible', () => {
    writeConsent(true)
    page(FORM)
    const observed: Element[] = []
    let callback: IntersectionObserverCallback = () => {}
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) {
        callback = cb
      }
      observe(el: Element) {
        observed.push(el)
      }
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('IntersectionObserver', FakeIO)
    stop = startEventTracking()
    expect(observed).toHaveLength(1)
    const entry = (ratio: number) =>
      ({
        target: observed[0],
        isIntersecting: ratio > 0,
        intersectionRatio: ratio,
      }) as IntersectionObserverEntry
    callback([entry(0.2)], {} as IntersectionObserver)
    expect(calls()).toHaveLength(0)
    callback([entry(0.6)], {} as IntersectionObserver)
    callback([entry(0.9)], {} as IntersectionObserver)
    expect(calls().map((c) => [c[0], c[1]])).toEqual([
      ['form_view', { form: 'contact', page: '/' }],
    ])
    vi.unstubAllGlobals()
  })
})

describe('video', () => {
  it('reports video_play with the id and the page, consent only', () => {
    trackVideoPlay('abc')
    expect(calls()).toHaveLength(0)
    writeConsent(true)
    trackVideoPlay('abc')
    expect(last()).toEqual(['video_play', { id: 'abc', page: '/' }])
  })

  it('reports 25/50/75/100 % from the player clock, once each, only while playing', () => {
    vi.useFakeTimers()
    writeConsent(true)
    let state = -1
    let time = 0
    let onState: (e: { data: number }) => void = () => {}
    class FakePlayer {
      constructor(_el: unknown, opts: { events: { onStateChange: typeof onState } }) {
        onState = opts.events.onStateChange
      }
      getCurrentTime() {
        return time
      }
      getDuration() {
        return 100
      }
      getPlayerState() {
        return state
      }
    }
    ;(window as unknown as TestWindow).YT = { Player: FakePlayer, PlayerState: { PLAYING: 1 } }
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    watchVideoProgress(iframe, 'abc')
    state = 1
    onState({ data: 1 })
    for (const t of [10, 26, 26, 51, 80, 100]) {
      time = t
      vi.advanceTimersByTime(1000)
    }
    expect(calls().map((c) => [c[0], c[1]])).toEqual([
      ['video_25', { id: 'abc', page: '/' }],
      ['video_50', { id: 'abc', page: '/' }],
      ['video_75', { id: 'abc', page: '/' }],
      ['video_100', { id: 'abc', page: '/' }],
    ])
    vi.mocked(track).mockReset()
    state = 2
    onState({ data: 2 })
    time = 100
    vi.advanceTimersByTime(3000)
    expect(calls()).toHaveLength(0)
    delete (window as unknown as TestWindow).YT
  })

  it('never loads the YouTube API script without consent', () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    watchVideoProgress(iframe, 'abc')
    expect(document.querySelector('script[src*="youtube.com/iframe_api"]')).toBeNull()
  })
})
