import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import {
  type ComponentPropsWithoutRef,
  createContext,
  type KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'

type CarouselApi = UseEmblaCarouselType[1]
type Options = Parameters<typeof useEmblaCarousel>[0]
type Plugins = Parameters<typeof useEmblaCarousel>[1]

export type { CarouselApi }

interface CarouselCtx {
  carouselRef: UseEmblaCarouselType[0]
  api: CarouselApi
  orientation: 'horizontal' | 'vertical'
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
}

const Ctx = createContext<CarouselCtx | null>(null)

export function useCarousel() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCarousel は <Carousel> の内部で使ってください')
  return c
}

export interface CarouselProps extends ComponentPropsWithoutRef<'div'> {
  opts?: Options
  plugins?: Plugins
  orientation?: 'horizontal' | 'vertical'
  setApi?: (api: CarouselApi) => void
}

/**
 * 繰り — 紙を一枚ずつ、横へ繰っていく。
 * 表示枠は紙の耳と影の分だけ外側へ広げてあり、端の紙の縁が切り落とされない。
 */
export function Carousel({
  orientation = 'horizontal',
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === 'horizontal' ? 'x' : 'y' },
    plugins,
  )
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((a: CarouselApi) => {
    if (!a) return
    setCanScrollPrev(a.canScrollPrev())
    setCanScrollNext(a.canScrollNext())
  }, [])

  const scrollPrev = useCallback(() => api?.scrollPrev(), [api])
  const scrollNext = useCallback(() => api?.scrollNext(), [api])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const back = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
      const fwd = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
      if (e.key === back) {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === fwd) {
        e.preventDefault()
        scrollNext()
      }
    },
    [orientation, scrollPrev, scrollNext],
  )

  useEffect(() => {
    if (api && setApi) setApi(api)
  }, [api, setApi])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  return (
    <Ctx.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: WAI-ARIA のカルーセルの作法（region + aria-roledescription）に従う */}
      <div
        role="region"
        onKeyDownCapture={onKeyDown}
        className={cn('tz-carousel', className)}
        aria-roledescription="carousel"
        {...props}
      >
        {children}
      </div>
    </Ctx.Provider>
  )
}

export function CarouselContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const { carouselRef, orientation } = useCarousel()
  return (
    <div ref={carouselRef} className="tz-carousel__viewport">
      <div
        className={cn(
          'tz-carousel__track',
          orientation === 'vertical' && 'tz-carousel__track--v',
          className,
        )}
        {...props}
      />
    </div>
  )
}

export function CarouselItem({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA のカルーセルの作法（role=group + aria-roledescription=slide）に従う
    <div
      role="group"
      aria-roledescription="slide"
      className={cn('tz-carousel__item', className)}
      {...props}
    />
  )
}

export function CarouselPrevious({
  className,
  variant = 'contour',
  size = 'icon-sm',
  ...props
}: ButtonProps) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'tz-carousel__step tz-carousel__step--prev',
        orientation === 'vertical' && 'is-v',
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="前の紙へ"
      {...props}
    >
      <Glyph name={orientation === 'vertical' ? 'up' : 'prev'} />
    </Button>
  )
}

export function CarouselNext({
  className,
  variant = 'contour',
  size = 'icon-sm',
  ...props
}: ButtonProps) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'tz-carousel__step tz-carousel__step--next',
        orientation === 'vertical' && 'is-v',
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="次の紙へ"
      {...props}
    >
      <Glyph name={orientation === 'vertical' ? 'turn' : 'next'} />
    </Button>
  )
}
