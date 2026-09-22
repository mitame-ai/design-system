import { Command as CommandPrimitive } from 'cmdk'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { useSlip } from '../hooks/useSlip'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog'
import { Rule } from './Rule'

/**
 * 索引 — 言葉を書き入れると、当てはまる項目だけが残る。
 * 書く場所は罫、候補は Select と同じ作法の選択肢で描く。
 */
export const Command = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive>
>(function Command({ className, ...props }, ref) {
  return <CommandPrimitive ref={ref} className={cn('tz-command', className)} {...props} />
})

export interface CommandDialogProps extends ComponentPropsWithoutRef<typeof Dialog> {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  /** 候補を絞り込む処理を差し替える（cmdk の filter） */
  filter?: ComponentPropsWithoutRef<typeof CommandPrimitive>['filter']
}

/** 画面の中央に索引の紙を差し出す（⌘K などで開く） */
export function CommandDialog({
  title = '索引',
  description = '探したい言葉を書き入れてください',
  children,
  className,
  showCloseButton = false,
  filter,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn('tz-command-dialog', className)}
        showCloseButton={showCloseButton}
      >
        <DialogHeader className="tz-sr">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command filter={filter}>{children}</Command>
      </DialogContent>
    </Dialog>
  )
}

export const CommandInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(function CommandInput({ className, ...props }, ref) {
  return (
    <div className="tz-command__search">
      <div className="tz-command__field">
        <Glyph name="search" className="tz-command__glass" />
        <CommandPrimitive.Input
          ref={ref}
          className={cn('tz-command__input', className)}
          {...props}
        />
      </div>
      <Rule className="tz-command__rule" aria-hidden="true" role="none" />
    </div>
  )
})

export const CommandList = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(function CommandList({ className, ...props }, ref) {
  return (
    <CommandPrimitive.List ref={ref} className={cn('tz-command__list', className)} {...props} />
  )
})

export const CommandEmpty = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(function CommandEmpty({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Empty ref={ref} className={cn('tz-command__empty', className)} {...props} />
  )
})

export const CommandGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(function CommandGroup({ className, ...props }, ref) {
  return (
    <CommandPrimitive.Group ref={ref} className={cn('tz-command__group', className)} {...props} />
  )
})

export function CommandSeparator({ className }: { className?: string }) {
  return (
    <CommandPrimitive.Separator alwaysRender={false} className="tz-command__sep">
      <Rule className={className} aria-hidden="true" role="none" />
    </CommandPrimitive.Separator>
  )
}

export const CommandItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(function CommandItem({ className, style, ...props }, ref) {
  const slip = useSlip()
  return (
    <CommandPrimitive.Item
      ref={ref}
      className={cn('tz-mi', className)}
      style={{ ...slip, ...style }}
      {...props}
    />
  )
})

export function CommandShortcut({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={cn('tz-mi__short', className)} {...props} />
}

export const CommandLoading = CommandPrimitive.Loading
