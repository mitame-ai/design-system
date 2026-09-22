import { prefersReducedMotion } from './env'
import { toPath } from './geometry'
import { num } from './random'
import type { Point, Skin } from './types'

/** 減衰振動パラメータ（減衰率 TAU / 角周波数 OMEGA） */
const TAU = 0.145
const OMEGA = 2 * Math.PI * 2.6

/** 押し込み変形（内向き）と角の浮き上がり（外向き）を合成し、単一の輪郭パスを動的に書き換える */
export function deform(st: Skin) {
  if (!st.silhouette) return
  const pd = st.pressD || 0
  const ld = st.liftD || 0
  const key = `${Math.round(pd * 50)}:${Math.round(ld * 50)}`
  if (key === st.dkey) return
  st.dkey = key
  let d = st.d0
  if (pd || ld) {
    const b = st.base
    const n = st.norm
    const pw = st.pressW
    const lw = st.liftW
    const out: Point[] = new Array(b.length)
    for (let i = 0; i < b.length; i++) {
      const k = (pw ? (pw[i] as number) * pd : 0) - (lw ? (lw[i] as number) * ld : 0)
      const p = b[i] as Point
      const q = n[i] as Point
      out[i] = [p[0] - q[0] * k, p[1] - q[1] * k]
    }
    d = toPath(out)
  }
  st.silhouette.setAttribute('d', d)
}

/** ポインタ位置からの距離に応じたガウス減衰の重み付け配列を算出する */
export const weights = (st: Skin, px: number, py: number, sigma: number) => {
  const k = -1 / (2 * sigma * sigma)
  return st.base.map((p) => Math.exp(((p[0] - px) ** 2 + (p[1] - py) ** 2) * k))
}

/**
 * たわみの深さの時間変化を計算（アニメーションフレーム処理）。
 * 押下時は 160ms 以内に急速に沈み込み、解放時は減衰振動を描き約 800ms で静止する。
 */
export function tick(st: Skin) {
  st.raf = 0
  const t = (performance.now() - st.t0) / 1000
  if (st.phase === 'press') {
    if (t >= 0.16) {
      st.pressD = st.D
      deform(st)
      return
    }
    st.pressD = st.D * (1 - Math.exp(-t / 0.032))
  } else {
    if (t >= 0.8) {
      st.pressD = 0
      deform(st)
      return
    }
    st.pressD = st.d1 * Math.exp(-t / TAU) * Math.cos(OMEGA * t)
  }
  deform(st)
  st.raf = requestAnimationFrame(() => tick(st))
}

export function press(st: Skin, x: number, y: number) {
  const el = st.el
  if (st.grad) {
    st.grad.setAttribute('cx', String(x + st.pad))
    st.grad.setAttribute('cy', String(y + st.pad))
  }
  el.classList.add('is-press')
  if (prefersReducedMotion()) return

  const nx = (x / st.w - 0.5) * 2
  const ny = (y / st.h - 0.5) * 2
  const tilt = el.classList.contains('tz-card') ? 1.1 : 2.1
  el.style.transformOrigin = `${x}px ${y}px`
  el.style.setProperty('--tz-rx', `${(-ny * tilt).toFixed(2)}deg`)
  el.style.setProperty('--tz-ry', `${(nx * tilt).toFixed(2)}deg`)
  el.style.setProperty('--tz-sc', '.988')
  el.style.setProperty('--tz-ty', '0.5px')

  /* ポインタ位置からの距離に基づいて変形範囲を決定。
     ボタンは局所的に一点が沈み、カードは全体がしなるように変形する */
  const sigma = Math.max(num(el, '--tz-sigma-min'), Math.min(st.w, st.h) * num(el, '--tz-sigma'))
  st.pressW = weights(st, x + st.pad, y + st.pad, sigma)
  st.D = Math.min(num(el, '--tz-dent'), Math.min(st.w, st.h) * 0.1)
  st.phase = 'press'
  st.t0 = performance.now()
  cancelAnimationFrame(st.raf)
  tick(st)
}

export function release(st: Skin) {
  const el = st.el
  if (!el.classList.contains('is-press')) return
  el.classList.remove('is-press')
  for (const p of ['--tz-rx', '--tz-ry', '--tz-sc', '--tz-ty']) el.style.removeProperty(p)
  if (st.pressW) {
    st.d1 = st.pressD || st.D
    st.phase = 'release'
    st.t0 = performance.now()
    cancelAnimationFrame(st.raf)
    tick(st)
    /* requestAnimationFrame が停止した場合のセーフティタイマー（確実に水平復帰させる） */
    if (st.settleTO) clearTimeout(st.settleTO)
    st.settleTO = setTimeout(() => {
      cancelAnimationFrame(st.raf)
      st.raf = 0
      st.pressD = 0
      deform(st)
    }, 900)
  }
  /* 経年変化（使い込み）：操作回数に応じて輪郭とテクスチャがわずかに馴染む */
  st.wear = Math.min(st.wear + 1, 12)
  el.style.setProperty('--tz-wear', (st.wear / 12).toFixed(3))
}
