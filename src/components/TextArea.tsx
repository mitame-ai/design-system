import { type ComponentPropsWithoutRef, forwardRef, useCallback, useEffect, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface TextAreaProps extends ComponentPropsWithoutRef<'textarea'> {
  /** 欄を包む要素に足すクラス */
  wrapperClassName?: string
  /** 輪郭の種を固定する */
  seed?: string
}

/**
 * 原稿用紙。面の中に行の数だけ罫が引かれている。
 * 行は紙に引かれているので、書いても動かない。
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { className, wrapperClassName, disabled, rows = 4, seed, ...props },
  forwarded,
) {
  const well = useRef<HTMLSpanElement>(null)
  const ctl = useRef<HTMLTextAreaElement>(null)
  const ref = useComposedRefs(ctl, forwarded)
  const handle = useTezawari(well, { seed })

  /* 行数が変われば、罫の本数も変わる : 面を漉き直す */
  // biome-ignore lint/correctness/useExhaustiveDependencies: rows は DOM を変えるので、値そのものを見る
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
