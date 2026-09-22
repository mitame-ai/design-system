import { type CSSProperties, useId, useMemo } from 'react'
import { fnv, mulberry32 } from '../lib/tezawari/random'
import { useSalt } from './useSalt'

/**
 * 選択肢の個体差 — 一行ごとに、わずかな傾きと横のずれを与える。
 * セレクトの選択肢（tz-slip）と同じ振れ幅。並んだ行が定規で揃えたように見えないようにする。
 */
export function useSlip(seed?: string): CSSProperties {
  const id = useId()
  const salt = useSalt()
  return useMemo(() => {
    const rand = mulberry32(fnv(`slip|${seed ?? id}|${salt}`))
    return {
      '--tz-sr': `${((rand() - 0.5) * 0.55).toFixed(2)}deg`,
      '--tz-sx': `${((rand() - 0.5) * 1.8).toFixed(2)}px`,
    } as CSSProperties
  }, [seed, id, salt])
}
