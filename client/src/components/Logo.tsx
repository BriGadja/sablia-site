/**
 * The Sablia lockup (US-12): mark 3 of the Claude Design round 3, picked by Brice on 2026-09-29
 * (« on prend le 3 »), inline, and the word « Sablia » in the site's display font. It replaces the
 * wordmark derived from a client's brand (grill 2026-09-28, decision 7). The path is the one of
 * `client/public/brand/symbol.svg`; `Logo.test.tsx` fails if the two diverge.
 */
export const SYMBOL_PATH = 'M43 21L54 10H10L54 54H10L21 43'

/** The logo colour of the grill (decision 7), distinct from the site's coral token on purpose. */
export const LOGO_COLOUR = '#D97757'

interface LogoProps {
  /** `light` for a light background (ink word), `dark` for a dark one. */
  tone?: 'light' | 'dark'
  size?: 'nav' | 'footer'
}

const SIZES = {
  nav: { mark: 'h-8 w-8', word: 'text-[30px]', gap: 'gap-2.5' },
  footer: { mark: 'h-6 w-6', word: 'text-[23px]', gap: 'gap-2' },
} as const

const TONES = { light: 'text-ink', dark: 'text-on-dark' } as const

export default function Logo({ tone = 'dark', size = 'nav' }: LogoProps) {
  const s = SIZES[size]
  return (
    <span
      role="img"
      aria-label="Sablia"
      className={`inline-flex items-center ${s.gap} ${TONES[tone]}`}
    >
      <svg viewBox="0 0 64 64" aria-hidden="true" className={`block shrink-0 ${s.mark}`}>
        <path
          d={SYMBOL_PATH}
          fill="none"
          stroke={LOGO_COLOUR}
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        aria-hidden="true"
        className={`font-display font-medium leading-none tracking-[-0.015em] ${s.word}`}
      >
        Sablia
      </span>
    </span>
  )
}
