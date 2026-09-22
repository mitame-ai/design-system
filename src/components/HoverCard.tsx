import { HoverCard as HoverCardPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/** 覗き紙 — リンクに手を留めると、その先の様子を一枚の紙に写して見せる */
export const HoverCard = HoverCardPrimitive.Root
export const HoverCardTrigger = HoverCardPrimitive.Trigger

export const HoverCardContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> & { seed?: string }
>(function HoverCardContent(
  { className, align = 'center', sideOffset = 10, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn('tz-leaf tz-hovercard', className)}
        {...props}
      >
        <Shell />
        {children}
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  )
})
