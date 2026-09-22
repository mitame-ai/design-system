import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { register, type SkinHandle } from '../lib/tezawari/registry'
import type { TezawariOptions } from '../lib/tezawari/types'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export interface UseSkinOptions extends TezawariOptions {
  /** false のあいだは描画エンジンに登録しない（variant によって面を持たない部品向け） */
  enabled?: boolean
}

/**
 * コールバック ref 版の useTezawari。
 * ポップオーバーやメニューの中身のように、親より遅れて DOM に現れる要素を登録するときに使う。
 * 要素が付けば登録し、外れれば解除するので、開閉のたびに描き直される。
 * seed や enabled が変わったときも登録し直す。
 */
export function useSkin<T extends HTMLElement>(opts: UseSkinOptions = {}) {
  const handle = useRef<SkinHandle | null>(null)
  const [node, setNode] = useState<T | null>(null)
  const { seed, pressable, enabled = true } = opts
  const ref = useCallback((n: T | null) => setNode(n), [])

  useIsomorphicLayoutEffect(() => {
    if (!node || !enabled) return
    const h = register(node, { seed, pressable })
    handle.current = h
    return () => {
      h.dispose()
      handle.current = null
    }
  }, [node, seed, pressable, enabled])

  return [ref, handle] as const
}
