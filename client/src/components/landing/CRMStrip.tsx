const CRMS = ['salesforce', 'hubspot', 'pipedrive', 'zoho', 'monday', 'notion']

export default function CRMStrip() {
  return (
    <section className="on-light px-8 py-16">
      <div className="mx-auto max-w-editorial">
        <div className="t-caption-uppercase mb-7 text-center text-muted-text">
          Compatible avec votre CRM
        </div>
        <div className="scrollbar-hide grid grid-cols-3 items-center justify-items-center gap-6 md:grid-cols-6">
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
