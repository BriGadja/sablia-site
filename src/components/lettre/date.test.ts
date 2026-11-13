import { describe, expect, it } from 'vitest'
import { parisDate } from './date'

describe('parisDate: the visible date of an issue, the Paris day of its send instant', () => {
  it('reads the instant in Paris, not in UTC', () => {
    expect(parisDate('2026-11-16T23:30:00+00:00')).toBe('17 novembre 2026')
    expect(parisDate('2026-11-17T07:30:00+00:00')).toBe('17 novembre 2026')
    expect(parisDate('2026-07-06T22:30:00+00:00')).toBe('7 juillet 2026')
  })

  it('writes the first of the month « 1er »', () => {
    expect(parisDate('2026-12-01T07:30:00+00:00')).toBe('1er décembre 2026')
  })

  it('answers an empty string for an instant it cannot read', () => {
    expect(parisDate('pas une date')).toBe('')
  })

  it('answers an empty string for a missing instant, never « 1er janvier 1970 »', () => {
    expect(parisDate(null)).toBe('')
    expect(parisDate(undefined)).toBe('')
    expect(parisDate('')).toBe('')
  })
})
