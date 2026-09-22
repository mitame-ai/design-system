import { Avatar as AvatarPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

export interface AvatarProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /** 大きさ（px）。既定は 40 */
  size?: 'sm' | 'md' | 'lg'
  seed?: string
}

/**
 * 顔 — 手で描いた円の中に、写真か頭文字を置く。
 * 輪郭の線は写真の上に引かれる。写真の縁を機械的な円で切らないためである。
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size = 'md', seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLSpanElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn('tz-avatar', size !== 'md' && `tz-avatar--${size}`, className)}
      {...props}
    >
      <Shell />
      <span className="tz-avatar__face">{children}</span>
    </AvatarPrimitive.Root>
  )
})

export const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(function AvatarImage({ className, ...props }, ref) {
  return <AvatarPrimitive.Image ref={ref} className={cn('tz-avatar__img', className)} {...props} />
})

/** 写真が読めないとき、または無いときに見せる頭文字 */
export const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(function AvatarFallback({ className, ...props }, ref) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      className={cn('tz-avatar__initial', className)}
      {...props}
    />
  )
})

/** 顔の右下に打つ墨の点。在席などの状態を示す */
export function AvatarBadge({ className, children, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span className={cn('tz-avatar__badge', className)} {...props}>
      {children ?? <Mark kind="pip" />}
    </span>
  )
}

/** 複数の顔を少しずつ重ねて並べる */
export function AvatarGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-avatar-group', className)} {...props} />
}

/** 並びきらなかった人数（+3 など） */
export function AvatarGroupCount({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'span'>) {
  const [skin] = useSkin<HTMLSpanElement>({ pressable: false })
  return (
    <span ref={skin} className={cn('tz-avatar tz-avatar--count', className)} {...props}>
      <Shell />
      <span className="tz-avatar__face">
        <span className="tz-avatar__initial">{children}</span>
      </span>
    </span>
  )
}
