import { describe, expect, it, vi } from 'vitest'
import { html, text } from '@/components/legal/helpers.test-util'

let query = ''
vi.mock('next/navigation', () => ({ useSearchParams: () => new URLSearchParams(query) }))

import Page, { metadata } from './page'

describe('/thank-you', () => {
  it('server-renders with no window access and the default copy', () => {
    query = ''
    const t = text(<Page />)
    expect(t).toContain('Merci !')
    expect(html(<Page />)).toContain('data-cta-book')
  })

  it('reads ?source= for the copy', () => {
    query = 'source=contact'
    expect(text(<Page />)).toContain('Message envoyé !')
    query = 'source=diagnostic'
    expect(text(<Page />)).toContain('Demande enregistrée !')
    query = 'source=nope'
    expect(text(<Page />)).toContain('Merci !')
  })

  it('is noindex but carries a canonical', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false })
    expect(metadata.alternates?.canonical).toBe('/thank-you')
  })
})
