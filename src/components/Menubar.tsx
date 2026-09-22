import { Menubar as MenuPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { useSlip } from '../hooks/useSlip'
import { itemClass, MenuShortcut, pip, subArrow, TickSlot, tick } from '../lib/menu'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Separator } from './Separator'

/**
 * 献立 — 画面の上に並ぶ見出し。見出しを押すと、その下に札が降りてくる。
 * 並び自体は紙に沈めた細い溝として描く。
 */
export const Menubar = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Root> & { seed?: string }
>(function Menubar({ className, seed, children, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Root ref={ref} className={cn('tz-menubar', className)} {...props}>
      <Shell />
      {children}
    </MenuPrimitive.Root>
  )
})

export function MenubarMenu(props: ComponentPropsWithoutRef<typeof MenuPrimitive.Menu>) {
  return <MenuPrimitive.Menu {...props} />
}
export const MenubarGroup = MenuPrimitive.Group
export const MenubarPortal = MenuPrimitive.Portal
export const MenubarSub = MenuPrimitive.Sub
export const MenubarRadioGroup = MenuPrimitive.RadioGroup

export const MenubarTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Trigger>
>(function MenubarTrigger({ className, ...props }, ref) {
  return (
    <MenuPrimitive.Trigger ref={ref} className={cn('tz-menubar__trigger', className)} {...props} />
  )
})

export const MenubarContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Content> & { seed?: string }
>(function MenubarContent(
  { className, align = 'start', alignOffset = -4, sideOffset = 10, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
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

export const MenubarSubContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubContent> & { seed?: string }
>(function MenubarSubContent({ className, seed, children, ...props }, forwarded) {
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

export const MenubarItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Item> & {
    inset?: boolean
    variant?: 'default' | 'shu'
  }
>(function MenubarItem({ className, inset, variant, style, ...props }, ref) {
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

export const MenubarCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.CheckboxItem>
>(function MenubarCheckboxItem({ className, children, style, ...props }, ref) {
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

export const MenubarRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.RadioItem>
>(function MenubarRadioItem({ className, children, style, ...props }, ref) {
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

export const MenubarSubTrigger = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.SubTrigger> & { inset?: boolean }
>(function MenubarSubTrigger({ className, inset, children, style, ...props }, ref) {
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

export const MenubarLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof MenuPrimitive.Label> & { inset?: boolean }
>(function MenubarLabel({ className, inset, ...props }, ref) {
  return (
    <MenuPrimitive.Label
      ref={ref}
      className={cn('tz-mi-label', inset && 'tz-mi-label--inset', className)}
      {...props}
    />
  )
})

export function MenubarSeparator({ className }: { className?: string }) {
  return <Separator className={className} />
}

export const MenubarShortcut = MenuShortcut
