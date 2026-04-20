import { cn } from '@/lib/utils'
import { LogoMark } from './logo-mark'

type LogoWordmarkProps = {
  className?: string
  size?: number
}

export function LogoWordmark({ className, size = 26 }: LogoWordmarkProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} className="text-[color:var(--color-tuile)]" />
      <span className="font-display text-[1.3em] leading-none tracking-[-0.02em] text-[color:var(--color-encre)]">
        Sablia
      </span>
    </span>
  )
}
