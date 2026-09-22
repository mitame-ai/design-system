import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'

export interface IconProps extends ComponentPropsWithoutRef<'svg'> {}

/**
 * 部品に添える印。線は繊維のフィルタを通すので、真っ直ぐには引かれない。
 *
 * ```tsx
 * <Icon><path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" /></Icon>
 * ```
 */
export function Icon({ className, viewBox = '0 0 16 16', children, ...props }: IconProps) {
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
