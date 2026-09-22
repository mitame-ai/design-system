import { Collapsible as CollapsiblePrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

/** 畳み — 一つの領域を開け閉めする。Accordion の一段だけを取り出したもの */
export const Collapsible = CollapsiblePrimitive.Root

export const CollapsibleTrigger = CollapsiblePrimitive.Trigger

export const CollapsibleContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(function CollapsibleContent({ className, ...props }, ref) {
  return (
    <CollapsiblePrimitive.Content ref={ref} className={cn('tz-collapse', className)} {...props} />
  )
})
