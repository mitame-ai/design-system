import { clamp } from './random'
import type { Skin } from './types'

let mctx: CanvasRenderingContext2D | null = null
const ctx = () => {
  mctx ||= document.createElement('canvas').getContext('2d')
  return mctx
}

export function textWidth(ctl: HTMLElement, str: string) {
  if (!str) return 0
  const c = ctx()
  if (!c) return 0
  const cs = getComputedStyle(ctl)
  c.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  /* canvas は letter-spacing を見ない : 字間は自分で足す */
  const ls = Number.parseFloat(cs.letterSpacing) || 0
  return c.measureText(str).width + ls * [...str].length
}

/** 記入 : 書いた跡が罫に残り、穂先が文字に従う */
export function ink(st: Skin) {
  const well = st.el
  const ctl = st.ctl
  if (!ctl || !st.base.length) return
  const cs = getComputedStyle(ctl)
  const padL = Number.parseFloat(cs.paddingLeft) || 0
  const padR = Number.parseFloat(cs.paddingRight) || 0
  const inner = Math.max(0, ctl.clientWidth - padL - padR)
  const left = st.pad + ctl.offsetLeft + padL
  const v = ctl.value

  well.classList.toggle('has-ink', v.length > 0)
  if (ctl.tagName === 'INPUT') {
    well.style.setProperty('--tz-ink-from', left.toFixed(1))
    well.style.setProperty('--tz-ink-len', Math.min(textWidth(ctl, v), inner).toFixed(1))
    let caret = v.length
    try {
      if (ctl.selectionStart !== null) caret = ctl.selectionStart
    } catch {
      /* type によっては selectionStart を読めない */
    }
    const x = clamp(textWidth(ctl, v.slice(0, caret)) - ctl.scrollLeft, 0, inner)
    well.style.setProperty('--tz-nib-x', `${(ctl.offsetLeft + padL + x).toFixed(1)}px`)
    well.style.setProperty(
      '--tz-nib-b',
      `${(Number.parseFloat(cs.paddingBottom) - 1).toFixed(1)}px`,
    )
  }
}

/** 選 : 書いた文字ではなく、選ばれた言葉の幅がそのまま墨になる */
export function inkPick(st: Skin) {
  const well = st.el
  const val = well.querySelector('.tz-pick__val')
  const pick = well.querySelector('.tz-pick')
  if (!val || !pick || !st.base.length) return
  const r = val.getBoundingClientRect()
  const wr = well.getBoundingClientRect()
  const empty = pick.classList.contains('is-empty')
  well.style.setProperty('--tz-ink-from', (st.pad + (r.left - wr.left)).toFixed(1))
  well.style.setProperty('--tz-ink-len', (empty ? 0 : r.width).toFixed(1))
}

export const reInk = (st: Skin) => (st.pick ? inkPick(st) : ink(st))
