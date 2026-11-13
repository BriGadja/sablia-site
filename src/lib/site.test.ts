import { describe, expect, it } from 'vitest'
import { site } from './site'

/** US-93: the training buttons open « Échange de 30 minutes »; the CRM keeps its own event type. */
describe('site booking urls', () => {
  it('formationBookingUrl is the « Échange de 30 minutes » event', () => {
    expect(site.formationBookingUrl).toBe('https://calendly.com/brice-gachadoat/echange-30-minutes')
  })

  it('bookingUrl (CRM) is unchanged', () => {
    expect(site.bookingUrl).toBe('https://calendly.com/brice-gachadoat/30min')
  })
})

/** US-100: Sablia is in Rouen (Normandie); the registered office stays on the legal pages. */
describe('site locality', () => {
  it('says Rouen and Normandie', () => {
    expect(site.locality).toBe('Rouen')
    expect(site.region).toBe('Normandie')
  })
})

/**
 * US-104: the tagline is the home's title without « · Sablia » (copy deck B2 `home.tagline`): what
 * Sablia does, for whom, where; never the CRM agency. `public/manifest.json` repeats it (its own test
 * in scripts/seo/head-hygiene.test.mjs).
 */
describe('site tagline', () => {
  it('is the home title without « · Sablia »', () => {
    expect(site.tagline).toBe("Outils d'IA et formation pour les PME, à Rouen")
  })
})
