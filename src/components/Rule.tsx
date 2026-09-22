import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { registerRule } from '../lib/tezawari/registry'
import { cn } from '../lib/utils'

/** 手描き風の水平罫線。機械的な直線ではなく、微細なゆらぎを持たせています */
export function Rule({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerRule(el)
  }, [])
  return <div ref={ref} className={cn('tz-rule', className)} role="separator" {...props} />
}
