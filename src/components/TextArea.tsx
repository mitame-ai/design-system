import { type ComponentPropsWithoutRef, forwardRef, useCallback, useEffect, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  /** 入力欄を内包する親要素（ラッパー）に付与するクラス名 */
  wrapperClassName?: string
  /** 輪郭のシード値を固定します */
  seed?: string
}

/**
 * 原稿用紙風の複数行入力フィールド。
 * 指定行数分の罫線が描画されます。
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, wrapperClassName, disabled, rows = 4, seed, ...props },
  forwarded,
) {
  const well = useRef<HTMLSpanElement>(null)
  const ctl = useRef<HTMLTextAreaElement>(null)
  const ref = useComposedRefs(ctl, forwarded)
  const handle = useTezawari(well, { seed })

  /* 行数の変更に伴い罫線の本数が変わるため、コンポーネントを再描画します */
  // biome-ignore lint/correctness/useExhaustiveDependencies: rows の変更に合わせて再描画を実行するため
  useEffect(() => {
    handle.current?.repaint(true)
  }, [handle, rows])

  const refresh = useCallback(() => handle.current?.ink(), [handle])

  return (
    <span
      ref={well}
      className={cn('tz-well tz-well--ruled', disabled && 'is-off', wrapperClassName)}
    >
      <Shell />
      <textarea
        ref={ref}
        className={cn('tz-area', className)}
        rows={rows}
        disabled={disabled}
        onInput={refresh}
        onFocus={refresh}
        {...props}
      />
    </span>
  )
})
