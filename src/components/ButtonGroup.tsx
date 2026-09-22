import { Slot } from '@radix-ui/react-slot'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'
import { Separator, type SeparatorProps } from './Separator'

export interface ButtonGroupProps extends ComponentPropsWithoutRef<'div'> {
  orientation?: 'horizontal' | 'vertical'
}

/**
 * ボタンの組 — 器を寄せて並べる。継ぎ目を溶接して一枚にはしない。
 * 一つひとつは別の個体のまま、間隔だけを詰めて「組」に見せる。
 */
export function ButtonGroup({ className, orientation = 'horizontal', ...props }: ButtonGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: fieldset ではなく group ロールの並びとして扱う
    <div
      role="group"
      data-orientation={orientation}
      className={cn('tz-bgroup', orientation === 'vertical' && 'tz-bgroup--v', className)}
      {...props}
    />
  )
}

/** 組の中に置く、押せない言葉（単位や前置きなど） */
export function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: ComponentPropsWithoutRef<'span'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'
  return <Comp className={cn('tz-bgroup__text', className)} {...props} />
}

/** 組の中の区切り。既定では縦の罫 */
export function ButtonGroupSeparator({
  orientation = 'vertical',
  className,
  ...props
}: SeparatorProps) {
  return (
    <Separator orientation={orientation} className={cn('tz-bgroup__sep', className)} {...props} />
  )
}
