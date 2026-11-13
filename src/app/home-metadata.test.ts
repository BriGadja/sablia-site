import { describe, expect, it } from 'vitest'
import { homeMetadata } from './home-metadata'

/**
 * US-104 (plan sablia-site-structure-offre E1): the home's title and description are the copy deck's
 * `home.meta.*`: what Sablia does (the monthly offer, trainings, talks), for SMEs, in Rouen; no price.
 */
describe('home metadata', () => {
  const title = (homeMetadata.title as { absolute: string }).absolute
  const description = String(homeMetadata.description)

  it('title and description are the deck strings', () => {
    expect(title).toBe("Outils d'IA et formation pour les PME, à Rouen · Sablia")
    expect(description).toBe(
      "Sablia, à Rouen, met l'IA en place dans les PME : un responsable IA externalisé au mois, des formations et des conférences sur demande.",
    )
  })

  it('no em dash, no CRM sentence, no euro amount, no retired offer name', () => {
    for (const s of [title, description]) {
      expect(s).not.toContain('—')
      expect(s).not.toMatch(/CRM/)
      expect(s).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
      expect(s).not.toMatch(/temps partagé|référent|audit/i)
    }
  })
})
