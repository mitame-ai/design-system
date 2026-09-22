import type { ReactNode } from 'react'
import { Button } from '../components/Button'
import { reseed } from '../lib/tezawari/registry'

/** index.html の .cap 相当。各セクションのキャプション見出し */
export const Cap = ({ children }: { children: ReactNode }) => (
  <p className="m-0 mb-[18px] text-[11px] tracking-[.18em] text-tz-ink-3">{children}</p>
)

/** 横並びレイアウト（index.html の .row 相当） */
export const Row = ({ children }: { children: ReactNode }) => (
  <div className="mb-14 flex flex-wrap items-center gap-x-[22px] gap-y-5">{children}</div>
)

/** カードグリッドレイアウト（index.html の .cards 相当） */
export const Cards = ({ children, min = 232 }: { children: ReactNode; min?: number }) => (
  <div
    className="mb-[30px] grid gap-x-[34px] gap-y-9"
    style={{ gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))` }}
  >
    {children}
  </div>
)

/** フィールドグリッドレイアウト（index.html の .fields 相当） */
export const Fields = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div
    className="mb-[30px] grid gap-x-[30px] gap-y-[34px]"
    style={{ gridTemplateColumns: wide ? '1fr' : 'repeat(auto-fit,minmax(248px,1fr))' }}
  >
    {children}
  </div>
)

/** 形状の再生成（Reseed） — グローバルシードを進めて全コンポーネントを再描画する */
export const Reseed = () => (
  <>
    <Cap>形 状 の 再 生 成</Cap>
    <Row>
      <Button variant="contour" onClick={() => reseed()}>
        すべて再生成する
      </Button>
    </Row>
  </>
)
