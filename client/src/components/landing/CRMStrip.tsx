const CRMS = ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'monday', 'notion', 'sellsy']

/**
 * The compatible-CRM strip scrolls (grill 2026-09-28, decision 3): the list is rendered twice and
 * the track slides by one list, so the loop is seamless. The second copy is `aria-hidden` and
 * disappears under reduced motion, where the first one wraps, still (`index.css`, `.strip-*`).
 */
function Logos({ copy }: { copy: boolean }) {
  return (
    <ul
      aria-hidden={copy || undefined}
      className={`flex shrink-0 items-center gap-x-14 pr-14 ${copy ? 'strip-copy' : ''}`}
    >
      {CRMS.map((name) => (
        <li key={name} className="shrink-0">
          <img
            src={`/logos/crm/${name}.svg`}
            alt={copy ? '' : name}
            className="h-6 opacity-55 grayscale transition-all duration-base hover:opacity-95 hover:grayscale-[0.3]"
          />
        </li>
      ))}
    </ul>
  )
}

export default function CRMStrip() {
  return (
    <section className="on-light border-y border-hairline-light px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-editorial">
        <div className="t-caption-uppercase mb-7 text-center text-muted-text">
          Compatible avec votre stack. Pas de migration. Pas de double saisie.
        </div>
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <div className="strip-track">
            <Logos copy={false} />
            <Logos copy />
          </div>
        </div>
      </div>
    </section>
  )
}
