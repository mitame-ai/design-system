import { Dialog as DrawerPrimitive } from 'radix-ui'
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type PointerEvent as ReactPointerEvent,
  useContext,
  useRef,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { prefersReducedMotion } from '../lib/tezawari/env'
import { cn } from '../lib/utils'

type Side = 'top' | 'right' | 'bottom' | 'left'
const Ctx = createContext<Side>('bottom')

export interface DrawerProps extends ComponentPropsWithoutRef<typeof DrawerPrimitive.Root> {
  /** 紙を引き出す辺。既定は下 */
  direction?: Side
}

/**
 * 引き出し — 画面の端から紙を引き出す。指で払えば、紙は戻っていく。
 * 払いが足りなければ、紙はたわんでから元の位置へ揺れ戻る。
 */
export function Drawer({ direction = 'bottom', ...props }: DrawerProps) {
  return (
    <Ctx.Provider value={direction}>
      <DrawerPrimitive.Root {...props} />
    </Ctx.Provider>
  )
}

export const DrawerTrigger = DrawerPrimitive.Trigger
export const DrawerPortal = DrawerPrimitive.Portal
export const DrawerClose = DrawerPrimitive.Close

export const DrawerOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return <DrawerPrimitive.Overlay ref={ref} className={cn('tz-veil', className)} {...props} />
})

/** 払いで閉じる閾値 : 紙の長さの 1/3、または速さ 0.55px/ms */
const FLING_RATIO = 1 / 3
const FLING_SPEED = 0.55

export const DrawerContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Content> & { seed?: string }
>(function DrawerContent(
  {
    className,
    seed,
    children,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    ...props
  },
  forwarded,
) {
  const side = useContext(Ctx)
  const el = useRef<HTMLDivElement>(null)
  const closer = useRef<HTMLButtonElement>(null)
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false })
  const ref = useComposedRefs(el, skin, forwarded)
  const drag = useRef<{ x: number; y: number; t: number; d: number } | null>(null)

  const vertical = side === 'top' || side === 'bottom'
  const sign = side === 'bottom' || side === 'right' ? 1 : -1
  const place = (d: number) => {
    const node = el.current
    if (node) node.style.translate = vertical ? `0 ${d}px` : `${d}px 0`
  }

  const down = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerDown?.(e)
    if (e.defaultPrevented || e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('input, textarea, select, button, a, [contenteditable], [data-no-drag]'))
      return
    if (target.closest('.tz-sheet__inner')?.scrollTop) return
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now(), d: 0 }
    el.current?.setPointerCapture(e.pointerId)
    el.current?.classList.add('is-dragging')
  }
  const move = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    const s = drag.current
    if (!s) return
    const raw = (vertical ? e.clientY - s.y : e.clientX - s.x) * sign
    /* 閉じる向きには素直に、逆向きには紙の張りで抵抗する */
    s.d = raw > 0 ? raw : raw * 0.18
    place(s.d * sign)
  }
  const up = () => {
    const s = drag.current
    drag.current = null
    const node = el.current
    if (!s || !node) return
    node.classList.remove('is-dragging')
    const size = vertical ? node.offsetHeight : node.offsetWidth
    const speed = s.d / Math.max(1, performance.now() - s.t)
    if (s.d > size * FLING_RATIO || (s.d > 12 && speed > FLING_SPEED)) {
      /* 指を離した位置（translate）はそのまま残し、そこから画面の外へ送る */
      closer.current?.click()
      return
    }
    /* 戻り : 押しは速く、戻りは遅く緩む。行き過ぎてから止まる */
    node.style.transition = prefersReducedMotion()
      ? 'none'
      : 'translate 620ms cubic-bezier(.2,1.42,.34,1)'
    place(0)
    const clear = () => {
      node.style.transition = ''
      node.style.translate = ''
    }
    node.addEventListener('transitionend', clear, { once: true })
  }

  return (
    <DrawerPrimitive.Portal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        data-side={side}
        className={cn('tz-sheet tz-drawer', `tz-sheet--${side}`, className)}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={(e) => {
          onPointerUp?.(e)
          up()
        }}
        onPointerCancel={(e) => {
          onPointerCancel?.(e)
          up()
        }}
        {...props}
      >
        <Shell />
        <div className="tz-sheet__inner">
          <Mark kind="stroke" className="tz-drawer__grip" preserveAspectRatio="none" />
          {children}
        </div>
        <DrawerPrimitive.Close ref={closer} hidden tabIndex={-1} aria-hidden="true" />
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  )
})

export function DrawerHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-sheet__head tz-drawer__head', className)} {...props} />
}

export function DrawerFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-sheet__foot tz-drawer__foot', className)} {...props} />
}

export const DrawerTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Title ref={ref} className={cn('tz-dialog__title', className)} {...props} />
  )
})

export const DrawerDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn('tz-dialog__text', className)}
      {...props}
    />
  )
})
