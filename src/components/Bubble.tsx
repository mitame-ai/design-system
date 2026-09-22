import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type ReactNode,
  useContext,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useSkin } from '../hooks/useSkin'
import { decorateChild, Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/* =========================================================
   BUBBLE — 吹き出し。会話の一言を、一枚の紙片に書く。
     墨（ink）  : 自分の言葉。墨で塗った紙片に白抜き
     紙（paper）: 相手の言葉。光を受けた紙片
     象嵌（muted）/ 輪郭（contour）/ 素（ghost）/ 朱（shu）
   ========================================================= */

export const bubbleVariants = cva('tz-bubble', {
  variants: {
    variant: {
      ink: 'tz-bubble--ink',
      paper: 'tz-bubble--paper',
      muted: 'tz-bubble--muted',
      contour: 'tz-bubble--contour',
      ghost: 'tz-bubble--ghost',
      shu: 'tz-bubble--shu',
    },
  },
  defaultVariants: { variant: 'ink' },
})

type Variant = NonNullable<VariantProps<typeof bubbleVariants>['variant']>
const Ctx = createContext<Variant>('ink')

export function BubbleGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-bubbles', className)} {...props} />
}

export interface BubbleProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof bubbleVariants> {
  align?: 'start' | 'end'
}

export function Bubble({ variant = 'ink', align = 'start', className, ...props }: BubbleProps) {
  return (
    <Ctx.Provider value={variant ?? 'ink'}>
      <div
        data-align={align}
        className={cn(bubbleVariants({ variant }), `is-${align}`, className)}
        {...props}
      />
    </Ctx.Provider>
  )
}

export interface BubbleContentProps extends ComponentPropsWithoutRef<'div'> {
  asChild?: boolean
  seed?: string
}

/** 紙片そのもの。押せる紙片（button や a を asChild で渡したもの）は、触れるとたわむ */
export const BubbleContent = forwardRef<HTMLDivElement, BubbleContentProps>(function BubbleContent(
  { asChild = false, className, seed, children, ...props },
  forwarded,
) {
  const variant = useContext(Ctx)
  const [skin] = useSkin<HTMLDivElement>({ seed, enabled: variant !== 'ghost' })
  const ref = useComposedRefs(skin, forwarded)
  const dress = (kids: ReactNode) => (
    <>
      {variant !== 'ghost' && <Shell />}
      <div className="tz-bubble__text">{kids}</div>
    </>
  )
  if (asChild) {
    return (
      <Slot ref={ref} className={cn('tz-bubble__content', className)} {...props}>
        {decorateChild(children, dress)}
      </Slot>
    )
  }
  return (
    <div ref={ref} className={cn('tz-bubble__content', className)} {...props}>
      {dress(children)}
    </div>
  )
})

/** 紙片の角に添える反応（絵文字など）。小さな札として貼る */
export function BubbleReactions({
  side = 'bottom',
  align = 'end',
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'> & { side?: 'top' | 'bottom'; align?: 'start' | 'end' }) {
  const [skin] = useSkin<HTMLDivElement>({ pressable: false })
  return (
    <div
      ref={skin}
      className={cn('tz-bubble__reactions', `is-${side}`, `is-${align}`, className)}
      {...props}
    >
      <Shell />
      {children}
    </div>
  )
}
