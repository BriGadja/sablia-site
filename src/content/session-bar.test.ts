import { describe, expect, it } from 'vitest'
import { BAR, barShownOn, SESSION_START, sessionUpcoming } from './session-bar'
import { NEXT_WEBINAR_BANNER, PATHS, SESSION } from './webinaire'

/** US-92: the bar lives until the session starts, never on /webinaire* (Data contract « Session facts »). */
describe('SESSION_START', () => {
  it('is 19/11/2026 12:00 Paris', () => {
    expect(SESSION_START).toBe('2026-11-19T12:00:00+01:00')
  })
})

describe('sessionUpcoming', () => {
  it('is true well before, and one second before, the start', () => {
    expect(sessionUpcoming(new Date('2026-11-01T10:00:00+01:00'))).toBe(true)
    expect(sessionUpcoming(new Date('2026-11-19T11:59:59+01:00'))).toBe(true)
  })

  it('is false at the start second and after', () => {
    expect(sessionUpcoming(new Date('2026-11-19T12:00:00+01:00'))).toBe(false)
    expect(sessionUpcoming(new Date('2026-11-19T12:00:01+01:00'))).toBe(false)
    expect(sessionUpcoming(new Date('2026-12-15T09:00:00+01:00'))).toBe(false)
  })
})

describe('barShownOn', () => {
  it.each([
    '/',
    '/formations',
    '/accompagnement',
    '/realisations',
    '/offres/compte-rendu-appel/hubspot',
    '/webinaires',
    '/webinairex',
  ])('shows the bar on %s', (p) => {
    expect(barShownOn(p)).toBe(true)
  })

  it.each([
    '/webinaire',
    '/webinaire/',
    '/webinaire/merci',
    '/webinaire/merci/',
    '/webinaire/apres-reservation',
    '/webinaire/questionnaire',
  ])('hides the bar on %s', (p) => {
    expect(barShownOn(p)).toBe(false)
  })

  it('shows it when the pathname is unknown', () => {
    expect(barShownOn(null)).toBe(true)
  })
})

/** US-92, plan site-formation-lot1 U5: the bar copy is 01b § 0, date and title derived from SESSION (never typed twice). */
describe('BAR', () => {
  it('carries the 01b strings', () => {
    expect(BAR.aria).toBe('Prochain webinaire')
    expect(BAR.label).toBe('Webinaire gratuit')
    expect(BAR.cta).toBe("Je m'inscris")
    expect(BAR.href).toBe('/webinaire')
    expect(BAR.text).toBe(
      "Jeudi 19 novembre à 12 h : « Bureaux d'études : votre équipe utilise déjà l'IA. Avec quelles règles ? »",
    )
    expect(BAR.textShort).toBe("Jeudi 19 novembre, 12 h · bureaux d'études")
  })

  it('derives its text from SESSION, so it agrees with the shipped banner constant', () => {
    expect(BAR.text).toBe(NEXT_WEBINAR_BANNER.text)
    expect(BAR.text).toContain(SESSION.title)
    expect(BAR.href).toBe(PATHS.page)
  })

  it('SESSION_START agrees with the session page (same day, same start hour)', () => {
    expect(SESSION_START.slice(0, 10)).toBe(SESSION.slug)
    expect(SESSION.hours).toMatch(new RegExp(`^de ${Number(SESSION_START.slice(11, 13))} h `))
  })
})
