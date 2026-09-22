import { clamp, type Rand, wobbler } from './random'
import type { Point } from './types'

/** 角丸矩形の外周を等間隔でサンプリングする */
export function basePoints(
  x0: number,
  y0: number,
  w: number,
  h: number,
  r: number,
  step: number,
): Point[] {
  r = Math.max(0.5, Math.min(r, w / 2, h / 2))
  const pts: Point[] = []
  const arc = (cx: number, cy: number, a0: number, a1: number) => {
    const n = Math.max(3, Math.round((((Math.abs(a1 - a0) * Math.PI) / 180) * r) / step))
    for (let i = 0; i < n; i++) {
      const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)])
    }
  }
  const seg = (ax: number, ay: number, bx: number, by: number) => {
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step))
    for (let i = 0; i < n; i++) pts.push([ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n])
  }
  const X = x0
  const Y = y0
  const W = x0 + w
  const H = y0 + h
  arc(X + r, Y + r, 180, 270)
  seg(X + r, Y, W - r, Y)
  arc(W - r, Y + r, 270, 360)
  seg(W, Y + r, W, H - r)
  arc(W - r, H - r, 0, 90)
  seg(W - r, H, X + r, H)
  arc(X + r, H - r, 90, 180)
  seg(X, H - r, X, Y + r)
  return pts
}

/** 各サンプリング点における外向き法線ベクトルを算出する（開いたパス端点は片側差分で処理） */
export function normals(pts: Point[], closed = true): Point[] {
  const n = pts.length
  const out: Point[] = []
  const at = (i: number) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)] as Point
  for (let i = 0; i < n; i++) {
    const a = at(i - 1)
    const b = at(i + 1)
    const tx = b[0] - a[0]
    const ty = b[1] - a[1]
    const L = Math.hypot(tx, ty) || 1
    out.push([ty / L, -tx / L])
  }
  return out
}

/** 各サンプリング点を法線方向にノイズで変位させ、個体差のある輪郭を生成する */
export const organic = (
  pts: Point[],
  nrm: Point[],
  wob: (t: number) => number,
  amp: number,
): Point[] =>
  pts.map((p, i) => {
    const d = wob(i / pts.length) * amp
    const n = nrm[i] as Point
    return [p[0] + n[0] * d, p[1] + n[1] * d]
  })

export function toPath(pts: Point[], closed = true): string {
  const n = pts.length
  const f = (v: number) => v.toFixed(2)
  const at = (i: number) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)] as Point
  const first = pts[0] as Point
  let d = `M${f(first[0])},${f(first[1])}`
  for (let i = 0, last = closed ? n : n - 1; i < last; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    d +=
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)},${f(p1[1] + (p2[1] - p0[1]) / 6)}` +
      ` ${f(p2[0] - (p3[0] - p1[0]) / 6)},${f(p2[1] - (p3[1] - p1[1]) / 6)}` +
      ` ${f(p2[0])},${f(p2[1])}`
  }
  return d + (closed ? 'Z' : '')
}

/** 手描き風の丸印パス：始点を行き過ぎて完全には閉じない形状を生成する */
export function circleMark(rand: Rand): string {
  const n = 30
  const pts: Point[] = []
  const wob = wobbler(rand, 1)
  const cx = 9.5
  const cy = 9.5
  const start = -2.1
  const sweep = Math.PI * 2 + 0.5
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const a = start + t * sweep
    pts.push([
      cx + Math.cos(a) * (7.4 + wob(t / 2) * 1.05),
      cy + Math.sin(a) * (6.6 + wob((t + 0.31) / 2) * 1.05),
    ])
  }
  return toPath(pts, false)
}
