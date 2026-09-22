import { useEffect, useState } from 'react'

const BREAKPOINT = 768

/** 画面幅が狭い（768px 未満）かどうか。サイドバーを差し込み紙（Sheet）に切り替える判定に使う */
export function useIsMobile() {
  const [mobile, setMobile] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    const mq = matchMedia(`(max-width: ${BREAKPOINT - 1}px)`)
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return !!mobile
}
