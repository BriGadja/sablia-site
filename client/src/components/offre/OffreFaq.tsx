import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { ChevronDown } from '@/components/icons/lucide-crm'
import { FAQ_CARRIED } from '@/content/faq-carried'
import { of1 } from '@/content/of1'

/**
 * The OF-1 questions, then the five that lived on the home until 2026-09-28 (grill decision 4).
 * Appended AFTER `of1.faq`: `of1.parity.test.ts` anchors indices 0/1/2/4 of the OF-1 list.
 */
const ENTRIES = [...of1.faq, ...FAQ_CARRIED]

export default function OffreFaq() {
  const [open, setOpen] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <section id="faq" className="border-t border-hairline-light bg-surface-light px-8 py-section">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-12 text-center">
          <div className="eyebrow mb-4 text-primary-active">FAQ</div>
          <h2 className="t-display-lg text-ink">Les questions que vous vous posez.</h2>
        </div>

        <div className="border-y border-hairline-light">
          {ENTRIES.map((item, index) => {
            const isOpen = open === index
            const btnId = `offre-faq-btn-${index}`
            const panelId = `offre-faq-panel-${index}`
            return (
              <div key={item.q} className="border-b border-hairline-light last:border-b-0">
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="t-title-sm text-ink">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={reduce ? { duration: 0 } : { duration: 0.2 }}
                      className="shrink-0 text-primary-active"
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
                  <p className="pb-5 text-[15px] leading-relaxed text-body">{item.a}</p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
