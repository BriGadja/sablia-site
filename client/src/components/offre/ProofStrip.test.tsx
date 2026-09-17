import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { of1 } from '@/content/of1'
import { DOGFOODING_LINE, FOUNDER_LINE, PROOF_DEMO_URL } from '@/content/proof'
import ProofStrip, { keepPricesWhole } from './ProofStrip'

const HERE = dirname(fileURLToPath(import.meta.url))
const SOURCE = readFileSync(resolve(HERE, 'ProofStrip.tsx'), 'utf8')
const CONTENT_SOURCE = readFileSync(resolve(HERE, '../../content/proof.ts'), 'utf8')

describe('ProofStrip: what it renders', () => {
  it('renders the guarantee from the offer module, not a retyped copy', () => {
    render(<ProofStrip />)
    expect(screen.getByText(of1.guarantee)).toBeTruthy()
    // The component must read the module; a literal pasted into the strip would drift from OF-1.
    expect(SOURCE).not.toContain('intégralement remboursés')
    expect(CONTENT_SOURCE).toContain('of1.guarantee')
  })

  it('welds the price so it never breaks across two lines', () => {
    expect(keepPricesWhole('les 1 490 € HT versés')).toBe('les 1\u00a0490\u00a0€ HT versés')
    expect(keepPricesWhole(of1.guarantee)).toContain('1\u00a0490\u00a0€')
    expect(keepPricesWhole('rien : 149 € par mois')).toBe('rien : 149 € par mois')
  })

  it('renders the dogfooding line and the founder line', () => {
    render(<ProofStrip />)
    expect(screen.getByText(DOGFOODING_LINE)).toBeTruthy()
    expect(screen.getByText(FOUNDER_LINE)).toBeTruthy()
  })

  it('states the dogfooding line in the near future while the chain has no real report', () => {
    expect(DOGFOODING_LINE).toContain('seront écrits par elle')
  })
})

describe('ProofStrip: the demonstration slot', () => {
  it('renders no demonstration block, and no placeholder, while no recording exists', () => {
    expect(PROOF_DEMO_URL).toBeNull()
    render(<ProofStrip />)
    expect(screen.queryByText(/Voir la démonstration/)).toBeNull()
    expect(screen.queryByText(/à venir|bientôt|prochainement/i)).toBeNull()
  })

  it('gates the block on the URL rather than on a flag that could drift from it', () => {
    expect(SOURCE).toContain('PROOF_DEMO_URL !== null')
  })
})

describe('ProofStrip: house rules', () => {
  it('names no client and calls nothing a client quote', () => {
    for (const banned of [
      'Norloc',
      'Nestenn',
      'Qwertys',
      'VB Mobilier',
      'Valentin',
      'témoignage',
    ]) {
      expect(`${SOURCE}\n${CONTENT_SOURCE}`.toLowerCase()).not.toContain(banned.toLowerCase())
    }
  })

  it('uses no `any` and no em dash', () => {
    for (const text of [SOURCE, CONTENT_SOURCE]) {
      expect(text).not.toMatch(/:\s*any\b|\bas any\b|<any>/)
      expect(text).not.toMatch(/[—―]/)
    }
  })
})
