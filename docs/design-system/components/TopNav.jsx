// Sticky 64px top nav. Brand left, menu center-left, primary CTA right.

const navStyles = {
  wrap: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(20, 20, 24, 0.82)',
    backdropFilter: 'saturate(140%) blur(12px)',
    WebkitBackdropFilter: 'saturate(140%) blur(12px)',
    borderBottom: '1px solid var(--hairline)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    height: 64,
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    gap: 40,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 10 },
  brandImg: { height: 28, display: 'block' },
  menu: { display: 'flex', gap: 28, flex: 1, marginLeft: 8 },
  link: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--on-dark-body)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 120ms cubic-bezier(.2,0,0,1)',
  },
  linkActive: { color: 'var(--on-dark)' },
  cta: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    height: 40,
    padding: '0 20px',
    borderRadius: 8,
    background: 'var(--primary)',
    color: 'var(--on-primary)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 180ms cubic-bezier(.2,0,0,1)',
  },
}

function TopNav({ onBook }) {
  const [hoverIdx, setHoverIdx] = React.useState(null)
  const [ctaHover, setCtaHover] = React.useState(false)

  const items = ['Offre', 'Comment ça marche', "Cas d'usage", 'À propos']
  return (
    <nav style={navStyles.wrap}>
      <div style={navStyles.inner}>
        <a href="#" style={navStyles.brand}>
          <img src="../../assets/wordmark-dark.svg" alt="Sablia" style={navStyles.brandImg} />
        </a>
        <div style={navStyles.menu}>
          {items.map((it, i) => (
            <a
              key={it}
              style={{
                ...navStyles.link,
                ...(hoverIdx === i || i === 0 ? navStyles.linkActive : null),
              }}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            >
              {it}
            </a>
          ))}
        </div>
        <button
          onClick={onBook}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          style={{
            ...navStyles.cta,
            boxShadow: ctaHover ? '0 0 20px rgba(93,184,166,0.28)' : 'none',
          }}
        >
          Réserver un call
        </button>
      </div>
    </nav>
  )
}

window.TopNav = TopNav
