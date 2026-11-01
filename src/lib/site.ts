/**
 * Canonical Sablia constants shared across landing + legal pages.
 */
export const site = {
  name: 'Sablia',
  domain: 'sablia.io',
  // The home's promise (01b `home.meta.title` without « · Sablia »); public/manifest.json repeats it.
  tagline: "Formation à l'IA pour votre équipe, sur ses dossiers",
  founder: 'Brice Gachadoat',
  email: 'brice@sablia.io',

  diagnosticTurnaround: '5 jours ouvrés',
  diagnosticCreditWindow: '90 jours',

  // Brice runs acquisition and sales alone since 2026-09-01 (IDEATION.md §9); the break-up mail of
  // 2026-09-10 gives this same link, so the home must not book with anyone else.
  bookingUrl: 'https://calendly.com/brice-gachadoat/30min',

  // Training buttons (home, /formations, /accompagnement, /realisations): the « Échange de 30
  // minutes » event, the same one as the hub webinar config `booking_url` (plan site-formation-lot1).
  // `/offres/**` keeps `bookingUrl`; the webinar pages keep their own `BOOKING_URL`.
  formationBookingUrl: 'https://calendly.com/brice-gachadoat/echange-30-minutes',

  privacyUrl: '/politique-confidentialite',
  legalUrl: '/mentions-legales',
  cgvUrl: '/cgv',

  year: new Date().getFullYear(),
}
