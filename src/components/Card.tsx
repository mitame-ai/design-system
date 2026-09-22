import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Panel } from './Panel'

/**
 * 札 — 漉かれた一枚の紙。
 * 縁は裁たれておらず、影は矩形のぼかしではなくその個体と同じ輪郭を持つ。
 */
export const cardVariants = cva('tz-card', {
  variants: {
    variant: {
      /** 置かれた一枚。影と耳を持つ */
      plain: '',
      /** 拾い上げられる札。手にいちばん近い角が紙から起き上がる */
      pick: 'tz-card--pick',
      /** 象嵌。浮かない札。影も耳も持たず、紙に沈んで区切るだけ */
      inlay: 'tz-card--inlay',
    },
  },
  defaultVariants: { variant: 'plain' },
})

export interface CardProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean
  seed?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, asChild = false, seed, children, ...props },
  forwarded,
) {
  const inner = useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(inner, forwarded)
  useTezawari(inner, { seed })

  const classes = cn(cardVariants({ variant }), className)
  const dress = (kids: ReactNode) => (
    <>
      <Shell />
      {kids}
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
    <div ref={ref} className={classes} {...props}>
      {dress(children)}
    </div>
  )
})

export function CardTitle({ className, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return <h3 className={cn('tz-card__title', className)} {...props} />
}

export function CardText({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('tz-card__text', className)} {...props} />
}

export function CardMeta({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-card__meta', className)} {...props} />
}

export function CardFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-card__foot', className)} {...props} />
}

/** 札の上に置く織り。画像の代わりになる面 */
export function CardMedia({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <Panel className={cn('tz-card__media', className)} aria-hidden="true" {...props} />
}
