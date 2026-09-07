import { of1 } from '@/content/of1'

export default function AudienceStrip() {
  return (
    <section className="on-light px-8 py-20">
      <div className="mx-auto max-w-editorial">
        <div className="eyebrow mb-5 text-muted-text">Pour qui</div>
        <h2 className="t-display-md max-w-[860px] [text-wrap:balance]">{of1.audience}</h2>

        <ul className="mt-9 flex flex-wrap items-center gap-2.5">
          {of1.crms.map((crm) => (
            <li
              key={crm}
              className="t-caption-uppercase rounded-pill bg-surface-light-card px-3.5 py-1.5 text-muted-text"
            >
              {crm}
            </li>
          ))}
        </ul>

        <p className="mt-7 max-w-[620px] text-[15px] leading-relaxed">
          Le CRM doit exister et être utilisé. Nous ne vendons pas le CRM, nous le remplissons.
        </p>
      </div>
    </section>
  )
}
