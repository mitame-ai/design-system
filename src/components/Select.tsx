import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { circleMark } from '../lib/tezawari/geometry'
import { fnv, mulberry32 } from '../lib/tezawari/random'
import { cn } from '../lib/utils'

/* =========================================================
   SELECT — 書く場所ではなく、選ぶ場所。
     重なり : 閉じていても、下に札が重なっているのが見えている
     繰る   : 開くと札が一枚ずつ繰り出される。揃って並ばない
     丸印   : 選ばれた札には、その場で丸が描かれる
     写す   : 選んだ言葉は、欄の罫に墨として移る
   ========================================================= */

interface ItemRec {
  id: string
  value: string
  label: string
  disabled: boolean
  el: HTMLLIElement
}

interface SelectCtx {
  listId: string
  valueId: string
  open: boolean
  value: string | undefined
  label: string | undefined
  activeId: string | null
  /** 札の並びは DOM の順で決まる */
  items: React.MutableRefObject<ItemRec[]>
  registerItem: (rec: ItemRec) => () => void
  indexOf: (id: string) => number
  setActive: (i: number) => void
  choose: (i: number) => void
  toggle: () => void
  close: (back: boolean) => void
  openList: (goTo?: number) => void
  onTriggerKeyDown: (e: React.KeyboardEvent) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const Ctx = createContext<SelectCtx | null>(null)
const useSelect = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Select の部品は <Select> の中でしか使えません')
  return c
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** 輪郭の種を固定する */
  seed?: string
  children?: ReactNode
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(
  { className, value: controlled, defaultValue, onValueChange, seed, children, ...props },
  forwarded,
) {
  const well = useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(well, forwarded)
  const handle = useTezawari(well, { seed })

  const reactId = useId()
  const key = seed ?? reactId
  const listId = `${reactId}-slips`
  const valueId = `${reactId}-val`

  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue)
  const value = controlled !== undefined ? controlled : uncontrolled

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [version, bump] = useReducer((v: number) => v + 1, 0)

  const items = useRef<ItemRec[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const pending = useRef(-1)

  const registerItem = useCallback((rec: ItemRec) => {
    items.current.push(rec)
    items.current.sort((a, b) =>
      a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
    )
    bump()
    return () => {
      items.current = items.current.filter((r) => r !== rec)
      bump()
    }
  }, [])

  const usable = useCallback((i: number) => {
    const r = items.current[i]
    return !!r && !r.disabled
  }, [])

  const edge = useCallback(
    (dir: number) => {
      const list = items.current
      for (let i = dir > 0 ? 0 : list.length - 1; i >= 0 && i < list.length; i += dir)
        if (usable(i)) return i
      return -1
    },
    [usable],
  )

  const step = useCallback(
    (from: number, dir: number) => {
      const list = items.current
      for (let i = from + dir; i >= 0 && i < list.length; i += dir) if (usable(i)) return i
      return from
    },
    [usable],
  )

  const setActive = useCallback(
    (i: number) => {
      if (!usable(i)) return
      setActiveIndex(i)
      items.current[i]?.el.scrollIntoView({ block: 'nearest' })
    },
    [usable],
  )

  const choose = useCallback(
    (i: number) => {
      if (!usable(i)) return
      const v = items.current[i]?.value
      if (v === undefined) return
      if (controlled === undefined) setUncontrolled(v)
      onValueChange?.(v)
    },
    [controlled, onValueChange, usable],
  )

  const selectedIndex = useMemo(() => {
    void version
    return items.current.findIndex((r) => r.value === value)
  }, [value, version])

  const openList = useCallback(
    (goTo?: number) => {
      if (open) return
      const at = goTo ?? (selectedIndex >= 0 ? selectedIndex : edge(1))
      pending.current = at
      setOpen(true)
    },
    [open, selectedIndex, edge],
  )

  const close = useCallback((back: boolean) => {
    setOpen(false)
    setActiveIndex(-1)
    if (back) requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  const toggle = useCallback(() => {
    if (open) close(false)
    else openList()
  }, [open, close, openList])

  /* 開いた瞬間に、繰り出す札を決める */
  useLayoutEffect(() => {
    if (!open) return
    setActive(pending.current)
  }, [open, setActive])

  /* 外を押したら閉じる */
  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => {
      if (!well.current?.contains(e.target as Node)) close(false)
    }
    document.addEventListener('pointerdown', outside, true)
    return () => document.removeEventListener('pointerdown', outside, true)
  }, [open, close])

  /* 個体差 : 札は揃って並ばない。丸印も一つずつ違う形で描かれる */
  useLayoutEffect(() => {
    void version
    const rand = mulberry32(fnv(`pick|${key}`))
    const mark = circleMark(rand)
    items.current.forEach((rec, i) => {
      const el = rec.el
      el.style.setProperty('--tz-si', String(i))
      el.style.setProperty('--tz-sr', `${((rand() - 0.5) * 0.55).toFixed(2)}deg`)
      el.style.setProperty('--tz-sx', `${((rand() - 0.5) * 1.8).toFixed(2)}px`)
      const path = el.querySelector<SVGPathElement>('.tz-slip__mark path')
      if (path) {
        path.setAttribute('d', mark)
        el.style.setProperty('--mlen', String(Math.ceil(path.getTotalLength())))
      }
    })
  }, [version, key])

  /* 選んだ言葉は、そのまま罫の墨になる */
  // biome-ignore lint/correctness/useExhaustiveDependencies: 札が揃ってから幅を測る
  useEffect(() => {
    const id = requestAnimationFrame(() => handle.current?.ink())
    return () => cancelAnimationFrame(id)
  }, [value, version, handle])

  const onTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const k = e.key
      if (!open) {
        if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') {
          e.preventDefault()
          openList(k === 'ArrowUp' ? edge(-1) : undefined)
        }
        return
      }
      if (k === 'ArrowDown') {
        e.preventDefault()
        setActive(step(activeIndex, 1))
      } else if (k === 'ArrowUp') {
        e.preventDefault()
        setActive(step(activeIndex, -1))
      } else if (k === 'Home') {
        e.preventDefault()
        setActive(edge(1))
      } else if (k === 'End') {
        e.preventDefault()
        setActive(edge(-1))
      } else if (k === 'Enter' || k === ' ') {
        e.preventDefault()
        choose(activeIndex)
        close(true)
      } else if (k === 'Escape') {
        e.preventDefault()
        close(true)
      } else if (k === 'Tab') {
        close(false)
      } else if (k.length === 1) {
        /* 頭の一字で探す */
        const at = items.current.findIndex(
          (r, i) => usable(i) && i !== activeIndex && r.label.trim().startsWith(k),
        )
        if (at >= 0) setActive(at)
      }
    },
    [open, activeIndex, openList, edge, step, setActive, choose, close, usable],
  )

  const ctx = useMemo<SelectCtx>(() => {
    void version
    const list = items.current
    return {
      listId,
      valueId,
      open,
      value,
      label: list.find((r) => r.value === value)?.label,
      activeId: list[activeIndex]?.id ?? null,
      items,
      registerItem,
      indexOf: (id) => list.findIndex((r) => r.id === id),
      setActive,
      choose,
      toggle,
      close,
      openList,
      onTriggerKeyDown,
      triggerRef,
    }
  }, [
    listId,
    valueId,
    open,
    value,
    activeIndex,
    version,
    registerItem,
    setActive,
    choose,
    toggle,
    close,
    openList,
    onTriggerKeyDown,
  ])

  return (
    <Ctx.Provider value={ctx}>
      <div
        ref={ref}
        className={cn('tz-well tz-well--pick', open && 'is-open', className)}
        {...props}
      >
        <Shell />
        {children}
      </div>
    </Ctx.Provider>
  )
})

/* ---------- 引き手 ---------- */

export interface SelectTriggerProps extends ComponentPropsWithoutRef<'button'> {}

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ className, children, onClick, onKeyDown, ...props }, forwarded) {
    const s = useSelect()
    const ref = useComposedRefs(s.triggerRef, forwarded)
    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={s.open}
        aria-controls={s.listId}
        aria-activedescendant={s.open ? (s.activeId ?? undefined) : undefined}
        className={cn('tz-pick', s.value === undefined && 'is-empty', className)}
        onClick={(e) => {
          onClick?.(e)
          if (!e.defaultPrevented) s.toggle()
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e)
          if (!e.defaultPrevented) s.onTriggerKeyDown(e)
        }}
        {...props}
      >
        {children}
        {/* 返し : 筆が下で止まって返る。開けば向きが変わる */}
        <svg
          className="tz-pick__turn"
          viewBox="0 0 13 13"
          aria-hidden="true"
          filter="url(#tz-fiber-g)"
        >
          <path d="M1.5 4 C3.3 7.3 4.9 9.3 6.4 9.8 C8 9.3 9.7 7.2 11.5 4.1" strokeWidth="1.5" />
        </svg>
      </button>
    )
  },
)

export interface SelectValueProps extends ComponentPropsWithoutRef<'span'> {
  /** まだ選んでいないときの言葉。墨は乗らない */
  placeholder?: string
}

export function SelectValue({ className, placeholder, ...props }: SelectValueProps) {
  const s = useSelect()
  return (
    <span id={s.valueId} className={cn('tz-pick__val', className)} {...props}>
      {s.label ?? placeholder}
    </span>
  )
}

/* ---------- 札束 ---------- */

export interface SelectContentProps extends ComponentPropsWithoutRef<'div'> {
  /** 一覧に見出しを結びつける */
  'aria-labelledby'?: string
}

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  { className, children, ...props },
  forwarded,
) {
  const s = useSelect()
  const panel = useRef<HTMLDivElement>(null)
  const ref = useComposedRefs(panel, forwarded)
  const handle = useTezawari(panel)
  const labelledBy = props['aria-labelledby']

  /* 浮いている紙は、出した瞬間に漉く : 隠れている間は測れない */
  useLayoutEffect(() => {
    if (!s.open) return
    handle.current?.repaint(true)
    const place = () => {
      const el = panel.current
      const well = el?.parentElement
      if (!el || !well) return
      el.classList.remove('is-up')
      const r = well.getBoundingClientRect()
      if (r.bottom + el.offsetHeight + 24 > innerHeight && r.top > el.offsetHeight + 24)
        el.classList.add('is-up')
    }
    place()
    addEventListener('resize', place, { passive: true })
    return () => removeEventListener('resize', place)
  }, [s.open, handle])

  return (
    <div ref={ref} className={cn('tz-card tz-slips', className)} hidden={!s.open} {...props}>
      <Shell />
      <ul className="tz-slips__list" role="listbox" id={s.listId} aria-labelledby={labelledBy}>
        {children}
      </ul>
    </div>
  )
})

export interface SelectItemProps extends Omit<ComponentPropsWithoutRef<'li'>, 'onSelect'> {
  value: string
  disabled?: boolean
}

export function SelectItem({
  className,
  value,
  disabled = false,
  children,
  onClick,
  onPointerEnter,
  ...props
}: SelectItemProps) {
  const s = useSelect()
  const el = useRef<HTMLLIElement>(null)
  const id = useId()
  const label = typeof children === 'string' ? children : ''

  useLayoutEffect(() => {
    const node = el.current
    if (!node) return
    const text = label || (node.querySelector('.tz-slip__label')?.textContent ?? '')
    return s.registerItem({ id, value, label: text, disabled, el: node })
  }, [s.registerItem, id, value, label, disabled])

  const selected = s.value === value
  const active = s.activeId === id

  return (
    <li
      ref={el}
      id={id}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={cn('tz-slip', active && 'is-active', className)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e)
        if (s.open) s.setActive(s.indexOf(id))
      }}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        s.choose(s.indexOf(id))
        s.close(true)
      }}
      {...props}
    >
      {/* 丸印 : 選ばれた札は、その場で丸をつけられる。d は Select が配る */}
      <svg
        className="tz-slip__mark"
        viewBox="0 0 19 19"
        aria-hidden="true"
        filter="url(#tz-fiber-g)"
      >
        <path d="" />
      </svg>
      <span className="tz-slip__label">{children}</span>
    </li>
  )
}
