// Lightweight booking modal — opens from any "Réserver un call" CTA.
// Cosmetic only: shows a date picker, three time slots, an email field, a confirm button.

const bmStyles = {
  scrim: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,15,18,0.78)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 520,
    background: 'var(--canvas-soft)',
    border: '1px solid var(--hairline)',
    borderRadius: 16,
    padding: 32,
    position: 'relative',
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 9999,
    background: 'var(--surface-card)',
    border: '1px solid var(--hairline)',
    color: 'var(--on-dark)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'var(--primary)',
    marginBottom: 14,
  },
  h: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 32,
    lineHeight: 1.15,
    letterSpacing: '-0.5px',
    color: 'var(--on-dark)',
    margin: 0,
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--on-dark-body)',
    marginTop: 10,
    marginBottom: 24,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'var(--on-dark-muted)',
    marginBottom: 10,
    display: 'block',
  },
  daysRow: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 22 },
  day: (active) => ({
    padding: '12px 6px',
    borderRadius: 8,
    border: `1px solid ${active ? 'var(--primary)' : 'var(--hairline)'}`,
    background: active ? 'rgba(93,184,166,0.10)' : 'var(--surface-card)',
    color: 'var(--on-dark)',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'var(--font-body)',
  }),
  dayName: {
    fontSize: 10,
    color: 'var(--on-dark-muted)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  dayNum: { fontSize: 18, fontWeight: 500, marginTop: 4 },
  slots: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 22 },
  slot: (active) => ({
    padding: '10px 8px',
    borderRadius: 8,
    border: `1px solid ${active ? 'var(--primary)' : 'var(--hairline)'}`,
    background: active ? 'rgba(93,184,166,0.10)' : 'var(--surface-card)',
    color: 'var(--on-dark)',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
  }),
  input: {
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    height: 44,
    padding: '0 14px',
    background: 'var(--canvas)',
    color: 'var(--on-dark)',
    border: '1px solid var(--hairline)',
    borderRadius: 8,
    outline: 'none',
    marginBottom: 18,
  },
  confirm: {
    width: '100%',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    height: 48,
    borderRadius: 8,
    background: 'var(--primary)',
    color: 'var(--on-primary)',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmed: {
    textAlign: 'center',
    padding: '16px 0',
  },
  confirmedH: {
    fontFamily: 'var(--font-display)',
    fontWeight: 500,
    fontSize: 28,
    color: 'var(--on-dark)',
    letterSpacing: '-0.3px',
    marginTop: 16,
  },
  confirmedP: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--on-dark-body)',
    marginTop: 10,
  },
}

function BookingModal({ open, onClose }) {
  const [day, setDay] = React.useState(1)
  const [slot, setSlot] = React.useState(1)
  const [confirmed, setConfirmed] = React.useState(false)
  const [email, setEmail] = React.useState('')

  React.useEffect(() => {
    if (!open) {
      setConfirmed(false)
      setEmail('')
    }
  }, [open])

  if (!open) return null

  const days = [
    { name: 'Lun', num: 24 },
    { name: 'Mar', num: 25 },
    { name: 'Mer', num: 26 },
    { name: 'Jeu', num: 27 },
    { name: 'Ven', num: 28 },
  ]
  const slots = ['10:00', '14:00', '16:30']

  return (
    <div style={bmStyles.scrim} onClick={onClose}>
      <div style={bmStyles.dialog} onClick={(e) => e.stopPropagation()}>
        <button style={bmStyles.close} onClick={onClose}>
          <Icons.X size={16} />
        </button>
        {confirmed ? (
          <div style={bmStyles.confirmed}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(93,184,166,0.15)',
                color: 'var(--primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icons.Check size={28} />
            </div>
            <div style={bmStyles.confirmedH}>C'est calé.</div>
            <div style={bmStyles.confirmedP}>
              On vous envoie une confirmation à {email || 'votre adresse'} avec l'invitation
              calendrier. À mai&nbsp;{days[day].num}, {slots[slot]}.
            </div>
          </div>
        ) : (
          <>
            <div style={bmStyles.eyebrow}>Call discovery · 45 min · gratuit</div>
            <h3 style={bmStyles.h}>Choisissez un créneau.</h3>
            <p style={bmStyles.sub}>
              On bloque 45&nbsp;min avec un expert d'intégration. Sans engagement.
            </p>

            <label style={bmStyles.label}>Mai 2026</label>
            <div style={bmStyles.daysRow}>
              {days.map((d, i) => (
                <div key={d.num} style={bmStyles.day(i === day)} onClick={() => setDay(i)}>
                  <div style={bmStyles.dayName}>{d.name}</div>
                  <div style={bmStyles.dayNum}>{d.num}</div>
                </div>
              ))}
            </div>

            <label style={bmStyles.label}>Heure (Paris)</label>
            <div style={bmStyles.slots}>
              {slots.map((s, i) => (
                <div key={s} style={bmStyles.slot(i === slot)} onClick={() => setSlot(i)}>
                  {s}
                </div>
              ))}
            </div>

            <label style={bmStyles.label}>Email professionnel</label>
            <input
              style={bmStyles.input}
              type="email"
              placeholder="email@entreprise.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button style={bmStyles.confirm} onClick={() => setConfirmed(true)}>
              Confirmer le créneau <Icons.ArrowRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

window.BookingModal = BookingModal
