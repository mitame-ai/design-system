import { type ComponentPropsWithoutRef, forwardRef, useCallback, useEffect } from 'react'
import { useSkin } from '../hooks/useSkin'
import { Glyph } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface NativeSelectProps extends ComponentPropsWithoutRef<'select'> {
  variant?: 'rule' | 'boxed'
  wrapperClassName?: string
  seed?: string
}

/**
 * 素のセレクト — ブラウザの select をそのまま使い、罫と返しだけを手で描く。
 * 開いたときの一覧は OS のものになる。選んだ言葉は罫に墨として写る。
 */
export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(function NativeSelect(
  { className, wrapperClassName, variant = 'rule', disabled, seed, onChange, ...props },
  ref,
) {
  const [skin, handle] = useSkin<HTMLSpanElement>({ seed, pressable: false })
  const refresh = useCallback(() => handle.current?.ink(), [handle])
  useEffect(refresh)
  return (
    <span
      ref={skin}
      className={cn(
        'tz-well tz-well--native',
        variant === 'boxed' && 'tz-well--boxed',
        disabled && 'is-off',
        wrapperClassName,
      )}
    >
      <Shell />
      <select
        ref={ref}
        disabled={disabled}
        className={cn('tz-native', className)}
        onChange={(e) => {
          onChange?.(e)
          refresh()
        }}
        {...props}
      />
      <Glyph name="turn" className="tz-native__turn" />
    </span>
  )
})

export function NativeSelectOption(props: ComponentPropsWithoutRef<'option'>) {
  return <option {...props} />
}

export function NativeSelectOptGroup(props: ComponentPropsWithoutRef<'optgroup'>) {
  return <optgroup {...props} />
}
