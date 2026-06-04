const CRMS = ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'monday', 'notion', 'sellsy']

export default function CRMStrip() {
  return (
    <section className="on-light px-8 py-16">
      <div className="mx-auto max-w-editorial">
        <div className="t-caption-uppercase mb-7 text-center text-muted-text">
          Compatible avec votre stack. Pas de migration. Pas de double saisie.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {CRMS.map((name) => (
            <img
              key={name}
              src={`/logos/crm/${name}.svg`}
              alt={name}
              className="h-6 opacity-55 grayscale transition-all duration-base hover:opacity-95 hover:grayscale-[0.3]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
