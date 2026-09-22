import type { ComponentPropsWithoutRef } from 'react'
import { Glyph, Mark } from '../lib/marks'
import { cn } from '../lib/utils'
import { Button } from './Button'

/** 頁送り — いま開いている頁の数字には、手で丸を付ける */
export function Pagination({ className, ...props }: ComponentPropsWithoutRef<'nav'>) {
  return <nav aria-label="頁送り" className={cn('tz-pages', className)} {...props} />
}

export function PaginationContent({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return <ul className={cn('tz-pages__list', className)} {...props} />
}

export function PaginationItem(props: ComponentPropsWithoutRef<'li'>) {
  return <li {...props} />
}

export interface PaginationLinkProps extends ComponentPropsWithoutRef<'a'> {
  isActive?: boolean
  size?: 'icon-sm' | 'sm'
}

export function PaginationLink({
  className,
  isActive = false,
  size = 'icon-sm',
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      asChild
      variant="bare"
      size={size}
      className={cn('tz-pages__link', isActive && 'is-current', className)}
    >
      <a aria-current={isActive ? 'page' : undefined} {...props}>
        {children}
        {isActive && <Mark kind="circle" className="tz-pages__ring is-writing" />}
      </a>
    </Button>
  )
}

export function PaginationPrevious({
  className,
  children = '前へ',
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <PaginationLink
      aria-label="前の頁へ"
      size="sm"
      className={cn('tz-pages__step', className)}
      {...props}
    >
      <Glyph name="prev" />
      <span>{children}</span>
    </PaginationLink>
  )
}

export function PaginationNext({
  className,
  children = '次へ',
  ...props
}: ComponentPropsWithoutRef<'a'>) {
  return (
    <PaginationLink
      aria-label="次の頁へ"
      size="sm"
      className={cn('tz-pages__step', className)}
      {...props}
    >
      <span>{children}</span>
      <Glyph name="next" />
    </PaginationLink>
  )
}

export function PaginationEllipsis({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span aria-hidden="true" className={cn('tz-pages__more', className)} {...props}>
      <Glyph name="more" />
      <span className="tz-sr">ほかの頁</span>
    </span>
  )
}
