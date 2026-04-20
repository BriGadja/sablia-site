import * as React from 'react'

import { cn } from '@/lib/utils'

type RevealProps = {
  as?: 'div' | 'section' | 'article' | 'li' | 'ul' | 'ol' | 'aside' | 'figure'
  delay?: number
  className?: string
  children: React.ReactNode
}

export function Reveal({ as = 'div', delay = 0, className, children }: RevealProps) {
  const ref = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    if (rect.top < vh && rect.bottom > 0) {
      el.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as as React.ElementType
  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={cn('reveal', className)}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}
