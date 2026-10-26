/** The gold S-sablier mark, inline (no image request). Decorative: the wordmark beside it names the site. */
export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M43 21L54 10H10L54 54H10L21 43"
        fill="none"
        stroke="#D9A441"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
