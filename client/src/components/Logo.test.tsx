import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo, { LOGO_COLOUR, SYMBOL_PATH } from './Logo'

const PUBLIC = resolve(dirname(fileURLToPath(import.meta.url)), '../../public')
const read = (name: string) => readFileSync(resolve(PUBLIC, name), 'utf8')

/**
 * US-12. The nav and footer draw the symbol inline; the favicon set and the OG images are generated
 * from `brand/symbol.svg` and `brand/badge.svg` (scripts/brand-assets.py). One geometry for all of
 * them: the badge cuts the symbol's own path out of its coral square (Brice, 2026-09-29: mark 3,
 * with mark 12 « pour ajouter un fond quand nécessaire »).
 */
describe('Logo', () => {
  it('draws the path and colour of brand/symbol.svg', () => {
    const symbol = read('brand/symbol.svg')
    expect(symbol).toContain(`d="${SYMBOL_PATH}"`)
    expect(symbol).toContain(`stroke="${LOGO_COLOUR}"`)
  })

  it('the badge cuts out that same path', () => {
    const badge = read('brand/badge.svg')
    expect(badge).toContain(`d="${SYMBOL_PATH}"`)
    expect(badge).toContain(`fill="${LOGO_COLOUR}"`)
    expect(badge).toMatch(/<mask /)
  })

  it('is one image named « Sablia », the word in the display font', () => {
    const { container } = render(<Logo tone="light" />)
    const root = container.firstElementChild
    expect(root?.getAttribute('role')).toBe('img')
    expect(root?.getAttribute('aria-label')).toBe('Sablia')
    expect(container.querySelector('path')?.getAttribute('d')).toBe(SYMBOL_PATH)
    expect(container.querySelector('path')?.getAttribute('stroke')).toBe(LOGO_COLOUR)
    expect(container.querySelector('.font-display')?.textContent).toBe('Sablia')
  })
})
