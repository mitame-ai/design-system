import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef, type ReactNode } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Separator, type SeparatorProps } from './Separator'

/**
 * 項目 — 一覧の一行。図、言葉、操作を横に並べる。
 * 素（plain）は面を持たない。輪郭（outline）は薄い紙の枠、象嵌（muted）は紙に沈めた面になる。
 * リンクとして置いた項目だけが、触れたときにたわむ。
 */
export const itemVariants = cva('tz-item', {
  variants: {
    variant: {
      plain: '',
      outline: 'tz-item--outline',
      muted: 'tz-item--muted',
    },
    size: {
      md: '',
      sm: 'tz-item--sm',
    },
  },
  defaultVariants: { variant: 'plain', size: 'md' },
})

export interface ItemProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof itemVariants> {
  asChild?: boolean
  seed?: string
}

export const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
  { className, variant, size, asChild = false, seed, children, ...props },
  forwarded,
) {
  const surfaced = !!variant && variant !== 'plain'
  const [skin] = useSkin<HTMLDivElement>({ seed, enabled: surfaced })
  const ref = useComposedRefs(skin, forwarded)
  const classes = cn(itemVariants({ variant, size }), className)
  const dress = (kids: ReactNode) => (
    <>
      {surfaced && <Shell />}
      {kids}
    </>
  )
  if (asChild) {
    return (
      <Slot ref={ref} className={classes} {...props}>
        {decorateChild(children, dress)}
      </Slot>
    )
  }
  return (
    <div ref={ref} className={classes} {...props}>
      {dress(children)}
    </div>
  )
})

export function ItemGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  // biome-ignore lint/a11y/useSemanticElements: 子の Item を並べるだけの一覧。ul にすると li を強いることになる
  return <div role="list" className={cn('tz-items', className)} {...props} />
}

export function ItemSeparator({ className, ...props }: SeparatorProps) {
  return <Separator className={cn('tz-item__sep', className)} {...props} />
}

export const itemMediaVariants = cva('tz-item__media', {
  variants: {
    variant: {
      default: '',
      /** 小さな象嵌の枡にアイコンを置く */
      icon: 'tz-item__media--icon',
      /** 写真を置く。角は紙の縁と同じく、機械的に切り揃えない */
      image: 'tz-item__media--image',
    },
  },
  defaultVariants: { variant: 'default' },
})

export function ItemMedia({
  className,
  variant,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'> & VariantProps<typeof itemMediaVariants>) {
  const [skin] = useSkin<HTMLDivElement>({ pressable: false, enabled: variant === 'icon' })
  return (
    <div ref={skin} className={cn(itemMediaVariants({ variant }), className)} {...props}>
      {variant === 'icon' && <Shell />}
      {children}
    </div>
  )
}

export function ItemContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-item__content', className)} {...props} />
}

export function ItemTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-item__title', className)} {...props} />
}

export function ItemDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('tz-item__text', className)} {...props} />
}

export function ItemActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-item__actions', className)} {...props} />
}

export function ItemHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-item__header', className)} {...props} />
}

export function ItemFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-item__footer', className)} {...props} />
}
