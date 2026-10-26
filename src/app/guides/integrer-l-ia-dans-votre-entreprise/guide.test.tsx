import { describe, expect, it } from 'vitest'
import { html, text } from '@/components/legal/helpers.test-util'
import Page, { metadata } from './page'

const blocks = (h: string) =>
  [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1].replace(/\\u003c/g, '<')),
  )

describe('guide IA en entreprise', () => {
  const markup = html(<Page />)
  const ld = blocks(markup)

  it('keeps Article, FAQPage and BreadcrumbList JSON-LD', () => {
    expect(ld.map((b) => b['@type']).sort()).toEqual(['Article', 'BreadcrumbList', 'FAQPage'])
    const faq = ld.find((b) => b['@type'] === 'FAQPage')
    expect(faq.mainEntity).toHaveLength(5)
  })

  it('has one h1, the FAQ on the page, prices from the OF-1 module and one booking button', () => {
    expect(markup.match(/<h1/g)).toHaveLength(1)
    const t = text(<Page />)
    expect(t).toContain('Questions fréquentes')
    expect(t).toContain('1 490 € HT')
    expect(markup).toContain('data-cta-book')
  })

  it('has its own canonical', () => {
    expect(metadata.alternates?.canonical).toBe('/guides/integrer-l-ia-dans-votre-entreprise')
  })
})
