import { OTPInput, OTPInputContext } from 'input-otp'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 枡の罫 — 一文字ずつ書く枡を、短い罫の並びで示す。
 * 今書く枡の罫だけが引き直され、両端にかぎが立つ。書いた枡には墨が染みる。
 */
export const InputOTP = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<typeof OTPInput>>(
  function InputOTP({ className, containerClassName, ...props }, ref) {
    return (
      <OTPInput
        ref={ref}
        containerClassName={cn('tz-otp', containerClassName)}
        className={cn('tz-otp__input', className)}
        {...props}
      />
    )
  },
)

export function InputOTPGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-otp__group', className)} {...props} />
}

export interface InputOTPSlotProps extends ComponentPropsWithoutRef<'div'> {
  index: number
  seed?: string
}

export const InputOTPSlot = forwardRef<HTMLDivElement, InputOTPSlotProps>(function InputOTPSlot(
  { index, className, seed, style, ...props },
  forwarded,
) {
  const ctx = useContext(OTPInputContext)
  const slot = ctx.slots[index]
  const el = useRef<HTMLDivElement>(null)
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(el, skin, forwarded)

  /* 書いた枡は、罫の端から端まで墨が染みる */
  useEffect(() => {
    const n = el.current
    if (!n) return
    const ro = new ResizeObserver(() => n.style.setProperty('--tz-sw', String(n.offsetWidth)))
    ro.observe(n)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-active={slot?.isActive || undefined}
      className={cn(
        'tz-otp__slot',
        slot?.char && 'has-ink',
        slot?.isActive && 'is-active',
        className,
      )}
      style={style as CSSProperties}
      {...props}
    >
      <Shell />
      <span className="tz-otp__char">{slot?.char ?? slot?.placeholderChar}</span>
      {slot?.hasFakeCaret && <span className="tz-otp__nib" aria-hidden="true" />}
    </div>
  )
})

export function InputOTPSeparator(props: ComponentPropsWithoutRef<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: 枡の組の区切り。hr の既定の線ではなく、手で引いた一画を描く
    <div role="separator" className="tz-otp__sep" {...props}>
      <Mark kind="dash" />
    </div>
  )
}
