// Single client testimonial — cream contrast section.

const proofStyles = {
  band: { background: 'var(--surface-light)', padding: '96px 32px' },
  inner: { maxWidth: 920, margin: '0 auto' },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--accent-coral)',
    marginBottom: 24,
    textAlign: 'center',
  },
  quote: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontStyle: 'italic',
    fontSize: 36,
    lineHeight: 1.25,
    letterSpacing: '-0.5px',
    color: 'var(--ink)',
    margin: 0,
    textAlign: 'center',
    textWrap: 'pretty',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginTop: 32,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a2e4e 0%, #c45a2c 100%)',
    color: 'white',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-display)',
    fontSize: 20,
    fontWeight: 500,
    letterSpacing: '-0.3px',
  },
  cite: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--body)',
  },
  citeName: { fontWeight: 500, color: 'var(--ink)' },
  citeRole: { color: 'var(--muted)', marginTop: 2 },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24,
    marginTop: 64,
    paddingTop: 40,
    borderTop: '1px solid var(--hairline-light)',
  },
  kpi: { textAlign: 'center' },
  kpiVal: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 48,
    lineHeight: 1,
    letterSpacing: '-1px',
    color: 'var(--ink)',
  },
  kpiLbl: {
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--muted)',
    marginTop: 8,
  },
}

function Proof() {
  return (
    <section style={proofStyles.band}>
      <div style={proofStyles.inner}>
        <div style={proofStyles.eyebrow}>Ils ont sauté le pas</div>
        <blockquote style={proofStyles.quote}>
          « Sablia a divisé par trois le temps que mes commerciaux passent dans Salesforce. On a
          récupéré une journée entière par semaine et par personne. »
        </blockquote>
        <div style={proofStyles.meta}>
          <div style={proofStyles.avatar}>CM</div>
          <div style={proofStyles.cite}>
            <div style={proofStyles.citeName}>Camille Marchand</div>
            <div style={proofStyles.citeRole}>Directrice commerciale · Atelier Garnier</div>
          </div>
        </div>
        <div style={proofStyles.kpiRow}>
          <div style={proofStyles.kpi}>
            <div style={proofStyles.kpiVal}>15&nbsp;h</div>
            <div style={proofStyles.kpiLbl}>par semaine, par commercial</div>
          </div>
          <div style={proofStyles.kpi}>
            <div style={proofStyles.kpiVal}>3 sem.</div>
            <div style={proofStyles.kpiLbl}>du diagnostic à la mise en production</div>
          </div>
          <div style={proofStyles.kpi}>
            <div style={proofStyles.kpiVal}>0</div>
            <div style={proofStyles.kpiLbl}>migration d'outil, jamais</div>
          </div>
        </div>
      </div>
    </section>
  )
}

window.Proof = Proof
