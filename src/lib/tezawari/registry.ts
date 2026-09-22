import { deform, press, release } from './deform'
import { ensureDefs } from './defs'
import { canHover, canPaint, prefersReducedMotion } from './env'
import { reInk } from './ink'
import { paint, paintRule } from './paint'
import { type Pointer, sense } from './sense'
import type { Skin, TezawariOptions } from './types'

/* =========================================================
   レジストリ — index.html では起動時に一度 querySelectorAll していた場所。
   React では個体が出入りするので、登録と解除で持ち替える。
   リスナと Observer は最初の登録で生まれ、最後の解除で片付く。
   ========================================================= */

const skins = new Map<HTMLElement, Skin>()
const rules = new Map<HTMLElement, number>()

let salt = 0
let uid = 0
/** 描き出しの順。誰も居なくなったら 0 に戻す */
let births = 0

/** 同じ指定の個体に席を配る。席が同じなら形も同じ : 個体は不変である */
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

/* ---------- 大域の観測者たち ---------- */

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
/** タブが隠れている間に止まった動きを、戻った時点で片付ける */
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
  /* 画面の外にある個体は息を止める : 見えないものを動かし続けない */
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

  /* 書体が届いてから測り直す : 幅が変われば輪郭も染みも変わる */
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

/* ---------- 生まれかた ---------- */

/** 部品は一本の線として引かれる。所要時間は個体ごとに散らし、46ms ずつずらす */
function scribe(st: Skin, order: number) {
  if (prefersReducedMotion() || !st.len) return
  const el = st.el
  const delay = Math.min(order, 11) * 46 + st.drawJit
  el.style.setProperty('--tz-draw-dur', `${st.drawDur.toFixed(0)}ms`)
  el.style.setProperty('--tz-draw-delay', `${delay.toFixed(0)}ms`)
  el.classList.remove('is-drawing')
  void el.offsetWidth /* アニメーションを確実に巻き戻す */
  el.classList.add('is-drawing')
  if (st.scribeTO) clearTimeout(st.scribeTO)
  st.scribeTO = setTimeout(() => el.classList.remove('is-drawing'), delay + st.drawDur * 2.4)
}

/* ---------- 触れられる物かどうか ---------- */

/** 押される物。欄を押しても沈まない : ポインタを捕まえたら文字も選べなくなる */
const looksPressable = (el: HTMLElement) =>
  !(el as HTMLButtonElement).disabled &&
  (el.matches('button, a[href]') || el.matches('[tabindex]:not([tabindex="-1"])'))

/** 気配だけ感じる物も含む */
const looksLive = (el: HTMLElement) =>
  looksPressable(el) ||
  el.classList.contains('tz-well') ||
  !!el.querySelector('input:not([disabled]), textarea:not([disabled]), select:not([disabled])')

/* ---------- 公開 ---------- */

export interface SkinHandle {
  readonly skin: Skin
  /** 塗り直す。force を付けると寸法が変わっていなくても漉き直す */
  repaint(force?: boolean): void
  /** 記入の染みと穂先を合わせ直す */
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
    ctl: el.querySelector('input, textarea'),
    pick: el.classList.contains('tz-well--pick'),
  }

  /* 札は内容が着地してから読めるようになる : 読む順に 85ms ずつ遅らせる。
     ボタンは中身を .tz-label 一枚に包んであるので、この添字は要らない */
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
        /* 捕まえられない環境もある */
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
      st.ctl = el.querySelector('input, textarea')
      if (paint(st, salt)) reInk(st)
    },
    ink() {
      st.ctl ||= el.querySelector('input, textarea')
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

/** 手で引いた罫を登録する */
export function registerRule(el: HTMLElement): () => void {
  wire()
  const i = rules.size
  rules.set(el, i)
  paintRule(el, i, salt)
  const observer = new ResizeObserver(() => paintRule(el, i, salt))
  observer.observe(el)
  return () => {
    observer.disconnect()
    rules.delete(el)
    if (!skins.size && !rules.size) unwire()
  }
}

/**
 * 窯出し — 大域の salt を進めて、全個体を焼き直す。
 * 一つずつの形は変わるが、次に焼き直すまでその形のままでいる。
 */
export function reseed() {
  salt++
  for (const st of skins.values()) {
    if (paint(st, salt)) scribe(st, st.birth)
  }
  for (const [el, i] of rules) paintRule(el, i, salt)
  for (const st of skins.values()) reInk(st)
}

/** 寸法や中身が変わったとき、全部まとめて漉き直す */
export function repaintAll() {
  for (const st of skins.values()) {
    st.w = 0
    paint(st, salt)
  }
  for (const [el, i] of rules) paintRule(el, i, salt)
  for (const st of skins.values()) reInk(st)
}

export const currentSalt = () => salt
