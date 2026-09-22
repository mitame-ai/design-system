import type { ReactNode } from 'react'
import { Button } from '../components/Button'
import { reseed } from '../lib/tezawari/registry'

/** index.html の .cap 相当。節の見出し */
export const Cap = ({ children }: { children: ReactNode }) => (
  <p className="m-0 mb-[18px] text-[11px] tracking-[.18em] text-tz-ink-3">{children}</p>
)

/** index.html の .row 相当 */
export const Row = ({ children }: { children: ReactNode }) => (
  <div className="mb-14 flex flex-wrap items-center gap-x-[22px] gap-y-5">{children}</div>
)

/** index.html の .cards 相当 */
export const Cards = ({ children, min = 232 }: { children: ReactNode; min?: number }) => (
  <div
    className="mb-[30px] grid gap-x-[34px] gap-y-9"
    style={{ gridTemplateColumns: `repeat(auto-fit,minmax(${min}px,1fr))` }}
  >
    {children}
  </div>
)

/** index.html の .fields 相当 */
export const Fields = ({ children, wide = false }: { children: ReactNode; wide?: boolean }) => (
  <div
    className="mb-[30px] grid gap-x-[30px] gap-y-[34px]"
    style={{ gridTemplateColumns: wide ? '1fr' : 'repeat(auto-fit,minmax(248px,1fr))' }}
  >
    {children}
  </div>
)

/** 窯出し — 大域の salt を進めて、全個体を焼き直す */
export const Reseed = () => (
  <>
    <Cap>窯 出 し</Cap>
    <Row>
      <Button variant="contour" onClick={() => reseed()}>
        すべて焼き直す
      </Button>
    </Row>
  </>
)
