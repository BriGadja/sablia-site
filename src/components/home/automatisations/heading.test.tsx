import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { EYEBROW, LINE, SR_INTRO, TITLE } from './heading'
import { Automatisations } from './index'

/**
 * Plan site-formation-lot1, U9: the agents band is reframed as « what the team knows after three
 * days ». Its framing lives in `heading.ts` (the file the red-line guard reads); the five scenes in
 * `content.ts` are unchanged and stay out of the guard (their sample prices are not training prices).
 */
const html = renderToString(<Automatisations />).replace(/&#x27;/g, "'")

describe('heading copy (01b « Après trois jours »)', () => {
  it('carries the 01b wording', () => {
    expect(EYEBROW).toBe('Après trois jours')
    expect(TITLE).toBe('Ce que votre équipe sait faire.')
    expect(LINE).toBe(
      "Confier à Claude les tâches qui reviennent, avec vos documents et vos règles, puis relire ce qu'il produit.",
    )
    expect(SR_INTRO).toMatch(/^Exemples animés de tâches qu'une équipe formée confie à Claude\./)
  })

  it('has no em dash, no amount, no banned wording', () => {
    const all = [EYEBROW, TITLE, LINE, SR_INTRO].join(' ')
    expect(all).not.toMatch(/—|€|euros?\b|IAPreneurs|CPF|finançable|certifié|Qualiopi/i)
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
