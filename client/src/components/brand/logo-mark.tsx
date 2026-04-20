import { cn } from '@/lib/utils'

type LogoMarkProps = {
  className?: string
  size?: number
  label?: string
}

export function LogoMark({ className, size = 28, label = 'Sablia' }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={label}
      role="img"
      className={cn('inline-block shrink-0', className)}
    >
      <path d="M14 8 L66 8 L40 40 Z" fill="currentColor" />
      <path d="M14 72 L40 40 L66 72 Z" fill="currentColor" />
    </svg>
  )
}
