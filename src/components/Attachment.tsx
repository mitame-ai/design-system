import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'

/* =========================================================
   ATTACHMENT — 添え物。会話や入力欄に添えた書類の札。
     下書き (idle)       : まだ添えていない。点線の当たり線
     縫い (uploading)     : 送っているあいだ、針目が縁を進む
     乾き (processing)    : 受け取った後の処理中。墨が乾くのを待つように文字が満ち引きする
     朱 (error)           : 失敗。左に朱の傍線
   ========================================================= */

export type AttachmentState = 'idle' | 'uploading' | 'processing' | 'error' | 'done'

export const attachmentVariants = cva('tz-attach', {
  variants: {
    size: { md: '', sm: 'tz-attach--sm', xs: 'tz-attach--xs' },
    orientation: { horizontal: '', vertical: 'tz-attach--v' },
  },
  defaultVariants: { size: 'md', orientation: 'horizontal' },
})

export interface AttachmentProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof attachmentVariants> {
  state?: AttachmentState
  seed?: string
}

export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { className, state = 'done', size, orientation, seed, children, ...props },
  forwarded,
) {
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(skin, forwarded)
  return (
    <div
      ref={ref}
      data-state={state}
      aria-busy={state === 'uploading' || state === 'processing' || undefined}
      className={cn(attachmentVariants({ size, orientation }), `is-${state}`, className)}
      {...props}
    >
      <Shell />
      {children}
    </div>
  )
})

/** 添え物を横に並べる。はみ出した分は横に送って見る */
export function AttachmentGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-attaches', className)} {...props} />
}

export const attachmentMediaVariants = cva('tz-attach__media', {
  variants: {
    variant: { icon: '', image: 'tz-attach__media--image' },
  },
  defaultVariants: { variant: 'icon' },
})

export function AttachmentMedia({
  className,
  variant,
  ...props
}: ComponentPropsWithoutRef<'div'> & VariantProps<typeof attachmentMediaVariants>) {
  return <div className={cn(attachmentMediaVariants({ variant }), className)} {...props} />
}

export function AttachmentContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-attach__content', className)} {...props} />
}

export function AttachmentTitle({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-attach__title', className)} {...props} />
}

export function AttachmentDescription({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-attach__desc', className)} {...props} />
}

export function AttachmentActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-attach__actions', className)} {...props} />
}

/** 添え物に付ける小さな操作（外す、開く など）。既定は素地の小さなボタン */
export const AttachmentAction = forwardRef<HTMLButtonElement, ButtonProps>(
  function AttachmentAction({ variant = 'bare', size = 'icon-sm', className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('tz-attach__action', className)}
        {...props}
      />
    )
  },
)

/** 札全体を押せるようにする透明な覆い（中身を開く、など） */
export const AttachmentTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<'button'> & { asChild?: boolean }
>(function AttachmentTrigger({ className, asChild = false, type, ...props }, ref) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : (type ?? 'button')}
      className={cn('tz-attach__trigger', className)}
      {...props}
    />
  )
})
