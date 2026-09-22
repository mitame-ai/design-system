import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface SkeletonProps extends ComponentPropsWithoutRef<'div'> {}

/**
 * 下書き — 中身が届くまでの仮の形。墨を入れる前の、点線の当たり線で描く。
 * 光が走る演出はしない。紙がゆっくり湿るように、面の濃さだけが満ち引きする。
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <div ref={ref} aria-hidden="true" className={cn('tz-sketch', className)} {...props}>
      <Shell />
    </div>
  )
})
