import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { MONTHLY_LINE, MonthlyOfferLine } from './MonthlyOfferLine'

/**
 * The line toward the monthly offer, just before the closing band of `/formations`, `/conferences` and
 * `/realisations` (Brice at VP2, 13/11, question 8: « j'ajoute avant le bouton final une ligne qui mène à
 * l'offre mensuelle »). Its words are the home's first door and the home's monthly link (copy deck B2
 * `home.door.1.label`, `home.door.1.line`, `home.mensuel.link`), typed here as the deck has them, never
 * read back from the source. A link, never a booking button: the pages pin their count.
 */
const decode = (s: string) => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&')
const textOf = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/[\s  ]+/g, ' ')
const css = readFileSync(join(__dirname, 'monthly-offer-line.css'), 'utf8')

describe('MONTHLY_LINE copy', () => {
  it('is the home first door, said as one sentence, and the home monthly link', () => {
    expect(MONTHLY_LINE.lead).toBe('Responsable IA externalisé')
    expect(MONTHLY_LINE.text).toBe("quelqu'un qui construit et entretient vos outils, chaque mois.")
    expect(MONTHLY_LINE.cta).toBe("Voir l'offre mensuelle")
    expect(MONTHLY_LINE.href).toBe('/responsable-ia-externalise')
  })
})

describe('MonthlyOfferLine', () => {
  for (const ground of ['rose', 'sand', 'paper'] as const) {
    it(`renders on the ${ground} ground: one sentence, one link to the offer page, zone « mensuel »`, () => {
      const html = decode(renderToString(<MonthlyOfferLine ground={ground} />))
      expect(html).toMatch(new RegExp(`class="v2-monthly-line is-${ground}"`))
      expect(html.match(/data-zone="mensuel"/g)).toHaveLength(1)
      expect(textOf(html)).toContain(
        "Responsable IA externalisé : quelqu'un qui construit et entretient vos outils, chaque mois.",
      )
      const links = [...html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      expect(links.map((m) => m[1])).toEqual(['/responsable-ia-externalise'])
      expect(textOf(links[0]?.[2] ?? '').trim()).toBe("Voir l'offre mensuelle")
      expect(html).not.toContain('<button')
      expect(html).not.toContain('data-cta-book')
    })
  }

  it('keeps the room the closing band dune overlaps, the grounds of the three pages and a 44 px link', () => {
    // the #fin dune straddles 80 px above the band's top edge (dune.css `top: -79px`)
    const room = [...css.matchAll(/padding-bottom:\s*(\d+)px/g)].map((m) => Number(m[1]))
    expect(room.length).toBeGreaterThanOrEqual(2)
    for (const px of room) expect(px).toBeGreaterThanOrEqual(96)
    expect(css).toMatch(/\.is-rose\s*\{\s*background:\s*#f2e3df;/)
    expect(css).toMatch(/\.is-sand\s*\{\s*background:\s*#f4ecdd;/)
    expect(css).toMatch(/\.is-paper\s*\{\s*background:\s*#fbf7f0;/)
    expect(css).toMatch(/\.ml-cta\s*\{[^}]*min-height:\s*44px/)
  })
})
