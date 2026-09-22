export const canPaint = () => typeof window !== 'undefined' && typeof document !== 'undefined'

let reduceMq: MediaQueryList | null = null
/** 動きを減らす設定。形（個体差・筆圧・地肌）は残し、動きだけを止める */
export const prefersReducedMotion = () => {
  if (!canPaint()) return true
  reduceMq ||= matchMedia('(prefers-reduced-motion: reduce)')
  return reduceMq.matches
}

let hoverMq: MediaQueryList | null = null
export const canHover = () => {
  if (!canPaint()) return false
  hoverMq ||= matchMedia('(hover:hover)')
  return hoverMq.matches
}
