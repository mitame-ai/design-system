import { Popover as PopoverPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 浮き紙 — 押した場所のそばに、一枚の紙がそっと置かれる。
 * 机の上のカードより光を多く受け、影はその紙の輪郭から落ちる。
 */
export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverAnchor = PopoverPrimitive.Anchor
export const PopoverClose = PopoverPrimitive.Close

export interface PopoverContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  seed?: string
  /** Portal を使わず、その場に描く */
  inline?: boolean
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(
    { className, align = 'center', sideOffset = 10, seed, inline = false, children, ...props },
    forwarded,
  ) {
    const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
    const ref = useComposedRefs(skin, forwarded)
    const content = (
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn('tz-leaf tz-popover', className)}
        {...props}
      >
        <Shell />
        {children}
      </PopoverPrimitive.Content>
    )
    return inline ? content : <PopoverPrimitive.Portal>{content}</PopoverPrimitive.Portal>
  },
)

export function PopoverHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-popover__head', className)} {...props} />
}

export function PopoverTitle({ className, ...props }: ComponentPropsWithoutRef<'h4'>) {
  return <h4 className={cn('tz-popover__title', className)} {...props} />
}

export function PopoverDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('tz-popover__text', className)} {...props} />
}
