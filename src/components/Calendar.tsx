import { type ComponentProps, useEffect, useRef } from 'react'
import { type DayButtonProps, DayPicker } from 'react-day-picker'
import { ja } from 'react-day-picker/locale'
import { Glyph, Mark } from '../lib/marks'
import { cn } from '../lib/utils'

export type CalendarProps = ComponentProps<typeof DayPicker>

/**
 * 暦 — 選んだ日に、手で丸を付ける。
 * 期間は、両端の日に丸を付け、そのあいだに薄く墨を刷く。今日には小さな墨の点を打つ。
 * 既定の言語は日本語（週は日曜はじまり）。
 */
export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ja,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn('tz-cal', className)}
      classNames={{
        months: 'tz-cal__months',
        month: 'tz-cal__month',
        nav: 'tz-cal__nav',
        button_previous: 'tz-cal__step',
        button_next: 'tz-cal__step',
        month_caption: 'tz-cal__caption',
        caption_label: 'tz-cal__caption-label',
        dropdowns: 'tz-cal__dropdowns',
        dropdown_root: 'tz-cal__dropdown-root',
        dropdown: 'tz-cal__dropdown',
        month_grid: 'tz-cal__grid',
        weekdays: 'tz-cal__weekdays',
        weekday: 'tz-cal__weekday',
        week: 'tz-cal__week',
        week_number: 'tz-cal__weeknum',
        week_number_header: 'tz-cal__weeknum',
        day: 'tz-cal__day',
        range_start: 'is-range-start',
        range_middle: 'is-range-middle',
        range_end: 'is-range-end',
        selected: 'is-selected',
        today: 'is-today',
        outside: 'is-outside',
        disabled: 'is-disabled',
        hidden: 'is-hidden',
        focused: 'is-focused',
        footer: 'tz-cal__footer',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) => (
          <Glyph
            name={orientation === 'left' ? 'prev' : orientation === 'right' ? 'next' : 'turn'}
            className={cn('tz-cal__chevron', c)}
          />
        ),
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

/** 日付の一枡。選ばれた日には丸印が、その場で書かれる */
export function CalendarDayButton({
  className,
  day,
  modifiers,
  children,
  ...props
}: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])
  const ringed =
    modifiers.selected && !modifiers.range_middle && !modifiers.disabled && !modifiers.outside
  return (
    <button
      ref={ref}
      data-day={day.date.toLocaleDateString()}
      className={cn('tz-cal__daybtn', className)}
      {...props}
    >
      <span className="tz-cal__num">{children}</span>
      {ringed && <Mark kind="circle" seed={day.isoDate} className="tz-cal__ring is-writing" />}
      {modifiers.today && <Mark kind="pip" seed={`${day.isoDate}t`} className="tz-cal__today" />}
    </button>
  )
}
