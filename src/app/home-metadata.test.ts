import { describe, expect, it } from 'vitest'
import { homeMetadata } from './home-metadata'

/** U13a: the home's title and description, transcribed from 01b (`home.meta.*`): training first, no price. */
describe('home metadata', () => {
  const title = (homeMetadata.title as { absolute: string }).absolute
  const description = String(homeMetadata.description)

  it('title and description are the 01b strings', () => {
    expect(title).toBe("Formation à l'IA pour votre équipe, sur ses dossiers · Sablia")
    expect(description).toBe(
      "Trois jours dans vos locaux, jusqu'à 12 personnes : votre équipe apprend à travailler avec Claude sur ses propres dossiers. Premier pas : un webinaire gratuit d'une heure, le jeudi midi.",
    )
  })

  it('no em dash, no CRM sentence, no euro amount', () => {
    for (const s of [title, description]) {
      expect(s).not.toContain('—')
      expect(s).not.toMatch(/CRM/)
      expect(s).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
    }
  })
})
