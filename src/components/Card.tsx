import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Panel } from './Panel'

/**
 * 札（カード） — 手漉き和紙をモチーフにしたコンポーネント。
 * 裁断されていない手漉き紙の縁を持ち、ドロップシャドウも個々の不規則な輪郭に合わせて投影されます。
 */
export const cardVariants = cva('tz-card', {
  variants: {
    variant: {
      /** 標準の札。接地影と紙の耳（毛羽立ち）を持ちます */
      plain: '',
      /** 拾い上げられる札。カーソルに最も近い角が浮き上がるような反応を示します */
      pick: 'tz-card--pick',
      /** 象嵌（インレイ）。浮き上がりや影を持たず、背景に馴染んで領域を区切るためのスタイルです */
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

/** カード内に配置する織物調のテクスチャ面。画像プレースホルダーとして利用できます */
export function CardMedia({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <Panel className={cn('tz-card__media', className)} aria-hidden="true" {...props} />
}
