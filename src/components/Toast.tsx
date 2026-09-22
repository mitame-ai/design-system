import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useSkin } from '../hooks/useSkin'
import { Glyph, Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button } from './Button'
import { Spinner } from './Spinner'

/* =========================================================
   TOAST — 知らせの紙片。画面の隅に、一枚ずつ差し込まれる。
     重なり : 新しい紙片が手前に来て、古いものは少し奥へずれる
     知らせ : 手を留めると重なりがほどけ、消える時計も止まる
     朱     : 失敗の知らせだけが、朱の傍線を持つ
   ========================================================= */

export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'

export interface ToastOptions {
  id?: string | number
  description?: ReactNode
  type?: ToastType
  /** 表示時間 (ms)。Infinity で閉じるまで残す。loading は既定で残り続ける */
  duration?: number
  action?: { label: ReactNode; onClick: () => void }
  onDismiss?: () => void
}

interface ToastRecord extends Required<Pick<ToastOptions, 'type' | 'duration'>> {
  id: string | number
  title: ReactNode
  description?: ReactNode
  action?: ToastOptions['action']
  onDismiss?: () => void
  leaving: boolean
  born: number
}

let seq = 0
let records: ToastRecord[] = []
const listeners = new Set<() => void>()
const emit = () => {
  records = [...records]
  for (const l of listeners) l()
}

const LEAVE_MS = 220

function upsert(title: ReactNode, opts: ToastOptions = {}) {
  const id = opts.id ?? ++seq
  const type = opts.type ?? 'default'
  const duration = opts.duration ?? (type === 'loading' ? Number.POSITIVE_INFINITY : 4800)
  const i = records.findIndex((r) => r.id === id)
  const rec: ToastRecord = {
    id,
    title,
    type,
    duration,
    description: opts.description,
    action: opts.action,
    onDismiss: opts.onDismiss,
    leaving: false,
    born: i >= 0 ? (records[i] as ToastRecord).born : performance.now(),
  }
  if (i >= 0) records[i] = rec
  else records.push(rec)
  emit()
  return id
}

function dismiss(id?: string | number) {
  const targets = records.filter((r) => id === undefined || r.id === id)
  for (const r of targets) {
    r.leaving = true
    r.onDismiss?.()
  }
  emit()
  setTimeout(() => {
    records = records.filter((r) => !targets.includes(r))
    emit()
  }, LEAVE_MS)
}

type ToastFn = ((title: ReactNode, opts?: ToastOptions) => string | number) & {
  success: (title: ReactNode, opts?: ToastOptions) => string | number
  info: (title: ReactNode, opts?: ToastOptions) => string | number
  warning: (title: ReactNode, opts?: ToastOptions) => string | number
  error: (title: ReactNode, opts?: ToastOptions) => string | number
  loading: (title: ReactNode, opts?: ToastOptions) => string | number
  dismiss: (id?: string | number) => void
  /** 約束（Promise）の行方を一枚の紙片で知らせる。待つあいだは針目が回る */
  promise: <T>(
    p: Promise<T>,
    msgs: {
      loading: ReactNode
      success: ReactNode | ((v: T) => ReactNode)
      error: ReactNode | ((e: unknown) => ReactNode)
    },
  ) => Promise<T>
}

/** 知らせを出す。toast('保存しました') / toast.error('失敗しました', { description }) */
export const toast: ToastFn = Object.assign(
  (title: ReactNode, opts?: ToastOptions) => upsert(title, opts),
  {
    success: (title: ReactNode, opts?: ToastOptions) => upsert(title, { ...opts, type: 'success' }),
    info: (title: ReactNode, opts?: ToastOptions) => upsert(title, { ...opts, type: 'info' }),
    warning: (title: ReactNode, opts?: ToastOptions) => upsert(title, { ...opts, type: 'warning' }),
    error: (title: ReactNode, opts?: ToastOptions) => upsert(title, { ...opts, type: 'error' }),
    loading: (title: ReactNode, opts?: ToastOptions) => upsert(title, { ...opts, type: 'loading' }),
    dismiss,
    promise: <T,>(
      p: Promise<T>,
      msgs: {
        loading: ReactNode
        success: ReactNode | ((v: T) => ReactNode)
        error: ReactNode | ((e: unknown) => ReactNode)
      },
    ) => {
      const id = upsert(msgs.loading, { type: 'loading' })
      p.then(
        (v) =>
          upsert(typeof msgs.success === 'function' ? msgs.success(v) : msgs.success, {
            id,
            type: 'success',
          }),
        (e) =>
          upsert(typeof msgs.error === 'function' ? msgs.error(e) : msgs.error, {
            id,
            type: 'error',
          }),
      )
      return p
    },
  },
)

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}
const snapshot = () => records
const empty: ToastRecord[] = []

export interface ToasterProps extends ComponentPropsWithoutRef<'section'> {
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'top-right'
    | 'top-left'
    | 'top-center'
  /** 重ねて見せる枚数。これより奥の紙片は隠れる */
  visible?: number
}

/** 知らせを受け取る場所。アプリに一つだけ置く */
export function Toaster({
  className,
  position = 'bottom-right',
  visible = 3,
  ...props
}: ToasterProps) {
  const list = useSyncExternalStore(subscribe, snapshot, () => empty)
  const [expanded, setExpanded] = useState(false)
  /* 紙片ごとの高さ。重ねたときは手前の紙片の高さに揃え、ほどいたときは手前から順に積む */
  const [heights, setHeights] = useState<Record<string, number>>({})
  const measure = useCallback(
    (id: string | number, h: number) => setHeights((m) => (m[id] === h ? m : { ...m, [id]: h })),
    [],
  )
  const top = position.startsWith('top')
  const ordered = [...list].reverse()
  const frontH = heights[String(ordered[0]?.id)] ?? 0
  let offset = 0
  const offsets = ordered.map((r) => {
    const at = offset
    offset += (heights[String(r.id)] ?? 0) + 12
    return at
  })
  return (
    <section
      aria-label="知らせ"
      aria-live="polite"
      className={cn('tz-toaster', `tz-toaster--${position}`, expanded && 'is-expanded', className)}
      onPointerEnter={() => setExpanded(true)}
      onPointerLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      {...props}
    >
      <ol className="tz-toaster__list" style={{ '--tz-front-h': `${frontH}px` } as CSSProperties}>
        {ordered.map((r, i) => (
          <ToastSlip
            key={r.id}
            rec={r}
            index={i}
            offset={offsets[i] ?? 0}
            onHeight={measure}
            hidden={i >= visible}
            paused={expanded}
            top={top}
          />
        ))}
      </ol>
    </section>
  )
}

function ToastSlip({
  rec,
  index,
  offset,
  onHeight,
  hidden,
  paused,
  top,
}: {
  rec: ToastRecord
  index: number
  offset: number
  onHeight: (id: string | number, h: number) => void
  hidden: boolean
  paused: boolean
  top: boolean
}) {
  const [skin] = useSkin<HTMLLIElement>({ pressable: false })
  const el = useRef<HTMLLIElement | null>(null)
  const setRefs = useCallback(
    (n: HTMLLIElement | null) => {
      el.current = n
      skin(n)
    },
    [skin],
  )

  /* 消える時計 : 手を留めているあいだは止まる */
  const left = useRef(rec.duration)
  useEffect(() => {
    left.current = rec.duration
  }, [rec.duration])
  useEffect(() => {
    if (paused || rec.leaving || !Number.isFinite(left.current)) return
    const start = performance.now()
    const t = setTimeout(() => dismiss(rec.id), left.current)
    return () => {
      clearTimeout(t)
      left.current -= performance.now() - start
    }
  }, [paused, rec.leaving, rec.id])

  /* 自分の高さを Toaster へ知らせる（重ね方とほどき方の計算に使う） */
  const [h, setH] = useState(0)
  useEffect(() => {
    const n = el.current
    if (!n) return
    const ro = new ResizeObserver(() => {
      setH(n.offsetHeight)
      onHeight(rec.id, n.offsetHeight)
    })
    ro.observe(n)
    return () => ro.disconnect()
  }, [onHeight, rec.id])

  return (
    <li
      ref={setRefs}
      role={rec.type === 'error' ? 'alert' : 'status'}
      data-type={rec.type}
      data-index={index}
      aria-hidden={hidden || undefined}
      className={cn(
        'tz-leaf tz-toast',
        rec.leaving && 'is-leaving',
        hidden && 'is-buried',
        top && 'is-top',
      )}
      style={{ '--tz-i': index, '--tz-h': `${h}px`, '--tz-off': `${offset}px` } as CSSProperties}
    >
      <Shell />
      <div className="tz-toast__body">
        {rec.type !== 'default' && (
          <span className="tz-toast__icon" aria-hidden="true">
            {rec.type === 'success' && <Mark kind="tick" className="is-writing" />}
            {rec.type === 'loading' && <Spinner label="" />}
            {rec.type === 'info' && <Glyph name="info" />}
            {(rec.type === 'warning' || rec.type === 'error') && <Glyph name="alert" />}
          </span>
        )}
        <div className="tz-toast__text">
          <div className="tz-toast__title">{rec.title}</div>
          {rec.description && <div className="tz-toast__desc">{rec.description}</div>}
        </div>
        {rec.action && (
          <Button
            variant="contour"
            size="sm"
            className="tz-toast__action"
            onClick={() => {
              rec.action?.onClick()
              dismiss(rec.id)
            }}
          >
            {rec.action.label}
          </Button>
        )}
        <Button
          variant="bare"
          size="icon-sm"
          className="tz-toast__close"
          aria-label="閉じる"
          onClick={() => dismiss(rec.id)}
        >
          <Glyph name="close" />
        </Button>
      </div>
    </li>
  )
}
