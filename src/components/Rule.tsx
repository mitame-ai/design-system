import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react'
import { registerRule } from '../lib/tezawari/registry'
import { cn } from '../lib/utils'

/** 手で引いた罫。1px の直線は、この言語には無い */
export function Rule({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    return registerRule(el)
  }, [])
  return <div ref={ref} className={cn('tz-rule', className)} role="separator" {...props} />
}
