export const canPaint = () => typeof window !== 'undefined' && typeof document !== 'undefined'

let reduceMq: MediaQueryList | null = null
/** 視覚的アニメーションを抑制する設定（prefers-reduced-motion）。静的な造形（個体差・筆圧・地肌）は維持し、動的なアニメーションのみを無効化する */
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
