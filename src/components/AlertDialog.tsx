import { AlertDialog as AlertDialogPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'

/**
 * 確かめの紙 — 取り返しのつかない操作の前に、一度だけ手を止めてもらう。
 * 外側を押しても閉じない。答えるまで、紙はそこに置かれたままになる。
 */
export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export const AlertDialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(function AlertDialogOverlay({ className, ...props }, ref) {
  return <AlertDialogPrimitive.Overlay ref={ref} className={cn('tz-veil', className)} {...props} />
})

export interface AlertDialogContentProps
  extends ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  size?: 'sm' | 'md'
  seed?: string
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ className, size = 'md', seed, children, ...props }, forwarded) {
    const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
    const ref = useComposedRefs(skin, forwarded)
    return (
      <AlertDialogPrimitive.Portal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            'tz-leaf tz-dialog tz-dialog--alert',
            size === 'sm' && 'tz-dialog--sm',
            className,
          )}
          {...props}
        >
          <Shell />
          <div className="tz-dialog__inner">{children}</div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    )
  },
)

export function AlertDialogHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-dialog__head', className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-dialog__foot', className)} {...props} />
}

/** 見出しに添える図。手で描いた丸の中にアイコンを置く */
export function AlertDialogMedia({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('tz-dialog__media', className)} {...props}>
      <Mark kind="circle" className="tz-dialog__ring" />
      {children}
    </div>
  )
}

export const AlertDialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(function AlertDialogTitle({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn('tz-dialog__title', className)}
      {...props}
    />
  )
})

export const AlertDialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className={cn('tz-dialog__text', className)}
      {...props}
    />
  )
})

type ActionProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> &
  Pick<ButtonProps, 'variant' | 'size'>

/** 進める操作。既定は塗りのボタン */
export const AlertDialogAction = forwardRef<HTMLButtonElement, ActionProps>(
  function AlertDialogAction({ variant = 'ink', size, children, ...props }, ref) {
    return (
      <AlertDialogPrimitive.Action ref={ref} asChild {...props}>
        <Button variant={variant} size={size}>
          {children}
        </Button>
      </AlertDialogPrimitive.Action>
    )
  },
)

/** 取りやめる操作。既定は輪郭のボタン */
export const AlertDialogCancel = forwardRef<HTMLButtonElement, ActionProps>(
  function AlertDialogCancel({ variant = 'contour', size, children, ...props }, ref) {
    return (
      <AlertDialogPrimitive.Cancel ref={ref} asChild {...props}>
        <Button variant={variant} size={size}>
          {children}
        </Button>
      </AlertDialogPrimitive.Cancel>
    )
  },
)
