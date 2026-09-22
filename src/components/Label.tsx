import { Label as LabelPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

export interface LabelProps extends ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

/** ラベル — 字間を広く取った、控えめな見出し文字。FieldLabel と同じ調子で書く */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <LabelPrimitive.Root ref={ref} className={cn('tz-label-text', className)} {...props} />
})
