import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import RessourceForm from './RessourceForm'

/**
 * Brice, 2026-10-12: a visitor who ticks « être contacté » may leave a phone number (optional),
 * the email stays required. The field only exists once the box is ticked, so an unticked visitor
 * is never asked for a number nobody will call.
 */
vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

function stubFetch() {
  const spy = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ ok: true, files: [], lead: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  )
  vi.stubGlobal('fetch', spy)
  return spy
}

function sentBody(spy: ReturnType<typeof stubFetch>) {
  const init = spy.mock.calls[0]?.[1]
  return JSON.parse(String(init?.body)) as Record<string, unknown>
}

async function fillIdentity(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Prénom'), 'Camille')
  await user.type(screen.getByLabelText('Email'), 'camille@exemple.fr')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('RessourceForm: the optional phone', () => {
  it('asks for no phone while the box is unticked', () => {
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    expect(screen.queryByLabelText(/Téléphone/)).toBeNull()
  })

  it('shows an optional phone field once the box is ticked, the email still required', async () => {
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await user.click(screen.getByLabelText('Je souhaite être contacté par Sablia'))

    const phone = screen.getByLabelText(/Téléphone/) as HTMLInputElement
    expect(phone.required).toBe(false)
    expect(phone.type).toBe('tel')
    expect((screen.getByLabelText('Email') as HTMLInputElement).required).toBe(true)
  })

  it('sends the number with the request when the box is ticked', async () => {
    const spy = stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    await user.click(screen.getByLabelText('Je souhaite être contacté par Sablia'))
    await user.type(screen.getByLabelText(/Téléphone/), '06 12 34 56 78')
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))

    expect(sentBody(spy)).toMatchObject({ contact: true, telephone: '06 12 34 56 78' })
  })

  it('sends no number once the box is unticked again', async () => {
    const spy = stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    const box = screen.getByLabelText('Je souhaite être contacté par Sablia')
    await user.click(box)
    await user.type(screen.getByLabelText(/Téléphone/), '06 12 34 56 78')
    await user.click(box)
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))

    expect(sentBody(spy)).toMatchObject({ contact: false, telephone: '' })
  })

  it('confirms on screen that the contact request was heard', async () => {
    stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    await user.click(screen.getByLabelText('Je souhaite être contacté par Sablia'))
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))

    expect(await screen.findByText(/on revient vers vous sous 24 h ouvrées/)).not.toBeNull()
  })

  it('makes no contact promise when the box stayed unticked', async () => {
    stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))

    await screen.findByText("C'est à vous")
    expect(screen.queryByText(/on revient vers vous/)).toBeNull()
  })
})

describe('RessourceForm: found_via', () => {
  it('found_via: the select is present, optional, labelled verbatim, with six options', () => {
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    const select = screen.getByLabelText('Comment nous avez-vous trouvés ?') as HTMLSelectElement
    expect(select.required).toBe(false)
    expect(select.value).toBe('')
    const labels = Array.from(select.options)
      .filter((o) => o.value !== '')
      .map((o) => o.textContent)
    expect(labels).toEqual([
      'Google',
      'ChatGPT ou une autre IA',
      'YouTube',
      'LinkedIn',
      'Bouche-à-oreille',
      'Autre',
    ])
  })

  it('found_via: the form submits without it', async () => {
    const spy = stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))
    expect(sentBody(spy)).toMatchObject({ foundVia: '' })
  })

  it('found_via: the payload carries the chosen key', async () => {
    const spy = stubFetch()
    const user = userEvent.setup()
    render(<RessourceForm slug="demo-of1" titre="le template" />)
    await fillIdentity(user)
    await user.selectOptions(screen.getByLabelText('Comment nous avez-vous trouvés ?'), 'ia')
    await user.click(screen.getByRole('button', { name: /Recevoir/ }))
    expect(sentBody(spy)).toMatchObject({ foundVia: 'ia' })
  })
})
