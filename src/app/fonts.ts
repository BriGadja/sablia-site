import localFont from 'next/font/local'

// Familjen Grotesk (variable, 400-700) and Fragment Mono (400), self-hosted: no request to Google Fonts.
// next/font preloads the woff2 and generates the size-adjusted fallback; the fallback is reachable only
// through the variable, so ported CSS uses `var(--font-sans)` / `var(--font-mono)` exclusively
// (mapped in globals.css `@theme inline`).
export const familjen = localFont({
  src: './fonts/familjen-grotesk-latin-wght-normal.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-sans-nf',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

export const fragmentMono = localFont({
  src: './fonts/fragment-mono-latin-400-normal.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono-nf',
  adjustFontFallback: false,
  fallback: ['ui-monospace', 'monospace'],
})
