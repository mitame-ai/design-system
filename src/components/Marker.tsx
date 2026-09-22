import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { decorateChild } from '../lib/slot'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

/**
 * 目印 — 会話や記録の流れの中に置く、小さな注記（「ここから新しい話題」「3 日前」など）。
 * 区切り（separator）は両側に手で罫を引き、下線（border）は下に一本引く。
 */
export const markerVariants = cva('tz-marker', {
  variants: {
    variant: {
      default: '',
      separator: 'tz-marker--separator',
      border: 'tz-marker--border',
    },
  },
  defaultVariants: { variant: 'default' },
})

export interface MarkerProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof markerVariants> {
  asChild?: boolean
}

export function Marker({ className, variant, asChild = false, children, ...props }: MarkerProps) {
  const classes = markerVariants({ variant, className })
  const dress = (kids: ReactNode) =>
    variant === 'separator' ? (
      <>
        <Rule className="tz-marker__rule" aria-hidden="true" role="none" />
        {kids}
        <Rule className="tz-marker__rule" aria-hidden="true" role="none" />
      </>
    ) : variant === 'border' ? (
      <>
        {kids}
        <Rule className="tz-marker__under" aria-hidden="true" role="none" />
      </>
    ) : (
      kids
    )
  if (asChild) {
    return (
      <Slot className={classes} {...props}>
        {decorateChild(children, dress)}
      </Slot>
    )
  }
  return (
    <div className={classes} {...props}>
      {dress(children)}
    </div>
  )
}

export function MarkerIcon({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span aria-hidden="true" className={cn('tz-marker__icon', className)} {...props} />
}

export function MarkerContent({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-marker__content', className)} {...props} />
}
