import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Router } from 'wouter'
import DiagnosticForm, { diagnosticSchema } from './DiagnosticForm'

const fetchMock = vi.fn()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function renderForm() {
  return render(
    <Router>
      <DiagnosticForm />
    </Router>,
  )
}

describe('diagnosticSchema', () => {
  it('accepts a valid payload', () => {
    const result = diagnosticSchema.safeParse({
      nom: 'Jean Dupont',
      email: 'jean@acme.fr',
      entreprise: 'ACME',
      processus_couteux: 'Relances factures',
      rgpdConsent: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects short nom', () => {
    const result = diagnosticSchema.safeParse({
      nom: 'A',
      email: 'jean@acme.fr',
      entreprise: 'ACME',
      rgpdConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = diagnosticSchema.safeParse({
      nom: 'Jean Dupont',
      email: 'not-an-email',
      entreprise: 'ACME',
      rgpdConsent: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects unchecked rgpdConsent', () => {
    const result = diagnosticSchema.safeParse({
      nom: 'Jean Dupont',
      email: 'jean@acme.fr',
      entreprise: 'ACME',
      rgpdConsent: false,
    })
    expect(result.success).toBe(false)
  })

  it('treats processus_couteux as optional', () => {
    const result = diagnosticSchema.safeParse({
      nom: 'Jean Dupont',
      email: 'jean@acme.fr',
      entreprise: 'ACME',
      rgpdConsent: true,
    })
    expect(result.success).toBe(true)
  })
})

describe('DiagnosticForm component', () => {
  it('renders the 4 fields, RGPD checkbox and submit CTA with price', () => {
    renderForm()
    expect(screen.getByLabelText(/Nom/i)).toBeDefined()
    expect(screen.getByLabelText(/Email professionnel/i)).toBeDefined()
    expect(screen.getByLabelText(/Entreprise/i)).toBeDefined()
    expect(screen.getByLabelText(/Quel process vous coûte le plus de temps/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Démarrer mon diagnostic, 490€/ })).toBeDefined()
  })

  it('silently short-circuits when honeypot is filled (no fetch)', async () => {
    const { container } = renderForm()
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement
    expect(honeypot).toBeDefined()

    fireEvent.change(honeypot, { target: { value: 'bot-fill' } })
    fireEvent.change(screen.getByLabelText(/Nom/i), { target: { value: 'Jean Dupont' } })
    fireEvent.change(screen.getByLabelText(/Email professionnel/i), {
      target: { value: 'jean@acme.fr' },
    })
    fireEvent.change(screen.getByLabelText(/Entreprise/i), { target: { value: 'ACME' } })
    fireEvent.click(screen.getByRole('checkbox'))

    fireEvent.click(screen.getByRole('button', { name: /Démarrer mon diagnostic, 490€/ }))

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
