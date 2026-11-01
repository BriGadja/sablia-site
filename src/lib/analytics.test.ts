import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyConsent,
  applyStatsParam,
  BEFORE_SEND_NAME,
  beforeSend,
  keepUtm,
  loadRecorder,
  recorderLoaded,
  resetAnalyticsForTests,
  startAnalytics,
  statsDisabled,
  track,
  WEBSITE_IDS,
  websiteIdFor,
} from './analytics'
import { clearConsent, writeConsent } from './consent'

type UmamiWindow = Window & { umami?: { track: (name: string, data?: object) => void } }
type TestWindow = Window & {
  happyDOM: { setURL: (url: string) => void }
}

function visit(url: string) {
  ;(window as unknown as TestWindow).happyDOM.setURL(url)
}
const scripts = (kind: string) => document.head.querySelectorAll(`script[data-sablia="${kind}"]`)

function reset() {
  resetAnalyticsForTests()
  clearConsent()
  document.head.replaceChildren()
}

describe('track', () => {
  afterEach(() => {
    delete (window as UmamiWindow).umami
  })

  it('does nothing and does not throw when the tracker is absent or blocked', () => {
    expect(() => track('cta_book', { zone: 'nav' })).not.toThrow()
  })

  it('forwards the event name and its data to Umami', () => {
    const spy = vi.fn()
    ;(window as UmamiWindow).umami = { track: spy }
    track('cta_book', { zone: 'nav' })
    expect(spy).toHaveBeenCalledWith('cta_book', { zone: 'nav' })
  })

  it('swallows a tracker that throws: a measurement bug never breaks a click', () => {
    ;(window as UmamiWindow).umami = {
      track: () => {
        throw new Error('boom')
      },
    }
    expect(() => track('cta_book')).not.toThrow()
  })
})

describe('which Umami website a host reports to', () => {
  it('maps the production host and the preview host to their own website, and nothing else', () => {
    expect(websiteIdFor('sablia.io')).toBe(WEBSITE_IDS['sablia.io'])
    expect(websiteIdFor('preview.sablia.io')).toBe(WEBSITE_IDS['preview.sablia.io'])
    expect(WEBSITE_IDS['sablia.io']).not.toBe(WEBSITE_IDS['preview.sablia.io'])
    for (const other of [
      'localhost',
      'code.sablia.io',
      'sablia.io.evil.example',
      'www.sablia.io',
      '',
    ]) {
      expect(websiteIdFor(other)).toBeNull()
    }
  })
})

describe('tier 1: the cookieless tracker', () => {
  beforeEach(reset)

  it('injects the first-party tracker once, with the preview website id on the preview host', () => {
    visit('https://preview.sablia.io/ressources')
    expect(startAnalytics()).toBe(true)
    expect(startAnalytics()).toBe(false)
    const tag = scripts('tracker')
    expect(tag).toHaveLength(1)
    expect(tag[0].getAttribute('src')).toBe('/m/a.js')
    expect(tag[0].getAttribute('data-website-id')).toBe(WEBSITE_IDS['preview.sablia.io'])
    expect(tag[0].getAttribute('data-host-url')).toBe('https://preview.sablia.io/m')
    expect(tag[0].hasAttribute('data-exclude-search')).toBe(false)
    expect(tag[0].getAttribute('data-before-send')).toBe(BEFORE_SEND_NAME)
    expect(typeof (window as unknown as Record<string, unknown>)[BEFORE_SEND_NAME]).toBe('function')
    expect(tag[0].getAttribute('data-domains')).toBe('preview.sablia.io')
    expect(tag[0].hasAttribute('defer')).toBe(true)
    expect(tag[0].hasAttribute('data-do-not-track')).toBe(false)
    expect(tag[0].hasAttribute('data-distinct-id')).toBe(false)
  })

  it('stays silent on any other host (localhost, a Vercel preview, a stranger mirroring the site)', () => {
    for (const url of ['http://localhost:5000/', 'https://sablia-site-git-x.vercel.app/']) {
      resetAnalyticsForTests()
      visit(url)
      expect(startAnalytics()).toBe(false)
    }
    expect(scripts('tracker')).toHaveLength(0)
  })
})

describe('tier 2: the recorder only follows an explicit « accept »', () => {
  beforeEach(() => {
    reset()
    visit('https://sablia.io/')
  })

  it('loads nothing while the visitor has not chosen, or refused', () => {
    const reload = vi.fn()
    applyConsent(reload)
    expect(scripts('recorder')).toHaveLength(0)
    writeConsent(false)
    applyConsent(reload)
    expect(scripts('recorder')).toHaveLength(0)
    expect(recorderLoaded()).toBe(false)
    expect(reload).not.toHaveBeenCalled()
  })

  it('loads /m/r.js once after « accept », on the production website', () => {
    const reload = vi.fn()
    writeConsent(true)
    applyConsent(reload)
    applyConsent(reload)
    const tag = scripts('recorder')
    expect(tag).toHaveLength(1)
    expect(tag[0].getAttribute('src')).toBe('/m/r.js')
    expect(tag[0].getAttribute('data-website-id')).toBe(WEBSITE_IDS['sablia.io'])
    expect(tag[0].getAttribute('data-host-url')).toBe('https://sablia.io/m')
    expect(recorderLoaded()).toBe(true)
    expect(reload).not.toHaveBeenCalled()
  })

  it('reloads the page when consent is withdrawn after the recorder ran (it has no stop)', () => {
    const reload = vi.fn()
    writeConsent(true)
    applyConsent(reload)
    clearConsent()
    applyConsent(reload)
    expect(reload).toHaveBeenCalledTimes(1)
  })

  it('reloads when « accept » turns into « refuse »', () => {
    const reload = vi.fn()
    writeConsent(true)
    applyConsent(reload)
    writeConsent(false)
    applyConsent(reload)
    expect(reload).toHaveBeenCalledTimes(1)
  })
})

describe('UTM: only utm_source / utm_medium / utm_campaign survive the before-send hook', () => {
  const origin = 'https://sablia.io'

  it('keeps the three UTM keys and drops every other parameter and the hash', () => {
    expect(
      keepUtm(
        `${origin}/webinaire?t=tok&utm_source=linkedin&c=x&utm_medium=post&x=1&utm_campaign=webinaire-2026-11-19#inscription`,
      ),
    ).toBe(
      `${origin}/webinaire?utm_source=linkedin&utm_medium=post&utm_campaign=webinaire-2026-11-19#inscription`,
    )
  })

  it('returns the bare url when no UTM key is present, whatever else the query holds', () => {
    expect(keepUtm(`${origin}/?t=a&c=b&x=c`)).toBe(`${origin}/`)
    expect(keepUtm(`${origin}/formations`)).toBe(`${origin}/formations`)
  })

  it('drops utm_term, utm_content and look-alike keys', () => {
    expect(
      keepUtm(`${origin}/?utm_term=a&utm_content=b&utm_sourcex=c&xutm_source=d&utm_source=site`),
    ).toBe(`${origin}/?utm_source=site`)
  })

  it('passes a relative url or a non-url through without throwing', () => {
    expect(keepUtm('/webinaire?t=a&utm_source=youtube')).toBe('/webinaire?utm_source=youtube')
    expect(() => keepUtm('http://[bad')).not.toThrow()
  })

  it('rewrites payload.url and hands the payload back (cancel is never our call)', () => {
    const payload = {
      website: 'w',
      url: `${origin}/webinaire?t=tok&utm_source=newsletter`,
      title: 'x',
    }
    expect(beforeSend('event', payload)).toEqual({
      website: 'w',
      url: `${origin}/webinaire?utm_source=newsletter`,
      title: 'x',
    })
    const noUrl = { website: 'w' }
    expect(beforeSend('identify', noUrl)).toBe(noUrl)
  })

  it('trims payload.referrer too when it is our own site: relative (as the tracker sends it) or one of our hosts', () => {
    const rel = { url: `${origin}/`, referrer: '/newsletter?t=tok&utm_source=newsletter' }
    expect(beforeSend('event', rel).referrer).toBe('/newsletter?utm_source=newsletter')
    for (const host of [
      'https://sablia.io',
      'https://www.sablia.io',
      'https://preview.sablia.io',
    ]) {
      const own = { url: `${origin}/`, referrer: `${host}/webinaire?c=code&utm_medium=bar` }
      expect(beforeSend('event', own).referrer).toBe(`${host}/webinaire?utm_medium=bar`)
    }
  })

  it('leaves an external, look-alike, protocol-relative or empty referrer untouched', () => {
    for (const ref of [
      'https://www.linkedin.com/feed/?trk=abc',
      'https://sablia.io.example.com/?t=x',
      'https://notsablia.io/?t=x',
      '//cdn.example.com/?t=x',
      '',
    ]) {
      expect(beforeSend('event', { url: `${origin}/`, referrer: ref }).referrer).toBe(ref)
    }
  })

  it('is registered on window before the tracker script is attached', () => {
    resetAnalyticsForTests()
    visit('https://sablia.io/?utm_source=youtube')
    let registeredWhenAttached = false
    const append = document.head.appendChild.bind(document.head)
    vi.spyOn(document.head, 'appendChild').mockImplementation(((node: Node) => {
      registeredWhenAttached =
        typeof (window as unknown as Record<string, unknown>)[BEFORE_SEND_NAME] === 'function'
      return append(node)
    }) as typeof document.head.appendChild)
    startAnalytics()
    expect(registeredWhenAttached).toBe(true)
    vi.restoreAllMocks()
  })
})

describe('device exclusion: ?stats=off | on and the umami.disabled flag', () => {
  beforeEach(() => {
    reset()
    window.localStorage.clear()
  })

  it('?stats=off sets the flag, ?stats=on clears it, and ?stats leaves the URL', () => {
    visit('https://sablia.io/webinaire?stats=off&utm_source=linkedin')
    applyStatsParam()
    expect(window.localStorage.getItem('umami.disabled')).toBe('1')
    expect(statsDisabled()).toBe(true)
    expect(window.location.search).toBe('?utm_source=linkedin')
    visit('https://sablia.io/?stats=on')
    applyStatsParam()
    expect(window.localStorage.getItem('umami.disabled')).toBeNull()
    expect(statsDisabled()).toBe(false)
    expect(window.location.search).toBe('')
  })

  it('ignores any other stats value and any page without the parameter', () => {
    visit('https://sablia.io/?stats=maybe')
    applyStatsParam()
    expect(window.localStorage.getItem('umami.disabled')).toBeNull()
    visit('https://sablia.io/')
    applyStatsParam()
    expect(window.localStorage.getItem('umami.disabled')).toBeNull()
  })

  it('stops the tracker AND the recorder from being injected while the flag is set', () => {
    visit('https://sablia.io/')
    window.localStorage.setItem('umami.disabled', '1')
    writeConsent(true)
    expect(startAnalytics()).toBe(false)
    expect(loadRecorder()).toBe(false)
    expect(scripts('tracker')).toHaveLength(0)
    expect(scripts('recorder')).toHaveLength(0)
    window.localStorage.removeItem('umami.disabled')
    expect(startAnalytics()).toBe(true)
    expect(loadRecorder()).toBe(true)
  })
})
