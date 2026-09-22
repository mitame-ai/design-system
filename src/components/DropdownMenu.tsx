import { DropdownMenu as MenuPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { useSlip } from '../hooks/useSlip'
import { itemClass, MenuShortcut, pip, subArrow, TickSlot, tick } from '../lib/menu'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Separator } from './Separator'

/**
 * 引き出しの札 — 押した場所から、選べる言葉を書いた紙が一枚降りてくる。
 * 項目は一行ずつわずかに傾き、定規で揃えたようには並ばない。
 */
export const DropdownMenu = MenuPrimitive.Root
export const DropdownMenuTrigger = MenuPrimitive.Trigger
export const DropdownMenuGroup = MenuPrimitive.Group
export const DropdownMenuPortal = MenuPrimitive.Portal
export const DropdownMenuSub = MenuPrimitive.Sub
export const DropdownMenuRadioGroup = MenuPrimitive.RadioGroup

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Content> & { seed?: string }
>(function DropdownMenuContent({ className, sideOffset = 8, seed, children, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn('tz-leaf tz-menu', className)}
        {...props}
      >
        <Shell />
        <div className="tz-menu__scroll">{children}</div>
      </MenuPrimitive.Content>
    </MenuPrimitive.Portal>
  )
})

export const DropdownMenuSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent> & { seed?: string }
>(function DropdownMenuSubContent(
  { className, sideOffset = 6, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent
        ref={ref}
        sideOffset={sideOffset}
        className={cn('tz-leaf tz-menu', className)}
        {...props}
      >
        <Shell />
        <div className="tz-menu__scroll">{children}</div>
      </MenuPrimitive.SubContent>
    </MenuPrimitive.Portal>
  )
})

export interface DropdownMenuItemProps extends ComponentPropsWithoutRef<typeof MenuPrimitive.Item> {
  inset?: boolean
  /** shu は取り消せない操作（削除など）に使う */
  variant?: 'default' | 'shu'
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ className, inset, variant, style, ...props }, ref) {
    const slip = useSlip()
    return (
      <MenuPrimitive.Item
        ref={ref}
        className={itemClass(inset, variant, className)}
        style={{ ...slip, ...style }}
        {...props}
      />
    )
  },
)

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function DropdownMenuCheckboxItem({ className, children, style, ...props }, ref) {
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

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function DropdownMenuRadioItem({ className, children, style, ...props }, ref) {
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

export const DropdownMenuSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }
>(function DropdownMenuSubTrigger({ className, inset, children, style, ...props }, ref) {
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

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & { inset?: boolean }
>(function DropdownMenuLabel({ className, inset, ...props }, ref) {
  return (
    <MenuPrimitive.Label
      ref={ref}
      className={cn('tz-mi-label', inset && 'tz-mi-label--inset', className)}
      {...props}
    />
  )
})

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <Separator className={className} />
}

export const DropdownMenuShortcut = MenuShortcut
