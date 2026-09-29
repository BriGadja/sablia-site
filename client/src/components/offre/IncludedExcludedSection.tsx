import { Check, X } from '@/components/icons/lucide-crm'
import { of1 } from '@/content/of1'

export default function IncludedExcludedSection() {
  return (
    <section
      id="inclus"
      className="border-t border-hairline-light bg-surface-light px-8 py-section"
    >
      <div className="mx-auto max-w-editorial">
        <div className="eyebrow mb-4 text-primary-active">Le périmètre, écrit</div>
        <h2 className="t-display-lg max-w-[720px] text-ink [text-wrap:balance]">
          Ce que vous achetez, et ce que vous n'achetez pas.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h3 className="t-title-lg mb-6 text-ink">Ce qui est inclus</h3>
            <ul className="flex flex-col gap-4">
              {of1.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent-teal" />
                  <span className="text-[15px] leading-relaxed text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-hairline-light md:pl-14">
            <h3 className="t-title-lg mb-6 text-ink">Ce qui est exclu, nommé</h3>
            <ul className="flex flex-col gap-4">
              {of1.excluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <X size={18} className="mt-0.5 shrink-0 text-muted-text" />
                  <span className="text-[15px] leading-relaxed text-muted-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
