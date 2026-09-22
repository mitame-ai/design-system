import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface EmptyProps extends ComponentPropsWithoutRef<'div'> {
  /** 下書きの枠を描くかどうか。既定は true */
  outlined?: boolean
  seed?: string
}

/**
 * 空 — まだ何も書かれていない紙。
 * 枠は墨を入れる前の点線の当たり線で描く。ここに何かが置かれる、という予告である。
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { className, outlined = true, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false, enabled: outlined })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <div
      ref={ref}
      className={cn('tz-empty', outlined && 'tz-empty--outlined', className)}
      {...props}
    >
      {outlined && <Shell />}
      {children}
    </div>
  )
})

export function EmptyHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-empty__head', className)} {...props} />
}

export const emptyMediaVariants = cva('tz-empty__media', {
  variants: {
    variant: {
      default: '',
      /** 手で描いた丸で、アイコンを囲む */
      icon: 'tz-empty__media--icon',
    },
  },
  defaultVariants: { variant: 'default' },
})

export function EmptyMedia({
  className,
  variant,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div className={cn(emptyMediaVariants({ variant }), className)} {...props}>
      {variant === 'icon' && <Mark kind="circle" className="tz-empty__ring" />}
      {children}
    </div>
  )
}

export function EmptyTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-empty__title', className)} {...props} />
}

export function EmptyDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('tz-empty__text', className)} {...props} />
}

export function EmptyContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-empty__content', className)} {...props} />
}
