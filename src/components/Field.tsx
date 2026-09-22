import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../lib/utils'

export interface FieldProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * 誤り。赤い枠ではなく、後から引かれる朱の波線で示す。
   * 罫そのものは墨のまま残る : 朱は加えられる印であって、紙を塗り替えない。
   */
  invalid?: boolean
}

/** 欄とその見出し、注記をひとまとめにする */
export function Field({ className, invalid = false, ...props }: FieldProps) {
  return <div className={cn('tz-field', invalid && 'is-error', className)} {...props} />
}

export interface FieldLabelProps extends ComponentPropsWithoutRef<'label'> {
  /** 要る欄であることを朱の点で示す */
  required?: boolean
  /** 選ぶ欄のように for が効かない相手には span で出す */
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

/** 注記。誤りのときは朱になり、頭に「朱」が付く */
export function FieldNote({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-field__note', className)} {...props} />
}
