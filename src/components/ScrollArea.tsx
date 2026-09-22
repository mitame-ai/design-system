import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

/**
 * 巻物 — 中身が溢れる領域。
 * つまみは灰色の棒ではなく、筆で引いた一画。動かしているあいだだけ墨が濃くなる。
 */
export const ScrollArea = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & { viewportClassName?: string }
>(function ScrollArea({ className, viewportClassName, children, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Root ref={ref} className={cn('tz-scroll', className)} {...props}>
      <ScrollAreaPrimitive.Viewport className={cn('tz-scroll__viewport', viewportClassName)}>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollBar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})

export const ScrollBar = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>
>(function ScrollBar({ className, orientation = 'vertical', ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      className={cn('tz-scroll__bar', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className="tz-scroll__thumb" />
    </ScrollAreaPrimitive.Scrollbar>
  )
})
