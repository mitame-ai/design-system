import { NavigationMenu as NavPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'

/**
 * 案内 — サイトの見出しを並べ、手を留めた見出しの下に案内の紙を広げる。
 * 見出しを移ると、紙は置き直されず、同じ一枚がその場で大きさを変える。
 */
export const NavigationMenu = forwardRef<
  HTMLElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Root> & { viewport?: boolean }
>(function NavigationMenu({ className, viewport = true, children, ...props }, ref) {
  return (
    <NavPrimitive.Root ref={ref} className={cn('tz-nav', className)} {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavPrimitive.Root>
  )
})

export const NavigationMenuList = forwardRef<
  HTMLUListElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return <NavPrimitive.List ref={ref} className={cn('tz-nav__list', className)} {...props} />
})

export const NavigationMenuItem = forwardRef<
  HTMLLIElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Item>
>(function NavigationMenuItem({ className, ...props }, ref) {
  return <NavPrimitive.Item ref={ref} className={cn('tz-nav__item', className)} {...props} />
})

/** 見出しの見た目だけを他の要素（Link など）に付けたいときに使う */
export const navigationMenuTriggerStyle = () => 'tz-nav__trigger'

export const NavigationMenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavPrimitive.Trigger ref={ref} className={cn('tz-nav__trigger', className)} {...props}>
      {children}
      <Glyph name="turn" className="tz-nav__turn" />
    </NavPrimitive.Trigger>
  )
})

export const NavigationMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return <NavPrimitive.Content ref={ref} className={cn('tz-nav__content', className)} {...props} />
})

export const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Link>
>(function NavigationMenuLink({ className, ...props }, ref) {
  return <NavPrimitive.Link ref={ref} className={cn('tz-nav__link', className)} {...props} />
})

export const NavigationMenuViewport = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Viewport> & { seed?: string }
>(function NavigationMenuViewport({ className, seed, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <div className="tz-nav__stage">
      {/* 中身は Radix が差し替えるので、シェルは描画エンジンが自分で差し込む */}
      <NavPrimitive.Viewport
        ref={ref}
        className={cn('tz-leaf tz-nav__viewport', className)}
        {...props}
      />
    </div>
  )
})

export const NavigationMenuIndicator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof NavPrimitive.Indicator>
>(function NavigationMenuIndicator({ className, ...props }, ref) {
  return (
    <NavPrimitive.Indicator ref={ref} className={cn('tz-nav__indicator', className)} {...props}>
      <Glyph name="up" />
    </NavPrimitive.Indicator>
  )
})
