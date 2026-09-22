import type { ComponentPropsWithoutRef } from 'react'
import { Mark } from '../lib/marks'
import { cn } from '../lib/utils'

export interface SpinnerProps extends ComponentPropsWithoutRef<'span'> {
  /** 読み上げ用のラベル */
  label?: string
}

/**
 * 待ち — 手縫いの針目が輪を回る。一定の速さでは回らない。
 * 針を引き、止め、また引く。ボタンの loading と同じ拍で進む。
 */
export function Spinner({ className, label = '読み込み中', ...props }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('tz-spinner', className)} {...props}>
      <Mark kind="circle" />
    </span>
  )
}
