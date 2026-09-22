import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'

export interface FieldProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * エラー状態。全体を赤枠にするのではなく、校正の朱入れのように朱色の波線と注記で示します。
   * 罫線そのものは墨色のまま維持されます。
   */
  invalid?: boolean
}

/** 入力欄・ラベル・注記を束ねるフィールドコンポーネント */
export function Field({ className, invalid = false, ...props }: FieldProps) {
  return <div className={cn('tz-field', invalid && 'is-error', className)} {...props} />
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
