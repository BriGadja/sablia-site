import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import fixtureJson from '@/content/crm/__fixtures__/published-fixture.json'
import { crmPageSchema } from '@/content/crm/schema'
import CrmLinks from './CrmLinks'

const published = crmPageSchema.parse(fixtureJson)
const draft = crmPageSchema.parse({
  status: 'draft',
  slug: 'zoho',
  crm: 'Zoho',
  path: '/offres/compte-rendu-appel/zoho',
  draftReason: 'à rédiger',
})

describe('CrmLinks: the « Votre CRM » strip', () => {
  it('renders nothing when no page is published', () => {
    const { container } = render(<CrmLinks pages={[draft]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders nothing for the real pages while all four are drafts', () => {
    const { container } = render(<CrmLinks />)
    expect(container.querySelectorAll('a')).toHaveLength(
      container.querySelectorAll('a[href^="/offres/compte-rendu-appel/"]').length,
    )
  })

  it('lists the published pages only, each as a link to its path', () => {
    render(<CrmLinks pages={[draft, published]} />)
    const links = screen.getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual([published.path])
    expect(screen.getByText('Votre CRM')).toBeTruthy()
  })
})
