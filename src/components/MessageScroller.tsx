import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { Glyph } from '../lib/marks'
import { prefersReducedMotion } from '../lib/tezawari/env'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'

/* =========================================================
   MESSAGE SCROLLER — 会話の巻物。
     追う   : 末尾を読んでいるあいだは、新しい発言が来れば巻物が自然に送られる
     留まる : 遡って読んでいるときは、新しい発言が来ても巻物を動かさない
     戻る   : 末尾から離れると、末尾へ戻るための札が現れる
   ========================================================= */

const NEAR = 48

interface ScrollerCtx {
  viewport: React.RefObject<HTMLDivElement | null>
  atEnd: boolean
  atStart: boolean
  scrollable: boolean
  scrollToEnd: (smooth?: boolean) => void
  scrollToStart: (smooth?: boolean) => void
  setEdges: (end: boolean, start: boolean, scrollable: boolean) => void
  stuck: React.MutableRefObject<boolean>
}

const Ctx = createContext<ScrollerCtx | null>(null)

/** 巻物の状態と操作。<MessageScroller> の内側で使う */
export function useMessageScroller() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useMessageScroller は <MessageScroller> の内部で使ってください')
  return {
    isAtEnd: c.atEnd,
    isAtStart: c.atStart,
    isScrollable: c.scrollable,
    scrollToEnd: c.scrollToEnd,
    scrollToStart: c.scrollToStart,
  }
}

export function MessageScroller({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  const viewport = useRef<HTMLDivElement>(null)
  const stuck = useRef(true)
  const [edges, setEdgeState] = useState({ atEnd: true, atStart: true, scrollable: false })
  const setEdges = useCallback((atEnd: boolean, atStart: boolean, scrollable: boolean) => {
    setEdgeState((e) =>
      e.atEnd === atEnd && e.atStart === atStart && e.scrollable === scrollable
        ? e
        : { atEnd, atStart, scrollable },
    )
  }, [])
  const go = useCallback((top: number, smooth: boolean) => {
    viewport.current?.scrollTo({
      top,
      behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto',
    })
  }, [])
  const scrollToEnd = useCallback(
    (smooth = true) => {
      stuck.current = true
      go(viewport.current?.scrollHeight ?? 0, smooth)
    },
    [go],
  )
  const scrollToStart = useCallback(
    (smooth = true) => {
      stuck.current = false
      go(0, smooth)
    },
    [go],
  )
  const ctx = useMemo<ScrollerCtx>(
    () => ({ viewport, ...edges, scrollToEnd, scrollToStart, setEdges, stuck }),
    [edges, scrollToEnd, scrollToStart, setEdges],
  )
  return (
    <Ctx.Provider value={ctx}>
      <div className={cn('tz-scroller', className)} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

export const MessageScrollerViewport = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  function MessageScrollerViewport({ className, onScroll, children, ...props }, forwarded) {
    const c = useContext(Ctx)
    if (!c) throw new Error('MessageScrollerViewport は <MessageScroller> の内部で使ってください')
    const ref = useComposedRefs(c.viewport, forwarded)
    const { setEdges, stuck } = c

    const measure = useCallback(() => {
      const el = c.viewport.current
      if (!el) return
      const end = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR
      setEdges(end, el.scrollTop < NEAR, el.scrollHeight > el.clientHeight + 1)
      return end
    }, [c.viewport, setEdges])

    /* 最初は末尾から読み始める */
    useLayoutEffect(() => {
      const el = c.viewport.current
      if (el) el.scrollTop = el.scrollHeight
      measure()
    }, [c.viewport, measure])

    /* 中身が伸びたとき : 末尾を読んでいたなら、末尾へ送る */
    useEffect(() => {
      const el = c.viewport.current
      const content = el?.firstElementChild
      if (!el || !content) return
      const ro = new ResizeObserver(() => {
        if (stuck.current) el.scrollTop = el.scrollHeight
        measure()
      })
      ro.observe(content)
      ro.observe(el)
      return () => ro.disconnect()
    }, [c.viewport, measure, stuck])

    return (
      <div
        ref={ref}
        className={cn('tz-scroller__viewport', className)}
        onScroll={(e) => {
          onScroll?.(e)
          const end = measure()
          if (end !== undefined) stuck.current = end
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

export function MessageScrollerContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-scroller__content', className)} {...props} />
}

export interface MessageScrollerItemProps extends ComponentPropsWithoutRef<'div'> {
  /** true のとき、この項目が現れたら上端に揃うまで巻物を送る（自分の新しい問いかけなど） */
  scrollAnchor?: boolean
}

export function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) {
  const c = useContext(Ctx)
  const el = useRef<HTMLDivElement>(null)
  // biome-ignore lint/correctness/useExhaustiveDependencies: 現れた瞬間に一度だけ送る
  useEffect(() => {
    if (!scrollAnchor || !c) return
    const vp = c.viewport.current
    const node = el.current
    if (!vp || !node) return
    c.stuck.current = false
    vp.scrollTo({
      top: node.offsetTop - 16,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])
  return <div ref={el} className={cn('tz-scroller__item', className)} {...props} />
}

export interface MessageScrollerButtonProps extends ButtonProps {
  /** end は末尾へ、start は先頭へ戻る */
  direction?: 'end' | 'start'
  children?: ReactNode
}

/** 末尾（または先頭）へ戻る札。そこに居るあいだは沈んで見えなくなる */
export function MessageScrollerButton({
  direction = 'end',
  variant = 'contour',
  size = 'icon-sm',
  className,
  children,
  onClick,
  ...props
}: MessageScrollerButtonProps) {
  const c = useContext(Ctx)
  if (!c) throw new Error('MessageScrollerButton は <MessageScroller> の内部で使ってください')
  const active = c.scrollable && (direction === 'end' ? !c.atEnd : !c.atStart)
  return (
    <Button
      variant={variant}
      size={size}
      data-active={active}
      tabIndex={active ? undefined : -1}
      aria-hidden={!active || undefined}
      className={cn('tz-scroller__button', `is-${direction}`, className)}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) direction === 'end' ? c.scrollToEnd() : c.scrollToStart()
      }}
      {...props}
    >
      {children ?? (
        <>
          <Glyph name={direction === 'end' ? 'down' : 'up'} />
          <span className="tz-sr">{direction === 'end' ? '末尾へ' : '先頭へ'}</span>
        </>
      )}
    </Button>
  )
}
