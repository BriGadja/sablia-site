import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * ScrollReveal - Animation au scroll avec Framer Motion
 * 4 composants exportés pour différents effets
 * All components respect prefers-reduced-motion user preference
 */

// ============================================
// 1. ScrollReveal - Animation principale
// ============================================

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
  duration?: number
  delay?: number
  className?: string
}

const directionMap = {
  up: { y: 50, x: 0, scale: 1 },
  down: { y: -50, x: 0, scale: 1 },
  left: { y: 0, x: 50, scale: 1 },
  right: { y: 0, x: -50, scale: 1 },
  fade: { y: 0, x: 0, scale: 1 },
  scale: { y: 0, x: 0, scale: 0.8 },
}

export function ScrollReveal({
  children,
  direction = 'up',
  duration = 1,
  delay = 0,
  className = '',
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const offsets = directionMap[direction]

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, ...offsets }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal
