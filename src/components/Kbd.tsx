import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface KbdProps extends ComponentPropsWithoutRef<'kbd'> {}

/**
 * キー — 小さな木の札。押されるのは本物のキーボードなので、札そのものは応えない。
 * 下辺だけ筆圧を強くし、手前に厚みのある札に見せる。
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLElement>({ pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <kbd ref={ref} className={cn('tz-kbd', className)} {...props}>
      <Shell />
      <span className="tz-kbd__face">{children}</span>
    </kbd>
  )
})

/** 複数のキーを並べる（⌘ + K など） */
export function KbdGroup({ className, ...props }: ComponentPropsWithoutRef<'kbd'>) {
  return <kbd className={cn('tz-kbd-group', className)} {...props} />
}
