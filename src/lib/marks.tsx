import { type ComponentPropsWithoutRef, useEffect, useId, useMemo } from 'react'
import { useSalt } from '../hooks/useSalt'
import { ensureDefs } from './tezawari/defs'
import { circleMark, dashMark, dotMark, frameMark, strokeMark, tickMark } from './tezawari/geometry'
import { fnv, mulberry32, type Rand } from './tezawari/random'
import { cn } from './utils'

/* =========================================================
   印 (Mark) — 描画エンジンを通さない、小さな手描きの記号。
   チェック、丸印、墨の点など、面ではなく「書き込まれる印」はここで描く。
   形はシード（useId と salt）から決まり、同じ個体はいつも同じ形をしている。
   パスは pathLength=1 で正規化してあるので、CSS だけで「書かれる」動きを付けられる。
   ========================================================= */

const drawers: Record<MarkKind, (rand: Rand) => string> = {
  tick: tickMark,
  circle: circleMark,
  dot: (rand) => dotMark(rand, 4.1),
  pip: (rand) => dotMark(rand, 2.4),
  dash: dashMark,
  stroke: strokeMark,
  ring: (rand) => dotMark(rand, 7.4),
  frame: (rand) => frameMark(rand, 19, 19, 4.2, 0.45),
}

export type MarkKind = 'tick' | 'circle' | 'dot' | 'pip' | 'dash' | 'stroke' | 'ring' | 'frame'

export interface MarkProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'children'> {
  kind: MarkKind
  /** 形を固定したいときのシード */
  seed?: string
}

export function Mark({ kind, seed, className, ...props }: MarkProps) {
  const id = useId()
  const salt = useSalt()
  /* 印は描画エンジンを通さないが繊維フィルターを参照する。登録される要素が無い画面でも用意する */
  useEffect(ensureDefs, [])
  const d = useMemo(
    () => drawers[kind](mulberry32(fnv(`${kind}|${seed ?? id}|${salt}`))),
    [kind, seed, id, salt],
  )
  return (
    <svg
      className={cn('tz-mark', `tz-mark--${kind}`, className)}
      viewBox="0 0 19 19"
      aria-hidden="true"
      filter="url(#tz-fiber-g)"
      {...props}
    >
      <path d={d} pathLength={1} />
    </svg>
  )
}

/* =========================================================
   字形 (Glyph) — 部品が内部で使う、決まった形の小さな記号。
   Icon と同じく繊維のフィルターを通して、線に手の揺れを与える。
   座標はわざと格子に揃えていない。
   ========================================================= */

const glyphs = {
  /** 返し : 筆が下で止まって返る。開閉の印 */
  turn: 'M3.1 5.9 C4.7 8.6 6.2 10.3 7.9 10.8 C9.6 10.3 11.2 8.5 12.9 6',
  next: 'M6.1 3.2 C8.6 4.9 10.3 6.5 10.9 8.1 C10.3 9.7 8.7 11.3 6.2 12.9',
  prev: 'M9.9 3.2 C7.4 4.9 5.7 6.5 5.1 8.1 C5.7 9.7 7.3 11.3 9.8 12.9',
  up: 'M3.1 10.1 C4.7 7.4 6.2 5.7 7.9 5.2 C9.6 5.7 11.2 7.5 12.9 10',
  close: 'M4.1 4.3 C6.7 6.6 9.3 9.4 11.9 11.8 M11.7 4.1 C9.2 6.8 6.9 9.2 4.3 11.9',
  plus: 'M8.1 3.4 C7.9 6.4 8 9.6 7.9 12.7 M3.4 8.2 C6.4 7.9 9.6 8.1 12.7 7.9',
  minus: 'M3.4 8.2 C6.4 7.9 9.6 8.1 12.7 7.9',
  search:
    'M6.9 2.9 C9.3 2.8 11.1 4.6 11 6.9 C10.9 9.2 9.2 10.9 6.9 10.9 C4.6 11 2.9 9.1 2.9 6.9 C2.9 4.7 4.7 3 6.9 2.9 M9.9 10 C11.1 11.3 12.2 12.3 13.3 13.3',
  more: 'M3.4 8.1 L3.5 8.2 M8 7.9 L8.1 8 M12.5 8.1 L12.6 8.2',
  grip: 'M6.1 3.6 L6.2 3.7 M9.9 3.5 L10 3.6 M6 8 L6.1 8.1 M9.9 8.1 L10 8.2 M6.1 12.4 L6.2 12.5 M10 12.3 L10.1 12.4',
  down: 'M8 2.9 C8.1 6.3 7.9 9.6 8 12.8 M4.2 9.3 C5.6 10.6 6.8 11.8 8 13 C9.2 11.8 10.4 10.5 11.8 9.2',
  panel:
    'M2.9 3.4 C6.3 3.1 9.7 3.2 13.1 3.3 C13.2 6.5 13.1 9.6 13 12.7 C9.7 12.9 6.3 12.8 3 12.7 C2.8 9.6 2.9 6.5 2.9 3.4 M6.3 3.4 C6.2 6.5 6.4 9.6 6.2 12.7',
  file: 'M4.1 2.3 C6.1 2.2 8 2.3 9.6 2.4 L12.1 5 C12.2 7.8 12.1 10.7 12 13.6 C9.4 13.8 6.7 13.7 4 13.6 C3.9 9.9 4 6.1 4.1 2.3 M9.5 2.5 C9.4 3.4 9.5 4.3 9.6 5.1 C10.4 5.2 11.2 5.1 12 5',
  clip: 'M10.4 5.1 C8.7 6.9 7.1 8.6 5.9 10 C5.1 11 5.8 12.3 6.9 11.6 C8.8 9.8 10.8 7.8 12.4 6 C13.9 4.2 12 2 10.2 3.6 C8.1 5.6 5.9 7.9 3.9 10.2 C2.2 12.4 4.8 15 6.9 13.1 C8.6 11.4 10.2 9.8 11.7 8.2',
  info: 'M8 2.4 C11.1 2.3 13.6 4.9 13.6 8 C13.6 11.1 11.1 13.6 8 13.6 C4.9 13.7 2.4 11.1 2.4 8 C2.3 4.9 4.9 2.4 8 2.4 M8.1 7.2 C8 8.5 8 9.8 7.9 11 M8 4.9 L8.05 5',
  alert:
    'M8.1 2.6 C9.9 5.7 11.8 8.9 13.6 12.4 C9.9 12.6 6.1 12.5 2.4 12.3 C4.2 9 6.1 5.8 8.1 2.6 M8 6.3 C8.1 7.5 8 8.6 8.1 9.6 M8.05 11 L8.1 11.1',
  sun: 'M8 5.1 C9.7 5 11 6.3 10.9 8 C10.9 9.7 9.6 11 8 10.9 C6.3 11 5 9.7 5.1 8 C5 6.3 6.4 5.1 8 5.1 M8 1.6 L8.1 3 M8 13 L7.9 14.4 M1.6 8.1 L3 8 M13 7.9 L14.4 8',
} as const

export type GlyphName = keyof typeof glyphs

export interface GlyphProps extends Omit<ComponentPropsWithoutRef<'svg'>, 'children'> {
  name: GlyphName
}

export function Glyph({ name, className, ...props }: GlyphProps) {
  useEffect(ensureDefs, [])
  return (
    <svg
      className={cn('tz-glyph', className)}
      viewBox="0 0 16 16"
      aria-hidden="true"
      filter="url(#tz-fiber-g)"
      {...props}
    >
      <path d={glyphs[name]} />
    </svg>
  )
}
