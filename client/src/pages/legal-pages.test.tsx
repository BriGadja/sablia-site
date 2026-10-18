import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it } from 'vitest'
import MentionsLegales from './MentionsLegales'
import PolitiqueConfidentialite from './PolitiqueConfidentialite'

/**
 * US-65 / US-66 / lot 0 VPS (plan R11, R12): the legal pages say what the site now does — it is
 * hosted on our own server (Hostinger), it measures its audience without cookie, it records
 * screens only after « Tout accepter », YouTube loads after a click, backups are encrypted.
 */
const text = (ui: React.ReactElement) => {
  const { container } = render(<HelmetProvider>{ui}</HelmetProvider>)
  return container.textContent ?? ''
}

describe('politique de confidentialité', () => {
  const t = text(<PolitiqueConfidentialite />)

  it('has a section on audience measurement and screen recording, with the retention periods', () => {
    expect(t).toContain("Mesure d'audience et enregistrement des écrans")
    expect(t).toContain('sans cookie')
    expect(t).toContain('25 mois')
    expect(t).toContain('180 jours')
  })

  it('says the recording needs « Tout accepter », never covers forms, and can be withdrawn', () => {
    expect(t).toContain('Tout accepter')
    expect(t).toMatch(/formulaires? ne sont jamais enregistrés/)
    expect(t).toContain('Gérer mes choix')
  })

  it('says YouTube is loaded only after a click', () => {
    expect(t).toMatch(/YouTube[^.]*uniquement après un clic/)
  })

  it('lists the real hosting chain: own server at Hostinger, Resend, Supabase, Calendly, encrypted backups', () => {
    expect(t).toContain('Hostinger')
    expect(t).toContain('Resend')
    expect(t).toContain('Supabase')
    expect(t).toContain('Calendly')
    expect(t).toMatch(/sauvegardes chiffrées/)
    expect(t).not.toContain('Vercel Inc.')
  })

  it('no longer claims that only Calendly cookies exist without mentioning the choice storage', () => {
    expect(t).toContain('sablia_consent')
  })
})

describe('mentions légales', () => {
  // The contracting entity for a customer in France is the Cyprus company: Hostinger's Universal Terms
  // of Service § 2 (« any other country not listed above (including EU countries) »), France being in
  // neither Group No. 1 nor Group No. 2 of hostinger.com/legal/list-of-countries (read 2026-10-18).
  it('names the Hostinger entity that contracts with a French customer, no longer Vercel', () => {
    const t = text(<MentionsLegales />)
    expect(t).toContain('HOSTINGER INTERNATIONAL LIMITED')
    expect(t).toContain('61 Lordou Vironos str., 6023 Larnaca, Chypre')
    expect(t).not.toContain('Vilnius')
    expect(t).not.toContain('Vercel Inc.')
  })
})
