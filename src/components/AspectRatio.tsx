import { AspectRatio as AspectRatioPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '../lib/utils'

export interface AspectRatioProps
  extends ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> {}

/** 縦横比を保つ枠。中に Panel や画像を置く */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { className, ...props },
  ref,
) {
  return <AspectRatioPrimitive.Root ref={ref} className={cn('tz-ratio', className)} {...props} />
})
