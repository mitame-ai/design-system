import { Switch as SwitchPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  size?: 'sm' | 'md'
  seed?: string
}

/**
 * 切り替え — 細長い溝の中を、墨の玉が転がる。
 * 入れると溝に墨が満ち、玉は紙の色に抜ける。玉は行き過ぎてから止まる。
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { className, size = 'md', seed, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLButtonElement>({ seed, pressable: true })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={cn('tz-knob tz-switch', size === 'sm' && 'tz-switch--sm', className)}
      {...props}
    >
      <Shell />
      <SwitchPrimitive.Thumb className="tz-switch__thumb">
        <Mark kind="dot" seed={seed} />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
})
