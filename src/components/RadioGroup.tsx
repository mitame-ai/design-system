import { RadioGroup as RadioGroupPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export const RadioGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(function RadioGroup({ className, ...props }, ref) {
  return <RadioGroupPrimitive.Root ref={ref} className={cn('tz-radios', className)} {...props} />
})

export interface RadioGroupItemProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  seed?: string
}

/**
 * ラジオ — 手で描いた丸の中に、墨を一滴落とす。
 * 選び直すと、前の滴は消え、新しい丸に滴が落ちる。
 */
export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem({ className, seed, ...props }, forwarded) {
    const [skin] = useSkin<HTMLButtonElement>({ seed, pressable: true })
    const ref = useComposedRefs(skin, forwarded)
    return (
      <RadioGroupPrimitive.Item ref={ref} className={cn('tz-knob tz-radio', className)} {...props}>
        <Shell />
        <RadioGroupPrimitive.Indicator className="tz-radio__ind">
          <Mark kind="dot" className="is-writing" seed={seed} />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    )
  },
)
