import { describe, expect, it } from 'vitest'
import NotFound from '@/app/not-found'
import { html, text } from './helpers.test-util'

describe('404 page', () => {
  it('is the charte page: one h1, the way home, no inline styles', () => {
    const t = text(<NotFound />)
    expect(t).toContain('Page introuvable')
    expect(t).toContain("Retour à l'accueil")
    expect(html(<NotFound />)).not.toContain('style=')
    expect(html(<NotFound />)).toContain('v2-notfound')
  })
})
