import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { initAnalytics, resetAnalyticsForTests } from '@/lib/analytics'
import {
  CONSENT_KEY,
  clearConsent,
  readConsent,
  requestConsentBanner,
  writeConsent,
} from '@/lib/consent'
import ConsentBanner from './ConsentBanner'

/**
 * US-66: refusing is as easy as accepting, silence is a refusal, the recorder exists only after
 * « Tout accepter », and the choice can be taken back from the footer.
 */
type TestWindow = Window & {
  __SABLIA_PRERENDER__?: boolean
  happyDOM: { setURL: (url: string) => void }
}
const recorderTags = () => document.head.querySelectorAll('script[data-sablia="recorder"]')
const refuse = () => screen.getByRole('button', { name: 'Tout refuser' })
const accept = () => screen.getByRole('button', { name: 'Tout accepter' })

let reload: ReturnType<typeof vi.fn>

beforeEach(() => {
  ;(window as unknown as TestWindow).happyDOM.setURL('https://sablia.io/')
  window.localStorage.clear()
  clearConsent()
  resetAnalyticsForTests()
  document.head.replaceChildren()
  delete (window as unknown as TestWindow).__SABLIA_PRERENDER__
  reload = vi.fn()
  Object.defineProperty(window.location, 'reload', { value: reload, configurable: true })
  initAnalytics()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('ConsentBanner: the offer', () => {
  it('appears for a visitor who has not chosen, as a labelled, non-modal region', () => {
    render(<ConsentBanner />)
    const region = screen.getByRole('region', { name: /confidentialité/i })
    expect(region.hasAttribute('data-consent-banner')).toBe(true)
    expect(region.getAttribute('aria-modal')).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(region.textContent).toContain('Aidez-nous à améliorer ce site')
    expect(region.textContent).toContain('sans cookie')
    expect(region.textContent).toContain('jamais enregistrés')
    expect(screen.getByRole('link', { name: 'En savoir plus' }).getAttribute('href')).toBe(
      '/politique-confidentialite',
    )
  })

  it('gives « Tout refuser » and « Tout accepter » the same size, weight and row, refusal first', () => {
    render(<ConsentBanner />)
    const a = refuse()
    const b = accept()
    expect(a.className).toBe(b.className)
    expect(a.parentElement).toBe(b.parentElement)
    expect(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    for (const button of [a, b]) {
      expect(button.getAttribute('type')).toBe('button')
      expect(button.getAttribute('tabindex')).not.toBe('-1')
      expect(button.hasAttribute('autofocus')).toBe(false)
    }
  })

  it('does not animate, cover the booking button, or hide behind a wall', () => {
    render(<ConsentBanner />)
    const region = screen.getByRole('region', { name: /confidentialité/i })
    expect(region.className).not.toMatch(/animate-|transition|duration-/)
    expect(region.className).toMatch(/max-h-40/)
    expect(region.className).not.toMatch(/inset-0\b/)
  })

  it('stays away from the prerender run and from a visitor who already chose', () => {
    ;(window as unknown as TestWindow).__SABLIA_PRERENDER__ = true
    const { container, unmount } = render(<ConsentBanner />)
    expect(container.querySelector('[data-consent-banner]')).toBeNull()
    unmount()
    delete (window as unknown as TestWindow).__SABLIA_PRERENDER__
    writeConsent(false)
    const second = render(<ConsentBanner />)
    expect(second.container.querySelector('[data-consent-banner]')).toBeNull()
  })
})

describe('ConsentBanner: the choice', () => {
  it('« Tout refuser » stores a refusal, closes, and never requests the recorder', () => {
    render(<ConsentBanner />)
    fireEvent.click(refuse())
    expect(readConsent()?.replay).toBe(false)
    expect(screen.queryByRole('region', { name: /confidentialité/i })).toBeNull()
    expect(recorderTags()).toHaveLength(0)
    expect(reload).not.toHaveBeenCalled()
  })

  it('« Tout accepter » stores the consent, closes, and requests the recorder exactly once', () => {
    render(<ConsentBanner />)
    fireEvent.click(accept())
    expect(JSON.parse(window.localStorage.getItem(CONSENT_KEY) as string).replay).toBe(true)
    expect(screen.queryByRole('region', { name: /confidentialité/i })).toBeNull()
    expect(recorderTags()).toHaveLength(1)
    expect(recorderTags()[0].getAttribute('src')).toBe('/m/r.js')
  })

  it('treats Escape as a refusal, stored (no endless re-asking)', () => {
    render(<ConsentBanner />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(readConsent()?.replay).toBe(false)
    expect(screen.queryByRole('region', { name: /confidentialité/i })).toBeNull()
    expect(recorderTags()).toHaveLength(0)
  })

  it('does nothing at all on silence: no stored choice, no recorder', () => {
    render(<ConsentBanner />)
    expect(readConsent()).toBeNull()
    expect(recorderTags()).toHaveLength(0)
  })
})

describe('ConsentBanner: taking the choice back (footer « Gérer mes choix »)', () => {
  it('reopens on request even after a choice', () => {
    writeConsent(false)
    render(<ConsentBanner />)
    expect(screen.queryByRole('region', { name: /confidentialité/i })).toBeNull()
    act(() => requestConsentBanner())
    expect(screen.getByRole('region', { name: /confidentialité/i })).toBeTruthy()
  })

  it('withdrawing an acceptance reloads the page, because the recorder has no stop', () => {
    render(<ConsentBanner />)
    fireEvent.click(accept())
    expect(recorderTags()).toHaveLength(1)
    act(() => requestConsentBanner())
    fireEvent.click(refuse())
    expect(readConsent()?.replay).toBe(false)
    expect(reload).toHaveBeenCalledTimes(1)
  })
})
