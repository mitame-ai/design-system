import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSalt } from '../hooks/useSalt'
import { toPath } from '../lib/tezawari/geometry'
import { fnv, mulberry32, wobbler } from '../lib/tezawari/random'
import type { Point } from '../lib/tezawari/types'
import { cn } from '../lib/utils'

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * 表 — 行と行のあいだに、手で罫を引く。
 * 罫は行ごとに別の部品として描くのではなく、表全体を一枚の紙とみなして一度に引く。
 * 行が増えても SVG は一つのまま。見出しの下の罫だけ、筆圧を強くする。
 */
export const Table = forwardRef<HTMLTableElement, ComponentPropsWithoutRef<'table'>>(function Table(
  { className, ...props },
  forwarded,
) {
  const table = useRef<HTMLTableElement>(null)
  const ref = useComposedRefs(table, forwarded)
  const sheet = useRef<SVGSVGElement>(null)
  const id = useId()
  const salt = useSalt()

  useIsomorphicLayoutEffect(() => {
    const el = table.current
    const svg = sheet.current
    if (!el || !svg) return
    const draw = () => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      svg.setAttribute('width', String(w))
      svg.setAttribute('height', String(h))
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.style.left = `${el.offsetLeft}px`
      svg.style.top = `${el.offsetTop}px`
      const rows = [...el.querySelectorAll<HTMLTableRowElement>(':scope > * > tr')]
      let out = ''
      rows.forEach((tr, i) => {
        const section = tr.parentElement?.tagName
        const foot = section === 'TFOOT' && tr === tr.parentElement?.firstElementChild
        const y = tr.offsetTop + tr.offsetHeight
        /* 合計行の上：直前の行の罫のすぐ下にもう一本引いて、二重の罫にする */
        if (foot) {
          const rand = mulberry32(fnv(`${id}|foot|${salt}`))
          const wob = wobbler(rand, 2)
          const n = Math.max(8, Math.round(w / 14))
          const pts: Point[] = []
          for (let k = 0; k <= n; k++)
            pts.push([1 + ((w - 2) * k) / n, tr.offsetTop + 3.2 + wob(k / n / 2) * 0.9])
          out += `<path class="is-foot" d="${toPath(pts, false)}"/>`
        }
        /* 表の最後の行の下には罫を引かない（紙の縁がそのまま区切りになる） */
        if (i === rows.length - 1) return
        const rand = mulberry32(fnv(`${id}|row${i}|${salt}`))
        const wob = wobbler(rand, 2)
        const n = Math.max(8, Math.round(w / 14))
        const pts: Point[] = []
        for (let k = 0; k <= n; k++) pts.push([1 + ((w - 2) * k) / n, y + wob(k / n / 2) * 0.9])
        const head = section === 'THEAD' && tr === tr.parentElement?.lastElementChild
        const cls = head ? 'is-head' : ''
        /* 見出しの罫：墨だまりの太い破線を重ねる */
        const dash = `${(40 + rand() * 90).toFixed(0)} ${(3 + rand() * 6).toFixed(1)} ${(30 + rand() * 60).toFixed(0)} ${(2 + rand() * 4).toFixed(1)}`
        out += `<path class="${cls}" d="${toPath(pts, false)}" stroke-dasharray="${dash}"/>`
      })
      svg.innerHTML = out
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(el)
    const mo = new MutationObserver(draw)
    mo.observe(el, { childList: true, subtree: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [id, salt])

  return (
    <div className="tz-table-wrap">
      <svg ref={sheet} className="tz-table__rules" aria-hidden="true" filter="url(#tz-fiber-g)" />
      <table ref={ref} className={cn('tz-table', className)} {...props} />
    </div>
  )
})

export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<'thead'>) {
  return <thead className={cn('tz-table__head', className)} {...props} />
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody className={cn('tz-table__body', className)} {...props} />
}

export function TableFooter({ className, ...props }: ComponentPropsWithoutRef<'tfoot'>) {
  return <tfoot className={cn('tz-table__foot', className)} {...props} />
}

export function TableRow({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={cn('tz-table__row', className)} {...props} />
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<'th'>) {
  return <th className={cn('tz-table__th', className)} {...props} />
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<'td'>) {
  return <td className={cn('tz-table__td', className)} {...props} />
}

export function TableCaption({ className, ...props }: ComponentPropsWithoutRef<'caption'>) {
  return <caption className={cn('tz-table__caption', className)} {...props} />
}
