import { Slot } from '@radix-ui/react-slot'
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react'
import { useIsMobile } from '../hooks/useIsMobile'
import { useSkin } from '../hooks/useSkin'
import { useSlip } from '../hooks/useSlip'
import { Glyph } from '../lib/marks'
import { Shell } from '../lib/slot'
import { fnv, mulberry32 } from '../lib/tezawari/random'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'
import { Input, type InputProps } from './Input'
import { Rule } from './Rule'
import { Separator, type SeparatorProps } from './Separator'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from './Sheet'
import { Skeleton } from './Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

/* =========================================================
   SIDEBAR — 脇の帳。画面の端に、細長い紙を一枚立てる。
     耳     : 画面の外へ逃がした三辺は見えない。見えるのは内側の一辺の耳だけ
     畳む   : icon に畳むと、言葉は引っこみ、印だけが残る。印に手を留めると添え書きが出る
     狭い所 : 狭い画面では、端から差し込む紙（Sheet）に替わる
   ========================================================= */

const SHORTCUT = 'b'

interface SidebarCtx {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const Ctx = createContext<SidebarCtx | null>(null)

export function useSidebar() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useSidebar は <SidebarProvider> の内部で使ってください')
  return c
}

export interface SidebarProviderProps extends ComponentPropsWithoutRef<'div'> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const [local, setLocal] = useState(defaultOpen)
  const open = openProp ?? local
  const setOpen = useCallback(
    (v: boolean) => {
      if (openProp === undefined) setLocal(v)
      onOpenChange?.(v)
    },
    [openProp, onOpenChange],
  )
  const toggleSidebar = useCallback(
    () => (isMobile ? setOpenMobile((o) => !o) : setOpen(!open)),
    [isMobile, open, setOpen],
  )

  /* ⌘B / Ctrl+B で開け閉めする */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === SHORTCUT && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleSidebar])

  const ctx = useMemo<SidebarCtx>(
    () => ({
      state: open ? 'expanded' : 'collapsed',
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [open, setOpen, isMobile, openMobile, toggleSidebar],
  )

  return (
    <Ctx.Provider value={ctx}>
      <div className={cn('tz-side-wrap', className)} style={style as CSSProperties} {...props}>
        {children}
      </div>
    </Ctx.Provider>
  )
}

export interface SidebarProps extends ComponentPropsWithoutRef<'div'> {
  side?: 'left' | 'right'
  /** sidebar : 端に立てた紙 / floating : 浮いた一枚 / inset : 本文の側を一段沈める */
  variant?: 'sidebar' | 'floating' | 'inset'
  /** offcanvas : 畳むと画面の外へ / icon : 印だけ残す / none : 畳まない */
  collapsible?: 'offcanvas' | 'icon' | 'none'
  seed?: string
}

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  seed,
  children,
  ...props
}: SidebarProps) {
  const s = useSidebar()
  const [skin] = useSkin<HTMLDivElement>({ seed, pressable: false, enabled: !s.isMobile })

  if (s.isMobile) {
    return (
      <Sheet open={s.openMobile} onOpenChange={s.setOpenMobile}>
        <SheetContent side={side} className="tz-side-sheet" showCloseButton={false}>
          <SheetTitle className="tz-sr">脇の帳</SheetTitle>
          <SheetDescription className="tz-sr">移動先の一覧</SheetDescription>
          <div className="tz-side__inner">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  const collapsed = s.state === 'collapsed'
  return (
    <div
      className="tz-side"
      data-state={s.state}
      data-collapsible={collapsed ? collapsible : ''}
      data-variant={variant}
      data-side={side}
    >
      <div className="tz-side__gap" />
      <div className={cn('tz-side__frame', className)} {...props}>
        <div
          ref={skin}
          className={cn('tz-side__paper', `tz-side__paper--${variant}`, `is-${side}`)}
        >
          <Shell />
          <div className="tz-side__inner">{children}</div>
        </div>
      </div>
    </div>
  )
}

/** 開け閉めの引き手 */
export const SidebarTrigger = forwardRef<HTMLButtonElement, ButtonProps>(function SidebarTrigger(
  { className, onClick, children, ...props },
  ref,
) {
  const s = useSidebar()
  return (
    <Button
      ref={ref}
      variant="bare"
      size="icon-sm"
      className={cn('tz-side-trigger', className)}
      aria-label="脇の帳を開け閉めする"
      aria-expanded={s.isMobile ? s.openMobile : s.open}
      onClick={(e) => {
        onClick?.(e)
        s.toggleSidebar()
      }}
      {...props}
    >
      {children ?? <Glyph name="panel" />}
    </Button>
  )
})

/** 帳の内側の縁。押すと開け閉めできる細い帯 */
export function SidebarRail({ className, ...props }: ComponentPropsWithoutRef<'button'>) {
  const s = useSidebar()
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="脇の帳を開け閉めする"
      title="脇の帳を開け閉めする"
      className={cn('tz-side-rail', className)}
      onClick={s.toggleSidebar}
      {...props}
    />
  )
}

/** 本文の側。inset のときは一段沈めた面として描く */
export function SidebarInset({ className, children, ...props }: ComponentPropsWithoutRef<'main'>) {
  const [skin] = useSkin<HTMLElement>({ pressable: false })
  return (
    <main ref={skin} className={cn('tz-side-inset', className)} {...props}>
      <Shell />
      {children}
    </main>
  )
}

export function SidebarInput({ className, ...props }: InputProps) {
  return <Input wrapperClassName={cn('tz-side-input', className)} {...props} />
}

export function SidebarHeader({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__header', className)} {...props} />
}

export function SidebarFooter({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__footer', className)} {...props} />
}

export function SidebarSeparator({ className, ...props }: SeparatorProps) {
  return <Separator className={cn('tz-side__sep', className)} {...props} />
}

export function SidebarContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__content', className)} {...props} />
}

export function SidebarGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__group', className)} {...props} />
}

export function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: ComponentPropsWithoutRef<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return <Comp className={cn('tz-side__label', className)} {...props} />
}

export function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: ComponentPropsWithoutRef<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn('tz-side__gaction', className)} {...props} />
}

export function SidebarGroupContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__gcontent', className)} {...props} />
}

export function SidebarMenu({ className, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return <ul className={cn('tz-side__menu', className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('tz-side__mitem', className)} {...props} />
}

export interface SidebarMenuButtonProps extends ComponentPropsWithoutRef<'button'> {
  asChild?: boolean
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** icon に畳んだときに出す添え書き */
  tooltip?: ReactNode
}

/** 帳の一行。今いる場所の行には、行頭に墨の縦線が立ったまま残る */
export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton(
    { asChild = false, isActive = false, size = 'md', tooltip, className, style, ...props },
    forwarded,
  ) {
    const s = useSidebar()
    const slip = useSlip()
    const Comp = asChild ? Slot : 'button'
    const btn = (
      <Comp
        ref={forwarded}
        data-active={isActive || undefined}
        aria-current={isActive ? 'page' : undefined}
        className={cn('tz-side__btn', size !== 'md' && `tz-side__btn--${size}`, className)}
        style={{ ...slip, ...style }}
        {...(asChild ? {} : { type: 'button' as const })}
        {...props}
      />
    )
    if (!tooltip || s.state !== 'collapsed' || s.isMobile) return btn
    return (
      <Tooltip>
        <TooltipTrigger asChild>{btn}</TooltipTrigger>
        <TooltipContent side="right" align="center">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  },
)

export function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: ComponentPropsWithoutRef<'button'> & { asChild?: boolean; showOnHover?: boolean }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn('tz-side__maction', showOnHover && 'is-hover-only', className)}
      {...(asChild ? {} : { type: 'button' as const })}
      {...props}
    />
  )
}

export function SidebarMenuBadge({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-side__badge', className)} {...props} />
}

export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: ComponentPropsWithoutRef<'div'> & { showIcon?: boolean }) {
  const id = useId()
  /* 幅は id を種に決定論的に作る : SSR とクライアントで同じ形にしないとハイドレーションがずれる */
  const [width] = useState(() => `${50 + Math.floor(mulberry32(fnv(`sk|${id}`))() * 40)}%`)
  return (
    <div className={cn('tz-side__skeleton', className)} {...props}>
      {showIcon && <Skeleton className="tz-side__skeleton-icon" />}
      <Skeleton className="tz-side__skeleton-text" style={{ maxWidth: width }} />
    </div>
  )
}

/** 入れ子の一覧。左に細い縦の罫を引いて、親の行に従うことを示す */
export function SidebarMenuSub({ className, children, ...props }: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul className={cn('tz-side__sub', className)} {...props}>
      <Rule orientation="vertical" className="tz-side__subrule" aria-hidden="true" role="none" />
      {children}
    </ul>
  )
}

export function SidebarMenuSubItem({ className, ...props }: ComponentPropsWithoutRef<'li'>) {
  return <li className={cn('tz-side__subitem', className)} {...props} />
}

export const SidebarMenuSubButton = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & { asChild?: boolean; isActive?: boolean; size?: 'sm' | 'md' }
>(function SidebarMenuSubButton(
  { asChild = false, isActive = false, size = 'md', className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'a'
  return (
    <Comp
      ref={ref}
      data-active={isActive || undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn('tz-side__btn tz-side__subbtn', size === 'sm' && 'tz-side__btn--sm', className)}
      {...props}
    />
  )
})
