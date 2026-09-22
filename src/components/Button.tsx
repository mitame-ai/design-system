import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 手作業の質感を備えたボタンコンポーネント。
 * 塗り（ink）、輪郭（contour）、素地（bare）の3つのバリアントを持ちます。
 * 素地はホバー時に線が引かれ、それまでは輪郭を持ちません。
 */
export const buttonVariants = cva('tz', {
  variants: {
    variant: {
      ink: 'tz--ink',
      contour: 'tz--contour',
      bare: 'tz--bare',
    },
    size: {
      sm: 'tz--sm',
      md: '',
      lg: 'tz--lg',
      icon: 'tz--icon',
      'icon-sm': 'tz--icon tz--icon-sm',
    },
  },
  defaultVariants: {
    variant: 'ink',
    size: 'md',
  },
})

export interface ButtonProps
  extends ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** ローディング状態。手縫いのような間隔で破線が進みます */
  loading?: boolean
  /** 輪郭のシード値を固定します。同一の seed を指定すると常に同じ形状が再現されます */
  seed?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, loading = false, seed, children, ...props },
  forwarded,
) {
  const inner = useRef<HTMLButtonElement>(null)
  const ref = useComposedRefs(inner, forwarded)
  useTezawari(inner, { seed })

  const classes = cn(buttonVariants({ variant, size }), loading && 'is-loading', className)
  const dress = (kids: ReactNode) => (
    <>
      <Shell />
      <span className="tz-label">{kids}</span>
    </>
  )

  if (asChild) {
    return (
      <Slot ref={ref} className={classes} aria-busy={loading || undefined} {...props}>
        {decorateChild(children, dress)}
      </Slot>
    )
  }

  return (
    <button ref={ref} type="button" className={classes} aria-busy={loading || undefined} {...props}>
      {dress(children)}
    </button>
  )
})
