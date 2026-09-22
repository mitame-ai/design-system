import { Checkbox as CheckboxPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  seed?: string
}

/**
 * チェック — 小さな枡に、手で印を書き入れる。
 * 印は枡からわずかにはみ出す。紙に書く印は、枠の内側に行儀よく収まらない。
 * 不確定（indeterminate）は、横に一画だけ引く。
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  { className, seed, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLButtonElement>({ seed, pressable: true })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <CheckboxPrimitive.Root ref={ref} className={cn('tz-knob tz-check', className)} {...props}>
      <Shell />
      <CheckboxPrimitive.Indicator className="tz-check__ind">
        <Mark kind="tick" className="is-writing" seed={seed} />
        <Mark kind="dash" className="is-writing" seed={seed} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})
