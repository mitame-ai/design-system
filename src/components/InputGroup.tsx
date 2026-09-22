import { cva, type VariantProps } from 'class-variance-authority'
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  type MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'

const Ctx = createContext<{ refresh: () => void; setComposing: (v: boolean) => void }>({
  refresh: () => {},
  setComposing: () => {},
})

export const inputGroupVariants = cva('tz-well tz-igroup', {
  variants: {
    variant: {
      boxed: 'tz-well--boxed',
      rule: '',
    },
  },
  defaultVariants: { variant: 'boxed' },
})

export interface InputGroupProps
  extends ComponentPropsWithoutRef<'div'>,
    VariantProps<typeof inputGroupVariants> {
  disabled?: boolean
  seed?: string
}

/**
 * 添え書きのある入力欄 — 罫や枠の中に、書く場所と、その前後に添える言葉や道具を並べる。
 * 描かれる輪郭は一つだけ。添え物は輪郭の内側に収まる。
 */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { className, variant, disabled, seed, children, onClick, ...props },
  forwarded,
) {
  const [skin, handle] = useSkin<HTMLDivElement>({ seed })
  const [composing, setComposing] = useState(false)
  const refresh = useCallback(() => handle.current?.ink(), [handle])
  useEffect(refresh)
  return (
    <Ctx.Provider value={{ refresh, setComposing }}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: 余白を押したときに入力欄へ筆を移すだけ。キーボードでは入力欄に直接届く */}
      {/* biome-ignore lint/a11y/useSemanticElements: 入力欄と添え物の束ね。fieldset の既定の枠や余白は要らない */}
      <div
        ref={(n) => {
          skin(n)
          if (typeof forwarded === 'function') forwarded(n)
          else if (forwarded) forwarded.current = n
        }}
        role="group"
        className={cn(
          inputGroupVariants({ variant }),
          disabled && 'is-off',
          composing && 'is-composing',
          className,
        )}
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          onClick?.(e)
          /* 添え物の余白を押しても、筆は入力欄へ移る */
          if (e.defaultPrevented || (e.target as HTMLElement).closest('button, a, input, textarea'))
            return
          e.currentTarget.querySelector<HTMLElement>('input, textarea')?.focus()
        }}
        {...props}
      >
        <Shell />
        {children}
      </div>
    </Ctx.Provider>
  )
})

export const inputGroupAddonVariants = cva('tz-igroup__addon', {
  variants: {
    align: {
      'inline-start': 'tz-igroup__addon--start',
      'inline-end': 'tz-igroup__addon--end',
      'block-start': 'tz-igroup__addon--top',
      'block-end': 'tz-igroup__addon--bottom',
    },
  },
  defaultVariants: { align: 'inline-start' },
})

export function InputGroupAddon({
  className,
  align,
  ...props
}: ComponentPropsWithoutRef<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return <div className={cn(inputGroupAddonVariants({ align }), className)} {...props} />
}

/** 入力欄に添える小さなボタン。既定は素地（bare） */
export const InputGroupButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function InputGroupButton({ variant = 'bare', size = 'sm', className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('tz-igroup__btn', className)}
        {...props}
      />
    )
  },
)

export function InputGroupText({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-igroup__text', className)} {...props} />
}

export const InputGroupInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  function InputGroupInput(
    {
      className,
      onInput,
      onKeyUp,
      onSelect,
      onFocus,
      onCompositionStart,
      onCompositionEnd,
      ...props
    },
    ref,
  ) {
    const { refresh, setComposing } = useContext(Ctx)
    return (
      <>
        <input
          ref={ref}
          className={cn('tz-input tz-igroup__input', className)}
          onInput={(e) => {
            onInput?.(e)
            refresh()
          }}
          onKeyUp={(e) => {
            onKeyUp?.(e)
            refresh()
          }}
          onSelect={(e) => {
            onSelect?.(e)
            refresh()
          }}
          onFocus={(e) => {
            onFocus?.(e)
            refresh()
          }}
          onCompositionStart={(e) => {
            onCompositionStart?.(e)
            setComposing(true)
          }}
          onCompositionEnd={(e) => {
            onCompositionEnd?.(e)
            setComposing(false)
            refresh()
          }}
          {...props}
        />
        <span className="tz-nib" aria-hidden="true" />
      </>
    )
  },
)

export const InputGroupTextarea = forwardRef<
  HTMLTextAreaElement,
  ComponentPropsWithoutRef<'textarea'>
>(function InputGroupTextarea({ className, onInput, ...props }, ref) {
  const { refresh } = useContext(Ctx)
  return (
    <textarea
      ref={ref}
      className={cn('tz-area tz-igroup__area', className)}
      onInput={(e) => {
        onInput?.(e)
        refresh()
      }}
      {...props}
    />
  )
})
