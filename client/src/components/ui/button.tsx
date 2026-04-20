import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'bg-transparent text-[color:var(--color-encre)] hover:text-[color:var(--color-tuile)]',
        link: 'text-primary underline-offset-4 hover:underline',
        primary:
          'bg-[color:var(--color-encre)] text-[color:var(--color-sable-50)] hover:bg-[color:var(--color-tuile)] hover:text-[color:var(--color-sable-50)] active:translate-y-[1px] rounded-none',
        editorial:
          'bg-transparent text-[color:var(--color-encre)] border border-[color:var(--color-encre)]/25 hover:border-[color:var(--color-encre)] hover:bg-[color:var(--color-encre)]/[0.03] active:translate-y-[1px] rounded-none',
        tuile:
          'bg-[color:var(--color-tuile)] text-[color:var(--color-sable-50)] hover:bg-[color:var(--color-tuile-dark)] active:translate-y-[1px] rounded-none',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        md: 'h-11 px-6',
        xl: 'h-[3.25rem] px-8 text-[1rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

type ButtonLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants>

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
)
ButtonLink.displayName = 'ButtonLink'

export { Button, ButtonLink, buttonVariants }
