import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'

/**
 * 発言 — 誰が、何を、いつ言ったかを一行にまとめる枠組み。
 * 顔（Avatar）と吹き出し（Bubble）を並べる。自分の発言は右に寄せる（align="end"）。
 */
export function MessageGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-messages', className)} {...props} />
}

export function Message({
  className,
  align = 'start',
  ...props
}: ComponentPropsWithoutRef<'div'> & { align?: 'start' | 'end' }) {
  return (
    <div data-align={align} className={cn('tz-message', `is-${align}`, className)} {...props} />
  )
}

/** 顔を置く場所。中に Avatar を置く */
export function MessageAvatar({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-message__avatar', className)} {...props} />
}

export function MessageContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-message__content', className)} {...props} />
}

/** 名前など、発言の上に添える小さな字 */
export function MessageHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-message__header', className)} {...props} />
}

/** 時刻や既読など、発言の下に添える小さな字 */
export function MessageFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-message__footer', className)} {...props} />
}
