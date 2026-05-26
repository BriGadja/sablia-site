// 3-up use case grid. Surface-card with line icon, title, body, CRM tag row.

const ucStyles = {
  band: { background: 'var(--canvas)', padding: '96px 32px' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  header: { textAlign: 'center', marginBottom: 56, maxWidth: 720, margin: '0 auto 56px' },
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
    fontSize: 48,
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
    marginTop: 18,
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 },
  card: {
    background: 'var(--surface-card)',
    border: '1px solid var(--hairline)',
    borderRadius: 12,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'background 180ms cubic-bezier(.2,0,0,1)',
    cursor: 'default',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: 'rgba(93,184,166,0.10)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--primary)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 24,
    lineHeight: 1.2,
    letterSpacing: '-0.3px',
    color: 'var(--on-dark)',
    marginTop: 4,
  },
  desc: {
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    lineHeight: 1.55,
    color: 'var(--on-dark-body)',
  },
  tags: { display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' },
  tag: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: 9999,
    background: 'var(--surface-card-elevated)',
    color: 'var(--on-dark-body)',
  },
}

function UseCaseCard({ icon, title, desc, tags }) {
  const [hover, setHover] = React.useState(false)
  return (
    <div
      style={{
        ...ucStyles.card,
        background: hover ? 'var(--surface-card-elevated)' : 'var(--surface-card)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={ucStyles.iconWrap}>{icon}</div>
      <div style={ucStyles.title}>{title}</div>
      <div style={ucStyles.desc}>{desc}</div>
      <div style={ucStyles.tags}>
        {tags.map((t) => (
          <span key={t} style={ucStyles.tag}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

function UseCases() {
  return (
    <section style={ucStyles.band}>
      <div style={ucStyles.inner}>
        <div style={ucStyles.header}>
          <div style={ucStyles.eyebrow}>Cas d'usage</div>
          <h2 style={ucStyles.h}>
            Trois automatisations qui paient leur intégration en un trimestre.
          </h2>
          <p style={ucStyles.p}>
            Pas de solution générique. Chaque déploiement est calibré sur votre CRM, vos processus,
            vos équipes.
          </p>
        </div>
        <div style={ucStyles.grid}>
          <UseCaseCard
            icon={<Icons.LineChart size={22} />}
            title="Dashboards intelligents"
            desc="Claude lit votre pipeline et produit chaque lundi un brief commercial des opportunités à risque, des leads chauds, et des actions prioritaires."
            tags={['Salesforce', 'HubSpot']}
          />
          <UseCaseCard
            icon={<Icons.Mail size={22} />}
            title="Nurturing automatisé"
            desc="Séquences d'emails personnalisées, déclenchées par les signaux du pipeline. Le ton est calibré sur votre marque, pas sur un template."
            tags={['HubSpot', 'Pipedrive']}
          />
          <UseCaseCard
            icon={<Icons.PhoneCall size={22} />}
            title="Analyse de calls"
            desc="Claude transcrit, résume et enrichit chaque appel commercial dans votre CRM — objections clés, prochaines étapes, scoring."
            tags={['Salesforce', 'Pipedrive']}
          />
        </div>
      </div>
    </section>
  )
}

window.UseCases = UseCases
