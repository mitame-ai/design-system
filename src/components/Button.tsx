import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 形づくられた器。
 * 塗り (ink) / 輪郭 (contour) / 素地 (bare) の三態を持つ。
 * 素地は手を伸ばしたときに線が引かれ、それまで輪郭を持たない。
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
  /** 読み込み中。縫い目が手縫いの拍で進む */
  loading?: boolean
  /** 輪郭の種を固定する。同じ seed は同じ形になる */
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
