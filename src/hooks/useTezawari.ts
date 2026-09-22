import { type RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { register, type SkinHandle } from '../lib/tezawari/registry'
import type { TezawariOptions } from '../lib/tezawari/types'

/** SSR では layout effect が走らないので、そこだけ effect に落とす */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * 要素を塗師に預ける。
 * 殻 (`.tz-shell`) は JSX 側で描いておく : 中身は engine が書き込む。
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
