import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * US-91, US-93, US-94, US-98: no training price in any visitor-text source file (part (a) of the
 * plan's « No-price oracle »; part (b), the built HTML, is V1's). Deliberately NOT scanned:
 * `home/scene` and `home/automatisations/content.ts` (animation sample prices, not training prices).
 * RED until the page units (U7..U12, U5) land: the new files do not exist and the old `formations`
 * and `top` copy still carries euros.
 */
const SRC = resolve(__dirname, '..')
const PRICE = /\d[\d\s .,]*\s?(€|euros?)/i

// US-104: `apres` left the home; the monthly block (`mensuel`, its price lives on the offer page only)
// and the talks (`conferences`, price in the quote) are scanned like every other home band.
const HOME = [
  'top',
  'mensuel',
  'offre',
  'formations',
  'conferences',
  'derriere',
  'webinaire',
  'faq',
]
const FILES = [
  ...HOME.map((d) => `components/home/${d}/content.ts`),
  'components/home/automatisations/heading.ts',
  'content/session-bar.ts',
]

function contentFilesUnder(dir: string): string[] {
  const root = join(SRC, dir)
  if (!existsSync(root)) return []
  const out: string[] = []
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const p = join(d, name)
      if (statSync(p).isDirectory()) walk(p)
      else if (name === 'content.ts') out.push(p.slice(SRC.length + 1))
    }
  }
  walk(root)
  return out
}

const ALL = [...FILES, ...contentFilesUnder('components/formations')]

describe('no training price in the visitor-text sources', () => {
  it('the oracle regex catches the shapes it is meant to', () => {
    for (const s of ['5 000 €', '1 500 euros', '4.750€', '600 euros', '2,500 €'])
      expect(PRICE.test(s), s).toBe(true)
    for (const s of ['six demi-journées', 'Jusqu’à 12 personnes', 'prix dans le devis'])
      expect(PRICE.test(s), s).toBe(false)
  })

  it.each(ALL)('%s exists', (rel) => {
    expect(existsSync(join(SRC, rel)), rel).toBe(true)
  })

  it.each(ALL)('%s carries no amount in euros', (rel) => {
    const file = join(SRC, rel)
    if (!existsSync(file)) return expect(existsSync(file), rel).toBe(true)
    expect(PRICE.exec(readFileSync(file, 'utf8'))?.[0] ?? null, rel).toBeNull()
  })
})
