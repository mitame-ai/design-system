import {
  Children,
  type ComponentPropsWithoutRef,
  createContext,
  type FormEvent,
  forwardRef,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useComposedRefs } from '../hooks/useComposedRefs'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useSkin } from '../hooks/useSkin'
import { Mark } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Button, type ButtonProps } from './Button'
import { Kbd } from './Kbd'
import { Progress } from './Progress'

/* =========================================================
   QUESTIONNAIRE — 問いの帳面。一問ずつ頁をめくって答えていく。
     一問   : 見えている問いは常に一つ。答えると次の頁が落ち着いて現れる
     選ぶ   : 選択肢は紙の札。選んだ札には印が書き入れられる
     鍵     : A / B / C（または 1 / 2 / 3）の鍵で、札を直接選べる
     朱     : 答えが足りなければ、朱の注記で知らせる
   ========================================================= */

export type QuestionnaireValues = Record<string, string | string[]>

interface ItemMeta {
  name: string
  required: boolean
}

interface QCtx {
  current: string | undefined
  order: string[]
  register: (meta: ItemMeta) => () => void
  values: QuestionnaireValues
  setValue: (name: string, v: string | string[]) => void
  errors: Record<string, string | undefined>
  next: () => void
  prev: () => void
  skip: () => void
  canSkip: boolean
  first: boolean
  last: boolean
  shortcuts: 'letters' | 'numbers' | false
}

const Ctx = createContext<QCtx | null>(null)
const useQ = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('Questionnaire の部品は <Questionnaire> の内部で配置してください')
  return c
}

export interface QuestionnaireProps
  extends Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit' | 'defaultValue'> {
  defaultValues?: QuestionnaireValues
  /** すべての問いに答え終えたときに呼ばれる */
  onSubmit?: (values: QuestionnaireValues) => void
  /** 開いている問いが変わったときに呼ばれる */
  onItemChange?: (name: string) => void
  /** 選択肢を鍵で選ぶ方式。false で無効 */
  shortcuts?: 'letters' | 'numbers' | false
  /** 必須の問いが空のまま進もうとしたときの注記 */
  requiredMessage?: string
}

export function Questionnaire({
  className,
  defaultValues = {},
  onSubmit,
  onItemChange,
  shortcuts = 'letters',
  requiredMessage = '答えを選んでから進んでください',
  children,
  ...props
}: QuestionnaireProps) {
  /* 宣言された問いを子要素から読み取る。登録が効果でしか行われないため、
     SSR や初回描画では開いている問い・全問数が分からない。宣言順をフォールバックに使う */
  const declared = useMemo(() => {
    const items: ItemMeta[] = []
    const walk = (kids: ReactNode) => {
      Children.forEach(kids, (c) => {
        if (!isValidElement(c)) return
        if (c.type === QuestionnaireItem) {
          const p = c.props as QuestionnaireItemProps
          items.push({ name: p.name, required: !!p.required })
        } else {
          walk((c.props as { children?: ReactNode }).children)
        }
      })
    }
    walk(children)
    return items
  }, [children])

  const metas = useRef(new Map<string, ItemMeta>(declared.map((m) => [m.name, m])))
  const [order, setOrder] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [values, setValues] = useState<QuestionnaireValues>(defaultValues)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})

  const register = useCallback((meta: ItemMeta) => {
    metas.current.set(meta.name, meta)
    setOrder((o) => (o.includes(meta.name) ? o : [...o, meta.name]))
    return () => {
      metas.current.delete(meta.name)
      setOrder((o) => o.filter((n) => n !== meta.name))
    }
  }, [])

  /* 登録済みの順序を優先し、未登録のあいだは宣言順に従う */
  const names = order.length ? order : declared.map((m) => m.name)
  const current = names[Math.min(index, names.length - 1)]
  useEffect(() => {
    if (current) onItemChange?.(current)
  }, [current, onItemChange])

  const answered = (name: string) => {
    const v = values[name]
    return Array.isArray(v) ? v.length > 0 : !!v?.trim()
  }
  const check = (name: string | undefined) => {
    if (!name) return true
    const meta = metas.current.get(name)
    const ok = !meta?.required || answered(name)
    setErrors((e) => ({ ...e, [name]: ok ? undefined : requiredMessage }))
    return ok
  }

  const next = () => {
    if (!check(current)) return
    setIndex((i) => Math.min(i + 1, names.length - 1))
  }
  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const skip = () => setIndex((i) => Math.min(i + 1, names.length - 1))
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (index < names.length - 1) return next()
    if (!check(current)) return
    const missing = names.find((n) => metas.current.get(n)?.required && !answered(n))
    if (missing) {
      setIndex(names.indexOf(missing))
      check(missing)
      return
    }
    onSubmit?.(values)
  }

  const ctx: QCtx = {
    current,
    order: names,
    register,
    values,
    setValue: (name, v) => {
      setValues((all) => ({ ...all, [name]: v }))
      setErrors((e) => ({ ...e, [name]: undefined }))
    },
    errors,
    next,
    prev,
    skip,
    canSkip: !!current && !metas.current.get(current)?.required,
    first: index === 0,
    last: index >= names.length - 1,
    shortcuts,
  }

  return (
    <Ctx.Provider value={ctx}>
      <form className={cn('tz-quest', className)} onSubmit={submit} noValidate {...props}>
        {children}
      </form>
    </Ctx.Provider>
  )
}

/** いま何問目か。数字と、進んだ分だけ墨の染みた罫で示す */
export function QuestionnaireProgress({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const q = useQ()
  const at = q.current ? q.order.indexOf(q.current) + 1 : 0
  return (
    <div className={cn('tz-quest__progress', className)} {...props}>
      <span className="tz-quest__count" aria-live="polite">
        {at} / {q.order.length}
      </span>
      <Progress value={q.order.length ? (at / q.order.length) * 100 : 0} aria-label="進み" />
    </div>
  )
}

const ItemCtx = createContext<{
  name: string
  titleId: string
  descId: string
  multiple: boolean
} | null>(null)
const useItem = () => {
  const c = useContext(ItemCtx)
  if (!c) throw new Error('この部品は <QuestionnaireItem> の内部で配置してください')
  return c
}

export interface QuestionnaireItemProps extends Omit<ComponentPropsWithoutRef<'fieldset'>, 'name'> {
  name: string
  required?: boolean
  /** 選択肢を幾つでも選べる（チェック）。既定は一つだけ（ラジオ） */
  multiple?: boolean
}

/** 一問。開いている問いだけが描かれる */
export function QuestionnaireItem({
  name,
  required = false,
  multiple = false,
  className,
  children,
  ...props
}: QuestionnaireItemProps) {
  const q = useQ()
  const id = useId()
  const { register } = q
  useIsomorphicLayoutEffect(() => register({ name, required }), [register, name, required])
  if (q.current !== name) return null
  const invalid = !!q.errors[name]
  return (
    <ItemCtx.Provider value={{ name, titleId: `${id}-t`, descId: `${id}-d`, multiple }}>
      <fieldset
        className={cn('tz-quest__item', invalid && 'is-error', className)}
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-d`}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </fieldset>
    </ItemCtx.Provider>
  )
}

export function QuestionnaireTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  const item = useItem()
  return <div id={item.titleId} className={cn('tz-quest__title', className)} {...props} />
}

export function QuestionnaireDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  const item = useItem()
  return <p id={item.descId} className={cn('tz-quest__desc', className)} {...props} />
}

const ChoicesCtx = createContext<{ register: (v: string) => number } | null>(null)

export function QuestionnaireChoices({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  const q = useQ()
  const item = useItem()
  /* 選択肢は描かれた順に番号を持つ。鍵（A / B / C）はこの順で割り当てる */
  const seen = useRef<string[]>([])
  const register = useCallback((v: string) => {
    if (!seen.current.includes(v)) seen.current.push(v)
    return seen.current.indexOf(v)
  }, [])

  /* 鍵で選ぶ : 文字を書いている最中は横取りしない */
  useEffect(() => {
    if (!q.shortcuts) return
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const t = e.target as HTMLElement
      if (t.closest('input:not([type=checkbox]):not([type=radio]), textarea, [contenteditable]'))
        return
      const k = e.key.toUpperCase()
      const i = q.shortcuts === 'numbers' ? Number(k) - 1 : k.charCodeAt(0) - 65
      if (k.length !== 1 || Number.isNaN(i) || i < 0) return
      const v = seen.current[i]
      if (v === undefined) return
      e.preventDefault()
      const cur = q.values[item.name]
      if (item.multiple) {
        const list = Array.isArray(cur) ? cur : []
        q.setValue(item.name, list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
      } else q.setValue(item.name, v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [q, item])

  return (
    <ChoicesCtx.Provider value={{ register }}>
      {/* 問いの fieldset が見出しで名付けられている。選択肢は同じ name の input で一組になる */}
      <div className={cn('tz-quest__choices', className)} {...props}>
        {children}
      </div>
    </ChoicesCtx.Provider>
  )
}

export interface QuestionnaireChoiceProps
  extends Omit<ComponentPropsWithoutRef<'label'>, 'onChange'> {
  value: string
  disabled?: boolean
  seed?: string
}

/** 選択肢の札。選ぶと、札の頭の枡に印が書き入れられる */
export const QuestionnaireChoice = forwardRef<HTMLLabelElement, QuestionnaireChoiceProps>(
  function QuestionnaireChoice(
    { value, disabled = false, className, seed, children, ...props },
    forwarded,
  ) {
    const q = useQ()
    const item = useItem()
    const choices = useContext(ChoicesCtx)
    const index = choices?.register(value) ?? -1
    const [skin] = useSkin<HTMLLabelElement>({ seed, pressable: true })
    const ref = useComposedRefs(skin, forwarded)
    const cur = q.values[item.name]
    const checked = item.multiple ? Array.isArray(cur) && cur.includes(value) : cur === value
    const key =
      q.shortcuts === 'numbers'
        ? String(index + 1)
        : q.shortcuts === 'letters'
          ? String.fromCharCode(65 + index)
          : null
    const toggle = () => {
      if (disabled) return
      if (item.multiple) {
        const list = Array.isArray(cur) ? cur : []
        q.setValue(item.name, checked ? list.filter((x) => x !== value) : [...list, value])
      } else q.setValue(item.name, value)
    }
    return (
      <label
        ref={ref}
        data-checked={checked || undefined}
        data-disabled={disabled || undefined}
        className={cn('tz-quest__choice', className)}
        {...props}
      >
        <Shell />
        <input
          type={item.multiple ? 'checkbox' : 'radio'}
          name={item.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={toggle}
          className="tz-quest__native"
        />
        <span
          className={cn('tz-quest__ind', item.multiple ? 'is-box' : 'is-round')}
          aria-hidden="true"
        >
          <Mark kind={item.multiple ? 'frame' : 'ring'} seed={seed} className="tz-quest__well" />
          {checked && (
            <Mark kind={item.multiple ? 'tick' : 'dot'} className="tz-quest__mark is-writing" />
          )}
        </span>
        <span className="tz-quest__label">{children}</span>
        {key && index >= 0 && <Kbd className="tz-quest__key">{key}</Kbd>}
      </label>
    )
  },
)

export function QuestionnaireChoiceDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-quest__choice-desc', className)} {...props} />
}

/** 自由に書いて答える問い。罫の入力欄に書く */
export function QuestionnaireInput({
  className,
  ...props
}: Omit<ComponentPropsWithoutRef<'input'>, 'value' | 'onChange' | 'name'>) {
  const q = useQ()
  const item = useItem()
  const [skin, handle] = useSkin<HTMLSpanElement>({ pressable: false })
  const v = q.values[item.name]
  const text = typeof v === 'string' ? v : ''
  // biome-ignore lint/correctness/useExhaustiveDependencies: 書かれた言葉が変わるたびに墨を測り直す
  useEffect(() => {
    handle.current?.ink()
  }, [text, handle])
  return (
    <span ref={skin} className="tz-well">
      <Shell />
      <input
        className={cn('tz-input', className)}
        name={item.name}
        value={text}
        aria-labelledby={item.titleId}
        onChange={(e) => q.setValue(item.name, e.target.value)}
        onSelect={() => handle.current?.ink()}
        {...props}
      />
      <span className="tz-nib" aria-hidden="true" />
    </span>
  )
}

export function QuestionnaireError({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  const q = useQ()
  const item = useItem()
  const msg = q.errors[item.name]
  if (!msg) return null
  return (
    <div role="alert" className={cn('tz-field__note tz-field__error', className)} {...props}>
      {children ?? msg}
    </div>
  )
}

export function QuestionnaireActions({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-quest__actions', className)} {...props} />
}

type StepProps = Omit<ButtonProps, 'type'> & { children?: ReactNode }

export function QuestionnairePrevious({
  children = '戻る',
  variant = 'bare',
  ...props
}: StepProps) {
  const q = useQ()
  if (q.first) return <span className="tz-quest__spacer" />
  return (
    <Button variant={variant} className="tz-quest__prev" onClick={q.prev} {...props}>
      {children}
    </Button>
  )
}

export function QuestionnaireSkip({ children = '飛ばす', variant = 'bare', ...props }: StepProps) {
  const q = useQ()
  if (!q.canSkip || q.last) return null
  return (
    <Button variant={variant} className="tz-quest__skip" onClick={q.skip} {...props}>
      {children}
    </Button>
  )
}

export function QuestionnaireNext({ children = '次へ', variant = 'ink', ...props }: StepProps) {
  const q = useQ()
  if (q.last) return null
  return (
    <Button variant={variant} className="tz-quest__next" onClick={q.next} {...props}>
      {children}
    </Button>
  )
}

export function QuestionnaireSubmit({
  children = '答えを送る',
  variant = 'ink',
  ...props
}: StepProps) {
  const q = useQ()
  if (!q.last) return null
  return (
    <Button type="submit" variant={variant} className="tz-quest__next" {...props}>
      {children}
    </Button>
  )
}
