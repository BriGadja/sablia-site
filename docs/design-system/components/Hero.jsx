// Hero band — 6/6 split. Eyebrow + h1 + sub + CTA pair (left).
// Dashboard mockup card on cream (right).

const heroStyles = {
  band: {
    background: 'var(--canvas)',
    padding: '96px 32px 80px',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 56,
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: 24,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },
  eyebrowDot: { width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' },
  h1: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 64,
    lineHeight: 1.05,
    letterSpacing: '-1.5px',
    color: 'var(--on-dark-strong)',
    margin: 0,
  },
  h1Italic: { fontStyle: 'italic', color: 'var(--primary)' },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    lineHeight: 1.55,
    color: 'var(--on-dark-body)',
    marginTop: 24,
    maxWidth: 520,
  },
  ctaRow: { display: 'flex', gap: 12, marginTop: 36, alignItems: 'center' },
  primary: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    height: 44,
    padding: '0 22px',
    borderRadius: 8,
    background: 'var(--primary)',
    color: 'var(--on-primary)',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 180ms cubic-bezier(.2,0,0,1)',
  },
  secondary: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    height: 44,
    padding: '0 22px',
    borderRadius: 8,
    background: 'transparent',
    color: 'var(--on-dark)',
    border: '1px solid var(--hairline)',
    cursor: 'pointer',
  },
  meta: {
    display: 'flex',
    gap: 24,
    marginTop: 28,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--on-dark-muted)',
  },
  metaItem: { display: 'inline-flex', alignItems: 'center', gap: 6 },
  // Right side mockup
  mockWrap: {
    background: 'var(--surface-light)',
    borderRadius: 16,
    padding: 24,
    border: '1px solid var(--hairline-light)',
  },
  mockHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  mockTitle: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--ink)',
  },
  mockBadge: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--muted)',
    background: 'var(--surface-light-card)',
    padding: '4px 10px',
    borderRadius: 9999,
  },
  kpiGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 },
  kpiCell: {
    background: 'var(--surface-light-card)',
    borderRadius: 8,
    padding: '12px 14px',
  },
  kpiLbl: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: 4,
  },
  kpiVal: {
    fontFamily: 'var(--font-mono)',
    fontSize: 22,
    color: 'var(--ink)',
    letterSpacing: '-0.5px',
  },
  kpiDelta: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--success)', marginTop: 2 },
  // Sparkline
  spark: { display: 'block', width: '100%', height: 64, marginBottom: 16 },
  // Pipeline rows
  rowsLbl: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--muted)',
    marginBottom: 8,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr auto auto',
    gap: 10,
    alignItems: 'center',
    padding: '10px 12px',
    background: 'var(--surface-light-card)',
    borderRadius: 8,
    marginBottom: 6,
  },
  rowName: { fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ink)' },
  rowAmt: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--body)' },
  rowStage: (color) => ({
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color,
    background: 'transparent',
    padding: '2px 8px',
    borderRadius: 9999,
    border: `1px solid ${color}`,
  }),
}

function Sparkline() {
  // simple polyline
  const points = [4, 12, 8, 18, 14, 26, 22, 30, 28, 24, 36, 32, 44, 40, 52, 46, 60, 50]
  // build path d
  const W = 320,
    H = 56
  const xs = points.map((_, i) => (i / (points.length - 1)) * W)
  const ys = points.map((p) => H - (p / 60) * (H - 8) - 4)
  const d = xs.map((x, i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(' ')
  const fill = d + ` L${W} ${H} L0 ${H} Z`
  return (
    <svg style={heroStyles.spark} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <path d={fill} fill="rgba(93,184,166,0.14)" />
      <path d={d} fill="none" stroke="#5db8a6" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function DashboardMockup() {
  return (
    <div style={heroStyles.mockWrap}>
      <div style={heroStyles.mockHead}>
        <div style={heroStyles.mockTitle}>Pipeline commercial · Mars</div>
        <div style={heroStyles.mockBadge}>Salesforce</div>
      </div>
      <div style={heroStyles.kpiGrid}>
        <div style={heroStyles.kpiCell}>
          <div style={heroStyles.kpiLbl}>Volume</div>
          <div style={heroStyles.kpiVal}>€428k</div>
          <div style={heroStyles.kpiDelta}>+18.4%</div>
        </div>
        <div style={heroStyles.kpiCell}>
          <div style={heroStyles.kpiLbl}>Deals actifs</div>
          <div style={heroStyles.kpiVal}>62</div>
          <div style={heroStyles.kpiDelta}>+9</div>
        </div>
        <div style={heroStyles.kpiCell}>
          <div style={heroStyles.kpiLbl}>Cycle moyen</div>
          <div style={heroStyles.kpiVal}>21j</div>
          <div style={{ ...heroStyles.kpiDelta, color: 'var(--muted)' }}>−3j</div>
        </div>
      </div>
      <Sparkline />
      <div style={heroStyles.rowsLbl}>Top opportunités</div>
      <div style={heroStyles.row}>
        <span style={heroStyles.rowName}>Mercier &amp; Cie</span>
        <span style={heroStyles.rowAmt}>€48,200</span>
        <span style={heroStyles.rowStage('#5db872')}>Negotiation</span>
      </div>
      <div style={heroStyles.row}>
        <span style={heroStyles.rowName}>Atelier Garnier</span>
        <span style={heroStyles.rowAmt}>€36,500</span>
        <span style={heroStyles.rowStage('#5db8a6')}>Qualified</span>
      </div>
      <div style={heroStyles.row}>
        <span style={heroStyles.rowName}>Maison Lefèvre</span>
        <span style={heroStyles.rowAmt}>€24,000</span>
        <span style={heroStyles.rowStage('#cc785c')}>Discovery</span>
      </div>
    </div>
  )
}

function Hero({ onBook }) {
  const [pHover, setPHover] = React.useState(false)
  return (
    <section style={heroStyles.band}>
      <div style={heroStyles.inner}>
        <div>
          <div style={heroStyles.eyebrow}>
            <span style={heroStyles.eyebrowDot}></span>
            Agence d'intégration Claude AI
          </div>
          <h1 style={heroStyles.h1}>
            Gagnez 15&nbsp;h par semaine sur vos{' '}
            <span style={heroStyles.h1Italic}>processus commerciaux.</span>
          </h1>
          <p style={heroStyles.sub}>
            Sablia connecte Claude AI à votre CRM pour automatiser vos tâches répétitives, sans
            changer vos outils.
          </p>
          <div style={heroStyles.ctaRow}>
            <button
              onClick={onBook}
              onMouseEnter={() => setPHover(true)}
              onMouseLeave={() => setPHover(false)}
              style={{
                ...heroStyles.primary,
                boxShadow: pHover ? '0 0 20px rgba(93,184,166,0.25)' : 'none',
              }}
            >
              Réserver un call <Icons.ArrowRight size={16} />
            </button>
            <button style={heroStyles.secondary}>Voir les cas d'usage</button>
          </div>
          <div style={heroStyles.meta}>
            <span style={heroStyles.metaItem}>
              <Icons.Check size={14} color="#5db872" /> 45&nbsp;min, gratuit
            </span>
            <span style={heroStyles.metaItem}>
              <Icons.Check size={14} color="#5db872" /> Sans engagement
            </span>
          </div>
        </div>
        <DashboardMockup />
      </div>
    </section>
  )
}

window.Hero = Hero
