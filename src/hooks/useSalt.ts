import { useSyncExternalStore } from 'react'
import { currentSalt, onReseed } from '../lib/tezawari/registry'

/** グローバルシード（salt）の現在値。reseed() が呼ばれると再描画される */
export function useSalt() {
  return useSyncExternalStore(onReseed, currentSalt, () => 0)
}
