import { type MutableRefObject, type Ref, useCallback, useRef } from 'react'

type AnyRef<T> = Ref<T> | undefined

function assign<T>(ref: AnyRef<T>, value: T | null) {
  if (typeof ref === 'function') ref(value)
  else if (ref) (ref as MutableRefObject<T | null>).current = value
}

/** 内側で使う ref と、外から渡された ref の両方に同じ要素を入れる */
export function useComposedRefs<T>(...refs: AnyRef<T>[]) {
  const latest = useRef(refs)
  latest.current = refs
  return useCallback((node: T | null) => {
    for (const r of latest.current) assign(r, node)
  }, [])
}
