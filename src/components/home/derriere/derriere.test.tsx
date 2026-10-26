import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { FOUNDER_LINE } from '@/content/proof'
import { CAREER, HEADING } from './content'
import { Derriere } from './index'

describe('#derriere static HTML', () => {
  const html = renderToString(<Derriere />).replace(/&#x27;/g, "'")

  it('is the #derriere section with the scoped class', () => {
    expect(html).toContain('id="derriere"')
    expect(html).toContain('v2-derriere')
  })

  it('carries the heading, the whole timeline and the photo alt', () => {
    expect(html).toContain(HEADING)
    for (const c of CAREER) {
      expect(html).toContain(c.period)
      expect(html).toContain(c.employer)
      expect(html).toContain(c.role)
    }
    expect(html).toContain('les deux en parallèle')
    expect(html).toContain('Brice Gachadoat anime une formation IA')
  })

  it('LVMH row follows CAREER.md: DSI as context, last title Head of Controlling Domain', () => {
    expect(html).toContain("Au sein de la DSI, jusqu'à Head of Controlling Domain")
  })

  it('renders the founder line from proof.ts, not a retyped copy', () => {
    expect(html).toContain(FOUNDER_LINE)
  })

  it('has no headcount, no old school name, no em dash', () => {
    expect(html).not.toMatch(/IAPreneurs|une seule personne/i)
    expect(html).not.toContain('—')
  })
})
