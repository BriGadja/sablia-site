import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  CONSENT_TTL_MS,
  clearConsent,
  hasReplayConsent,
  OPEN_EVENT,
  readConsent,
  requestConsentBanner,
  writeConsent,
} from './consent'

/**
 * US-66: the visitor's choice. Silence, a corrupt value, an expired value and an unavailable
 * storage all mean "no consent" — the recorder is only ever loaded on an explicit, fresh « accept ».
 */
const NOW = Date.parse('2026-10-20T10:00:00Z')

beforeEach(() => {
  window.localStorage.clear()
  clearConsent()
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('consent storage', () => {
  it('has no consent before the visitor chose', () => {
    expect(readConsent(NOW)).toBeNull()
    expect(hasReplayConsent(NOW)).toBe(false)
  })

  it('stores the choice as {v:1, replay, at} under sablia_consent', () => {
    writeConsent(true, NOW)
    expect(JSON.parse(window.localStorage.getItem(CONSENT_KEY) as string)).toEqual({
      v: 1,
      replay: true,
      at: '2026-10-20T10:00:00.000Z',
    })
    expect(readConsent(NOW)).toEqual({ v: 1, replay: true, at: '2026-10-20T10:00:00.000Z' })
    expect(hasReplayConsent(NOW)).toBe(true)
  })

  it('remembers a refusal as a decision (replay false), not as silence', () => {
    writeConsent(false, NOW)
    expect(readConsent(NOW)?.replay).toBe(false)
    expect(hasReplayConsent(NOW)).toBe(false)
  })

  it('expires after 6 months and asks again', () => {
    writeConsent(true, NOW)
    expect(readConsent(NOW + CONSENT_TTL_MS - 1000)).not.toBeNull()
    expect(readConsent(NOW + CONSENT_TTL_MS + 1000)).toBeNull()
    expect(hasReplayConsent(NOW + CONSENT_TTL_MS + 1000)).toBe(false)
    expect(CONSENT_TTL_MS).toBeGreaterThanOrEqual(180 * 24 * 3600 * 1000)
    expect(CONSENT_TTL_MS).toBeLessThanOrEqual(184 * 24 * 3600 * 1000)
  })

  it('treats a corrupt, foreign or half-formed value as no consent', () => {
    for (const bad of [
      '{not json',
      'null',
      '"yes"',
      '{"v":2,"replay":true,"at":"2026-10-20T10:00:00Z"}',
      '{"v":1,"replay":"true","at":"2026-10-20T10:00:00Z"}',
      '{"v":1,"replay":true}',
      '{"v":1,"replay":true,"at":"not a date"}',
    ]) {
      window.localStorage.setItem(CONSENT_KEY, bad)
      expect(readConsent(NOW)).toBeNull()
      expect(hasReplayConsent(NOW)).toBe(false)
    }
  })

  it('refuses a consent dated in the future (clock tampering)', () => {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ v: 1, replay: true, at: '2030-01-01T00:00:00.000Z' }),
    )
    expect(readConsent(NOW)).toBeNull()
  })

  it('withdraws: clearConsent removes the stored choice', () => {
    writeConsent(true, NOW)
    clearConsent()
    expect(window.localStorage.getItem(CONSENT_KEY)).toBeNull()
    expect(readConsent(NOW)).toBeNull()
  })
})

describe('storage unavailable (private window, blocked site data)', () => {
  it('never throws, and the choice lasts only for the page', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readConsent(NOW)).toBeNull()
    expect(() => writeConsent(true, NOW)).not.toThrow()
    expect(hasReplayConsent(NOW)).toBe(true)
    expect(() => clearConsent()).not.toThrow()
    expect(hasReplayConsent(NOW)).toBe(false)
  })
})

describe('events', () => {
  it('announces every change, so the loader and the banner follow the choice', () => {
    const seen: string[] = []
    const on = () => seen.push('consent')
    window.addEventListener(CONSENT_EVENT, on)
    writeConsent(true, NOW)
    clearConsent()
    window.removeEventListener(CONSENT_EVENT, on)
    expect(seen).toEqual(['consent', 'consent'])
  })

  it('lets the footer link ask for the banner back', () => {
    const open = vi.fn()
    window.addEventListener(OPEN_EVENT, open)
    requestConsentBanner()
    window.removeEventListener(OPEN_EVENT, open)
    expect(open).toHaveBeenCalledTimes(1)
  })
})
