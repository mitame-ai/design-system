import { useEffect } from 'react'
import { ensureDefs } from '../lib/tezawari/defs'
import { cn } from '../lib/utils'

/**
 * 紙の繊維 — 画面全体をひとつの素材として扱う。
 * 面として使うときだけ敷く。部品を一つ置くだけなら要らない。
 */
export function PaperGrain({ className }: { className?: string }) {
  useEffect(ensureDefs, [])
  return (
    <svg className={cn('paper', className)} aria-hidden="true">
      <rect width="100%" height="100%" filter="url(#tz-paper-grain)" />
    </svg>
  )
}
