import * as React from 'react'

import { cn } from '@/lib/utils'

export type AccordionEditorialItem = {
  id: string
  question: string
  answer: React.ReactNode
}

type AccordionEditorialProps = {
  items: AccordionEditorialItem[]
  className?: string
  defaultOpenId?: string | null
}

export function AccordionEditorial({
  items,
  className,
  defaultOpenId,
}: AccordionEditorialProps) {
  const initial = defaultOpenId === undefined ? (items[0]?.id ?? null) : defaultOpenId
  const [openId, setOpenId] = React.useState<string | null>(initial)

  return (
    <div className={cn('w-full', className)}>
      {items.map((item, i) => {
        const isOpen = openId === item.id
        const panelId = `faq-panel-${item.id}`
        const btnId = `faq-btn-${item.id}`
        return (
          <div
            key={item.id}
            className="border-t border-[color:var(--color-encre)]/15 last:border-b"
          >
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className={cn(
                  'group flex w-full items-start gap-5 py-6 text-left',
                  'transition-colors duration-300',
                  'hover:text-[color:var(--color-tuile)]',
                  'focus-visible:outline-none focus-visible:bg-[color:var(--color-sable-50)]/60',
                )}
              >
                <span className="folio mt-2 shrink-0">Q·{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 font-display text-[clamp(1.125rem,1.5vw+0.5rem,1.5rem)] leading-tight tracking-[-0.02em] text-[color:var(--color-encre)] group-hover:text-[color:var(--color-tuile)]">
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'mt-2 inline-block h-5 w-5 shrink-0 transition-transform duration-500',
                    isOpen ? 'rotate-45' : 'rotate-0',
                  )}
                >
                  <svg viewBox="0 0 20 20" className="h-5 w-5">
                    <path
                      d="M10 3v14M3 10h14"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className={cn(
                'grid transition-all duration-500 ease-[var(--ease-editorial)]',
                isOpen ? 'pb-8 pl-[4.75rem] pr-10' : '',
              )}
            >
              <div className="max-w-prose text-[1rem] leading-relaxed text-[color:var(--color-encre-70)]">
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
