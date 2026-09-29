import { of1 } from '@/content/of1'

export default function VariantsSection() {
  return (
    <section
      id="variantes"
      className="border-t border-hairline-light bg-surface-light px-8 py-section"
    >
      <div className="mx-auto max-w-editorial">
        <div className="eyebrow mb-4 text-primary-active">Deux variantes</div>
        <h2 className="t-display-lg max-w-[720px] text-ink [text-wrap:balance]">
          Deux variantes, vous choisissez celle qui colle à votre terrain.
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {of1.variants.map((variant) => (
            <article
              key={variant.key}
              className="rounded-lg border border-hairline-light bg-white p-8"
            >
              <span className="t-caption-uppercase inline-block rounded-pill bg-primary-active px-3 py-1 text-on-primary">
                {variant.label}
              </span>
              <h3 className="t-title-lg mt-5 text-ink">{variant.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{variant.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-lg border border-accent-teal/60 bg-white p-6">
          <span className="t-caption-uppercase inline-block rounded-pill bg-accent-teal px-3 py-1 text-canvas">
            Jamais d'enregistrement à votre place
          </span>
          <p className="mt-4 max-w-[820px] text-[15px] leading-relaxed text-body">
            {of1.noRecording}
          </p>
        </div>
      </div>
    </section>
  )
}
