import { type ReactNode, useCallback, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useSkin } from '../hooks/useSkin'
import { Glyph } from '../lib/marks'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'
import { Calendar, type CalendarProps } from './Calendar'
import { Popover, PopoverContent, PopoverTrigger } from './Popover'

const defaultFormat = (d: Date) =>
  d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })

interface BaseProps {
  placeholder?: string
  disabled?: boolean
  className?: string
  /** 罫に写す日付の書式 */
  format?: (date: Date) => string
  /** Calendar に渡すそのほかの設定（disabled の日、表示月など） */
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'required'>
  id?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  seed?: string
}

export interface DatePickerProps extends BaseProps {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date | undefined) => void
}

/**
 * 日を選ぶ — 罫の上の引き手を押すと、暦の紙が降りてくる。
 * 選んだ日付は、Select と同じく罫に墨として写る。
 */
export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  format = defaultFormat,
  calendarProps,
  ...base
}: DatePickerProps) {
  const [local, setLocal] = useState(defaultValue)
  const date = value !== undefined ? value : local
  const [open, setOpen] = useState(false)
  return (
    <PickerWell
      {...base}
      open={open}
      onOpenChange={setOpen}
      text={date ? format(date) : undefined}
      calendar={
        <Calendar
          mode="single"
          selected={date}
          defaultMonth={date}
          onSelect={(d) => {
            if (value === undefined) setLocal(d)
            onValueChange?.(d)
            setOpen(false)
          }}
          {...(calendarProps as object)}
        />
      }
    />
  )
}

export interface DateRangePickerProps extends BaseProps {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  /** 並べて見せる月の数。既定は 2 */
  numberOfMonths?: number
}

/** 期間を選ぶ — 始まりと終わりの日に丸を付け、そのあいだに薄く墨を刷く */
export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  format = (d) => d.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' }),
  numberOfMonths = 2,
  calendarProps,
  ...base
}: DateRangePickerProps) {
  const [local, setLocal] = useState(defaultValue)
  const range = value !== undefined ? value : local
  const [open, setOpen] = useState(false)
  const text = range?.from
    ? range.to
      ? `${format(range.from)} 〜 ${format(range.to)}`
      : `${format(range.from)} 〜`
    : undefined
  return (
    <PickerWell
      {...base}
      open={open}
      onOpenChange={setOpen}
      text={text}
      calendar={
        <Calendar
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          numberOfMonths={numberOfMonths}
          onSelect={(r) => {
            if (value === undefined) setLocal(r)
            onValueChange?.(r)
          }}
          {...(calendarProps as object)}
        />
      }
    />
  )
}

interface WellProps extends BaseProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  text: string | undefined
  calendar: ReactNode
}

function PickerWell({
  open,
  onOpenChange,
  text,
  calendar,
  placeholder = '日付を選ぶ',
  disabled,
  className,
  id,
  seed,
  ...aria
}: WellProps) {
  const [skin, handle] = useSkin<HTMLDivElement>({ seed, pressable: false })
  /* 選んだ日付の幅だけ、罫に墨を写す */
  const reink = useCallback(() => handle.current?.ink(), [handle])
  // biome-ignore lint/correctness/useExhaustiveDependencies: 書かれた日付が変わるたびに測り直す
  useIsomorphicLayoutEffect(() => {
    const raf = requestAnimationFrame(reink)
    return () => cancelAnimationFrame(raf)
  }, [text, reink])
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <div
        ref={skin}
        className={cn(
          'tz-well tz-well--pick tz-well--date',
          open && 'is-open',
          disabled && 'is-off',
          className,
        )}
      >
        <Shell />
        <PopoverTrigger asChild disabled={disabled}>
          <button type="button" id={id} className={cn('tz-pick', !text && 'is-empty')} {...aria}>
            <span className="tz-pick__val">{text ?? placeholder}</span>
            <Glyph name="turn" className="tz-pick__turn tz-date__turn" />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="start" className="tz-date__leaf">
        {calendar}
      </PopoverContent>
    </Popover>
  )
}
