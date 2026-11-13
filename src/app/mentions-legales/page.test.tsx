import { describe, expect, it } from 'vitest'
import { text } from '@/components/legal/helpers.test-util'
import MentionsLegalesPage from './page'

// US-100 floor: Rouen goes into the structured data and the footer, never into the legal notice.
// Green before the change by design: it pins what must NOT move.
describe('/mentions-legales', () => {
  it('still gives the registered office, 75008 Paris', () => {
    expect(text(<MentionsLegalesPage />)).toContain('75008 Paris')
  })
})
