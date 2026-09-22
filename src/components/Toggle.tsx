import { cva, type VariantProps } from 'class-variance-authority'
import { Toggle as TogglePrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 押し込み — 押すと沈んだまま残るボタン。
 * 入っている状態は、色ではなく「へこみ」で示す。面が一段沈み、縁の墨が濃くなる。
 */
export const toggleVariants = cva('tz tz-toggle', {
  variants: {
    variant: {
      bare: 'tz--bare',
      contour: 'tz--contour',
    },
    size: {
      sm: 'tz--sm',
      md: '',
      lg: 'tz--lg',
      icon: 'tz--icon',
      'icon-sm': 'tz--icon tz--icon-sm',
    },
  },
  defaultVariants: { variant: 'bare', size: 'md' },
})

export interface ToggleProps
  extends ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {
  seed?: string
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { className, variant, size, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLButtonElement>({ seed, pressable: true })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    >
      <Shell />
      <span className="tz-label">{children}</span>
    </TogglePrimitive.Root>
  )
})
