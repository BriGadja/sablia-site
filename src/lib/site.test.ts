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

/** U13a: the tagline is the home's promise (01b `home.meta.title` without « · Sablia »), never the CRM agency. */
describe('site tagline', () => {
  it('says the training, not the CRM agency', () => {
    expect(site.tagline).toBe("Formation à l'IA pour votre équipe, sur ses dossiers")
  })
})
