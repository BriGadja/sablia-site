// 4-step "Comment ça marche" flow on dark canvas.

const procStyles = {
  band: {
    background: 'var(--canvas-soft)',
    padding: '96px 32px',
    borderTop: '1px solid var(--hairline)',
    borderBottom: '1px solid var(--hairline)',
  },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gap: 56,
    alignItems: 'end',
    marginBottom: 48,
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: 18,
  },
  h: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 44,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    color: 'var(--on-dark)',
    margin: 0,
  },
  p: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    lineHeight: 1.55,
    color: 'var(--on-dark-body)',
    maxWidth: 460,
    paddingBottom: 8,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  step: {
    background: 'var(--surface-card)',
    border: '1px solid var(--hairline)',
    borderRadius: 12,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 200,
  },
  num: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 36,
    lineHeight: 1,
    letterSpacing: '-0.5px',
    color: 'var(--primary)',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'var(--font-body)',
    fontSize: 17,
    fontWeight: 500,
    color: 'var(--on-dark)',
  },
  desc: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    lineHeight: 1.55,
    color: 'var(--on-dark-body)',
  },
  duration: {
    marginTop: 'auto',
    paddingTop: 12,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--on-dark-muted)',
    borderTop: '1px solid var(--hairline)',
  },
}

function Process() {
  const steps = [
    {
      n: '01',
      t: 'Call discovery',
      d: '45 min pour comprendre votre pipeline et identifier les automatisations à plus fort impact.',
      dur: '45 min',
    },
    {
      n: '02',
      t: 'Diagnostic CRM',
      d: 'Audit technique de votre stack. Cartographie des workflows à automatiser.',
      dur: '5 jours',
    },
    {
      n: '03',
      t: 'Implémentation',
      d: 'Intégration sur-mesure de Claude dans votre CRM. Pas de plugin, pas de migration.',
      dur: '2–4 semaines',
    },
    {
      n: '04',
      t: 'Suivi',
      d: 'Itérations mensuelles. On mesure le temps gagné. On ajuste.',
      dur: 'En continu',
    },
  ]
  return (
    <section style={procStyles.band}>
      <div style={procStyles.inner}>
        <div style={procStyles.header}>
          <div>
            <div style={procStyles.eyebrow}>Comment ça marche</div>
            <h2 style={procStyles.h}>
              Quatre étapes,
              <br />
              zéro friction sur votre stack.
            </h2>
          </div>
          <p style={procStyles.p}>
            Notre approche n'impose ni nouveau CRM, ni nouveau workflow. Nous connectons Claude à
            vos outils existants, là où il a le plus d'impact mesurable.
          </p>
        </div>
        <div style={procStyles.grid}>
          {steps.map((s) => (
            <div key={s.n} style={procStyles.step}>
              <div style={procStyles.num}>{s.n}</div>
              <div style={procStyles.title}>{s.t}</div>
              <div style={procStyles.desc}>{s.d}</div>
              <div style={procStyles.duration}>{s.dur}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

window.Process = Process
