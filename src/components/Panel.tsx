import { type ComponentPropsWithoutRef, forwardRef, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  seed?: string
}

/**
 * パネル — 規則的な方向性を持つ繊維テクスチャの面。
 * カード内で画像の代わりとして使用します。異方性ノイズにより生成されるため、外部の画像ファイルを必要としません。
 */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { className, seed, children, ...props },
  forwarded,
) {
  const inner = useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(inner, forwarded)
  useTezawari(inner, { seed })

  return (
    <div ref={ref} className={cn('tz-panel', className)} {...props}>
      <Shell />
      {children}
    </div>
  )
})
