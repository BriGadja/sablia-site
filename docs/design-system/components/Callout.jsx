// Full-bleed teal callout band — pre-footer CTA.

const calloutStyles = {
  band: { background: 'var(--canvas)', padding: '64px 32px' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  card: {
    background: 'var(--primary)',
    borderRadius: 16,
    padding: '64px 56px',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 56,
    alignItems: 'center',
  },
  h: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 44,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    color: 'var(--on-primary)',
    margin: 0,
    textWrap: 'balance',
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    lineHeight: 1.55,
    color: 'rgba(15,15,18,0.72)',
    marginTop: 16,
    maxWidth: 560,
  },
  btn: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 500,
    background: 'var(--canvas)',
    color: 'var(--on-dark)',
    border: 'none',
    height: 52,
    padding: '0 28px',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    whiteSpace: 'nowrap',
    transition: 'transform 180ms cubic-bezier(.2,0,0,1)',
  },
}

function Callout({ onBook }) {
  const [hover, setHover] = React.useState(false)
  return (
    <section style={calloutStyles.band}>
      <div style={calloutStyles.inner}>
        <div style={calloutStyles.card}>
          <div>
            <h2 style={calloutStyles.h}>Prêt à optimiser votre CRM&nbsp;?</h2>
            <p style={calloutStyles.sub}>
              45&nbsp;min avec un expert pour cartographier votre pipeline et identifier les trois
              automatisations les plus rentables. Gratuit, sans engagement.
            </p>
          </div>
          <button
            onClick={onBook}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
              ...calloutStyles.btn,
              transform: hover ? 'translateX(2px)' : 'translateX(0)',
            }}
          >
            Réserver un call <Icons.ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

window.Callout = Callout
