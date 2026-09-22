import { Tabs as TabsPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, createContext, forwardRef, useContext } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

type TabsVariant = 'line' | 'inlay'
const Ctx = createContext<TabsVariant>('line')

export const Tabs = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<typeof TabsPrimitive.Root>>(
  function Tabs({ className, ...props }, ref) {
    return <TabsPrimitive.Root ref={ref} className={cn('tz-tabs', className)} {...props} />
  },
)

export interface TabsListProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /**
   * line  : 選ばれた見出しの下に、その場で一筆引く（既定）
   * inlay : 紙に沈めた溝の中で、選ばれた見出しだけが一枚の紙として浮く
   */
  variant?: TabsVariant
  seed?: string
}

/** 見出しの並び */
export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, variant = 'line', seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false, enabled: variant === 'inlay' })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('tz-tabs__list', `tz-tabs__list--${variant}`, className)}
      {...props}
    >
      {variant === 'inlay' && <Shell />}
      <Ctx.Provider value={variant}>{children}</Ctx.Provider>
    </TabsPrimitive.List>
  )
})

export const TabsTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { seed?: string }
>(function TabsTrigger({ className, seed, children, ...props }, forwarded) {
  const variant = useContext(Ctx)
  const [skin] = useSkin<HTMLButtonElement>({ seed, enabled: variant === 'inlay' })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <TabsPrimitive.Trigger ref={ref} className={cn('tz-tab', className)} {...props}>
      {variant === 'inlay' && <Shell />}
      <span className="tz-tab__label">{children}</span>
      {variant === 'line' && (
        <Mark kind="stroke" className="tz-tab__line" preserveAspectRatio="none" seed={seed} />
      )}
    </TabsPrimitive.Trigger>
  )
})

export const TabsContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return <TabsPrimitive.Content ref={ref} className={cn('tz-tabs__panel', className)} {...props} />
})
