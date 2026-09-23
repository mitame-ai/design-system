import { useEffect, useLayoutEffect } from 'react'

/** SSR 環境では useLayoutEffect が実行できない（警告が出る）ため、フォールバックとして useEffect を使用 */
export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
