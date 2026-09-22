import { Tooltip as TooltipPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 添え書き — 墨で塗った小さな札に、白抜きで一言。
 * 手を留めたときにだけ現れ、離れると先に消える。
 */
export function TooltipProvider({
  delayDuration = 260,
  ...props
}: ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

/** Provider を内包した Tooltip。単独で置いても動く */
export function Tooltip(props: ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  )
}

export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & { seed?: string }
>(function TooltipContent({ className, sideOffset = 8, seed, children, ...props }, forwarded) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn('tz-leaf tz-tip', className)}
        {...props}
      >
        <Shell />
        <span className="tz-tip__label">{children}</span>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})
