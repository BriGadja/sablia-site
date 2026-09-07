import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from '@/components/icons/lucide-crm'
import { of1 } from '@/content/of1'

export default function OffreFaq() {
  const [open, setOpen] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <section id="faq" className="border-t border-hairline bg-canvas-soft px-8 py-section">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-12 text-center">
          <div className="eyebrow mb-4 text-primary">FAQ</div>
          <h2 className="t-display-lg">Les questions que vous vous posez.</h2>
        </div>

        <div className="border-y border-hairline">
          {of1.faq.map((item, index) => {
            const isOpen = open === index
            const btnId = `offre-faq-btn-${index}`
            const panelId = `offre-faq-panel-${index}`
            return (
              <div key={item.q} className="border-b border-hairline last:border-b-0">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-on-dark"
                  >
                    <span className="t-title-sm text-on-dark">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                      className="shrink-0 text-primary"
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                </h3>
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.28, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-[15px] leading-relaxed text-on-dark-body">{item.a}</p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
