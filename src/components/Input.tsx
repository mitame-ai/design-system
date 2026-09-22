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
 * 書きこむ場所。器でも紙でもない。
 * 既定は枠ではなく罫で、囲いが要るときだけ枡 (boxed) を使う。
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
  /** 欄を包む要素に足すクラス */
  wrapperClassName?: string
  /** 輪郭の種を固定する */
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
  /* 変換中は、まだ墨が定まっていない : 染みを点線にする */
  const [composing, setComposing] = useState(false)

  /* 記入のたび、書いた範囲だけ罫に墨が染みる。穂先も文字に従う */
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
