import type { VariantProps } from 'class-variance-authority'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, createContext, forwardRef, useContext } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { toggleVariants } from './Toggle'

type ToggleStyle = VariantProps<typeof toggleVariants>
const Ctx = createContext<ToggleStyle>({})

export type ToggleGroupProps = ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
  ToggleStyle

/** 押し込みの組。一つだけ、または幾つでも沈めておける */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  { className, variant, size, children, ...props },
  ref,
) {
  return (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn('tz-toggles', className)}
      {...(props as ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>)}
    >
      <Ctx.Provider value={{ variant, size }}>{children}</Ctx.Provider>
    </ToggleGroupPrimitive.Root>
  )
})

export interface ToggleGroupItemProps
  extends ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>,
    ToggleStyle {
  seed?: string
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem({ className, variant, size, seed, children, ...props }, forwarded) {
    const group = useContext(Ctx)
    const [skin] = useSkin<HTMLButtonElement>({ seed, pressable: true })
    const ref = useComposedRefs(skin, forwarded)
    return (
      <ToggleGroupPrimitive.Item
        ref={ref}
        className={cn(
          toggleVariants({ variant: variant ?? group.variant, size: size ?? group.size }),
          className,
        )}
        {...props}
      >
        <Shell />
        <span className="tz-label">{children}</span>
      </ToggleGroupPrimitive.Item>
    )
  },
)
