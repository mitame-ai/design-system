import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 貼り紙 — 読んでほしいことを、紙に沈めて示す。
 * 朱（shu）は注意の印。面や枠を赤く塗るのではなく、左に朱の傍線を一本引く。
 * 校正で、直すべき行の脇に線を引くのと同じ作法である。
 */
export const alertVariants = cva('tz-alert', {
  variants: {
    variant: {
      plain: '',
      shu: 'tz-alert--shu',
    },
  },
  defaultVariants: { variant: 'plain' },
})

export interface AlertProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof alertVariants> {
  seed?: string
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Shell />
      {children}
    </div>
  )
})

export function AlertTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-alert__title', className)} {...props} />
}

export function AlertDescription({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-alert__text', className)} {...props} />
}

/** 貼り紙の右肩に置く操作（閉じる、詳しく見る など） */
export function AlertAction({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-alert__action', className)} {...props} />
}
