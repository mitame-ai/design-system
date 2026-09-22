import { Dialog as SheetPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Glyph } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button } from './Button'

/**
 * 差し込み紙 — 画面の端から、大判の紙を一枚差し込む。
 * 画面の外に出ている三辺は見えない。見えるのは、手漉きの耳が残った一辺だけになる。
 */
export const Sheet = SheetPrimitive.Root
export const SheetTrigger = SheetPrimitive.Trigger
export const SheetClose = SheetPrimitive.Close
export const SheetPortal = SheetPrimitive.Portal

export interface SheetContentProps extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  showCloseButton?: boolean
  seed?: string
}

export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(function SheetContent(
  { className, side = 'right', showCloseButton = true, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="tz-veil" />
      <SheetPrimitive.Content
        ref={ref}
        data-side={side}
        className={cn('tz-sheet', `tz-sheet--${side}`, className)}
        {...props}
      >
        <Shell />
        <div className="tz-sheet__inner">{children}</div>
        {showCloseButton && (
          <SheetPrimitive.Close asChild>
            <Button variant="bare" size="icon-sm" className="tz-sheet__close" aria-label="閉じる">
              <Glyph name="close" />
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
})

export function SheetHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-sheet__head', className)} {...props} />
}

export function SheetFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-sheet__foot', className)} {...props} />
}

export const SheetTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return <SheetPrimitive.Title ref={ref} className={cn('tz-dialog__title', className)} {...props} />
})

export const SheetDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <SheetPrimitive.Description ref={ref} className={cn('tz-dialog__text', className)} {...props} />
  )
})
