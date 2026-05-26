// Minimal dark footer — wordmark left, contact center, legal right.

const footStyles = {
  band: {
    background: 'var(--canvas)',
    padding: '64px 32px 40px',
    borderTop: '1px solid var(--hairline)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 32,
    alignItems: 'start',
  },
  left: { display: 'flex', flexDirection: 'column', gap: 12 },
  wm: { height: 28 },
  tagline: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--on-dark-muted)',
    maxWidth: 280,
    lineHeight: 1.55,
  },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 },
  centerLbl: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--on-dark-muted)',
  },
  centerVal: { fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--on-dark)' },
  right: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--on-dark-body)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  bottom: {
    maxWidth: 1200,
    margin: '48px auto 0',
    paddingTop: 24,
    borderTop: '1px solid var(--hairline)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copy: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--on-dark-soft)' },
  powered: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--on-dark-soft)',
  },
  poweredMark: { height: 14, opacity: 0.6 },
}

function Footer() {
  return (
    <footer style={footStyles.band}>
      <div style={footStyles.inner}>
        <div style={footStyles.left}>
          <img src="../../assets/wordmark-dark.svg" alt="Sablia" style={footStyles.wm} />
          <div style={footStyles.tagline}>
            Agence d'intégration AI. On connecte Claude à votre CRM, depuis Paris.
          </div>
        </div>
        <div style={footStyles.center}>
          <div style={footStyles.centerLbl}>Contact</div>
          <a href="mailto:contact@sablia.io" style={footStyles.centerVal}>
            contact@sablia.io
          </a>
          <a
            href="tel:+33000000000"
            style={{ ...footStyles.centerVal, color: 'var(--on-dark-body)' }}
          >
            +33&nbsp;1&nbsp;82&nbsp;00&nbsp;00&nbsp;00
          </a>
        </div>
        <div style={footStyles.right}>
          <a style={footStyles.link}>Mentions légales</a>
          <a style={footStyles.link}>Politique de confidentialité</a>
          <a style={footStyles.link}>CGV</a>
        </div>
      </div>
      <div style={footStyles.bottom}>
        <div style={footStyles.copy}>© 2026 Sablia · Tous droits réservés</div>
        <div style={footStyles.powered}>
          Powered by
          <img src="../../assets/anthropic.svg" alt="Anthropic" style={footStyles.poweredMark} />
          Claude
        </div>
      </div>
    </footer>
  )
}

window.Footer = Footer
