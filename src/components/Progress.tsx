import { Progress as ProgressPrimitive } from 'radix-ui'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useEffect,
  useRef,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface ProgressProps extends ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  seed?: string
}

/**
 * 進み — 一本の罫に、進んだ分だけ墨が染みていく。入力欄の「記入」と同じ作法。
 * 値が決まらないあいだ（value = null）は、手縫いの針目が罫の上を進む。
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, value, max = 100, seed, style, ...props },
  forwarded,
) {
  const el = useRef<HTMLDivElement>(null)
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(el, skin, forwarded)

  /* 染みの長さは罫の実寸で決まる。幅が変われば測り直す */
  useEffect(() => {
    const node = el.current
    if (!node) return
    const ro = new ResizeObserver(() => node.style.setProperty('--tz-pw', String(node.offsetWidth)))
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  const ratio = value == null ? null : Math.max(0, Math.min(1, value / max))
  return (
    <ProgressPrimitive.Root
      ref={ref}
      value={value}
      max={max}
      className={cn('tz-progress', ratio === null && 'is-waiting', className)}
      style={{ '--tz-pv': ratio ?? 0, ...style } as CSSProperties}
      {...props}
    >
      <Shell />
      <ProgressPrimitive.Indicator className="tz-progress__value" />
    </ProgressPrimitive.Root>
  )
})
