import { Check, X } from '@/components/icons/lucide-crm'
import { of1 } from '@/content/of1'

export default function IncludedExcludedSection() {
  return (
    <section id="inclus" className="border-y border-hairline bg-canvas-soft px-8 py-section">
      <div className="mx-auto max-w-editorial">
        <div className="eyebrow mb-4 text-primary">Le périmètre, écrit</div>
        <h2 className="t-display-lg max-w-[720px] [text-wrap:balance]">
          Ce que vous achetez, et ce que vous n'achetez pas.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h3 className="t-title-lg mb-6">Ce qui est inclus</h3>
            <ul className="flex flex-col gap-4">
              {of1.included.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent-teal" />
                  <span className="text-[15px] leading-relaxed text-on-dark-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-l md:border-hairline md:pl-14">
            <h3 className="t-title-lg mb-6">Ce qui est exclu, nommé</h3>
            <ul className="flex flex-col gap-4">
              {of1.excluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <X size={18} className="mt-0.5 shrink-0 text-on-dark-soft" />
                  <span className="text-[15px] leading-relaxed text-on-dark-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
