import { deform, weights } from './deform'
import { clamp, num } from './random'
import type { Point, Skin } from './types'

export interface Pointer {
  x: number
  y: number
}

/**
 * 気配 — 手が近づいた時点で、触れる前に素材が応える。
 * 強さは m = (1 − d / reach)² × (arrive ? min(1, d / arrive) : 1)。
 * 反応するのは触れられる物だけ (`st.live`)。
 */
export function sense(skins: Iterable<Skin>, pointer: Pointer | null) {
  for (const st of skins) {
    const el = st.el
    if (!st.live) continue
    const R = num(el, '--tz-reach')
    if (!R) continue
    const curl = num(el, '--tz-curl')
    const tilt = num(el, '--tz-tilt')
    const arrive = num(el, '--tz-arrive')
    let m = 0
    let ux = 0
    let uy = 0
    let px = 0
    let py = 0
    if (pointer) {
      const r = el.getBoundingClientRect()
      if (r.bottom > -R && r.top < innerHeight + R) {
        const dx = Math.max(r.left - pointer.x, 0, pointer.x - r.right)
        const dy = Math.max(r.top - pointer.y, 0, pointer.y - r.bottom)
        const d = Math.hypot(dx, dy)
        if (d < R) {
          /* 近づくほど強く。arrive を持つ部品は、手が着いたら平らに戻る */
          m = (1 - d / R) ** 2 * (arrive ? Math.min(1, d / arrive) : 1)
          const ox = pointer.x - (r.left + r.width / 2)
          const oy = pointer.y - (r.top + r.height / 2)
          const L = Math.hypot(ox, oy) || 1
          ux = ox / L
          uy = oy / L
          px = clamp(pointer.x - r.left, 0, r.width)
          py = clamp(pointer.y - r.top, 0, r.height)
        }
      }
    }
    if (m === 0 && st.near === 0) continue
    st.near = m
    /* 近い辺が手の側へ持ち上がる。押したときの傾きとは逆向き */
    el.style.setProperty('--tz-nx', `${(-ux * m * tilt).toFixed(2)}deg`)
    el.style.setProperty('--tz-ny', `${(uy * m * tilt).toFixed(2)}deg`)
    el.style.setProperty('--tz-nz', `${(-m * (curl ? 2.6 : 2)).toFixed(2)}px`)
    el.style.setProperty('--tz-lift', m.toFixed(3))

    /* 角が起きる : 手にいちばん近い角だけが、紙から離れる */
    if (curl && st.base.length) {
      if (m === 0) {
        st.liftD = 0
        deform(st)
        continue
      }
      const corners: Point[] = [
        [0, 0],
        [st.w, 0],
        [st.w, st.h],
        [0, st.h],
      ]
      const c = corners.reduce<{ p: Point | null; d2: number }>(
        (best, p) => {
          const d2 = (p[0] - px) ** 2 + (p[1] - py) ** 2
          return d2 < best.d2 ? { p, d2 } : best
        },
        { p: null, d2: Number.POSITIVE_INFINITY },
      ).p
      if (!c) continue
      const sigma = Math.max(70, Math.min(st.w, st.h) * 0.8)
      if (st.corner !== `${c[0]},${c[1]}`) {
        st.corner = `${c[0]},${c[1]}`
        st.liftW = weights(st, c[0] + st.pad, c[1] + st.pad, sigma)
      }
      st.liftD = m * curl
      deform(st)
    }
  }
}
