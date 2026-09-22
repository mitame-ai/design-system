import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/**
 * 入力フィールド。矩形の枠線ではなく1本の罫線を基本とし、
 * 短い入力など枠が必要な場合のみボックス型（boxed）を用います。
 */
export const inputVariants = cva('tz-well', {
  variants: {
    variant: {
      rule: '',
      boxed: 'tz-well--boxed',
    },
  },
  defaultVariants: { variant: 'rule' },
})

export interface InputProps
  extends ComponentPropsWithoutRef<'input'>,
    VariantProps<typeof inputVariants> {
  /** 入力フィールドを内包する親要素（ラッパー）に付与するクラス名 */
  wrapperClassName?: string
  /** 輪郭のシード値を固定します */
  seed?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    wrapperClassName,
    variant,
    disabled,
    seed,
    onCompositionStart,
    onCompositionEnd,
    ...props
  },
  forwarded,
) {
  const well = useRef<HTMLSpanElement>(null)
  const ctl = useRef<HTMLInputElement>(null)
  const ref = useComposedRefs(ctl, forwarded)
  const handle = useTezawari(well, { seed })
  /* IME 変換中：確定するまでは墨の染みを点線で表現します */
  const [composing, setComposing] = useState(false)

  /* 文字入力に応じて、入力された文字幅の分だけ罫線に墨が染み込みます。キャレット（穂先）も追従します */
  const refresh = useCallback(() => handle.current?.ink(), [handle])
  useEffect(refresh)

  return (
    <span
      ref={well}
      className={cn(
        inputVariants({ variant }),
        disabled && 'is-off',
        composing && 'is-composing',
        wrapperClassName,
      )}
    >
      <Shell />
      <input
        ref={ref}
        className={cn('tz-input', className)}
        disabled={disabled}
        onInput={refresh}
        onKeyUp={refresh}
        onClick={refresh}
        onSelect={refresh}
        onScroll={refresh}
        onFocus={refresh}
        onCompositionStart={(e) => {
          setComposing(true)
          onCompositionStart?.(e)
        }}
        onCompositionEnd={(e) => {
          setComposing(false)
          onCompositionEnd?.(e)
          refresh()
        }}
        {...props}
      />
      <span className="tz-nib" aria-hidden="true" />
    </span>
  )
})
