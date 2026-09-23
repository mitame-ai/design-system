import {
  Children,
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useTezawari } from '../hooks/useTezawari'
import { Shell } from '../lib/slot'
import { circleMark } from '../lib/tezawari/geometry'
import { fnv, mulberry32 } from '../lib/tezawari/random'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

/* =========================================================
   SELECT — セレクトメニュー。
     重なり : 閉じた状態でも、下に選択肢が重なっている気配を感じさせる
     展開   : 展開時に選択肢が一枚ずつ順に現れる
     丸印   : 選択された項目には、手描き風の丸印が付与される
     写す   : 選択されたテキストの幅に応じて、罫線に墨が染み込む
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
  /** 選択肢の並び順（DOM ツリーの出現順） */
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
  if (!c) throw new Error('Select の関連コンポーネントは <Select> の内部で配置してください')
  return c
}

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** 輪郭のシード値を固定します */
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

  /* 宣言された選択肢の言葉を子要素から読み取る。
     項目の登録は効果でしか行われないため、SSR では選んだ値の言葉が分からない。宣言値をフォールバックに使う */
  const declared = useMemo(() => {
    const labels = new Map<string, string>()
    const walk = (kids: ReactNode) => {
      Children.forEach(kids, (c) => {
        if (!isValidElement(c)) return
        if (c.type === SelectItem) {
          const p = c.props as SelectItemProps
          if (typeof p.children === 'string') labels.set(p.value, p.children)
        } else {
          walk((c.props as { children?: ReactNode }).children)
        }
      })
    }
    walk(children)
    return labels
  }, [children])

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

  /* 展開時の初期選択またはフォーカス位置を決定 */
  useIsomorphicLayoutEffect(() => {
    if (!open) return
    setActive(pending.current)
  }, [open, setActive])

  /* メニュー外のクリックで閉じる */
  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => {
      if (!well.current?.contains(e.target as Node)) close(false)
    }
    document.addEventListener('pointerdown', outside, true)
    return () => document.removeEventListener('pointerdown', outside, true)
  }, [open, close])

  /* 個体差の付与：各選択肢の傾き・位置の微細なゆらぎと丸印のパスを生成 */
  useIsomorphicLayoutEffect(() => {
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

  /* 選択された値の文字幅に合わせて罫線のインク描画を更新 */
  // biome-ignore lint/correctness/useExhaustiveDependencies: 選択肢が描画された後に幅を再計測する
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
        /* 先頭文字によるキーボード検索 */
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
      label: list.find((r) => r.value === value)?.label ?? declared.get(value ?? ''),
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
    declared,
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

/* ---------- トリガー（引き手） ---------- */

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
        {/* アイコン（返し）：開閉状態に応じて向きが回転 */}
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
  /** 未選択時のプレースホルダーテキスト */
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

/* ---------- リストポップオーバー ---------- */

export interface SelectContentProps extends ComponentPropsWithoutRef<'div'> {
  /** リストボックスに紐付けるラベル要素の ID */
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

  /* 展開時に寸法を計測してシェルの描画を行う */
  useIsomorphicLayoutEffect(() => {
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

  useIsomorphicLayoutEffect(() => {
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
      {/* 選択マーク：選択された項目に手描き風の丸印を描画 */}
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

/* ---------- 選択肢の組 ---------- */

const GroupCtx = createContext<string | undefined>(undefined)

/** 選択肢をまとめる組。SelectLabel を置くと、その言葉が組の名前になる */
export function SelectGroup({ className, children, ...props }: ComponentPropsWithoutRef<'ul'>) {
  const id = useId()
  return (
    <li role="presentation" className="tz-slips__group">
      {/* biome-ignore lint/a11y/useSemanticElements: listbox の中の選択肢の組 */}
      <ul role="group" aria-labelledby={id} className={cn('tz-slips__list', className)} {...props}>
        <GroupCtx.Provider value={id}>{children}</GroupCtx.Provider>
      </ul>
    </li>
  )
}

export function SelectLabel({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  const id = useContext(GroupCtx)
  return <li role="presentation" id={id} className={cn('tz-slips__label', className)} {...props} />
}

export function SelectSeparator({ className }: { className?: string }) {
  return (
    <li role="presentation" aria-hidden="true" className={cn('tz-slips__sep', className)}>
      <Rule role="none" />
    </li>
  )
}
