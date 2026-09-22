import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { register, type SkinHandle } from '../lib/tezawari/registry'
import type { TezawariOptions } from '../lib/tezawari/types'

/** SSR 環境では useLayoutEffect が実行できないため、フォールバックとして useEffect を使用 */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * 対象の DOM 要素を Tezawari の描画エンジンに登録するフック。
 * 外枠となるシェル（.tz-shell）を JSX 側で配置し、その内部の SVG はエンジンが直接生成します。
 */
export function useTezawari<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts: TezawariOptions = {},
) {
  const handle = useRef<SkinHandle | null>(null)
  const { seed, pressable } = opts

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const h = register(el, { seed, pressable })
    handle.current = h
    return () => {
      h.dispose()
      handle.current = null
    }
  }, [ref, seed, pressable])

  return handle
}
