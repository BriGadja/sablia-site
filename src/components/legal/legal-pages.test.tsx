import { describe, expect, it } from 'vitest'
import MentionsLegales from '@/app/mentions-legales/page'
import PolitiqueConfidentialite from '@/app/politique-confidentialite/page'
import { text } from '@/components/legal/helpers.test-util'

/**
 * US-65 / US-66 / lot 0 VPS: the legal pages say what the site now does (own server at Hostinger, audience
 * measurement without cookie, recording only after « Tout accepter », YouTube after a click, encrypted backups).
 */
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

  it('lists the real hosting chain, with encrypted backups', () => {
    for (const w of ['Hostinger', 'Resend', 'Supabase', 'Calendly']) expect(t).toContain(w)
    expect(t).toMatch(/sauvegardes chiffrées/)
    expect(t).not.toContain('Vercel Inc.')
  })

  it('names the choice storage key', () => {
    expect(t).toContain('sablia_consent')
  })

  // US-84: the Tuesday letter is a processing of its own, on consent.
  it('has a Newsletter section: purpose, consent, data, no tracking, retention, unsubscribe, rights', () => {
    expect(t).toContain('Newsletter')
    expect(t).toContain("L'IA au travail")
    expect(t).toMatch(/Base légale : votre consentement/)
    expect(t).toMatch(/case[^.]*formulaire du site/)
    expect(t).toMatch(/lien de confirmation/)
    expect(t).toMatch(/bouton[^.]*invitation/)
    expect(t).toMatch(
      /prénom, votre adresse email[^.]*dates de votre inscription et de votre désinscription/,
    )
    expect(t).toContain("Aucun suivi d'ouverture ni de clic")
    expect(t).toMatch(/non confirmée est effacée sous 7 jours/)
    expect(t).toContain("jusqu'à votre désinscription")
    expect(t).toContain('un lien dans chaque lettre')
    expect(t).toContain('brice@sablia.io')
  })

  it('Newsletter: Resend also sends the Tuesday letter, from the United States under standard contractual clauses', () => {
    expect(t).toContain(
      'envoi des emails de confirmation, des notifications internes et de la lettre du mardi (newsletter)',
    )
    expect(t).toContain(
      'Resend héberge ses données aux États-Unis, sous clauses contractuelles types',
    )
  })
})

describe('mentions légales', () => {
  // Hostinger's Universal Terms of Service § 2: the contracting entity for a customer in France is the Cyprus company.
  const t = text(<MentionsLegales />)
  it('names the Hostinger entity that contracts with a French customer, no longer Vercel', () => {
    expect(t).toContain('HOSTINGER INTERNATIONAL LIMITED')
    expect(t).toContain('61 Lordou Vironos str., 6023 Larnaca, Chypre')
    expect(t).not.toContain('Vilnius')
    expect(t).not.toContain('Vercel Inc.')
  })
  it('names the editor and says nothing the content gate bans', () => {
    expect(t).toContain('SIRET : 94090112700016')
    expect(t).not.toMatch(/IAPreneurs/i)
  })
})
