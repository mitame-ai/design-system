import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 札 — 小さな紙片に書いた短い言葉。
 * 塗り（ink）、輪郭（contour）、象嵌（inlay）、朱（shu）の4種。
 * 朱は注意を促すときにだけ使う。色で温かみを足すための札は作らない。
 */
export const badgeVariants = cva('tz-knob tz-badge', {
  variants: {
    variant: {
      ink: 'tz-badge--ink',
      contour: 'tz-badge--contour',
      inlay: 'tz-badge--inlay',
      shu: 'tz-badge--shu',
    },
  },
  defaultVariants: { variant: 'ink' },
})

export interface BadgeProps
  extends ComponentPropsWithoutRef<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  seed?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, asChild = false, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLSpanElement>({ seed })
  const ref = useComposedRefs(skin, forwarded)
  const classes = cn(badgeVariants({ variant }), className)
  const dress = (kids: ReactNode) => (
    <>
      <Shell />
      <span className="tz-badge__label">{kids}</span>
    </>
  )
  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...props}>
        {decorateChild(children, dress)}
      </Slot>
    )
  }
  return (
    <span ref={ref} className={classes} {...props}>
      {dress(children)}
    </span>
  )
})
