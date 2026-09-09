/**
 * Coherence guard between the home page (and the guide it links) and the offer the site sells.
 *
 * Found 2026-09-09, the day the OF-1 product page went live: the home still sold
 * "1 000 à 2 000 €", "sous 30 jours" and "2–4 semaines" one click away from a page saying
 * 1 490 € HT delivered in 7 days. Nothing could go red. This test binds the landing's figures to
 * the typed OF-1 module: the price, the delay, the monthly fee and the brick rule come from
 * `@/content/of1`, so a change there propagates or fails here.
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { OF1_ROUTE, of1 } from '../../content/of1'
import { eurHt } from '../../lib/format'
import { FAQ } from './FaqSection'
import { STEPS } from './ProcessSection'

const HERE = dirname(fileURLToPath(import.meta.url))
const SOURCES = [
  resolve(HERE, 'FaqSection.tsx'),
  resolve(HERE, 'ProcessSection.tsx'),
  resolve(HERE, 'CalloutSection.tsx'),
  resolve(HERE, 'HeroSection.tsx'),
  resolve(HERE, 'UseCases.tsx'),
  resolve(HERE, 'ProblemsSection.tsx'),
  resolve(HERE, '../../pages/GuideIaEntreprise.tsx'),
].map((path) => ({ path, text: readFileSync(path, 'utf8') }))

/** Claims of the pre-catalogue discourse. Each one was displayed on sablia.io on 2026-09-09. */
const STALE_CLAIMS: RegExp[] = [
  /1 000 et 2 000/,
  /sous 30 jours/,
  /2[–-]4 semaines/,
  /chiffrés? sous 5 jours/,
  /apr[èe]s (le call )?audit, jamais avant/,
]

const faqText = FAQ.map((item) => `${item.q} ${item.a}`).join('\n')
const stepsText = STEPS.map((step) => `${step.title} ${step.desc} ${step.dur}`).join('\n')

describe('landing copy: no claim of the pre-catalogue discourse survives', () => {
  for (const source of SOURCES) {
    it(`${source.path.split('/').slice(-1)[0]} carries none of the stale claims`, () => {
      for (const claim of STALE_CLAIMS) {
        expect(source.text).not.toMatch(claim)
      }
    })
  }
})

describe('landing copy: the figures are the offer figures', () => {
  it('the FAQ prices the catalogue offer at OF-1 price and delay, and names the brick floor', () => {
    expect(faqText).toContain(eurHt(of1.price.oneShotHt))
    expect(faqText).toContain(`${of1.price.monthlyHt} € HT`)
    expect(faqText).toContain(`${of1.delay.days} jours`)
    expect(faqText).toContain(eurHt(of1.price.brickFloorHt))
  })

  it('the FAQ links to the product page', () => {
    expect(FAQ.some((item) => item.href === OF1_ROUTE)).toBe(true)
  })

  it('the process states the offer delay and the recurring fee', () => {
    expect(stepsText).toContain(`${of1.delay.days} jours`)
    expect(stepsText).toContain(`${of1.price.monthlyHt} €`)
  })

  it('the process no longer promises training beyond what OF-1 includes', () => {
    expect(stepsText.toLowerCase()).not.toContain('formation')
    const processSource = SOURCES.find((s) => s.path.endsWith('ProcessSection.tsx'))
    expect(processSource?.text.toLowerCase()).not.toContain('formons')
  })

  it('the guide states the same price and delay as the offer', () => {
    const guide = SOURCES.find((s) => s.path.endsWith('GuideIaEntreprise.tsx'))
    expect(guide?.text).toContain('of1.price.oneShotHt')
    expect(guide?.text).toContain('of1.delay.days')
  })
})
