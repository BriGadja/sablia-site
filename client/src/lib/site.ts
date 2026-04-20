/**
 * Canonical Sablia constants shared across landing sections.
 *
 * Ported from sablia-io with corrections for sablia-site :
 * - email = "brice@sablia.io" (canonical per plan Phase 3 item 12)
 * - privacy route = "/politique-confidentialite" (sablia-site route)
 * - diagnostic webhook stays in form-constants.ts (compat analytics flow)
 */
export const site = {
  name: 'Sablia',
  domain: 'sablia.io',
  tagline:
    "Intégrer l'intelligence artificielle dans votre PME, avec le Responsable Pédagogique IA d'IAPreneurs.",
  founder: 'Brice Gachadoat',
  email: 'brice@sablia.io',

  diagnosticAnchor: '#diagnostic-form',
  diagnosticPrice: '490€ HT',
  diagnosticTurnaround: '5 jours ouvrés',
  diagnosticCreditWindow: '90 jours',

  bookingUrl: 'https://calendly.com/brice-gachadoat/30min',
  iapreneursUrl: 'https://www.iapreneurs.com/?affiliate_code=8b6eda',

  privacyUrl: '/politique-confidentialite',
  legalUrl: '/mentions-legales',
  cgvUrl: '/cgv',

  year: new Date().getFullYear(),
}
