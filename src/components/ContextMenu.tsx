import { ContextMenu as MenuPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { useSlip } from '../hooks/useSlip'
import { itemClass, MenuShortcut, pip, subArrow, TickSlot, tick } from '../lib/menu'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Separator } from './Separator'

/** 手元の札 — 右クリック（長押し）した場所に、その場で使える言葉を書いた紙を置く */
export const ContextMenu = MenuPrimitive.Root
export const ContextMenuTrigger = MenuPrimitive.Trigger
export const ContextMenuGroup = MenuPrimitive.Group
export const ContextMenuPortal = MenuPrimitive.Portal
export const ContextMenuSub = MenuPrimitive.Sub
export const ContextMenuRadioGroup = MenuPrimitive.RadioGroup

export const ContextMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Content> & { seed?: string }
>(function ContextMenuContent({ className, seed, children, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content ref={ref} className={cn('tz-leaf tz-menu', className)} {...props}>
        <Shell />
        <div className="tz-menu__scroll">{children}</div>
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  )
})

export const ContextMenuSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent> & { seed?: string }
>(function ContextMenuSubContent({ className, seed, children, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent ref={ref} className={cn('tz-leaf tz-menu', className)} {...props}>
        <Shell />
        <div className="tz-menu__scroll">{children}</div>
      </MenuPrimitive.SubContent>
    </MenuPrimitive.Portal>
  )
})

export const ContextMenuItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean
    variant?: 'default' | 'shu'
  }
>(function ContextMenuItem({ className, inset, variant, style, ...props }, ref) {
  const slip = useSlip()
  return (
    <MenuPrimitive.Item
      ref={ref}
      className={itemClass(inset, variant, className)}
      style={{ ...slip, ...style }}
      {...props}
    />
  )
})

export const ContextMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function ContextMenuCheckboxItem({ className, children, style, ...props }, ref) {
  const slip = useSlip()
  return (
    <MenuPrimitive.CheckboxItem
      ref={ref}
      className={itemClass(true, 'default', className)}
      style={{ ...slip, ...style }}
      {...props}
    >
      <TickSlot>
        <MenuPrimitive.ItemIndicator>{tick}</MenuPrimitive.ItemIndicator>
      </TickSlot>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
})

export const ContextMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function ContextMenuRadioItem({ className, children, style, ...props }, ref) {
  const slip = useSlip()
  return (
    <MenuPrimitive.RadioItem
      ref={ref}
      className={itemClass(true, 'default', className)}
      style={{ ...slip, ...style }}
      {...props}
    >
      <TickSlot>
        <MenuPrimitive.ItemIndicator>{pip}</MenuPrimitive.ItemIndicator>
      </TickSlot>
      {children}
    </MenuPrimitive.RadioItem>
  )
})

export const ContextMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }
>(function ContextMenuSubTrigger({ className, inset, children, style, ...props }, ref) {
  const slip = useSlip()
  return (
    <MenuPrimitive.SubTrigger
      ref={ref}
      className={itemClass(inset, 'default', className)}
      style={{ ...slip, ...style }}
      {...props}
    >
      {children}
      {subArrow}
    </MenuPrimitive.SubTrigger>
  )
})

export const ContextMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & { inset?: boolean }
>(function ContextMenuLabel({ className, inset, ...props }, ref) {
  return (
    <MenuPrimitive.Label
      ref={ref}
      className={cn('tz-mi-label', inset && 'tz-mi-label--inset', className)}
      {...props}
    />
  )
})

export function ContextMenuSeparator({ className }: { className?: string }) {
  return <Separator className={className} />
}

export const ContextMenuShortcut = MenuShortcut
