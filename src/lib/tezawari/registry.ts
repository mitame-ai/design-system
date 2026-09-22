import { deform, press, release } from './deform'
import { ensureDefs } from './defs'
import { canHover, canPaint, prefersReducedMotion } from './env'
import { reInk } from './ink'
import { paint, paintRule } from './paint'
import { type Pointer, sense } from './sense'
import type { Skin, TezawariOptions } from './types'

/* =========================================================
   レジストリ — DOM 要素と描画インスタンスの管理。
   React のコンポーネントマウント・アンマウントに合わせて登録と解除を行う。
   イベントリスナーや各種 Observer は最初の要素登録時に初期化され、全解除時に破棄される。
   ========================================================= */

const skins = new Map<HTMLElement, Skin>()
const rules = new Map<HTMLElement, number>()

let salt = 0
let uid = 0
/** 登場アニメーションの実行順序カウンター。要素がすべて破棄されたら 0 にリセット */
let births = 0
/** 直近の登録時刻。間を置いて現れた要素（ポップオーバーの中身など）は新しい波として 0 番から数え直す */
let lastBirth = 0
const WAVE_GAP = 400

/** 形状の再生成を購読するリスナー。描画エンジンを通さない小さな印（チェックや丸印）が形を引き直すために使う */
const saltListeners = new Set<() => void>()

/** 同一プロパティの要素群に DOM インデックスを割り当てる（インデックスが一致すれば形状も一致する再現性を担保） */
const seats = new Map<string, Set<number>>()
function claimSeat(baseKey: string) {
  let used = seats.get(baseKey)
  if (!used) seats.set(baseKey, (used = new Set()))
  let i = 0
  while (used.has(i)) i++
  used.add(i)
  return i
}
function releaseSeat(baseKey: string, seat: number) {
  const used = seats.get(baseKey)
  if (!used) return
  used.delete(seat)
  if (!used.size) seats.delete(baseKey)
}

/* ---------- グローバル Observer / イベントリスナー ---------- */

let ro: ResizeObserver | null = null
let io: IntersectionObserver | null = null
let bodyRo: ResizeObserver | null = null
let pointer: Pointer | null = null
let nearRaf = 0
let wired = false

const schedule = () => {
  if (!nearRaf) nearRaf = requestAnimationFrame(sweep)
}
const sweep = () => {
  nearRaf = 0
  sense(skins.values(), pointer)
}

const onMove = (e: PointerEvent) => {
  if (e.pointerType === 'touch') return
  pointer = { x: e.clientX, y: e.clientY }
  schedule()
}
const onLeave = () => {
  pointer = null
  schedule()
}
/** タブ非アクティブ時に中断されたアニメーションを、可視復帰時に確実に完了・復帰させる */
const onVisible = () => {
  if (document.visibilityState !== 'visible') return
  for (const st of skins.values()) {
    if (st.pressD && !st.el.classList.contains('is-press')) {
      cancelAnimationFrame(st.raf)
      st.raf = 0
      st.pressD = 0
      deform(st)
    }
  }
}

function wire() {
  if (wired || !canPaint()) return
  wired = true
  ensureDefs()

  ro = new ResizeObserver((es) => {
    for (const e of es) {
      const st = skins.get(e.target as HTMLElement)
      if (st) paint(st, salt)
    }
  })
  /* 画面外の要素は呼吸アニメーションを一時停止（パフォーマンス最適化） */
  io = new IntersectionObserver(
    (es) => {
      for (const e of es) {
        const st = skins.get(e.target as HTMLElement)
        if (st) st.shell.style.animationPlayState = e.isIntersecting ? '' : 'paused'
      }
    },
    { rootMargin: '80px' },
  )
  bodyRo = new ResizeObserver(() => {
    for (const st of skins.values()) reInk(st)
  })
  bodyRo.observe(document.body)

  if (!prefersReducedMotion() && canHover()) {
    addEventListener('pointermove', onMove, { passive: true })
    addEventListener('pointerdown', schedule, { passive: true })
    addEventListener('scroll', schedule, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    addEventListener('blur', onLeave)
  }
  document.addEventListener('visibilitychange', onVisible)

  /* Web フォント読み込み完了後に再計測・再描画を実行（文字幅の変化を反映） */
  document.fonts?.ready.then(() => {
    for (const st of skins.values()) {
      st.w = 0
      paint(st, salt)
    }
    for (const [el, i] of rules) paintRule(el, i, salt)
    for (const st of skins.values()) reInk(st)
  })
}

function unwire() {
  if (!wired) return
  wired = false
  ro?.disconnect()
  io?.disconnect()
  bodyRo?.disconnect()
  ro = io = bodyRo = null
  cancelAnimationFrame(nearRaf)
  nearRaf = 0
  pointer = null
  births = 0
  removeEventListener('pointermove', onMove)
  removeEventListener('pointerdown', schedule)
  removeEventListener('scroll', schedule)
  document.removeEventListener('pointerleave', onLeave)
  removeEventListener('blur', onLeave)
  document.removeEventListener('visibilitychange', onVisible)
}

/* ---------- 登場アニメーション（描画の立ち上がり） ---------- */

/** 輪郭線が引かれる登場アニメーション。要素ごとに所要時間を分散し 46ms ずつずらして開始 */
function scribe(st: Skin, order: number) {
  if (prefersReducedMotion() || !st.len) return
  const el = st.el
  const delay = Math.min(order, 11) * 46 + st.drawJit
  el.style.setProperty('--tz-draw-dur', `${st.drawDur.toFixed(0)}ms`)
  el.style.setProperty('--tz-draw-delay', `${delay.toFixed(0)}ms`)
  el.classList.remove('is-drawing')
  void el.offsetWidth /* リフローを強制してアニメーションを確実に再トリガー */
  el.classList.add('is-drawing')
  if (st.scribeTO) clearTimeout(st.scribeTO)
  st.scribeTO = setTimeout(() => el.classList.remove('is-drawing'), delay + st.drawDur * 2.4)
}

/* ---------- インタラクション対象の判定 ---------- */

/** 押下変形を適用する要素（ボタン等）。入力欄は文字選択を阻害しないよう押下対象から除外 */
const looksPressable = (el: HTMLElement) =>
  !(el as HTMLButtonElement).disabled &&
  (el.matches('button, a[href]') || el.matches('[tabindex]:not([tabindex="-1"])'))

/** カーソル接近（気配）を検知する対象要素 */
const looksLive = (el: HTMLElement) =>
  looksPressable(el) ||
  el.classList.contains('tz-well') ||
  !!el.querySelector('input:not([disabled]), textarea:not([disabled]), select:not([disabled])')

/* ---------- 公開 API ---------- */

export interface SkinHandle {
  readonly skin: Skin
  /** 再描画を行う。force を指定した場合は寸法変化がなくても強制再描画 */
  repaint(force?: boolean): void
  /** 入力テキストのインク描画とキャレット位置を再計算 */
  ink(): void
  dispose(): void
}

export function register(el: HTMLElement, opts: TezawariOptions = {}): SkinHandle {
  wire()

  let shell = el.querySelector<HTMLElement>(':scope > .tz-shell')
  let ownsShell = false
  if (!shell) {
    shell = document.createElement('span')
    shell.className = 'tz-shell'
    shell.setAttribute('aria-hidden', 'true')
    el.prepend(shell)
    ownsShell = true
  }

  const baseKey = opts.seed ?? `${el.className}${(el.textContent ?? '').trim().slice(0, 24)}`
  const seat = claimSeat(baseKey)

  const now = performance.now()
  if (now - lastBirth > WAVE_GAP) births = 0
  lastBirth = now

  const st: Skin = {
    el,
    shell,
    id: ++uid,
    baseKey,
    slot: seat,
    key: `${baseKey}#${seat}`,
    birth: births++,
    w: 0,
    h: 0,
    pad: 10,
    salt: -1,
    wear: 0,
    near: 0,
    live: looksLive(el),
    pressable: opts.pressable ?? looksPressable(el),
    base: [],
    norm: [],
    closed: true,
    d0: '',
    dkey: '',
    len: 0,
    silhouette: null,
    grad: null,
    pressD: 0,
    liftD: 0,
    pressW: null,
    liftW: null,
    corner: '',
    D: 0,
    d1: 0,
    phase: 'release',
    t0: 0,
    raf: 0,
    drawDur: 640,
    drawJit: 0,
    settleTO: null,
    scribeTO: null,
    ctl: el.querySelector('input, textarea, select'),
    pick: el.classList.contains('tz-well--pick'),
  }

  /* カードは背景の紙が着地してからコンテンツを可視化（読み順に 85ms ずつ遅延）。
     ボタンはラベル全体が単一要素で包まれているため個別遅延は不要 */
  if (!el.classList.contains('tz')) {
    let ci = 0
    for (const c of el.children) {
      if (c === shell) continue
      ;(c as HTMLElement).style.setProperty('--tz-ci', String(ci++))
    }
  }

  skins.set(el, st)
  paint(st, salt)
  scribe(st, st.birth)
  ro?.observe(el)
  io?.observe(el)

  const off: (() => void)[] = []
  if (st.pressable) {
    const down = (e: PointerEvent) => {
      if ((el as HTMLButtonElement).disabled) return
      const r = el.getBoundingClientRect()
      press(st, e.clientX - r.left, e.clientY - r.top)
      try {
        el.setPointerCapture(e.pointerId)
      } catch {
        /* ポインタキャプチャに非対応の環境向けフォールバック */
      }
    }
    const up = () => release(st)
    const key = (e: KeyboardEvent) => {
      const keys = el.tagName === 'BUTTON' ? [' ', 'Enter'] : ['Enter']
      if (e.repeat || !keys.includes(e.key)) return
      press(st, el.offsetWidth / 2, el.offsetHeight * 0.72)
    }
    el.addEventListener('pointerdown', down)
    off.push(() => el.removeEventListener('pointerdown', down))
    for (const t of ['pointerup', 'pointercancel', 'pointerleave', 'blur'] as const) {
      el.addEventListener(t, up)
      off.push(() => el.removeEventListener(t, up))
    }
    el.addEventListener('keydown', key)
    el.addEventListener('keyup', up)
    off.push(() => el.removeEventListener('keydown', key))
    off.push(() => el.removeEventListener('keyup', up))
  }

  return {
    skin: st,
    repaint(force = false) {
      if (force) st.w = 0
      st.ctl = el.querySelector('input, textarea, select')
      if (paint(st, salt)) reInk(st)
    },
    ink() {
      st.ctl ||= el.querySelector('input, textarea, select')
      reInk(st)
    },
    dispose() {
      cancelAnimationFrame(st.raf)
      if (st.settleTO) clearTimeout(st.settleTO)
      if (st.scribeTO) clearTimeout(st.scribeTO)
      for (const f of off) f()
      ro?.unobserve(el)
      io?.unobserve(el)
      skins.delete(el)
      releaseSeat(baseKey, seat)
      if (ownsShell) shell.remove()
      if (!skins.size && !rules.size) unwire()
    },
  }
}

/** 手描き風の水平罫線（Rule）を登録する */
export function registerRule(el: HTMLElement): () => void {
  wire()
  /* 空いている最小の番号を使う : 開閉のたびに現れる罫（メニューの区切りなど）が同じ形に揃わないように */
  const i = claimSeat('\u0000rule')
  rules.set(el, i)
  paintRule(el, i, salt)
  const observer = new ResizeObserver(() => paintRule(el, i, salt))
  observer.observe(el)
  return () => {
    observer.disconnect()
    rules.delete(el)
    releaseSeat('\u0000rule', i)
    if (!skins.size && !rules.size) unwire()
  }
}

/**
 * 形状の再生成（Reseed） — グローバルシードを進めて全コンポーネントの形状を再描画する。
 * 各個体の形状は一新されるが、次回 reseed が呼ばれるまではその形状を安定して維持する。
 */
export function reseed() {
  salt++
  for (const st of skins.values()) {
    if (paint(st, salt)) scribe(st, st.birth)
  }
  for (const [el, i] of rules) paintRule(el, i, salt)
  for (const st of skins.values()) reInk(st)
  for (const f of saltListeners) f()
}

/** 形状の再生成を購読する。戻り値は購読の解除関数 */
export function onReseed(listener: () => void) {
  saltListeners.add(listener)
  return () => {
    saltListeners.delete(listener)
  }
}

/** レイアウト変更時などに、すべての登録要素を一括で再計測・再描画する */
export function repaintAll() {
  for (const st of skins.values()) {
    st.w = 0
    paint(st, salt)
  }
  for (const [el, i] of rules) paintRule(el, i, salt)
  for (const st of skins.values()) reInk(st)
}

export const currentSalt = () => salt
