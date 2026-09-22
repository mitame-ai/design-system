import { Command as CommandPrimitive, useCommandState } from 'cmdk'
import { Popover as PopoverPrimitive } from 'radix-ui'
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
import { useSkin } from '../hooks/useSkin'
import { useSlip } from '../hooks/useSlip'
import { Glyph, Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

/* =========================================================
   COMBOBOX — 書いて選ぶ。
     罫   : 書く場所は Input と同じ罫。書いた分だけ墨が染みる
     絞る : 書いた言葉に合う候補だけが、紙の上に残る
     丸印 : 選ばれた候補には、Select と同じく手で丸を付ける
   ========================================================= */

interface ComboCtx {
  open: boolean
  setOpen: (v: boolean) => void
  value: string | undefined
  label: string | undefined
  search: string
  setSearch: (s: string) => void
  dirty: boolean
  choose: (value: string, label: string) => void
  labels: Map<string, string>
  inputRef: React.RefObject<HTMLInputElement | null>
  listId: string
}

const Ctx = createContext<ComboCtx | null>(null)
const useCombo = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Combobox の関連コンポーネントは <Combobox> の内部で配置してください')
  return c
}

export interface ComboboxProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** 候補の絞り込み方を差し替える（cmdk の filter） */
  filter?: ComponentPropsWithoutRef<typeof CommandPrimitive>['filter']
  className?: string
  children?: ReactNode
}

export function Combobox({
  value: controlled,
  defaultValue,
  onValueChange,
  open: openProp,
  onOpenChange,
  filter,
  className,
  children,
}: ComboboxProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const value = controlled !== undefined ? controlled : uncontrolled
  const [openState, setOpenState] = useState(false)
  const open = openProp ?? openState
  const [search, setSearchState] = useState('')
  const [dirty, setDirty] = useState(false)
  const labels = useRef(new Map<string, string>()).current
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  /* 候補の言葉は、候補が描かれたときに集まる。最初の描画のあとで一度だけ読み直す */
  const [, reread] = useReducer((n: number) => n + 1, 0)
  useLayoutEffect(reread, [])
  const label = value !== undefined ? (labels.get(value) ?? value) : undefined

  const setOpen = useCallback(
    (v: boolean) => {
      if (openProp === undefined) setOpenState(v)
      onOpenChange?.(v)
      /* 閉じたら、書きかけの言葉は選んだ言葉に戻す */
      if (!v) {
        setDirty(false)
        setSearchState(label ?? '')
      }
    },
    [openProp, onOpenChange, label],
  )

  const setSearch = useCallback(
    (s: string) => {
      setSearchState(s)
      setDirty(true)
      if (!open) setOpen(true)
    },
    [open, setOpen],
  )

  const choose = useCallback(
    (v: string, l: string) => {
      if (controlled === undefined) setUncontrolled(v)
      onValueChange?.(v)
      setSearchState(l)
      setDirty(false)
      if (openProp === undefined) setOpenState(false)
      onOpenChange?.(false)
    },
    [controlled, onValueChange, openProp, onOpenChange],
  )

  /* 外から値が変わったら、罫の上の言葉も書き換える */
  useEffect(() => {
    if (!open) setSearchState(label ?? '')
  }, [label, open])

  const ctx = useMemo<ComboCtx>(
    () => ({
      open,
      setOpen,
      value,
      label,
      search,
      setSearch,
      dirty,
      choose,
      labels,
      inputRef,
      listId,
    }),
    [open, setOpen, value, label, search, setSearch, dirty, choose, labels, listId],
  )

  return (
    <Ctx.Provider value={ctx}>
      <CommandPrimitive
        shouldFilter={dirty}
        filter={filter}
        loop
        className={cn('tz-combobox', className)}
        label="候補"
      >
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          {children}
        </PopoverPrimitive.Root>
      </CommandPrimitive>
    </Ctx.Provider>
  )
}

export interface ComboboxInputProps
  extends Omit<ComponentPropsWithoutRef<typeof CommandPrimitive.Input>, 'value' | 'onValueChange'> {
  wrapperClassName?: string
  seed?: string
}

/** 書いて選ぶための罫。Input と同じく、書いた分だけ墨が染み、穂先が追いかける */
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  function ComboboxInput(
    {
      className,
      wrapperClassName,
      seed,
      disabled,
      id,
      'aria-labelledby': labelledBy,
      onFocus,
      onKeyDown,
      onClick,
      ...props
    },
    forwarded,
  ) {
    const c = useCombo()
    const [skin, handle] = useSkin<HTMLSpanElement>({ seed, pressable: false })
    const ref = useComposedRefs(c.inputRef, forwarded)
    const refresh = useCallback(() => handle.current?.ink(), [handle])

    /* cmdk は入力欄の id と aria-labelledby を自前の値で上書きする。
       <label htmlFor> や外のラベルと結べるよう、描いた後で利用側の値に差し戻す（cmdk はこの値を以後変えない） */
    useLayoutEffect(() => {
      const el = c.inputRef.current
      if (!el) return
      if (id) el.id = id
      if (labelledBy) el.setAttribute('aria-labelledby', labelledBy)
      else if (id) el.removeAttribute('aria-labelledby')
    }, [c.inputRef, id, labelledBy])
    // biome-ignore lint/correctness/useExhaustiveDependencies: 書かれた言葉が変わるたびに墨を測り直す
    useLayoutEffect(() => {
      refresh()
    }, [c.search, refresh])

    return (
      <PopoverPrimitive.Anchor asChild>
        <span
          ref={skin}
          className={cn(
            'tz-well tz-well--combo',
            disabled && 'is-off',
            c.open && 'is-open',
            wrapperClassName,
          )}
        >
          <Shell />
          <CommandPrimitive.Input
            ref={ref}
            value={c.search}
            onValueChange={c.setSearch}
            disabled={disabled}
            role="combobox"
            aria-expanded={c.open}
            aria-controls={c.listId}
            aria-autocomplete="list"
            className={cn('tz-input', className)}
            onFocus={(e) => {
              onFocus?.(e)
              /* 選んである言葉は、書き直しやすいように丸ごと選んでおく */
              if (!c.dirty) e.currentTarget.select()
              refresh()
            }}
            onClick={(e) => {
              onClick?.(e)
              if (!e.defaultPrevented) c.setOpen(true)
            }}
            onKeyDown={(e) => {
              onKeyDown?.(e)
              if (e.defaultPrevented) return
              if (!c.open && e.key === 'Enter') e.preventDefault()
              if (e.key === 'ArrowDown' && !c.open) c.setOpen(true)
              if (e.key === 'Escape' && c.open) {
                e.preventDefault()
                c.setOpen(false)
              }
            }}
            onSelect={refresh}
            {...props}
          />
          <span className="tz-nib" aria-hidden="true" />
          <Glyph name="turn" className="tz-combobox__turn" />
        </span>
      </PopoverPrimitive.Anchor>
    )
  },
)

export interface ComboboxContentProps
  extends Omit<ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, 'children'> {
  children?: ReactNode
  seed?: string
}

/** 候補を書いた紙。罫の真下に、罫と同じ幅で置かれる */
export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  function ComboboxContent(
    {
      className,
      align = 'start',
      sideOffset = 10,
      seed,
      children,
      onOpenAutoFocus,
      onInteractOutside,
      ...props
    },
    forwarded,
  ) {
    const c = useCombo()
    const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
    const ref = useComposedRefs(skin, forwarded)
    return (
      <PopoverPrimitive.Portal forceMount>
        {/* 閉じていても候補は描いておく : 選んだ値の言葉を、開く前から罫に写すため */}
        <PopoverPrimitive.Content
          ref={ref}
          forceMount
          hidden={!c.open}
          align={align}
          sideOffset={sideOffset}
          className={cn('tz-leaf tz-menu tz-combobox__content', className)}
          onOpenAutoFocus={(e) => {
            onOpenAutoFocus?.(e)
            /* 書く手を止めない : 紙が開いても、筆は罫の上に残す */
            e.preventDefault()
          }}
          onInteractOutside={(e) => {
            onInteractOutside?.(e)
            if (c.inputRef.current?.closest('.tz-well')?.contains(e.target as Node))
              e.preventDefault()
          }}
          {...props}
        >
          <Shell />
          <CommandPrimitive.List id={c.listId} className="tz-menu__scroll tz-command__list">
            {children}
          </CommandPrimitive.List>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    )
  },
)

export interface ComboboxItemProps
  extends Omit<ComponentPropsWithoutRef<typeof CommandPrimitive.Item>, 'value' | 'onSelect'> {
  value: string
  /** 罫に写す言葉。省略時は children の文字列、それも無ければ value */
  label?: string
}

export const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(function ComboboxItem(
  { className, value, label, children, style, keywords, ...props },
  ref,
) {
  const c = useCombo()
  const slip = useSlip()
  const text = label ?? (typeof children === 'string' ? children : value)
  c.labels.set(value, text)
  const selected = c.value === value
  return (
    <CommandPrimitive.Item
      ref={ref}
      value={value}
      keywords={[text, ...(keywords ?? [])]}
      onSelect={() => c.choose(value, text)}
      data-checked={selected || undefined}
      className={cn('tz-mi tz-mi--inset', className)}
      style={{ ...slip, ...style }}
      {...props}
    >
      <span className="tz-mi__ind">
        {selected && <Mark kind="circle" className="is-writing" />}
      </span>
      {children}
    </CommandPrimitive.Item>
  )
})

export const ComboboxGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function ComboboxGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group ref={ref} className={cn('tz-command__group', className)} {...props} />
  )
})

export function ComboboxEmpty({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const count = useCommandState((s) => s.filtered.count)
  if (count > 0) return null
  return <div className={cn('tz-command__empty', className)} {...props} />
}

export function ComboboxSeparator({ className }: { className?: string }) {
  return <Rule className={className} aria-hidden="true" role="none" />
}
