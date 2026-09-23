import { type ComponentPropsWithoutRef, useEffect } from 'react'
import { ensureDefs } from '../lib/tezawari/defs'
import { cn } from '../lib/utils'

export interface IconProps extends ComponentPropsWithoutRef<'svg'> {}

/**
 * アイコン表示用コンポーネント。輪郭線に繊維感のある SVG フィルターを通すことで、手描き風の風合いを与えます。
 *
 * ```tsx
 * <Icon><path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" /></Icon>
 * ```
 */
export function Icon({ className, viewBox = '0 0 16 16', children, ...props }: IconProps) {
  /* 繊維フィルターを参照する。描画エンジンに登録される要素が無い画面でも用意する */
  useEffect(ensureDefs, [])
  return (
    <svg
      className={cn('tz-ico', className)}
      viewBox={viewBox}
      aria-hidden="true"
      filter="url(#tz-fiber-g)"
      {...props}
    >
      {children}
    </svg>
  )
}
