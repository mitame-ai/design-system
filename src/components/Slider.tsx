import { Direction, Slider as SliderPrimitive } from 'radix-ui'

const useDirection = Direction.useDirection

import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface SliderProps extends ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  seed?: string
}

/**
 * 目盛り — 一本の罫の上を、手で丸めた玉が滑る。
 * 選んだ範囲は、罫に墨が染みる。入力欄の「記入」と同じ層で描く。
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    className,
    value,
    defaultValue,
    min = 0,
    max = 100,
    onValueChange,
    orientation = 'horizontal',
    inverted = false,
    dir,
    seed,
    ...props
  },
  ref,
) {
  const [local, setLocal] = useState<number[]>(value ?? defaultValue ?? [min])
  const vals = value ?? local
  const span = max - min || 1
  const lo = vals.length > 1 ? Math.min(...vals) : min
  const hi = Math.max(...vals)
  /* 右から左の文脈、または反転した目盛りでは、染みも反対の端から始める */
  const flip = (useDirection(dir) === 'rtl' && orientation === 'horizontal') !== inverted
  const a = (lo - min) / span
  const b = (hi - min) / span

  const track = useRef<HTMLSpanElement>(null)
  const [skin] = useSkin<HTMLSpanElement>({ seed, pressable: false })
  const trackRef = useComposedRefs(track, skin)

  /* 染みの長さは罫の実寸から決める */
  useEffect(() => {
    const node = track.current
    if (!node) return
    const vertical = orientation === 'vertical'
    const ro = new ResizeObserver(() =>
      node.style.setProperty('--tz-pw', String(vertical ? node.offsetHeight : node.offsetWidth)),
    )
    ro.observe(node)
    return () => ro.disconnect()
  }, [orientation])

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      orientation={orientation}
      inverted={inverted}
      dir={dir}
      onValueChange={(v) => {
        setLocal(v)
        onValueChange?.(v)
      }}
      className={cn('tz-slider', className)}
      {...props}
    >
      <SliderPrimitive.Track
        ref={trackRef}
        className="tz-slider__track"
        style={
          {
            '--tz-pa': (flip ? 1 - b : a).toFixed(4),
            '--tz-pb': (flip ? 1 - a : b).toFixed(4),
          } as CSSProperties
        }
      >
        <Shell />
        <SliderPrimitive.Range className="tz-slider__range" />
      </SliderPrimitive.Track>
      {vals.map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: 玉は値の位置（何番目か）そのもので識別する
        <SliderThumb key={i} seed={seed ? `${seed}-${i}` : undefined} />
      ))}
    </SliderPrimitive.Root>
  )
})

function SliderThumb({ seed }: { seed?: string }) {
  const [skin] = useSkin<HTMLSpanElement>({ seed, pressable: true })
  return (
    <SliderPrimitive.Thumb ref={skin} className="tz-knob tz-thumb">
      <Shell />
    </SliderPrimitive.Thumb>
  )
}
