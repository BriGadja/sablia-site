// Light cream contrast band — supported CRMs in grayscale.

const crmStyles = {
  band: { background: 'var(--surface-light)', padding: '64px 32px' },
  inner: { maxWidth: 1200, margin: '0 auto' },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--muted)',
    textAlign: 'center',
    marginBottom: 28,
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    alignItems: 'center',
    justifyItems: 'center',
    gap: 24,
  },
  img: {
    height: 24,
    opacity: 0.55,
    filter: 'grayscale(1)',
    color: 'var(--ink)',
    transition: 'opacity 180ms ease, filter 180ms ease',
  },
}

function CRMStrip() {
  const logos = ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'monday', 'notion']
  return (
    <section style={crmStyles.band}>
      <div style={crmStyles.inner}>
        <div style={crmStyles.label}>Compatible avec votre CRM</div>
        <div style={crmStyles.row}>
          {logos.map((l) => (
            <img
              key={l}
              src={`../../assets/crm/${l}.svg`}
              alt={l}
              style={crmStyles.img}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = 0.95
                e.currentTarget.style.filter = 'grayscale(0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = 0.55
                e.currentTarget.style.filter = 'grayscale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

window.CRMStrip = CRMStrip
