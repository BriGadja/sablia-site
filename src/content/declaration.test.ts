import { describe, expect, it } from 'vitest'
import { NDA_LINE, PHOTO_CREDIT } from './declaration'

/** US-96: the activity declaration appears only in the L6352-12 form (« Etat » without accent, as the law has it). */
describe('declaration', () => {
  it('NDA_LINE is the exact L6352-12 sentence', () => {
    expect(NDA_LINE).toBe(
      "Enregistrée sous le numéro 28760834576. Cet enregistrement ne vaut pas agrément de l'Etat.",
    )
  })

  it('PHOTO_CREDIT is the exact credit', () => {
    expect(PHOTO_CREDIT).toBe('Photos : école Noésia, 9 octobre 2026')
  })
})
