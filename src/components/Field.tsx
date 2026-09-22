import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

export interface FieldProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * エラー状態。全体を赤枠にするのではなく、校正の朱入れのように朱色の波線と注記で示します。
   * 罫線そのものは墨色のまま維持されます。
   */
  invalid?: boolean
  /**
   * 並べ方。vertical（既定）はラベルの下に入力欄、horizontal は横に並べる。
   * responsive は、狭い画面では縦、広い画面では横に並べる。
   */
  orientation?: 'vertical' | 'horizontal' | 'responsive'
}

/** 入力欄・ラベル・注記を束ねるフィールドコンポーネント */
export function Field({
  className,
  invalid = false,
  orientation = 'vertical',
  ...props
}: FieldProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: 入れ子にできる軽い束ね。fieldset は FieldSet を使う
    <div
      role="group"
      data-orientation={orientation}
      data-invalid={invalid || undefined}
      className={cn(
        'tz-field',
        orientation !== 'vertical' && `tz-field--${orientation}`,
        invalid && 'is-error',
        className,
      )}
      {...props}
    />
  )
}

export interface FieldLabelProps extends ComponentPropsWithoutRef<'label'> {
  /** 必須入力項目であることを朱色の印で示します */
  required?: boolean
  /** Select など htmlFor が使用できない要素向けに、ラベルを span 要素として描画します */
  asSpan?: boolean
}

export function FieldLabel({
  className,
  required = false,
  asSpan = false,
  children,
  ...props
}: FieldLabelProps) {
  const Comp = asSpan ? 'span' : 'label'
  return (
    <Comp className={cn('tz-field__label', className)} {...(props as object)}>
      {children}
      {required && (
        <span className="tz-field__need" aria-hidden="true">
          •
        </span>
      )}
    </Comp>
  )
}

/** 注記テキスト。エラー時には朱色になり、先頭に朱入れの印が付与されます */
export function FieldNote({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-field__note', className)} {...props} />
}

/** 注記（FieldNote の別名。shadcn の API に合わせたもの） */
export function FieldDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('tz-field__note', className)} {...props} />
}

export interface FieldErrorProps extends ComponentPropsWithoutRef<'div'> {
  /** 表示する誤り。重複した文言は一つにまとめる */
  errors?: ({ message?: string } | undefined)[]
}

/**
 * 朱入れの注記。invalid の有無にかかわらず、常に朱で書く。
 * 誤りが幾つもあるときは、箇条にして並べる。
 */
export function FieldError({ className, errors, children, ...props }: FieldErrorProps) {
  let body: ReactNode = children
  if (!body && errors?.length) {
    const unique = [...new Set(errors.map((e) => e?.message).filter(Boolean))] as string[]
    body =
      unique.length === 1 ? (
        unique[0]
      ) : (
        <ul className="tz-field__errors">
          {unique.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )
  }
  if (!body) return null
  return (
    <div role="alert" className={cn('tz-field__note tz-field__error', className)} {...props}>
      {body}
    </div>
  )
}

/** 入れ子の束ね。ラベルと注記をまとめて、横並びのフィールドの片側に置く */
export function FieldContent({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-field__content', className)} {...props} />
}

/** ラベルではない見出し（チェックの選択肢の見出しなど） */
export function FieldTitle({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-field__title', className)} {...props} />
}

/** フィールドの並び。縦に間隔をとって積む */
export function FieldGroup({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('tz-field-group', className)} {...props} />
}

/** 意味のまとまりを囲う fieldset */
export function FieldSet({ className, ...props }: ComponentPropsWithoutRef<'fieldset'>) {
  return <fieldset className={cn('tz-fieldset', className)} {...props} />
}

export function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: ComponentPropsWithoutRef<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      className={cn('tz-fieldset__legend', variant === 'label' && 'tz-field__label', className)}
      {...props}
    />
  )
}

/** フィールドのあいだの区切り。言葉を添えると、罫の中央に置く */
export function FieldSeparator({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('tz-field-sep', className)} {...props}>
      <Rule aria-hidden="true" role="none" />
      {children && <span className="tz-field-sep__text">{children}</span>}
      {children && <Rule aria-hidden="true" role="none" />}
    </div>
  )
}
