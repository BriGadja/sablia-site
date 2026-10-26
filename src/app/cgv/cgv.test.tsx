import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { html, text } from '@/components/legal/helpers.test-util'
import { cgvV1 } from '@/content/legal/cgv-v1'
import { cgvV2 } from '@/content/legal/cgv-v2'
import Cgv from './page'

const DRAFT = '/home/sablia/workspace/research/site-theophile-2026-10/cgv-v2-draft.md'

describe('CGV page', () => {
  const markup = html(<Cgv />)
  const t = text(<Cgv />)

  it('renders the 16 articles of the v2 draft, in order', () => {
    const heads = [...markup.matchAll(/<h2[^>]*>(Article \d+\.[^<]*)<\/h2>/g)].map((m) => m[1])
    expect(heads).toHaveLength(16)
    expect(heads[0]).toBe('Article 1. Parties')
    expect(heads[15]).toBe('Article 16. Contact')
  })

  it('shows every [À CONFIRMER] marker as a visible mark, with what it asks', () => {
    const marks = [...markup.matchAll(/<mark class="v2-legal-todo">/g)]
    expect(marks).toHaveLength(5)
    expect(t.match(/\[À CONFIRMER\]/g)).toHaveLength(5)
    expect(t).toContain('mention TVA')
    expect(t).not.toContain('**')
  })

  it('states the v2 catalogue and none of the retired offer', () => {
    expect(t).toContain('1 490 € HT')
    expect(t).not.toContain('490€ HT')
    expect(t).not.toContain('Diagnostic Sablia')
  })

  it('keeps the old text as data, as the fallback', () => {
    expect(cgvV1.articles).toHaveLength(12)
    expect(JSON.stringify(cgvV1)).toContain('Diagnostic Sablia')
    expect(cgvV2.articles).toHaveLength(16)
  })

  it.skipIf(!existsSafe(DRAFT))('matches the hub draft: article titles and marker count', () => {
    const src = readFileSync(DRAFT, 'utf8')
      .split('# Conditions générales de vente')[1]
      .split('\n---\n\n## Sources')[0]
    const titles = [...src.matchAll(/^## Article (\d+)\. (.+)$/gm)].map(
      (m) => `${m[1]}|${m[2].trim()}`,
    )
    expect(cgvV2.articles.map((a) => `${a.n}|${a.title}`)).toEqual(titles)
    expect((src.match(/\[À CONFIRMER/g) ?? []).length).toBe(5)
  })
})

function existsSafe(p: string) {
  try {
    readFileSync(p)
    return true
  } catch {
    return false
  }
}
