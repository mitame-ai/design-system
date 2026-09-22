/* 同一個体の形状再現性：シード値に基づく決定論的疑似乱数生成 */

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

export const cssv = (el: Element, p: string) => getComputedStyle(el).getPropertyValue(p).trim()

export const num = (el: Element, p: string) => Number.parseFloat(cssv(el, p))

export const fnv = (s: string) => {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export type Rand = () => number

export const mulberry32 =
  (a: number): Rand =>
  () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

/**
 * 周期的な1次元ノイズ。周波数は整数倍に保ち、閉じた輪郭が継ぎ目なくループするように設計。
 * grit パラメータを大きくすると高周波成分が増加し、紙の耳（毛羽立ち）のような微細な凹凸が生まれる。
 */
export const wobbler = (rand: Rand, grit = 1) => {
  const g = Math.max(1, Math.round(grit))
  const hs = (
    [
      [1, 1],
      [2, 0.58],
      [3, 0.34],
      [5, 0.2],
      [7, 0.12],
    ] as const
  ).map(([f, a]) => ({ f: f * g, a, p: rand() * Math.PI * 2 }))
  const norm = hs.reduce((s, h) => s + h.a, 0)
  return (t: number) =>
    hs.reduce((s, h) => s + h.a * Math.sin(h.f * 2 * Math.PI * t + h.p), 0) / norm
}
