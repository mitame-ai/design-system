import { type ComponentPropsWithoutRef, forwardRef, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface PanelProps extends ComponentPropsWithoutRef<'div'> {
  seed?: string
}

/**
 * 織り — 方向を持つ繊維の面。
 * 札の中で画像の代わりに使う。異方性のノイズだけで作るので、外部の画像を持たない。
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
