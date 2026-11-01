import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { FIN, HERO, META, REFERENT, SURMESURE } from './content'

const SRC = resolve(__dirname, '..', '..')
const CRM = '/offres/compte-rendu-appel'

/** A CRM variant exists when its JSON page is published or its spreadsheet page has a route. */
function crmPageExists(slug: string): boolean {
  const json = join(SRC, 'content', 'crm', `${slug}.json`)
  if (existsSync(json)) return JSON.parse(readFileSync(json, 'utf8')).status === 'published'
  return existsSync(join(SRC, 'app', 'offres', 'compte-rendu-appel', slug, 'page.tsx'))
}

const ALL_TEXT = JSON.stringify({ META, HERO, REFERENT, SURMESURE, FIN })

describe('/accompagnement content (01b § 4)', () => {
  it('links the six CRM variants that the site builds, in 01b order', () => {
    expect(SURMESURE.lead.href).toBe(CRM)
    expect(SURMESURE.crms.map((c) => c.label)).toEqual([
      'HubSpot',
      'Pipedrive',
      'Zoho',
      'Salesforce',
      'Google Sheets',
      'Excel',
    ])
    for (const c of SURMESURE.crms) {
      expect(c.href.startsWith(`${CRM}/`), c.href).toBe(true)
      expect(crmPageExists(c.href.slice(CRM.length + 1)), c.href).toBe(true)
    }
  })

  it('points the hero photo at the conversation photo of 09/10 (3:2)', () => {
    expect(HERO.photo.base).toBe('/photos/formation-05')
    expect(HERO.photo.width / HERO.photo.height).toBeCloseTo(1.5, 2)
  })

  it('names no price, no banned word, no em dash', () => {
    expect(ALL_TEXT).not.toMatch(/\d[\d\s .,]*\s?(€|euros?)/i)
    expect(ALL_TEXT).not.toMatch(/\b600\b/)
    expect(ALL_TEXT).not.toContain('—')
    for (const w of ['IAPreneurs', 'Noésia', 'CPF', 'finançable', 'certifié', 'Qualiopi'])
      expect(ALL_TEXT, w).not.toContain(w)
  })

  it('the month drawing reuses the figures of the line, nothing else', () => {
    expect(REFERENT.line).toContain(REFERENT.month.session)
    expect(REFERENT.line).toContain(REFERENT.month.answer)
    expect(REFERENT.month.days).toEqual(['L', 'M', 'M', 'J', 'V'])
  })
})
