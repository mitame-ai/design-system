import { Dialog as DialogPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Glyph } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button } from './Button'

/**
 * 差し出す紙 — 画面の中央に、一枚の紙を差し出す。
 * 背後は黒い幕で覆わない。薄い紙を一枚かぶせ、手元だけを明るく残す。
 */
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return <DialogPrimitive.Overlay ref={ref} className={cn('tz-veil', className)} {...props} />
})

export interface DialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** 右上の閉じる印を出すかどうか */
  showCloseButton?: boolean
  seed?: string
}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { className, showCloseButton = true, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn('tz-leaf tz-dialog', className)} {...props}>
        <Shell />
        <div className="tz-dialog__inner">{children}</div>
        {showCloseButton && (
          <DialogPrimitive.Close asChild>
            <Button variant="bare" size="icon-sm" className="tz-dialog__close" aria-label="閉じる">
              <Glyph name="close" />
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
})

export function DialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-dialog__head', className)} {...props} />
}

export function DialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-dialog__foot', className)} {...props} />
}

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title ref={ref} className={cn('tz-dialog__title', className)} {...props} />
  )
})

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('tz-dialog__text', className)}
      {...props}
    />
  )
})
