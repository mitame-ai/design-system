import { useEffect } from 'react'
import { ensureDefs } from '../lib/tezawari/defs'
import { cn } from '../lib/utils'

/**
 * 紙の繊維テクスチャ — 画面全体を一枚の和紙として表現するための背景コンポーネント。
 * 背景全体に敷く場合に使用します。個別のコンポーネントを単体で配置する場合は不要です。
 */
export function PaperGrain({ className }: { className?: string }) {
  useEffect(ensureDefs, [])
  return (
    <svg className={cn('paper', className)} aria-hidden="true">
      <rect width="100%" height="100%" filter="url(#tz-paper-grain)" />
    </svg>
  )
}
