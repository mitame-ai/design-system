import { Separator as SeparatorPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef, useEffect, useRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { registerRule } from '../lib/tezawari/registry'
import { cn } from '../lib/utils'

export interface SeparatorProps extends ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {}

/**
 * 区切り — 手で引いた罫。1px の直線は、この言語には無い。
 * 既定では装飾（decorative）として扱い、支援技術には読み上げさせません。
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  forwarded,
) {
  const inner = useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(inner, forwarded)
  useEffect(() => {
    const el = inner.current
    if (!el) return
    return registerRule(el)
  }, [])
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn('tz-rule', orientation === 'vertical' && 'tz-rule--v', className)}
      {...props}
    />
  )
})
