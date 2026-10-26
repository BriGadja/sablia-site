import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyConsent,
  loadRecorder,
  recorderLoaded,
  resetAnalyticsForTests,
  startAnalytics,
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
    expect(tag[0].getAttribute('data-exclude-search')).toBe('true')
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
