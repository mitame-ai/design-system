import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { registerRule } from '../lib/tezawari/registry'
import { cn } from '../lib/utils'

export interface RuleProps extends ComponentPropsWithoutRef<'div'> {
  /** 罫の向き。vertical は上から下へ引く縦の罫になる */
  orientation?: 'horizontal' | 'vertical'
}

/** 手描き風の水平罫線。機械的な直線ではなく、微細なゆらぎを持たせています */
export function Rule({ className, orientation = 'horizontal', ...props }: RuleProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerRule(el)
  }, [])
  return (
    <div
      ref={ref}
      className={cn('tz-rule', orientation === 'vertical' && 'tz-rule--v', className)}
      role="separator"
      aria-orientation={orientation}
      {...props}
    />
  )
}
