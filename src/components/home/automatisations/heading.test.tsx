import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { EYEBROW, LINE, SR_INTRO, TITLE } from './heading'
import { Automatisations } from './index'

/**
 * US-104 (plan sablia-site-structure-offre E5, copy deck B2 `home.auto.*`): the agents band now shows
 * what the offer builds, no longer « after three days ». Its framing lives in `heading.ts` (the file
 * the red-line guard reads); the five scenes in `content.ts` are unchanged and stay out of the guard
 * (their sample prices are not training prices).
 */
const html = renderToString(<Automatisations />).replace(/&#x27;/g, "'")

describe('heading copy (deck « Ce que je construis »)', () => {
  it('carries the deck wording', () => {
    expect(EYEBROW).toBe('Ce que je construis')
    expect(TITLE).toBe('Les tâches qui reviennent, confiées à Claude.')
    // Adversarial review K6 (dir-7): « elle » could read as Claude; the team is named again.
    expect(LINE).toBe(
      "Chaque outil part d'une tâche que votre équipe fait déjà : Claude prépare, et votre équipe relit et valide.",
    )
    expect(SR_INTRO).toBe(
      "Exemples animés d'outils construits sur des tâches qui reviennent. Pour chaque cas, une demande arrive et Claude produit ce que vous validez : un devis, un mail envoyé à la bonne personne, le résumé de la veille du matin, les documents d'une intervention, le compte rendu d'une séance et son mail de suivi.",
    )
  })

  it('no longer frames the band as « after three days » of training', () => {
    const all = [EYEBROW, TITLE, LINE, SR_INTRO].join(' ')
    expect(all).not.toMatch(/trois jours|équipe formée/i)
  })

  it('has no em dash, no amount, no banned wording', () => {
    const all = [EYEBROW, TITLE, LINE, SR_INTRO].join(' ')
    expect(all).not.toMatch(/—|€|euros?\b|IAPreneurs|CPF|finançable|certifié|Qualiopi/i)
    expect(all).not.toMatch(/audit|référent|temps partagé/i)
  })
})

describe('the band renders the new framing', () => {
  it('shows the eyebrow, the h2 and the line in the static HTML', () => {
    expect(html).toContain(`>${EYEBROW}<`)
    expect(html).toMatch(new RegExp(`<h2 class="auto-h2">${TITLE.replace('.', '\\.')}</h2>`))
    expect(html).toContain(`<p class="auto-line">${LINE}</p>`)
    expect(html).toContain(SR_INTRO)
  })

  it('the old CRM-era framing is gone', () => {
    expect(html).not.toContain('Le même principe, partout où ça se répète.')
    expect(html).not.toContain('>Automatisations<')
  })

  it('keeps the section id and the five scene chips', () => {
    expect(html).toContain('id="automatisations"')
    for (const label of [
      'Un devis',
      'Un nouveau lead',
      'Une veille',
      'Une intervention',
      'Une séance',
    ])
      expect(html).toContain(label)
  })

  it('the framing is read from heading.ts, not from the scenes file', () => {
    const src = (f: string) => readFileSync(join(__dirname, f), 'utf8')
    expect(src('index.tsx')).toMatch(/from '\.\/heading'/)
    expect(src('content.ts')).not.toMatch(/SR_INTRO/)
  })
})
