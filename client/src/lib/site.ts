/**
 * Canonical Sablia constants shared across landing + legal pages.
 */
export const site = {
  name: 'Sablia',
  domain: 'sablia.io',
  tagline: "Agence d'intégration Claude AI × CRM",
  founder: 'Brice Gachadoat',
  email: 'brice@sablia.io',

  diagnosticAnchor: '#diagnostic-form',
  diagnosticPrice: '490€ HT',
  diagnosticTurnaround: '5 jours ouvrés',
  diagnosticCreditWindow: '90 jours',

  // Brice runs acquisition and sales alone since 2026-09-01 (IDEATION.md §9); the break-up mail of
  // 2026-09-10 gives this same link, so the home must not book with anyone else.
  bookingUrl: 'https://calendly.com/brice-gachadoat/30min',
  iapreneursUrl: 'https://www.iapreneurs.com/?affiliate_code=8b6eda',

  privacyUrl: '/politique-confidentialite',
  legalUrl: '/mentions-legales',
  cgvUrl: '/cgv',

  year: new Date().getFullYear(),
}
