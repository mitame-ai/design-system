import { Slot } from '@radix-ui/react-slot'
import type { ComponentPropsWithoutRef } from 'react'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'

/** 道しるべ — 今いる場所までの道のり。区切りは筆の返し */
export function Breadcrumb({
  'aria-label': label = 'パンくずリスト',
  ...props
}: ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label={label} {...props} />
}

export function BreadcrumbList({ className, ...props }: ComponentPropsWithoutRef<'ol'>) {
  return <ol className={cn('tz-crumbs', className)} {...props} />
}

export function BreadcrumbItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('tz-crumbs__item', className)} {...props} />
}

export function BreadcrumbLink({
  asChild = false,
  className,
  ...props
}: ComponentPropsWithoutRef<'a'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'a'
  return <Comp className={cn('tz-crumbs__link', className)} {...props} />
}

/** いま居る場所。リンクではない */
export function BreadcrumbPage({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    // biome-ignore lint/a11y/useFocusableInteractive: 現在地を示すだけで、操作の対象ではない
    // biome-ignore lint/a11y/useSemanticElements: shadcn と同じく、現在地を無効なリンクとして読み上げさせる
    <span
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('tz-crumbs__page', className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'li'>) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('tz-crumbs__sep', className)}
      {...props}
    >
      {children ?? <Glyph name="next" />}
    </li>
  )
}

/** 途中を省いた印 */
export function BreadcrumbEllipsis({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('tz-crumbs__more', className)}
      {...props}
    >
      <Glyph name="more" />
      <span className="tz-sr">ほか</span>
    </span>
  )
}
