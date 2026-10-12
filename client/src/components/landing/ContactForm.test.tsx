import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ContactForm from './ContactForm'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))

function stubFetch() {
  const spy = vi.fn(
    async (_url: string, _init?: RequestInit) =>
      new Response(JSON.stringify({ ok: true, lead: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
  )
  vi.stubGlobal('fetch', spy)
  return spy
}

function sentBody(spy: ReturnType<typeof stubFetch>) {
  return JSON.parse(String(spy.mock.calls[0]?.[1]?.body)) as Record<string, unknown>
}

async function fillRequired(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nom'), 'Nom Test')
  await user.type(screen.getByLabelText('Société'), 'Société Test')
  await user.type(screen.getByLabelText('Email'), 'test@exemple.fr')
  await user.type(screen.getByLabelText('Votre demande'), 'Un séminaire en novembre.')
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ContactForm: found_via', () => {
  it('found_via: the select is present, optional, labelled verbatim, with six options', () => {
    render(<ContactForm />)
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
    render(<ContactForm />)
    await fillRequired(user)
    await user.click(screen.getByRole('button', { name: /Envoyer/ }))
    expect(sentBody(spy)).toMatchObject({ foundVia: '' })
  })

  it('found_via: the payload carries the chosen key', async () => {
    const spy = stubFetch()
    const user = userEvent.setup()
    render(<ContactForm />)
    await fillRequired(user)
    await user.selectOptions(screen.getByLabelText('Comment nous avez-vous trouvés ?'), 'youtube')
    await user.click(screen.getByRole('button', { name: /Envoyer/ }))
    expect(sentBody(spy)).toMatchObject({ foundVia: 'youtube' })
  })
})
