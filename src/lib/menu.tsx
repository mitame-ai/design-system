import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Glyph, Mark } from './marks'
import { cn } from './utils'

/* =========================================================
   メニューの共通部品 — DropdownMenu / ContextMenu / Menubar が同じ項目の作法を使う。
   項目は Select の選択肢と同じく、見ているものが押し出され、行頭に墨の縦線が立つ。
   チェックは手で書き入れ、ラジオは墨を一滴落とす。
   ========================================================= */

export const itemClass = (inset?: boolean, variant?: 'default' | 'shu', className?: string) =>
  cn('tz-mi', inset && 'tz-mi--inset', variant === 'shu' && 'tz-mi--shu', className)

export const TickSlot = ({ children }: { children: ReactNode }) => (
  <span className="tz-mi__ind">{children}</span>
)

export const tick = <Mark kind="tick" className="is-writing" />
export const pip = <Mark kind="pip" className="is-writing" />
export const subArrow = <Glyph name="next" className="tz-mi__sub" />

export function MenuShortcut({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-mi__short', className)} {...props} />
}
